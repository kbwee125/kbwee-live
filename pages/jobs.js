import React, { useState } from "react";
import Link from "next/link";

const JOBS = [
  {
    id: 1,
    title: "Analyste KYC / AML",
    company: "BNP Paribas",
    location: "Luxembourg",
    type: "CDI",
    sector: "Finance",
    description: "Rejoignez notre équipe compliance pour analyser et valider les dossiers KYC de nos clients institutionnels.",
    posted: "Il y a 2 jours",
  },
  {
    id: 2,
    title: "Chargé de recrutement RH",
    company: "Deloitte",
    location: "Paris",
    type: "CDI",
    sector: "Consulting",
    description: "Pilotez le recrutement de profils seniors en audit et conseil. Gestion complète du cycle de recrutement.",
    posted: "Il y a 3 jours",
  },
  {
    id: 3,
    title: "Gestionnaire de patrimoine junior",
    company: "Société Générale",
    location: "Lyon",
    type: "CDI",
    sector: "Finance",
    description: "Accompagnez nos clients privés dans la gestion et l'optimisation de leur patrimoine financier.",
    posted: "Il y a 5 jours",
  },
  {
    id: 4,
    title: "Product Manager SaaS",
    company: "Kbwee",
    location: "Remote",
    type: "CDI",
    sector: "Tech",
    description: "Définissez et pilotez la roadmap produit de notre plateforme de recrutement nouvelle génération.",
    posted: "Il y a 1 jour",
    featured: true,
  },
  {
    id: 5,
    title: "Responsable Compliance",
    company: "ING Luxembourg",
    location: "Luxembourg",
    type: "CDI",
    sector: "Finance",
    description: "Supervisez les processus de conformité réglementaire et managez une équipe de 5 analystes.",
    posted: "Il y a 4 jours",
  },
  {
    id: 6,
    title: "Développeur Full Stack React/Node",
    company: "Startup fintech",
    location: "Paris",
    type: "CDI",
    sector: "Tech",
    description: "Construisez les fonctionnalités clés d'une application fintech en forte croissance.",
    posted: "Il y a 6 jours",
  },
];

const SECTORS = ["Tous", "Finance", "Tech", "Consulting"];
const LOCATIONS = ["Tous", "Luxembourg", "Paris", "Lyon", "Remote"];

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("Tous");
  const [location, setLocation] = useState("Tous");

  const filtered = JOBS.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchSector = sector === "Tous" || job.sector === sector;
    const matchLocation = location === "Tous" || job.location === location;
    return matchSearch && matchSector && matchLocation;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap'); .font-syne { font-family: 'Syne', sans-serif; }`}</style>

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-8 h-16">
        <Link href="/" className="font-syne text-xl font-extrabold tracking-tight">Kbwee</Link>
        <nav className="flex items-center gap-8">
          <Link href="/jobs" className="text-sm text-gray-900 font-semibold">Jobs</Link>
          <Link href="/post-job" className="text-sm text-gray-500 hover:text-gray-900 transition">Recruteurs</Link>
          <Link href="/login" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80 transition">Connexion</Link>
        </nav>
      </header>

      {/* HERO */}
      <div className="pt-28 pb-12 px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">Offres d'emploi</div>
          <h1 className="font-syne text-4xl font-extrabold tracking-tight mb-2">Trouve ton prochain job.</h1>
          <p className="text-gray-400 font-light mb-8">Des offres vérifiées, sans bullshit. Juste l'essentiel.</p>

          {/* Barre de recherche */}
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Titre, entreprise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-48 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
            />
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-white"
            >
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-white"
            >
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* LISTE */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <p className="text-sm text-gray-400 mb-6">{filtered.length} offre{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}</p>

        <div className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Aucune offre ne correspond à ta recherche.</p>
            </div>
          ) : (
            filtered.map((job) => (
              <div
                key={job.id}
                className={`border-2 rounded-2xl p-6 hover:border-gray-900 transition cursor-pointer ${job.featured ? "border-blue-200 bg-blue-50" : "border-gray-100"}`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {job.featured && (
                        <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">⭐ Featured</span>
                      )}
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{job.sector}</span>
                    </div>
                    <h2 className="font-syne text-xl font-bold mb-1">{job.title}</h2>
                    <p className="text-sm text-gray-500 mb-3">
                      <strong>{job.company}</strong> · {job.location} · {job.type}
                    </p>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">{job.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-xs text-gray-300">{job.posted}</span>
                    <button className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:opacity-80 transition font-medium">
                      Postuler →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA Recruteur */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8 text-center text-white">
          <h3 className="font-syne text-2xl font-extrabold mb-2">Tu recrutes ?</h3>
          <p className="text-gray-400 font-light mb-6">Publie ton offre et accède aux meilleurs profils vérifiés par Kbwee.</p>
          <Link href="/post-job" className="inline-block bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-80 transition">
            Publier une offre →
          </Link>
        </div>
      </div>
    </div>
  );
}
