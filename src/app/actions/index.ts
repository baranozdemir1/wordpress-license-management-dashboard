"use server";

import createSupabaseServerClient from "@/lib/server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export async function signIn(data: { email: string; password: string }) {
  const supabase = await createSupabaseServerClient();
  const result = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  return result;
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();

  return supabase.auth.signOut();
}

export async function readUserSession() {
  noStore();
  const supabase = await createSupabaseServerClient();

  return supabase.auth.getSession();
}

export async function readAllLicenses() {
  noStore();
  const supabase = await createSupabaseServerClient();

  return await supabase.from("Licenses").select("*");
}

export async function createLicense(data: {
  domain: string;
  name: string;
  license_key: string;
  status: string;
}) {
  noStore();
  const supabase = await createSupabaseServerClient();
  revalidatePath("/dashboard");

  return await supabase.from("Licenses").insert(data);
}

export async function readLicense(id: number) {
  noStore();
  const supabase = await createSupabaseServerClient();

  return await supabase.from("Licenses").select("*").eq("id", id);
}

export async function updateLicense(
  id: number,
  data: {
    domain: string;
    name: string;
    license_key: string;
    status: string;
  }
) {
  noStore();
  const supabase = await createSupabaseServerClient();
  revalidatePath("/dashboard");

  return await supabase.from("Licenses").update(data).eq("id", id);
}

export async function deleteLicense(id: number) {
  noStore();
  const supabase = await createSupabaseServerClient();
  revalidatePath("/dashboard");

  return await supabase.from("Licenses").delete().eq("id", id);
}

export async function getLicenseByDomainAndKey(
  domain: string,
  license_key: string
) {
  noStore();
  const supabase = await createSupabaseServerClient();

  return await supabase
    .from("Licenses")
    .select("*")
    .eq("domain", domain)
    .eq("license_key", license_key)
    .single();
}

export async function getLicenseByDomainOrKey(
  domain: string,
  license_key: string
) {
  noStore();
  const supabase = await createSupabaseServerClient();

  return await supabase
    .from("Licenses")
    .select("*")
    .or(`domain.eq.${domain},license_key.eq.${license_key}`)
    .single();
}

export async function getDataByLicense(license: string) {
  noStore();
  const supabase = await createSupabaseServerClient();

  return await supabase
    .from("Licenses")
    .select("*")
    .eq("license_key", license)
    .single();
}
