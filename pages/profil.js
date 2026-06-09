import React, { useState } from "react";
import Link from "next/link";

export default function Profil() {
  const [lang, setLang] = useState("fr");
  const [activeTab, setActiveTab] = useState("profil");

  const t = {
    fr: {
      greeting: "Bonjour,", name: "Rida K.",
      role: "AML/KYC · Private Wealth Management",
      location: "Luxembourg · Disponible",
      tab_profil: "Mon profil", tab_cv: "CV Optimizer",
      tab_interview: "Mock Interview", tab_match: "Job Match",
      score_label: "Kbwee Score",
      score_sub: "Complétez votre profil pour améliorer votre score",
      section_info: "Informations", edit: "Modifier",
      coming_soon: "Bientôt disponible",
      coming_desc: "Cette fonctionnalité IA est en cours de développement. Rejoignez la liste d'attente pour y accéder en priorité.",
      notify: "Me notifier",
      fields: { poste: "Poste recherché", secteur: "Secteur", experience: "Expérience", localisation: "Localisation", dispo: "Disponibilité", email: "Email" },
      values: { poste: "Analyste / Manager KYC · AML", secteur: "Finance · Banque · Consulting", experience: "5+ ans", localisation: "Luxembourg · Grand Est", dispo: "Ouvert aux opportunités", email: "votre@email.com" },
      cv_title: "CV Optimizer IA", cv_desc: "Importez votre CV — Kbwee l'analyse, le restructure et vous donne un score de pertinence selon le poste visé.",
      interview_title: "Mock Interview IA", interview_desc: "Simulez un entretien complet par IA. Questions personnalisées selon votre profil, feedback instantané, progression mesurée.",
      match_title: "Job Match", match_desc: "Notre algorithme analyse votre profil en profondeur et vous propose uniquement les offres réellement alignées avec vos compétences.",
      logout: "Se déconnecter",
    },
    en: {
      greeting: "Hello,", name: "Rida K.",
      role: "AML/KYC · Private Wealth Management",
      location: "Luxembourg · Available",
      tab_profil: "My profile", tab_cv: "CV Optimizer",
      tab_interview: "Mock Interview", tab_match: "Job Match",
      score_label: "Kbwee Score",
      score_sub: "Complete your profile to improve your score",
      section_info: "Information", edit: "Edit",
      coming_soon: "Coming soon",
      coming_desc: "This AI feature is under development. Join the waitlist to get early access.",
      notify: "Notify me",
      fields: { poste: "Target position", secteur: "Sector", experience: "Experience", localisation: "Location", dispo: "Availability", email: "Email" },
      values: { poste: "KYC · AML Analyst / Manager", secteur: "Finance · Banking · Consulting", experience: "5+ years", localisation: "Luxembourg · Grand Est", dispo: "Open to opportunities", email: "your@email.com" },
      cv_title: "CV Optimizer AI", cv_desc: "Upload your CV — Kbwee analyses, restructures it and gives you a relevance score for your target position.",
      interview_title: "Mock Interview AI", interview_desc: "Simulate a full AI-powered interview. Personalised questions, instant feedback, measured progress.",
      match_title: "Job Match", match_desc: "Our algorithm deeply analyses your profile and only suggests jobs truly aligned with your skills.",
      logout: "Sign out",
    },
  };

  const copy = t[lang];

  function ComingSoon({ title, desc }) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 className="font-display text-xl font-extrabold mb-2">{title}</h3>
        <p className="text-gray-400 font-light text-sm max-w-sm mx-auto mb-6 leading-relaxed">{desc}</p>
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
          {copy.coming_soon}
        </div>
        <div>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition">{copy.notify}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 h-16">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight flex-shrink-0">Kbwee</Link>
        <nav className="flex items-center gap-3 md:gap-6 ml-4">
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-900 transition">Jobs</Link>
          <Link href="/post-job" className="text-sm text-gray-500 hover:text-gray-900 transition">Recruteurs</Link>
          <button onClick={function() { setLang(lang === "fr" ? "en" : "fr"); }}
            className="text-xs font-medium text-gray-400 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg transition">
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <Link href="/login" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80 transition">Connexion</Link>
        </nav>
      </header>

      <main className="flex-grow pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white font-display font-extrabold text-lg flex-shrink-0">RK</div>
              <div>
                <h1 className="font-display text-2xl font-extrabold">{copy.greeting} {copy.name}</h1>
                <p className="text-sm text-gray-400 font-light">{copy.role}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                  <span className="text-xs text-gray-400">{copy.location}</span>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-2xl px-6 py-4 text-center min-w-32">
              <div className="font-display text-3xl font-extrabold text-blue-600">62</div>
              <div className="text-xs font-semibold text-gray-900 mt-0.5">{copy.score_label}</div>
              <div className="text-xs text-gray-400 mt-0.5 max-w-28">{copy.score_sub}</div>
            </div>
          </div>

          <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
            {[
              { key: "profil", label: copy.tab_profil },
              { key: "cv", label: copy.tab_cv },
              { key: "interview", label: copy.tab_interview },
              { key: "match", label: copy.tab_match },
            ].map(function(tab) {
              return (
                <button key={tab.key} onClick={function() { setActiveTab(tab.key); }}
                  className={activeTab === tab.key
                    ? "px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-gray-900 text-gray-900"
                    : "px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-400 hover:text-gray-900"}>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "profil" && (
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-extrabold">{copy.section_info}</h2>
                <button className="text-xs font-medium border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-900 transition">{copy.edit}</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {Object.keys(copy.fields).map(function(key) {
                  return (
                    <div key={key} className="border-b border-gray-100 pb-4">
                      <div className="text-xs text-gray-400 mb-1">{copy.fields[key]}</div>
                      <div className="text-sm font-medium">{copy.values[key]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "cv" && <ComingSoon title={copy.cv_title} desc={copy.cv_desc} />}
          {activeTab === "interview" && <ComingSoon title={copy.interview_title} desc={copy.interview_desc} />}
          {activeTab === "match" && <ComingSoon title={copy.match_title} desc={copy.match_desc} />}

          <div className="mt-10 text-center">
            <Link href="/login" className="text-xs text-gray-300 hover:text-gray-600 transition">{copy.logout}</Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 px-8 py-4 text-center">
        <p className="text-xs text-gray-300">© 2026 Kbwee</p>
      </footer>
    </div>
  );
}
