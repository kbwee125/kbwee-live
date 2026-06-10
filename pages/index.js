import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900" style={{fontFamily: "'DM Sans', sans-serif"}}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 h-16">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight flex-shrink-0">Kbwee</Link>
        <nav className="flex items-center gap-3 md:gap-6 ml-4">
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-900 transition font-medium">Jobs</Link>
          <Link href="/cv-optimizer" className="text-sm text-gray-500 hover:text-gray-900 transition font-medium">CV Optimizer</Link>
          <Link href="/mock-interview" className="text-sm text-gray-500 hover:text-gray-900 transition font-medium">Mock Interview</Link>
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

        <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight tracking-normal max-w-3xl mb-6">
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

      {/* FEATURES IA */}
      <section className="py-20 px-6 md:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-xs font-bold tracking-widest uppercase text-blue-600 text-center mb-3">Outils IA</div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-4">Maximisez vos chances.</h2>
          <p className="text-center text-gray-400 font-light mb-14 max-w-md mx-auto">Des outils IA conçus pour vous donner un avantage réel sur le marché de l'emploi.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📄",
                title: "CV Optimizer",
                desc: "Importez votre CV — Claude l'analyse, le score et vous donne des suggestions concrètes selon le poste visé.",
                link: "/cv-optimizer",
                cta: "Optimiser mon CV",
              },
              {
                icon: "🎯",
                title: "Mock Interview",
                desc: "Simulez un entretien complet avec un recruteur IA. Feedback instantané et score final.",
                link: "/mock-interview",
                cta: "S'entraîner",
              },
              {
                icon: "🔍",
                title: "Job Match",
                desc: "Des offres alignées avec votre profil réel — pas juste des mots-clés.",
                link: "/jobs",
                cta: "Voir les offres",
                soon: false,
              },
            ].map(function(feature, i) {
              return (
                <div key={i} className="border-2 border-gray-100 rounded-2xl p-8 hover:border-gray-900 transition bg-white">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm text-gray-400 font-light leading-relaxed mb-6">{feature.desc}</p>
                  <Link href={feature.link} className="inline-block bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-medium hover:opacity-80 transition">
                    {feature.cta} →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SPLIT */}
      <section className="grid md:grid-cols-2">
        <div className="bg-white border-b md:border-b-0 md:border-r border-gray-200 px-8 md:px-16 py-20">
          <div className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-4">Pour les candidats</div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            Maximise tes chances.<br />Décroche le bon job.
          </h2>
          <p className="text-gray-400 font-light mb-8 leading-relaxed">
            CV, LinkedIn, entretiens — Kbwee t'aide à te présenter sous ton meilleur jour et te connecte aux offres qui correspondent vraiment à ton profil.
          </p>
          <ul className="space-y-3 mb-10">
            {[
              "CV Optimizer IA — restructuration selon le poste visé",
              "Mock Interview — simulateur d'entretien IA",
              "Job Match — offres alignées avec ton vrai profil",
              "Kbwee Score — mesure ton niveau de préparation"
            ].map(function(item, i) {
              return (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">✓</span>
                  <span><strong>{item.split("—")[0]}</strong>—{item.split("—")[1]}</span>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-3 flex-wrap">
            <Link href="/cv-optimizer" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition">
              Optimiser mon CV →
            </Link>
            <Link href="/mock-interview" className="inline-block border-2 border-gray-200 text-gray-900 px-6 py-3 rounded-xl text-sm font-medium hover:border-gray-900 transition">
              Mock Interview
            </Link>
          </div>
        </div>

        <div className="bg-gray-900 px-8 md:px-16 py-20">
          <div className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">Pour les recruteurs</div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold leading-tight mb-4 text-white">
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
            ].map(function(item, i) {
              return (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="mt-0.5 w-5 h-5 rounded-md bg-blue-900 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-xs">✓</span>
                  <span><strong className="text-white">{item.split("—")[0]}</strong>—{item.split("—")[1]}</span>
                </li>
              );
            })}
          </ul>
          <Link href="/post-job" className="inline-block bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition">
            Publier une offre
          </Link>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-24 px-6 md:px-8 max-w-5xl mx-auto w-full">
        <div className="text-xs font-bold tracking-widest uppercase text-blue-600 text-center mb-3">Process</div>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-4">Comment ça marche ?</h2>
        <p className="text-center text-gray-400 font-light mb-14">Simple, rapide, efficace. Trois étapes pour trouver le bon fit.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: "Profil", title: "Optimise ton CV", desc: "Importe ton CV — Kbwee l'analyse et te dit exactement quoi améliorer pour le poste visé.", link: "/cv-optimizer" },
            { label: "Prépare", title: "Entraîne-toi", desc: "Simule un entretien complet avec notre IA. Feedback instantané, progressif, personnalisé.", link: "/mock-interview" },
            { label: "Postule", title: "Décroche le job", desc: "Accède aux offres alignées avec ton profil et postule directement depuis Kbwee.", link: "/jobs" }
          ].map(function(step, i) {
            return (
              <Link key={i} href={step.link} className="border-2 border-gray-100 rounded-2xl p-8 hover:border-gray-900 transition block">
                <div className="text-xs font-bold text-blue-600 tracking-widest mb-4">0{i+1} · {step.label}</div>
                <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">{step.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gray-900 text-white py-24 px-6 md:px-8 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-extrabold max-w-2xl mx-auto mb-6 leading-tight">
          Prêt à transformer ta recherche d'emploi ?
        </h2>
        <p className="text-gray-400 font-light mb-10">Rejoins la liste d'attente. Lancement bêta bientôt.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/waitlist" className="bg-white text-gray-900 px-7 py-3.5 rounded-xl text-sm font-semibold hover:opacity-80 transition">
            Rejoindre la liste d'attente →
          </Link>
          <Link href="/post-job" className="border-2 border-gray-600 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:border-gray-400 transition">
            Je recrute
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 px-6 md:px-8 py-6 flex justify-between items-center flex-wrap gap-4">
        <span className="font-display font-extrabold text-lg">Kbwee</span>
        <p className="text-xs text-gray-400">© 2026 Kbwee. Le recrutement humain, intelligent, équitable.</p>
        <div className="flex gap-4">
          <Link href="/jobs" className="text-xs text-gray-400 hover:text-gray-900 transition">Jobs</Link>
          <Link href="/cv-optimizer" className="text-xs text-gray-400 hover:text-gray-900 transition">CV Optimizer</Link>
          <Link href="/mock-interview" className="text-xs text-gray-400 hover:text-gray-900 transition">Mock Interview</Link>
          <Link href="/post-job" className="text-xs text-gray-400 hover:text-gray-900 transition">Recruteurs</Link>
        </div>
      </footer>

    </div>
  );
}
