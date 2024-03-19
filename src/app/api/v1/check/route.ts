import { License } from "@/data/schema";
import {
  getDataByLicense,
  getLicenseByDomainAndKey,
  getLicenseByDomainOrKey,
} from "@/app/actions";
import { PostgrestError } from "@supabase/supabase-js";
import { Octokit } from "@octokit/core";

type TLicenseData = {
  data: License | null;
  error: PostgrestError | null;
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

  console.log(data, error);

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
      owner: "XXX", // TODO: Change this to your own username
      repo: "XXX", // TODO: Change this to your own repository
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const latestThemeVersion = latestThemeVersionRes.data.tag_name;

  return new Response(
    JSON.stringify({ version: latestThemeVersion, ...data }),
    {
      headers: { "content-type": "application/json" },
      status: 200,
    }
  );
}
