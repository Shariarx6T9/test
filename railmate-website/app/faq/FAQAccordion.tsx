"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { CaretDown } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const faqData = [
  {
    question: "Is RailMate free to use?",
    answer: "Yes, the core app is completely free — schedules, fares, saved routes, community reports, and delay alerts are all free. We offer an optional RailMate+ premium subscription (৳99–299/month) for advanced features."
  },
  {
    question: "How accurate is the schedule information?",
    answer: "Schedule data is sourced from Bangladesh Railway's official published timetables. We update it when official timetables change. Real-time accuracy depends on community reports — we recommend verifying against official sources for critical journeys."
  },
  {
    question: "Does RailMate sell train tickets?",
    answer: "No. RailMate is an information and companion platform. For ticket purchases, we direct you to the official Rail Sheba platform (railshebashohoz.com) or the government e-ticketing portal."
  },
  {
    question: "How do community reports work?",
    answer: "Any registered user can submit a delay, crowding, or condition report for any train. Reports are validated through a community upvote/confirm system. Reports with multiple confirmations are ranked higher."
  },
  {
    question: "Is RailMate affiliated with Bangladesh Railway?",
    answer: "No. RailMate is an independent platform built by Bangladeshi developers. We use publicly available schedule data from Bangladesh Railway's official publications. We are not officially affiliated unless a formal partnership is announced."
  }
];

function FAQItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
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

export default function FAQAccordion() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pt-32 pb-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader
          title={t.faq.title}
          subtitle={t.faq.subtitle}
          centered
        />
        
        <div className="mt-12 bg-bg-elevated rounded-xl border border-border-subtle px-6 md:px-8">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => { setOpenIndex(openIndex === index ? null : index); }}
            />
          ))}
        </div>

        <div className="mt-12 text-center p-8 rounded-xl bg-bg-card border border-border-subtle">
          <h3 className="text-xl font-bold text-text-primary mb-2 font-jakarta">{t.faq.still_questions}</h3>
          <p className="text-text-secondary mb-6 font-inter">
            If you couldn't find the answer you're looking for, please contact our support team.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dim transition-colors font-inter"
          >
            {t.faq.contact_support}
          </a>
        </div>
      </div>
    </div>
  );
}
