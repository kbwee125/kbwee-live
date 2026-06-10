import React, { useState, useEffect } from "react";
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
    try {
      const res = await fetch("/api/interview-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: kitJob, company: kitCompany, sector: kitSector }),
      });
      const json = await res.json();
      if (json.error) { setError(json.error); } else { setKit(json); }
    } catch (e) {
      setError("Erreur lors de la génération.");
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

          {/* LOGIN RECRUTEUR */}
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
              {/* HEADER DASHBOARD */}
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="font-display text-3xl font-extrabold">Dashboard Recruteur</h1>
                  <p className="text-sm text-gray-400 mt-1">{email}</p>
                </div>
                <Link href="/post-job" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition">
                  + Publier une offre
                </Link>
              </div>

              {/* TABS */}
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

              {/* VUE D'ENSEMBLE */}
              {activeTab === "overview" && (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "Offres publiées", value: data?.stats?.totalJobs || 0, color: "text-gray-900" },
                      { label: "Candidatures", value: data?.stats?.totalApplications || 0, color: "text-blue-600" },
                      { label: "En attente", value: data?.stats?.pending || 0, color: "text-orange-500" },
                      { label: "Retenus", value: data?.stats?.accepted || 0, color: "te
