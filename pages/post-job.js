import React, { useState } from "react";
import Link from "next/link";

export default function PostJob() {
  const [lang, setLang] = useState("fr");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "CDI",
    sector: "",
    description: "",
    email: "",
  });

  const t = {
    fr: {
      nav_jobs: "Jobs",
      nav_recruiter: "Recruteurs",
      nav_login: "Connexion",
      badge: "Recruteurs",
      heading: "Publiez votre offre.",
      subheading: "Simple, rapide, visible par les bons candidats.",
      label_title: "Intitulé du poste",
      label_company: "Entreprise",
      label_location: "Lieu",
      label_type: "Type de contrat",
      label_sector: "Secteur",
      label_description: "Description du poste",
      label_email: "Email de contact",
      placeholder_title: "ex. Analyste KYC Senior",
      placeholder_company: "ex. Goldman Sachs",
      placeholder_location: "ex. Luxembourg, Paris, Remote",
      placeholder_description: "Décrivez le poste, les missions, le profil recherché...",
      placeholder_email: "recrutement@entreprise.com",
      btn_submit: "Publier l'offre",
      success_title: "Offre soumise avec succès.",
      success_sub: "Nous reviendrons vers vous prochainement. Fonctionnalité complète bientôt disponible.",
      back: "Retour à l'accueil",
      types: ["CDI", "CDD", "Stage", "Freelance", "Alternance"],
      sectors: ["Finance", "Tech", "Consulting", "RH", "Marketing", "Juridique", "Autre"],
    },
    en: {
      nav_jobs: "Jobs",
      nav_recruiter: "Recruiters",
      nav_login: "Login",
      badge: "Recruiters",
      heading: "Post your job.",
      subheading: "Simple, fast, visible to the right candidates.",
      label_title: "Job title",
      label_company: "Company",
      label_location: "Location",
      label_type: "Contract type",
      label_sector: "Sector",
      label_description: "Job description",
      label_email: "Contact email",
      placeholder_title: "e.g. Senior KYC Analyst",
      placeholder_company: "e.g. Goldman Sachs",
      placeholder_location: "e.g. Luxembourg, Paris, Remote",
      placeholder_description: "Describe the role, responsibilities, required profile...",
      placeholder_email: "recruitment@company.com",
      btn_submit: "Post the job",
      success_title: "Job submitted successfully.",
      success_sub: "We will get back to you shortly. Full functionality coming soon.",
      back: "Back to home",
      types: ["Permanent", "Fixed-term", "Internship", "Freelance", "Apprenticeship"],
      sectors: ["Finance", "Tech", "Consulting", "HR", "Marketing", "Legal", "Other"],
    },
  };

  const copy = t[lang];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-8 h-16">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight">Kbwee</Link>
        <nav className="flex items-center gap-6">
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-900 transition">{copy.nav_jobs}</Link>
          <Link href="/post-job" className="text-sm text-gray-900 font-semibold">{copy.nav_recruiter}</Link>
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="text-xs font-medium text-gray-400 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg transition"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <Link href="/login" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80 transition">{copy.nav_login}</Link>
        </nav>
      </header>

      {/* MAIN */}
      <main className="flex-grow pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <div className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">{copy.badge}</div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight mb-3">{copy.heading}</h1>
            <p className="text-gray-400 font-light">{copy.subheading}</p>
          </div>

          {/* Succès */}
          {submitted ? (
            <div className="border-2 border-gray-100 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="font-display text-2xl font-extrabold mb-2">{copy.success_title}</h2>
              <p className="text-gray-400 font-light mb-8">{copy.success_sub}</p>
              <Link href="/" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition">
                {copy.back}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Ligne titre + entreprise */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">{copy.label_title} *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder={copy.placeholder_title}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">{copy.label_company} *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={copy.placeholder_company}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
              </div>

              {/* Lieu + type + secteur */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">{copy.label_location} *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder={copy.placeholder_location}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">{copy.label_type}</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-white"
                  >
                    {copy.types.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">{copy.label_sector}</label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-white"
                  >
                    <option value="">—</option>
                    {copy.sectors.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">{copy.label_description} *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={copy.placeholder_description}
                  required
                  rows={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition resize-none"
                />
              </div>

              {/* Email contact */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">{copy.label_email} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={copy.placeholder_email}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
                />
              </div>

              {/* Séparateur info */}
              <div className="bg-blue-50 rounded-xl px-4 py-3 text-xs text-blue-600 font-medium">
                {lang === "fr"
                  ? "Votre offre sera examinée avant publication. Fonctionnalité complète bientôt disponible."
                  : "Your job will be reviewed before publishing. Full functionality coming soon."}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-medium hover:opacity-80 transition"
              >
                {copy.btn_submit}
              </button>

            </form>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 px-8 py-4 text-center">
        <p className="text-xs text-gray-300">© 2026 Kbwee</p>
      </footer>
    </div>
  );
}
