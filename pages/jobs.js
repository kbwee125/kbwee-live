import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

const SECTORS = ["Tous", "Finance", "Tech", "Consulting", "RH", "Marketing"];
const LOCATIONS = ["Tous", "Luxembourg", "Paris", "London", "Remote"];

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Il y a 1 jour";
  return `Il y a ${diff} jours`;
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("Tous");
  const [location, setLocation] = useState("Tous");
  const [source, setSource] = useState("tous");

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    setLoading(true);

    // 1. Offres Supabase (publiées par les recruteurs)
    const { data: supabaseJobs } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    // 2. Offres JSearch (externes)
    let jsearchJobs = [];
    try {
      const res = await fetch("/api/jobs?query=emploi&location=Luxembourg");
      const data = await res.json();
      jsearchJobs = data.jobs || [];
    } catch (e) {
      console.error("Erreur JSearch:", e);
    }

    // Fusion des deux sources
    const allJobs = [
      ...(supabaseJobs || []).map(j => ({ ...j, _source: "kbwee" })),
      ...jsearchJobs.map(j => ({ ...j, _source: "external" })),
    ];

    setJobs(allJobs);
    setLoading(false);
  };

  const filtered = jobs.filter((job) => {
    const matchSearch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase());
    const matchSector = sector === "Tous" || job.sector === sector;
    const matchLocation = location === "Tous" ||
      job.location?.toLowerCase().includes(location.toLowerCase());
    const matchSource = source === "tous" ||
      (source === "kbwee" && job._source === "kbwee") ||
      (source === "external" && job._source === "external");
    return matchSearch && matchSector && matchLocation && matchSource;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-8 h-16">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight">Kbwee</Link>
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
          <h1 className="font-display text-4xl font-extrabold tracking-tight mb-2">Trouvez votre prochain poste.</h1>
          <p className="text-gray-400 font-light mb-8">Des offres vérifiées, présentées avec clarté. Juste l'essentiel.</p>

          {/* Filtres */}
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Titre, entreprise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-48 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
            />
            <select value={sector} onChange={(e) => setSector(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-white">
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={location} onChange={(e) => setLocation(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-white">
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* Toggle source */}
          <div className="flex gap-2 mt-4">
            {[
              { key: "tous", label: "Toutes les offres" },
              { key: "kbwee", label: "Publiées sur Kbwee" },
              { key: "external", label: "Sources externes" },
            ].map((s) => (
              <button key={s.key} onClick={() => setSource(s.key)}
                className={`text-xs px-4 py-2 rounded-full font-medium transition ${
                  source === s.key
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-900"
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LISTE */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-light">Chargement des offres...</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">
              {filtered.length} offre{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
            </p>
            <div className="flex flex-col gap-4">
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-lg">Aucune offre ne correspond à votre recherche.</p>
                </div>
              ) : (
                filtered.map((job) => (
                  <div key={job.id}
                    className={`border-2 rounded-2xl p-6 hover:border-gray-900 transition cursor-pointer ${
                      job._source === "kbwee" ? "border-blue-100 bg-blue-50" : "border-gray-100"
                    }`}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {job._source === "kbwee" && (
                            <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                              Kbwee
                            </span>
                          )}
                          {job._source === "external" && job.source && (
                            <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                              {job.source}
                            </span>
                          )}
                          {job.sector && (
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              {job.sector}
                            </span>
                          )}
                        </div>
                        <h2 className="font-display text-xl font-bold mb-1">{job.title}</h2>
                        <p className="text-sm text-gray-500 mb-3">
                          <strong>{job.company}</strong> · {job.location} · {job.type}
                        </p>
                        <p className="text-sm text-gray-400 font-light leading-relaxed line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className="text-xs text-gray-300">{timeAgo(job.created_at)}</span>
                        
                          href={job.apply_link || "#"}
                          target={job.apply_link ? "_blank" : "_self"}
                          rel="noopener noreferrer"
                          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:opacity-80 transition font-medium">
                          Postuler →
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* CTA Recruteur */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8 text-center text-white">
          <h3 className="font-display text-2xl font-extrabold mb-2">Vous recrutez ?</h3>
          <p className="text-gray-400 font-light mb-6">Publiez votre offre et accédez aux meilleurs profils vérifiés par Kbwee.</p>
          <Link href="/post-job" className="inline-block bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-80 transition">
            Publier une offre →
          </Link>
        </div>
      </div>
    </div>
  );
}
