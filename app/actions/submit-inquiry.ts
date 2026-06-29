"use server";
import { headers } from "next/headers";
import { inquirySchema } from "@/lib/inquiry/validate";
import { getSupabase } from "@/lib/supabase/server";
import { notifyEmail, notifyTelegram } from "@/lib/notifications";

export type InquiryResult = { ok: true } | { ok: false; error: string };

export async function submitInquiry(data: unknown): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Проверьте заполненные поля." };

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  if (ip) {
    const db = getSupabase();
    const { count } = await db
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("source_ip", ip)
      .gte("created_at", new Date(Date.now() - 60_000).toISOString());
    if ((count ?? 0) >= 3)
      return { ok: false, error: "Слишком много заявок. Подождите минуту." };
  }

  const { kind, product_slug, name, contact, message, source_url } = parsed.data;
  const db = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await db
    .from("inquiries")
    // cast required: no generated DB types, so insert's Row parameter infers as never
    .insert({ kind, product_slug, name, contact, message, source_url, source_ip: ip } as any);
  if (error) return { ok: false, error: "Не удалось отправить. Попробуйте ещё раз." };

  await Promise.allSettled([
    notifyEmail({ kind, product_slug, name, contact, message }),
    notifyTelegram({ kind, product_slug, name, contact, message }),
  ]);

  return { ok: true };
}
