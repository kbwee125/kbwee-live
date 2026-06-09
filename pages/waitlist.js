import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("candidat");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("waitlist")
      .insert([{ email, type }]);

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        setError("Cet email est déjà inscrit. Merci !");
      } else {
        setError("Une erreur est survenue. Réessayez.");
      }
    } else {
      setSubmitted(true);
    }
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

      <main className="flex-grow flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-lg py-16">

          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="font-display text-3xl font-extrabold mb-3">Vous êtes sur la liste !</h1>
              <p className="text-gray-400 font-light mb-2">
                {type === "candidat"
                  ? "Nous vous préviendrons dès que le CV Optimizer et le Mock Interview sont disponibles."
                  : "Nous vous préviendrons dès que l'accès recruteur complet est disponible."
                }
              </p>
              <p className="text-sm text-gray-300 mb-8">{email}</p>
              <Link href="/" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition">
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <div>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                  Lancement bêta bientôt
                </div>
                <h1 className="font-display text-4xl font-extrabold tracking-tight mb-3">
                  Rejoignez la liste d'attente.
                </h1>
                <p className="text-gray-400 font-light max-w-sm mx-auto">
                  Soyez parmi les premiers à accéder aux fonctionnalités IA de Kbwee — CV Optimizer, Mock Interview, Job Match.
                </p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-8">

                {/* Toggle candidat / recruteur */}
                <div className="flex border border-gray-200 rounded-xl p-1 mb-6">
                  <button
                    onClick={function() { setType("candidat"); }}
                    className={type === "candidat"
                      ? "flex-1 text-sm py-2.5 rounded-lg bg-gray-900 text-white font-medium"
                      : "flex-1 text-sm py-2.5 rounded-lg text-gray-400 hover:text-gray-900 font-medium transition"}>
                    Je cherche un emploi
                  </button>
                  <button
                    onClick={function() { setType("recruteur"); }}
                    className={type === "recruteur"
                      ? "flex-1 text-sm py-2.5 rounded-lg bg-gray-900 text-white font-medium"
                      : "flex-1 text-sm py-2.5 rounded-lg text-gray-400 hover:text-gray-900 font-medium transition"}>
                    Je recrute
                  </button>
                </div>

                {/* Ce qu'ils vont recevoir */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  {type === "candidat" ? (
                    <ul className="space-y-2">
                      {["CV Optimizer IA — accès prioritaire", "Mock Interview — simulateur d'entretien IA", "Job Match — offres alignées avec votre profil"].map(function(item, i) {
                        return (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-blue-600 font-bold">✓</span>
                            {item}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <ul className="space-y-2">
                      {["Interview Kit IA — grilles d'entretien par poste", "Candidate Insights — fiche synthèse par candidat", "Fit Score — compatibilité candidat ↔ poste"].map(function(item, i) {
                        return (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-blue-600 font-bold">✓</span>
                            {item}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={function(e) { setEmail(e.target.value); }}
                    required
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition disabled:opacity-50 flex-shrink-0">
                    {loading ? "..." : "Rejoindre →"}
                  </button>
                </form>

                <p className="text-xs text-gray-300 text-center mt-4">
                  Gratuit. Sans spam. Désabonnement en un clic.
                </p>
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
