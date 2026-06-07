import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900" style={{fontFamily: "'DM Sans', sans-serif"}}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-8 h-16">
        <span className="font-display text-xl font-extrabold tracking-tight">Kbwee</span>
        <nav className="flex items-center gap-8">
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-900 transition font-medium">Jobs</Link>
          <Link href="/post-job" className="text-sm text-gray-500 hover:text-gray-900 transition font-medium">Recruteurs</Link>
          <Link href="/login" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80 transition font-medium">Connexion</Link>
        </nav>
      </header>

      {/* HERO */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
          Plateforme IA · Recrutement 2026
        </div>

        <h1 className="font-display font-extrabold text-5xl md:text-6xl leading-tight tracking-normal max-w-3xl mb-6">
          Le recrutement{" "}
          <span className="text-blue-600">humain,</span>
          <br />intelligent, équitable.
        </h1>

        <p className="text-lg text-gray-400 font-light max-w-md mb-10">
          Une plateforme focalisée sur l'essentiel. Sans compromis. Pour les candidats et les entreprises qui visent le bon fit.
        </p>

        <div className="flex gap-3 flex-wrap justify-center mb-20">
          <Link href="/jobs" className="bg-gray-900 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:opacity-80 transition">
            Trouver un job →
          </Link>
          <Link href="/post-job" className="border-2 border-gray-200 text-gray-900 px-7 py-3.5 rounded-xl text-sm font-medium hover:border-gray-900 transition">
            Recruter un talent
          </Link>
        </div>

        <div className="flex gap-16 flex-wrap justify-center">
          <div className="text-center">
            <div className="font-display text-3xl font-extrabold">100%</div>
            <div className="text-xs text-gray-400 mt-1">Focalisé sur l'emploi</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl font-extrabold">IA</div>
            <div className="text-xs text-gray-400 mt-1">Assisté à chaque étape</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl font-extrabold">2 côtés</div>
            <div className="text-xs text-gray-400 mt-1">Candidats & Recruteurs</div>
          </div>
        </div>
      </main>

      {/* SPLIT */}
      <section className="grid md:grid-cols-2">
        <div className="bg-gray-50 border-r border-gray-200 px-16 py-20">
          <div className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-4">Pour les candidats</div>
          <h2 className="font-display text-4xl font-extrabold leading-tight mb-4">
            Maximise tes chances.<br />Décroche le bon job.
          </h2>
          <p className="text-gray-400 font-light mb-8 leading-relaxed">
            CV, LinkedIn, entretiens — Kbwee t'aide à te présenter sous ton meilleur jour et te connecte aux offres qui correspondent vraiment à ton profil.
          </p>
          <ul className="space-y-3 mb-10">
            {[
              "CV Optimizer IA — restructuration selon le poste visé",
              "LinkedIn Score — optimisation section par section",
              "Mock Interview — entraîne-toi, reçois un feedback IA",
              "Job Match — offres alignées avec ton vrai profil"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">✓</span>
                <span><strong>{item.split("—")[0]}</strong>—{item.split("—")[1]}</span>
              </li>
            ))}
          </ul>
          <Link href="/profil" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition">
            Créer mon profil gratuit
          </Link>
        </div>

        <div className="bg-gray-900 px-16 py-20">
          <div className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">Pour les recruteurs</div>
          <h2 className="font-display text-4xl font-extrabold leading-tight mb-4 text-white">
            Trouve le talent.<br />Pas juste un CV.
          </h2>
          <p className="text-gray-400 font-light mb-8 leading-relaxed">
            Kbwee structure ton process d'entretien, évalue les candidats en profondeur et t'aide à recruter avec précision.
          </p>
          <ul className="space-y-3 mb-10">
            {[
              "Interview Kit IA — grilles d'entretien par poste",
              "Candidate Insights — fiche synthèse IA par candidat",
              "Bias Checker — recrutement équitable et objectif",
              "Fit Score — compatibilité candidat ↔ culture/poste"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="mt-0.5 w-5 h-5 rounded-md bg-blue-900 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-xs">✓</span>
                <span><strong className="text-white">{item.split("—")[0]}</strong>—{item.split("—")[1]}</span>
              </li>
            ))}
          </ul>
          <Link href="/post-job" className="inline-block bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition">
            Publier une offre
          </Link>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-24 px-8 max-w-5xl mx-auto w-full">
        <div className="text-xs font-bold tracking-widest uppercase text-blue-600 text-center mb-3">Process</div>
        <h2 className="font-display text-4xl font-extrabold text-center mb-4">Comment ça marche ?</h2>
        <p className="text-center text-gray-400 font-light mb-14">Simple, rapide, efficace. Trois étapes pour trouver le bon fit.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: "Profil", title: "Crée ton profil", desc: "Importe ton CV ou LinkedIn. Kbwee l'analyse, le score, et te suggère comment le renforcer pour le marché." },
            { label: "Match", title: "Trouve le bon fit", desc: "Notre algorithme te connecte avec des offres réellement alignées avec tes compétences, ta culture et tes ambitions." },
            { label: "Prépare", title: "Décroche l'entretien", desc: "Entraîne-toi avec notre simulateur d'entretien IA. Feedback instantané, progressif, personnalisé par poste." }
          ].map((step, i) => (
            <div key={i} className="border-2 border-gray-100 rounded-2xl p-8 hover:border-gray-900 transition">
              <div className="text-xs font-bold text-blue-600 tracking-widest mb-4">0{i+1} · {step.label}</div>
              <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gray-900 text-white py-24 px-8 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-extrabold max-w-2xl mx-auto mb-6 leading-tight">
          Prêt à transformer ta façon de recruter ?
        </h2>
        <p className="text-gray-400 font-light mb-10">Rejoins la liste d'attente. Lancement bêta bientôt.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/profil" className="bg-white text-gray-900 px-7 py-3.5 rounded-xl text-sm font-semibold hover:opacity-80 transition">
            Je cherche un emploi →
          </Link>
          <Link href="/post-job" className="border-2 border-gray-600 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:border-gray-400 transition">
            Je recrute
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 px-8 py-6 flex justify-between items-center flex-wrap gap-4">
        <span className="font-display font-extrabold text-lg">Kbwee</span>
        <p className="text-xs text-gray-400">© 2026 Kbwee. Le recrutement humain, intelligent, équitable.</p>
        <p className="text-xs text-gray-400">Jobs · Recruteurs · À propos · Contact</p>
      </footer>

    </div>
  );
}
