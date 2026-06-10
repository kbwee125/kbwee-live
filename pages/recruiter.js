import React, { useState } from "react";
import Link from "next/link";

export default function RecruiterDashboard() {
  const [email, setEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedJob, setSelectedJob] = useState(null);
  const [kitLoading, setKitLoading] = useState(false);
  const [kit, setKit] = useState(null);
  const [kitJob, setKitJob] = useState("");
  const [kitCompany, setKitCompany] = useState("");
  const [kitSector, setKitSector] = useState("");
  const [error, setError] = useState("");

  async function loadDashboard(e) {
    if (e) e.preventDefault();
    if (!emailInput) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recruiter?action=stats&email=" + encodeURIComponent(emailInput));
      const json = await res.json();
      if (json.error) { setError(json.error); setLoading(false); return; }
      setData(json);
      setEmail(emailInput);
    } catch (e) {
      setError("Erreur de connexion.");
    }
    setLoading(false);
  }

  async function updateStatus(appId, status) {
    await fetch("/api/recruiter?action=update-status&id=" + appId + "&status=" + status);
    const updated = { ...data };
    updated.applications = updated.applications.map(function(a) {
      return a.id === appId ? { ...a, status } : a;
    });
    updated.stats.pending = updated.applications.filter(function(a) { return a.status === "pending"; }).length;
    updated.stats.reviewed = updated.applications.filter(function(a) { return a.status === "reviewed"; }).length;
    updated.stats.accepted = updated.applications.filter(function(a) { return a.status === "accepted"; }).length;
    setData(updated);
  }

  async function deleteJob(jobId) {
    if (!confirm("Supprimer cette offre ?")) return;
    await fetch("/api/recruiter?action=delete-job&id=" + jobId);
    const updated = { ...data };
    updated.jobs = updated.jobs.filter(function(j) { return j.id !== jobId; });
    updated.stats.totalJobs = updated.jobs.length;
    setData(updated);
    if (selectedJob === jobId) setSelectedJob(null);
  }

  async function generateKit() {
    if (!kitJob) return;
    setKitLoading(true);
    setKit(null);
    setError("");
    try {
      const res = await fetch("/api/interview-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: kitJob,
          company: kitCompany,
          sector: kitSector,
        }),
      });
      const json = await res.json();
      if (json.error) { setError(json.error); } else { setKit(json); }
    } catch (e) {
      setError("Erreur : " + e.message);
    }
    setKitLoading(false);
  }

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return "Il y a 1 jour";
    return "Il y a " + diff + " jours";
  }

  function statusColor(status) {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "reviewed") return "bg-blue-100 text-blue-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  }

  function statusLabel(status) {
    if (status === "accepted") return "Retenu";
    if (status === "reviewed") return "En cours";
    if (status === "rejected") return "Refusé";
    return "En attente";
  }

  const jobApplications = selectedJob
    ? (data?.applications || []).filter(function(a) { return a.job_id === selectedJob; })
    : [];

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
          <Link href="/cv-optimizer" className="text-sm text-gray-500 hover:text-gray-900 transition">CV Optimizer</Link>
          <Link href="/mock-interview" className="text-sm text-gray-500 hover:text-gray-900 transition">Mock Interview</Link>
          <Link href="/post-job" className="text-sm text-gray-500 hover:text-gray-900 transition">Publier une offre</Link>
          <Link href="/login" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80 transition">Connexion</Link>
        </nav>
      </header>

      <main className="flex-grow pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">

          {!email ? (
            <div className="max-w-md mx-auto pt-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                  Espace Recruteur
                </div>
                <h1 className="font-display text-3xl font-extrabold mb-3">Dashboard Recruteur</h1>
                <p className="text-gray-400 font-light">Entrez l'email utilisé pour publier vos offres.</p>
              </div>
              <div className="border border-gray-200 rounded-2xl p-8">
                <form onSubmit={loadDashboard} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-2 block">Email recruteur</label>
                    <input type="email" placeholder="recrutement@entreprise.com"
                      value={emailInput} onChange={function(e) { setEmailInput(e.target.value); }} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"/>
                  </div>
                  {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
                  <button type="submit" disabled={loading}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:opacity-80 transition disabled:opacity-40">
                    {loading ? "Chargement..." : "Accéder au dashboard →"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="font-display text-3xl font-extrabold">Dashboard Recruteur</h1>
                  <p className="text-sm text-gray-400 mt-1">{email}</p>
                </div>
                <Link href="/post-job" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition">
                  + Publier une offre
                </Link>
              </div>

              <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
                {[
                  { key: "overview", label: "Vue d'ensemble" },
                  { key: "jobs", label: "Mes offres (" + (data?.stats?.totalJobs || 0) + ")" },
                  { key: "applications", label: "Candidatures (" + (data?.stats?.totalApplications || 0) + ")" },
                  { key: "tools", label: "Outils IA" },
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

              {activeTab === "overview" && (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "Offres publiées", value: data?.stats?.totalJobs || 0, color: "text-gray-900" },
                      { label: "Candidatures", value: data?.stats?.totalApplications || 0, color: "text-blue-600" },
                      { label: "En attente", value: data?.stats?.pending || 0, color: "text-orange-500" },
                      { label: "Retenus", value: data?.stats?.accepted || 0, color: "text-green-600" },
                    ].map(function(stat, i) {
                      return (
                        <div key={i} className="border border-gray-200 rounded-2xl p-6 text-center">
                          <div className={"font-display text-4xl font-extrabold mb-1 " + stat.color}>{stat.value}</div>
                          <div className="text-xs text-gray-400">{stat.label}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <h2 className="font-display text-lg font-extrabold mb-4">Dernières candidatures</h2>
                    {(data?.applications || []).length === 0 ? (
                      <p className="text-gray-400 text-sm font-light text-center py-8">Aucune candidature pour le moment.</p>
                    ) : (
                      <div className="space-y-3">
                        {(data?.applications || []).slice(0, 5).map(function(app) {
                          const job = (data?.jobs || []).find(function(j) { return j.id === app.job_id; });
                          return (
                            <div key={app.id} className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
                              <div>
                                <p className="text-sm font-medium">{app.candidate_name}</p>
                                <p className="text-xs text-gray-400">{job ? job.title : "Offre supprimée"} · {timeAgo(app.created_at)}</p>
                              </div>
                              <span className={"text-xs font-medium px-2 py-1 rounded-full " + statusColor(app.status)}>{statusLabel(app.status)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "jobs" && (
                <div className="space-y-4">
                  {(data?.jobs || []).length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
                      <p className="text-gray-400 mb-4">Aucune offre publiée avec cet email.</p>
                      <Link href="/post-job" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition">
                        Publier ma première offre →
                      </Link>
                    </div>
                  ) : (
                    (data?.jobs || []).map(function(job) {
                      const appCount = (data?.applications || []).filter(function(a) { return a.job_id === job.id; }).length;
                      return (
                        <div key={job.id} className="border border-gray-200 rounded-2xl p-6 hover:border-gray-900 transition">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1">
                              <h3 className="font-display text-lg font-bold mb-1">{job.title}</h3>
                              <p className="text-sm text-gray-500 mb-3">{job.company} · {job.location} · {job.type}</p>
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{appCount} candidature{appCount > 1 ? "s" : ""}</span>
                                <span className="text-xs text-gray-400">{timeAgo(job.created_at)}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={function() { setSelectedJob(job.id); setActiveTab("applications"); }}
                                className="text-xs border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-900 transition">
                                Voir candidatures
                              </button>
                              <button onClick={function() { deleteJob(job.id); }}
                                className="text-xs border border-red-200 text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition">
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === "applications" && (
                <div>
                  <div className="flex gap-2 flex-wrap mb-6">
                    <button onClick={function() { setSelectedJob(null); }}
                      className={!selectedJob ? "text-xs px-4 py-2 rounded-full font-medium bg-gray-900 text-white" : "text-xs px-4 py-2 rounded-full font-medium bg-white border border-gray-200 text-gray-500 hover:border-gray-900 transition"}>
                      Toutes
                    </button>
                    {(data?.jobs || []).map(function(job) {
                      return (
                        <button key={job.id} onClick={function() { setSelectedJob(job.id); }}
                          className={selectedJob === job.id ? "text-xs px-4 py-2 rounded-full font-medium bg-gray-900 text-white" : "text-xs px-4 py-2 rounded-full font-medium bg-white border border-gray-200 text-gray-500 hover:border-gray-900 transition"}>
                          {job.title}
                        </button>
                      );
                    })}
                  </div>
                  {(selectedJob ? jobApplications : data?.applications || []).length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
                      <p className="text-gray-400">Aucune candidature pour le moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(selectedJob ? jobApplications : data?.applications || []).map(function(app) {
                        const job = (data?.jobs || []).find(function(j) { return j.id === app.job_id; });
                        return (
                          <div key={app.id} className="border border-gray-200 rounded-2xl p-6">
                            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                              <div>
                                <h3 className="font-display text-lg font-bold">{app.candidate_name}</h3>
                                <p className="text-sm text-gray-400">{app.candidate_email}{app.candidate_phone ? " · " + app.candidate_phone : ""}</p>
                                {job && <p className="text-xs text-blue-600 mt-1 font-medium">{job.title}</p>}
                                <p className="text-xs text-gray-300 mt-1">{timeAgo(app.created_at)}</p>
                              </div>
                              <span className={"text-xs font-medium px-3 py-1.5 rounded-full " + statusColor(app.status)}>{statusLabel(app.status)}</span>
                            </div>
                            {app.cover_letter && (
                              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <p className="text-xs font-medium text-gray-500 mb-2">Lettre de motivation</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{app.cover_letter}</p>
                              </div>
                            )}
                            <div className="flex gap-2 flex-wrap">
                              {["pending", "reviewed", "accepted", "rejected"].map(function(status) {
                                return (
                                  <button key={status} onClick={function() { updateStatus(app.id, status); }}
                                    className={app.status === status
                                      ? "text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-900 text-white"
                                      : "text-xs px-3 py-1.5 rounded-lg font-medium border border-gray-200 text-gray-500 hover:border-gray-900 transition"}>
                                    {statusLabel(status)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "tools" && (
                <div className="space-y-8">
                  <div className="border border-gray-200 rounded-2xl p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="text-3xl">📋</div>
                      <div>
                        <h2 className="font-display text-xl font-extrabold mb-1">Interview Kit IA</h2>
                        <p className="text-gray-400 font-light text-sm">Générez une grille d'entretien complète et structurée par poste.</p>
                      </div>
                    </div>
                    {!kit ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Poste *</label>
                            <input type="text" placeholder="ex. Analyste KYC"
                              value={kitJob} onChange={function(e) { setKitJob(e.target.value); }}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"/>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Entreprise</label>
                            <input type="text" placeholder="ex. Goldman Sachs"
                              value={kitCompany} onChange={function(e) { setKitCompany(e.target.value); }}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"/>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Secteur</label>
                            <input type="text" placeholder="ex. Finance"
                              value={kitSector} onChange={function(e) { setKitSector(e.target.value); }}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"/>
                          </div>
                        </div>
                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
                        <button onClick={generateKit} disabled={!kitJob || kitLoading}
                          className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition disabled:opacity-40">
                          {kitLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              Claude génère la grille...
                            </span>
                          ) : "Générer la grille d'entretien →"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-display text-lg font-bold">{kit.title}</h3>
                            <p className="text-xs text-gray-400">Durée : {kit.duration}</p>
                          </div>
                          <button onClick={function() { setKit(null); setKitJob(""); setKitCompany(""); setKitSector(""); }}
                            className="text-xs border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-900 transition">
                            Nouvelle grille
                          </button>
                        </div>
                        {(kit.sections || []).map(function(section, si) {
                          return (
                            <div key={si} className="border border-gray-100 rounded-xl p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-display text-base font-bold">{section.name}</h4>
                                <span className="text-xs text-gray-400">{section.duration}</span>
                              </div>
                              <div className="space-y-4">
                                {(section.questions || []).map(function(q, qi) {
                                  return (
                                    <div key={qi} className="bg-gray-50 rounded-xl p-4">
                                      <p className="text-sm font-medium mb-3">{q.question}</p>
                                      <div className="grid md:grid-cols-3 gap-3">
                                        <div>
                                          <p className="text-xs font-bold text-gray-400 mb-1">Objectif</p>
                                          <p className="text-xs text-gray-600">{q.objective}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-green-600 mb-1">✓ Bonne réponse</p>
                                          <p className="text-xs text-gray-600">{q.goodAnswer}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-red-500 mb-1">⚠ Signal alerte</p>
                                          <p className="text-xs text-gray-600">{q.redFlag}</p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                        {kit.evaluationCriteria && (
                          <div className="border border-blue-100 bg-blue-50 rounded-xl p-4">
                            <p className="text-xs font-bold text-blue-600 mb-2">Critères d'évaluation</p>
                            <div className="flex gap-2 flex-wrap">
                              {kit.evaluationCriteria.map(function(c, i) {
                                return <span key={i} className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded-full">{c}</span>;
                              })}
                            </div>
                          </div>
                        )}
                        {kit.recommendation && (
                          <div className="border border-gray-200 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-500 mb-2">Conseil du recruteur IA</p>
                            <p className="text-sm text-gray-700">{kit.recommendation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                    <div className="text-3xl mb-3">⚖️</div>
                    <h2 className="font-display text-xl font-extrabold mb-2">Bias Checker</h2>
                    <p className="text-gray-400 font-light text-sm mb-4">Analysez vos offres pour détecter les biais inconscients.</p>
                    <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                      Bientôt disponible
                    </span>
                  </div>

                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                    <div className="text-3xl mb-3">🎯</div>
                    <h2 className="font-display text-xl font-extrabold mb-2">Fit Score</h2>
                    <p className="text-gray-400 font-light text-sm mb-4">Évaluez la compatibilité candidat ↔ poste par IA.</p>
                    <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                      Bientôt disponible
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 px-8 py-4 text-center">
        <p className="text-xs text-gray-300">© 2026 Kbwee</p>
      </footer>
    </div>
  );
}
