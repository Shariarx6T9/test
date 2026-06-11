import { buildMetadata } from "@/lib/metadata";
import DownloadPageClient from "./DownloadPageClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();
  return buildMetadata({
    title: t('download_page.meta_title'),
    description: t('download_page.meta_description'),
    path: "/download",
  });
}

export default async function DownloadPage() {
  const t = await getTranslations();
  const translations = {
    download_page: t.raw('download_page'),
    common: t.raw('common'),
  };
  return <DownloadPageClient translations={translations} />;
}
