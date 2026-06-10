import React, { useState } from "react";
import Link from "next/link";

export default function CVOptimizer() {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const isText = file.name.endsWith(".txt") || file.name.endsWith(".md");

      if (isText) {
        const text = await file.text();
        const response = await fetch("/api/cv-optimizer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cvText: text,
            isText: true,
            jobTitle: jobTitle,
          }),
        });
        const data = await response.json();
        if (data.error) setError(data.error);
        else setResult(data);
      } else {
        const reader = new FileReader();
        reader.onload = async function(event) {
          const base64 = event.target.result.split(",")[1];
          const response = await fetch("/api/cv-optimizer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cvBase64: base64,
              isText: false,
              jobTitle: jobTitle,
            }),
          });
          const data = await response.json();
          if (data.error) setError(data.error);
          else setResult(data);
          setLoading(false);
        };
        reader.readAsDataURL(file);
        return;
      }
    } catch (e) {
      setError("Une erreur est survenue. Réessayez.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 h-16">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight flex-shrink-0">Kbwee</Link>
        <nav className="flex items-center gap-3 md:gap-8 ml-4">
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-900 transition">Jobs</Link>
          <Link href="/post-job" className="text-sm text-gray-500 hover:text-gray-900 transition">Recruteurs</Link>
          <Link href="/login" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80 transition">Connexion</Link>
        </nav>
      </header>

      <main className="flex-grow pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
              Assisté par Claude IA
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight mb-3">CV Optimizer</h1>
            <p className="text-gray-400 font-light max-w-md mx-auto">
              Importez votre CV — Claude l'analyse, le score et vous donne des suggestions concrètes selon le poste visé.
            </p>
          </div>

          {!result ? (
            <div className="border border-gray-200 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Votre CV (PDF ou TXT) *</label>
                  <div
                    onClick={function() { document.getElementById("cv-file").click(); }}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                      file ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"
                    }`}>
                    <input
                      id="cv-file"
                      type="file"
                      accept=".pdf,.txt"
                      onChange={function(e) { setFile(e.target.files[0]); }}
                      className="hidden"
                    />
                    {file ? (
                      <div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                    ) : (
                      <div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 15V3m0 0L8 7m4-4l4 4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">Cliquez pour importer votre CV</p>
                        <p className="text-xs text-gray-300 mt-1">PDF ou TXT — max 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Poste visé (optionnel)</label>
                  <input
                    type="text"
                    placeholder="ex. Analyste KYC Senior, Product Manager..."
                    value={jobTitle}
                    onChange={function(e) { setJobTitle(e.target.value); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={!file || loading}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-medium hover:opacity-80 transition disabled:opacity-40">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Claude analyse votre CV...
                    </span>
                  ) : "Analyser mon CV →"}
                </button>

                <p className="text-xs text-gray-300 text-center">
                  Votre CV est analysé en temps réel et n'est pas stocké.
                </p>
              </form>
            </div>
          ) : (
            <div className="space-y-6">

              <div className="border border-gray-200 rounded-2xl p-8 text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Kbwee Score</p>
                <div className="font-display text-7xl font-extrabold text-blue-600 mb-2">{result.score}</div>
                <div className="text-gray-400 font-light">/100</div>
                <p className="text-sm text-gray-500 mt-3 max-w-sm mx-auto">{result.summary}</p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-8">
                <h2 className="font-display text-xl font-extrabold mb-4">
                  <span className="text-green-500">✓</span> Points forts
                </h2>
                <ul className="space-y-3">
                  {(result.strengths || []).map(function(item, i) {
                    return (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="w-5 h-5 rounded-md bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600 font-bold text-xs mt-0.5">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border border-gray-200 rounded-2xl p-8">
                <h2 className="font-display text-xl font-extrabold mb-4">
                  <span className="text-orange-500">↑</span> Améliorations prioritaires
                </h2>
                <ul className="space-y-3">
                  {(result.improvements || []).map(function(item, i) {
                    return (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600 font-bold text-xs mt-0.5">{i + 1}</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {result.jobMatch && (
                <div className="border border-blue-100 bg-blue-50 rounded-2xl p-8">
                  <h2 className="font-display text-xl font-extrabold mb-3 text-blue-900">
                    Compatibilité avec "{jobTitle}"
                  </h2>
                  <p className="text-sm text-blue-800 leading-relaxed">{result.jobMatch}</p>
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={function() { setResult(null); setFile(null); setJobTitle(""); }}
                  className="flex-1 border-2 border-gray-200 text-gray-900 py-3 rounded-xl text-sm font-medium hover:border-gray-900 transition">
                  Analyser un autre CV
                </button>
                <Link href="/jobs" className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:opacity-80 transition text-center">
                  Voir les offres →
                </Link>
              </div>
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
