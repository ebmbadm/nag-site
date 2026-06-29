import { istoriya } from "@/content/company/istoriya";
import { kontakty } from "@/content/company/kontakty";
import { garantiya } from "@/content/company/garantiya";
import { oKompanii } from "@/content/company/o-kompanii";
import type {
  HistoryContent,
  ContactsContent,
  GuaranteeContent,
  CompanyHubContent,
} from "./types";

/** Company history content (typed data module pattern). */
export function getHistory(): HistoryContent {
  return istoriya;
}

/** Контакты page content. */
export function getContacts(): ContactsContent {
  return kontakty;
}

/** Гарантия и сервис page content. */
export function getGuarantee(): GuaranteeContent {
  return garantiya;
}

/** О компании hub content. */
export function getCompanyHub(): CompanyHubContent {
  return oKompanii;
}
