'use client';

import SectionHeader from "@/components/ui/SectionHeader";
import { useI18n } from "@/lib/i18n";

export default function CopyrightPageClient() {
  const { t } = useI18n();

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeader
          title={t.copyright.title}
          subtitle={t.copyright.subtitle}
          align="center"
        />
        
        <div className="mt-12 space-y-8">
          <section className="bg-bg-elevated p-8 rounded-lg border border-border">
            <p className="text-text-secondary leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.copyright.legal_notice }} />
            
            <p className="text-text-secondary leading-relaxed mb-6">
              {t.copyright.prohibition}
            </p>

            <div className="border-t border-border pt-6 mt-6">
              <h3 className="text-lg font-bold text-primary mb-3">{t.copyright.trademarks.title}</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                {t.copyright.trademarks.body}
              </p>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <h3 className="text-lg font-bold text-primary mb-3">{t.copyright.data_sources.title}</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                {t.copyright.data_sources.body}
              </p>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <h3 className="text-lg font-bold text-primary mb-3">{t.copyright.independence.title}</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                {t.copyright.independence.body}
              </p>
            </div>

            <div className="border-t border-border pt-6 mt-6 text-center">
              <p className="text-text-secondary font-medium">
                {t.copyright.reporting.title}
              </p>
              <a 
                href="mailto:legal@railmatebd.com" 
                className="text-primary hover:underline font-bold mt-2 inline-block"
              >
                legal@railmatebd.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
