'use client';

import SectionHeader from "@/components/ui/SectionHeader";
import DownloadButton from "@/components/ui/DownloadButton";
import Badge from "@/components/ui/Badge";
import { 
  GooglePlayLogo, 
  AndroidLogo, 
  AppleLogo, 
  DownloadSimple, 
  Gear, 
  CheckCircle,
  FileArrowDown
} from "@phosphor-icons/react/dist/ssr";

export default function DownloadPageClient({ translations }: { translations: any }) {
  const t = translations;

  const steps = [
    {
      title: t.download_page.google_play,
      steps: [
        { icon: <DownloadSimple />, text: t.download_page.install_steps.google_play.step1 },
        { icon: <CheckCircle />, text: t.download_page.install_steps.google_play.step2 },
        { icon: <Gear />, text: t.download_page.install_steps.google_play.step3 },
      ],
    },
    {
      title: t.download_page.direct_apk,
      steps: [
        { icon: <FileArrowDown />, text: t.download_page.install_steps.direct_apk.step1 },
        { icon: <Gear />, text: t.download_page.install_steps.direct_apk.step2 },
        { icon: <DownloadSimple />, text: t.download_page.install_steps.direct_apk.step3 },
        { icon: <CheckCircle />, text: t.download_page.install_steps.direct_apk.step4 },
      ],
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": t.download_page.json_ld_name,
    "operatingSystem": "Android",
    "applicationCategory": "TravelApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BDT"
    },
    "description": t.download_page.json_ld_description
  };

  return (
    <main className="pt-32 pb-24 bg-bg-base min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-20 text-center">
          <SectionHeader 
            title={t.download_page.title}
            align="center"
          />
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
             {t.download_page.subtitle}
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {/* Google Play */}
          <div className="p-8 bg-bg-elevated border border-border rounded-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-bg-card border border-border rounded-full flex items-center justify-center mb-6 text-primary">
              <GooglePlayLogo size={32} weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">{t.download_page.google_play}</h3>
            <p className="text-text-tertiary text-sm mb-8">{t.download_page.google_play_desc}</p>
            <div className="mt-auto w-full">
              <DownloadButton
                platform="google-play"
                className="w-full"
                href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL!}
              />
            </div>
          </div>

          {/* APK */}
          <div className="p-8 bg-bg-elevated border border-border rounded-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-bg-card border border-border rounded-full flex items-center justify-center mb-6 text-text-primary">
              <AndroidLogo size={32} weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">{t.download_page.direct_apk}</h3>
            <p className="text-text-tertiary text-sm mb-4">{t.download_page.direct_apk_desc}</p>
            <div className="p-3 bg-bg-card border border-border rounded-md w-full mb-8">
               <p className="text-[10px] text-text-tertiary font-mono break-all">{t.download_page.sha_hash}</p>
            </div>
            <div className="mt-auto w-full">
              <DownloadButton
                platform="apk"
                className="w-full"
                href={process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL!}
              />
            </div>
          </div>

          {/* App Store */}
          <div className="p-8 bg-bg-elevated border border-border rounded-xl flex flex-col items-center text-center opacity-75">
            <div className="w-16 h-16 bg-bg-card border border-border rounded-full flex items-center justify-center mb-6 text-text-secondary">
              <AppleLogo size={32} weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">{t.download_page.app_store}</h3>
            <p className="text-text-tertiary text-sm mb-2">{t.download_page.app_store_desc}</p>
            <Badge variant="warning" className="mb-8">{t.common.coming_soon}</Badge>
            <div className="mt-auto w-full">
              <DownloadButton
                platform="app-store"
                status="coming-soon"
                className="w-full"
                href={process.env.NEXT_PUBLIC_APP_STORE_URL!}
              />
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {steps.map((section, i) => (
            <div key={i} className="space-y-8">
               <h3 className="text-2xl font-jakarta font-extrabold text-text-primary">{section.title} {t.download_page.instructions_suffix}</h3>
               <div className="space-y-4">
                  {section.steps.map((step, si) => (
                    <div key={si} className="flex gap-4 p-4 bg-bg-card border border-border rounded-lg">
                       <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                          {step.icon}
                       </div>
                       <div>
                          <p className="text-text-tertiary text-xs font-bold uppercase mb-1">{t.download_page.step_label.replace('{number}', (si + 1).toString())}</p>
                          <p className="text-text-primary font-medium">{step.text}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>

        {/* Version & Release Notes */}
        <div className="space-y-8 mb-24">
           <h3 className="text-2xl font-jakarta font-extrabold text-text-primary">{t.download_page.version_notes_title}</h3>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-border">
                       <th className="py-4 px-6 text-text-tertiary font-bold text-sm uppercase">{t.download_page.table_header_version}</th>
                       <th className="py-4 px-6 text-text-tertiary font-bold text-sm uppercase">{t.download_page.table_header_release_date}</th>
                       <th className="py-4 px-6 text-text-tertiary font-bold text-sm uppercase">{t.download_page.table_header_changes}</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr className="border-b border-border bg-bg-elevated/30">
                       <td className="py-4 px-6 font-mono text-primary">v1.0.0</td>
                       <td className="py-4 px-6 text-text-secondary">{t.common.coming_soon}</td>
                       <td className="py-4 px-6 text-text-secondary">{t.download_page.v1_release_notes}</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>

        {/* System Requirements */}
        <div className="p-8 bg-bg-elevated border border-border rounded-xl">
           <h3 className="text-xl font-jakarta font-extrabold text-text-primary mb-6">{t.download_page.requirements_title}</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                 <p className="text-text-tertiary text-xs font-bold uppercase mb-2">{t.download_page.android}</p>
                 <p className="text-text-primary">{t.download_page.android_version}</p>
              </div>
              <div>
                 <p className="text-text-tertiary text-xs font-bold uppercase mb-2">{t.download_page.ios}</p>
                 <p className="text-text-primary">{t.download_page.ios_version}</p>
              </div>
              <div>
                 <p className="text-text-tertiary text-xs font-bold uppercase mb-2">{t.download_page.storage}</p>
                 <p className="text-text-primary">{t.download_page.storage_size}</p>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
