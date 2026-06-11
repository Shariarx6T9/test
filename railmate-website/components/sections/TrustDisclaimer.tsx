"use client";

import { useI18n } from "@/lib/i18n";
import { ShieldCheck } from "@phosphor-icons/react";

export function TrustDisclaimer() {
  const { t } = useI18n();

  return (
    <section className="py-16 bg-bg-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center p-8 rounded-2xl bg-bg-card border border-border-subtle">
          <ShieldCheck size={48} className="mx-auto text-primary mb-4" weight="duotone" />
          <h3 className="text-2xl font-bold text-text-primary mb-3 font-jakarta">
            {t.trust.title}
          </h3>
          <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed font-inter">
            {t.trust.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
