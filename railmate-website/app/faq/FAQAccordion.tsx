"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { CaretDown } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

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
  },
  {
    question: "How do notifications work?",
    answer: "You can save routes and enable alerts. When community members report delays or issues on your saved routes, you receive a push notification. Notification timing is based on your saved departure preferences."
  },
  {
    question: "Is my data safe?",
    answer: "Yes. We collect minimal data — only what's needed to run the app. We never sell user data. Community reports can be submitted anonymously. See our Privacy Policy for full details."
  },
  {
    question: "Does the app work offline?",
    answer: "Schedule data is cached locally for offline access. Community reports and alerts require an internet connection."
  },
  {
    question: "How do I delete my account?",
    answer: "Go to Profile → Settings → Delete Account. All your data will be permanently deleted within 30 days. Alternatively, email privacy@railmatebd.com."
  },
  {
    question: "Which cities and routes are covered?",
    answer: "We cover all major Bangladesh Railway routes including Dhaka–Chittagong, Dhaka–Sylhet, Dhaka–Rajshahi, Dhaka–Khulna, and all intercity express routes. Coverage expands as we grow."
  },
  {
    question: "How can I report a bug or suggest a feature?",
    answer: "Use the Contact page or in-app feedback. We read every message."
  }
];

function FAQItem({ question, answer, isOpen, onClick }: { key?: any, question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors focus:outline-none"
        onClick={onClick}
      >
        <span className="text-lg font-semibold text-text-primary">{question}</span>
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
            <div className="pb-6 text-text-secondary leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about RailMate Bangladesh."
          centered
        />
        
        <div className="mt-12 bg-bg-elevated rounded-xl border border-border px-6 md:px-8">
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

        <div className="mt-12 text-center p-8 rounded-xl bg-primary-subtle border border-primary/20">
          <h3 className="text-xl font-bold text-text-primary mb-2">Still have questions?</h3>
          <p className="text-text-secondary mb-6">
            If you couldn't find the answer you're looking for, please contact our support team.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-bg-base font-bold hover:bg-primary-dim transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}
