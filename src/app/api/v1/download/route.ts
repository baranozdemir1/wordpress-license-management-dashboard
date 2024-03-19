import { License } from "@/data/schema";
import { getLicenseByDomainAndKey } from "@/app/actions";
import { PostgrestError } from "@supabase/supabase-js";
import { Octokit } from "@octokit/core";
import fs from "fs";
import path from "path";
import axios from "axios";
import AdmZip from "adm-zip";
import supabase from "@/lib/supabase";

type TLicenseData = {
  data: License | null;
  error: PostgrestError | null;
};

type TPostBody = {
  license: string;
  domain: string;
};

export async function GET(request: Request) {
  // searchParams
  const url = new URL(request.url);
  const params = url.searchParams;
  const license = params.get("license");
  const domain = params.get("domain");

  if (!license || !domain) {
    return new Response("Missing license or domain", {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const { data, error }: TLicenseData = await getLicenseByDomainAndKey(
    domain,
    license
  );

  if (!data) {
    return new Response(JSON.stringify({ error: "License not found" }), {
      headers: { "content-type": "application/json" },
      status: 404,
    });
  }

  if (data && data.status !== "active") {
    return new Response(JSON.stringify({ error: "License not active" }), {
      headers: { "content-type": "application/json" },
      status: 403,
    });
  }

  if (error) {
    return new Response(JSON.stringify({ error }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_API_TOKEN,
  });

  const latestThemeVersionRes = await octokit.request(
    "GET /repos/{owner}/{repo}/releases/latest",
    {
      owner: "XXX", // TODO: Change this to your GitHub username
      repo: "XXX", // TODO: Change this to your GitHub repository
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const latestThemeVersion = latestThemeVersionRes.data.tag_name;
  // const { data: bucketDataVer, error: bucketErrVer } = await supabase.storage
  //   .from("theme")
  //   .upload(`public/theme_ver.txt`, tempThemeVerTXTBuffer);

  const latestThemeDownloadLinkRes = await octokit.request(
    "GET /repos/{owner}/{repo}/zipball/{ref}",
    {
      owner: "XXX", // TODO: Change this to your GitHub username
      repo: "XXX", // TODO: Change this to your GitHub repository
      ref: latestThemeVersion,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const latestThemeDownloadLink = latestThemeDownloadLinkRes.url;

  const newFolderName = "XXX"; // TODO: Change this to your theme folder name
  const zipFileName = "XXX.zip"; // TODO: Change this to your theme zip file name

  const download = await axios({
    method: "GET",
    url: latestThemeDownloadLink,
    responseType: "arraybuffer",
  });

  const zip = new AdmZip(download.data);
  const zipEntries = zip.getEntries();
  zipEntries.forEach((entry) => {
    const entryName = entry.entryName;
    const newEntryName = entryName.replace(/^([^\/]+\/)/, `${newFolderName}/`);
    entry.entryName = newEntryName;
  });

  const updatedZipFile = zip.toBuffer();

  const { data: bucketData, error: bucketErr } = await supabase.storage
    .from("theme")
    .upload(`public/${zipFileName}`, updatedZipFile);

  if (bucketErr) {
    if (bucketErr.message.includes("The resource already exists")) {
      const { data: replacedData, error: replacedErr } = await supabase.storage
        .from("theme")
        .update(`public/${zipFileName}`, updatedZipFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (replacedErr) {
        return new Response(JSON.stringify({ error }), {
          headers: { "content-type": "application/json" },
          status: 500,
        });
      }

      const { data: signedURL, error: signedURLErr } = await supabase.storage
        .from("theme")
        .createSignedUrl(`public/${zipFileName}`, 300);

      if (signedURLErr) {
        return new Response(JSON.stringify({ error }), {
          headers: { "content-type": "application/json" },
          status: 500,
        });
      }
      return new Response(
        JSON.stringify({
          url: signedURL.signedUrl,
          tag_name: latestThemeVersion,
        }),
        {
          headers: { "content-type": "application/json" },
          status: 200,
        }
      );
    }
    return new Response(JSON.stringify({ error: bucketErr }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }

  const { data: signedURL, error: signedURLErr } = await supabase.storage
    .from("theme")
    .createSignedUrl(`public/${zipFileName}`, 300);
  if (signedURLErr) {
    return new Response(JSON.stringify({ error }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
  return new Response(
    JSON.stringify({ url: signedURL.signedUrl, tag_name: latestThemeVersion }),
    {
      headers: { "content-type": "application/json" },
      status: 200,
    }
  );
}

export async function POST(request: Request) {
  const { license, domain } = (await request.json()) as TPostBody;

  if (!license || !domain) {
    return new Response("Missing license or domain", {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const { data, error }: TLicenseData = await getLicenseByDomainAndKey(
    domain,
    license
  );

  if (error) {
    return new Response(JSON.stringify({ error }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }

  if (!data) {
    return new Response(JSON.stringify({ error: "License not found" }), {
      headers: { "content-type": "application/json" },
      status: 404,
    });
  }

  if (data && data.status !== "active") {
    return new Response(JSON.stringify({ error: "License not active" }), {
      headers: { "content-type": "application/json" },
      status: 403,
    });
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_API_TOKEN,
  });

  const latestThemeVersionRes = await octokit.request(
    "GET /repos/{owner}/{repo}/releases/latest",
    {
      owner: "XXX", // TODO: Change this to your GitHub username
      repo: "XXX", // TODO: Change this to your GitHub repository
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const latestThemeVersion = latestThemeVersionRes.data.tag_name;
  // const { data: bucketDataVer, error: bucketErrVer } = await supabase.storage
  //   .from("theme")
  //   .upload(`public/theme_ver.txt`, tempThemeVerTXTBuffer);

  const latestThemeDownloadLinkRes = await octokit.request(
    "GET /repos/{owner}/{repo}/zipball/{ref}",
    {
      owner: "XXX", // TODO: Change this to your GitHub username
      repo: "XXX", // TODO: Change this to your GitHub repository
      ref: latestThemeVersion,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const latestThemeDownloadLink = latestThemeDownloadLinkRes.url;

  const newFolderName = "XXX"; // TODO: Change this to your theme folder name
  const zipFileName = "XXX.zip"; // TODO: Change this to your theme zip file name

  const download = await axios({
    method: "GET",
    url: latestThemeDownloadLink,
    responseType: "arraybuffer",
  });

  const zip = new AdmZip(download.data);
  const zipEntries = zip.getEntries();
  zipEntries.forEach((entry) => {
    const entryName = entry.entryName;
    const newEntryName = entryName.replace(/^([^\/]+\/)/, `${newFolderName}/`);
    entry.entryName = newEntryName;
  });

  const updatedZipFile = zip.toBuffer();

  const { data: bucketData, error: bucketErr } = await supabase.storage
    .from("theme")
    .upload(`public/${zipFileName}`, updatedZipFile);

  if (bucketErr) {
    if (bucketErr.message.includes("The resource already exists")) {
      const { data: replacedData, error: replacedErr } = await supabase.storage
        .from("theme")
        .update(`public/${zipFileName}`, updatedZipFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (replacedErr) {
        return new Response(JSON.stringify({ error }), {
          headers: { "content-type": "application/json" },
          status: 500,
        });
      }

      const { data: signedURL, error: signedURLErr } = await supabase.storage
        .from("theme")
        .createSignedUrl(`public/${zipFileName}`, 300);

      if (signedURLErr) {
        return new Response(JSON.stringify({ error }), {
          headers: { "content-type": "application/json" },
          status: 500,
        });
      }
      return new Response(
        JSON.stringify({
          url: signedURL.signedUrl,
          tag_name: latestThemeVersion,
          new_version: latestThemeVersion,
          success: true,
          license: "valid",
        }),
        {
          headers: { "content-type": "application/json" },
          status: 200,
        }
      );
    }
    return new Response(JSON.stringify({ error: bucketErr }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }

  const { data: signedURL, error: signedURLErr } = await supabase.storage
    .from("theme")
    .createSignedUrl(`public/${zipFileName}`, 300);
  if (signedURLErr) {
    return new Response(JSON.stringify({ error }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      url: signedURL.signedUrl,
      tag_name: latestThemeVersion,
      new_version: latestThemeVersion,
      success: true,
      license: "valid",
    }),
    {
      headers: { "content-type": "application/json" },
      status: 200,
    }
  );
}
