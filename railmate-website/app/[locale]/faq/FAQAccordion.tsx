"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { CaretDown } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

import Link from "next/link";

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-border-subtle last:border-0">
      <button
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors focus:outline-none"
        onClick={onClick}
      >
        <span className="text-lg font-semibold text-text-primary font-inter">{question}</span>
        <CaretDown
          size={24}
          className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-text-secondary leading-relaxed font-inter">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQAccordion({ homepage = false }: { homepage?: boolean }) {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = t.faq.questions || [];
  const itemsToShow = homepage ? faqData.slice(0, 3) : faqData;

  const containerClasses = homepage
    ? "py-16"
    : "pt-32 pb-16 min-h-screen";

  return (
    <div className={containerClasses}>
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader
          title={t.faq.title}
          subtitle={homepage ? '' : t.faq.subtitle}
          centered
        />

        <div className="mt-12 bg-bg-elevated rounded-xl border border-border-subtle px-6 md:px-8">
          {itemsToShow.map((item: any, index: number) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {!homepage && (
          <div className="mt-12 text-center p-8 rounded-xl bg-bg-card border border-border-subtle">
            <h3 className="text-xl font-bold text-text-primary mb-2 font-jakarta">{t.faq.still_questions}</h3>
            <p className="text-text-secondary mb-6 font-inter">
              If you couldn&apos;t find the answer you&apos;re looking for, please contact our support team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dim transition-colors font-inter"
            >
              {t.faq.contact_support}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

