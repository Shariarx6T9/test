"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { 
  EnvelopeSimple, 
  ChatTeardropText, 
  Handshake, 
  Bug, 
  Megaphone,
  CheckCircle,
  WarningCircle,
  CircleNotch,
  FacebookLogo,
  TwitterLogo,
  InstagramLogo,
  LinkedinLogo
} from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

export default function ContactForm() {
  const { t } = useI18n();

  const subjects = [
    { value: "General", label: t.contact.subjects.general },
    { value: "Support", label: t.contact.subjects.support },
    { value: "Partnership", label: t.contact.subjects.partnership },
    { value: "Bug Report", label: t.contact.subjects.bug },
    { value: "Media", label: t.contact.subjects.media },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "General", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || t.contact.errors.generic);
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(t.contact.errors.connection);
    }
  };

  const contactDetails = [
    {
      icon: <EnvelopeSimple size={24} />,
      title: t.contact.details.support,
      email: "support@railmatebd.com",
    },
    {
      icon: <Handshake size={24} />,
      title: t.contact.details.business,
      email: "hello@railmatebd.com",
    },
    {
      icon: <ChatTeardropText size={24} />,
      title: t.contact.details.legal,
      email: "privacy@railmatebd.com",
    },
  ];

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader
          title={t.contact.title}
          subtitle={t.contact.subtitle}
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-bg-elevated p-8 rounded-xl border border-border">
            {status === "success" ? (
              <div className="text-center py-12">
                <CheckCircle size={64} weight="fill" className="text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-text-primary mb-2">{t.contact.success.title}</h3>
                <p className="text-text-secondary mb-8">
                  {t.contact.success.message}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-3 bg-primary text-bg-base font-bold rounded-lg hover:bg-primary-dim transition-colors"
                >
                  {t.contact.success.send_another}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                      {t.contact.form.name.label}
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-bg-card border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none transition-colors"
                      placeholder={t.contact.form.name.placeholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                      {t.contact.form.email.label}
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-bg-card border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none transition-colors"
                      placeholder={t.contact.form.email.placeholder}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-2">
                    {t.contact.form.subject.label}
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-bg-card border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none transition-colors appearance-none"
                  >
                    {subjects.map((s) => (
                      <option key={s.value} value={s.value} className="bg-bg-card">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
                    {t.contact.form.message.label}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-bg-card border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder={t.contact.form.message.placeholder}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-danger bg-danger/10 p-4 rounded-lg border border-danger/20">
                    <WarningCircle size={20} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 bg-primary text-bg-base font-bold rounded-lg hover:bg-primary-dim transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <CircleNotch size={20} className="animate-spin" />
                      {t.contact.form.sending}
                    </>
                  ) : (
                    t.contact.form.send
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-bg-elevated p-8 rounded-xl border border-border">
              <h3 className="text-xl font-bold text-text-primary mb-6">{t.contact.sidebar.details.title}</h3>
              <div className="space-y-6">
                {contactDetails.map((detail, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="text-primary">{detail.icon}</div>
                    <div>
                      <h4 className="font-bold text-text-primary">{detail.title}</h4>
                      <a 
                        href={`mailto:${detail.email}`} 
                        className="text-text-secondary hover:text-primary transition-colors text-sm"
                      >
                        {detail.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-elevated p-8 rounded-xl border border-border">
              <h3 className="text-xl font-bold text-text-primary mb-4">{t.contact.sidebar.social.title}</h3>
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-bg-card rounded-lg text-text-secondary hover:text-primary border border-border transition-all">
                  <FacebookLogo size={24} />
                </a>
                <a href="#" className="p-3 bg-bg-card rounded-lg text-text-secondary hover:text-primary border border-border transition-all">
                  <TwitterLogo size={24} />
                </a>
                <a href="#" className="p-3 bg-bg-card rounded-lg text-text-secondary hover:text-primary border border-border transition-all">
                  <InstagramLogo size={24} />
                </a>
                <a href="#" className="p-3 bg-bg-card rounded-lg text-text-secondary hover:text-primary border border-border transition-all">
                  <LinkedinLogo size={24} />
                </a>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-accent-subtle border border-accent/20">
              <h4 className="font-bold text-accent mb-2">{t.contact.sidebar.partnership.title}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t.contact.sidebar.partnership.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
