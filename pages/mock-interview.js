import React, { useState } from "react";
import Link from "next/link";

export default function MockInterview() {
  const [step, setStep] = useState("setup");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [finalReport, setFinalReport] = useState(null);

  async function startInterview() {
    if (!jobTitle) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, company, action: "start", messages: [] }),
      });
      const data = await response.json();
      if (data.error) { setError(data.error); setLoading(false); return; }

      setCurrentQuestion(data);
      setQuestionNumber(1);
      setMessages([{ role: "assistant", content: JSON.stringify(data) }]);
      setStep("interview");
    } catch (e) {
      setError("Erreur de connexion. Réessayez.");
    }
    setLoading(false);
  }

  async function submitAnswer() {
    if (!userAnswer.trim()) return;
    setLoading(true);
    setError("");

    const newMessages = [
      ...messages,
      { role: "user", content: userAnswer },
    ];

    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle, company, action: "answer",
          messages: newMessages,
        }),
      });
      const data = await response.json();
      if (data.error) { setError(data.error); setLoading(false); return; }

      const updatedMessages = [
        ...newMessages,
        { role: "assistant", content: JSON.stringify(data) },
      ];

      setMessages(updatedMessages);
      setUserAnswer("");

      if (data.isFinished && data.finalReport) {
        setFinalReport(data.finalReport);
        setStep("report");
      } else {
        setCurrentQuestion(data);
        setQuestionNumber(data.questionNumber || questionNumber + 1);
      }
    } catch (e) {
      setError("Erreur de connexion. Réessayez.");
    }
    setLoading(false);
  }

  const conversationHistory = messages.filter(function(m) {
    if (m.role === "user") return true;
    try {
      const parsed = JSON.parse(m.content);
      return parsed.feedback || parsed.question;
    } catch { return false; }
  }).map(function(m) {
    if (m.role === "user") return { role: "user", text: m.content };
    try {
      const parsed = JSON.parse(m.content);
      return { role: "assistant", feedback: parsed.feedback, score: parsed.score, question: parsed.question || parsed.nextQuestion };
    } catch { return null; }
  }).filter(Boolean);

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
          <Link href="/mock-interview" className="text-sm text-gray-900 font-semibold">Mock Interview</Link>
          <Link href="/post-job" className="text-sm text-gray-500 hover:text-gray-900 transition">Recruteurs</Link>
          <Link href="/login" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80 transition">Connexion</Link>
        </nav>
      </header>

      <main className="flex-grow pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          {/* SETUP */}
          {step === "setup" && (
            <div>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                  Simulateur IA · Claude
                </div>
                <h1 className="font-display text-4xl font-extrabold tracking-tight mb-3">Mock Interview</h1>
                <p className="text-gray-400 font-light max-w-md mx-auto">
                  Entraînez-vous avec un recruteur IA. Questions personnalisées, feedback instantané, score final.
                </p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-8 space-y-5">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Poste visé *</label>
                  <input
                    type="text"
                    placeholder="ex. Analyste KYC Senior, Product Manager, Développeur Full Stack..."
                    value={jobTitle}
                    onChange={function(e) { setJobTitle(e.target.value); }}
                    onKeyDown={function(e) { if (e.key === "Enter" && jobTitle) startInterview(); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Entreprise (optionnel)</label>
                  <input
                    type="text"
                    placeholder="ex. Goldman Sachs, BNP Paribas, Google..."
                    value={company}
                    onChange={function(e) { setCompany(e.target.value); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
                  />
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Comment ça marche :</p>
                  <ul className="space-y-1">
                    {[
                      "Claude joue le rôle d'un recruteur senior",
                      "5 questions progressives personnalisées",
                      "Feedback immédiat après chaque réponse",
                      "Score final + rapport détaillé"
                    ].map(function(item, i) {
                      return (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="text-blue-600 font-bold">✓</span>
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

                <button
                  onClick={startInterview}
                  disabled={!jobTitle || loading}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-medium hover:opacity-80 transition disabled:opacity-40">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Préparation de l'entretien...
                    </span>
                  ) : "Commencer l'entretien →"}
                </button>
              </div>
            </div>
          )}

          {/* INTERVIEW */}
          {step === "interview" && currentQuestion && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display text-2xl font-extrabold">{jobTitle}</h1>
                  {company && <p className="text-sm text-gray-400">{company}</p>}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Question</div>
                  <div className="font-display text-2xl font-extrabold text-blue-600">{questionNumber}/5</div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: (questionNumber / 5 * 100) + "%" }}>
                </div>
              </div>

              {/* Historique */}
              {conversationHistory.length > 0 && (
                <div className="space-y-4 mb-8">
                  {conversationHistory.map(function(item, i) {
                    if (item.role === "user") {
                      return (
                        <div key={i} className="flex justify-end">
                          <div className="bg-gray-900 text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-lg text-sm">
                            {item.text}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={i} className="space-y-2">
                        {item.feedback && (
                          <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-sm px-5 py-3 max-w-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-blue-600">Feedback</span>
                              {item.score && (
                                <span className="text-xs font-bold text-blue-600">{item.score}/10</span>
                              )}
                            </div>
                            <p className="text-sm text-blue-800">{item.feedback}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Question actuelle */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    {currentQuestion.category || "Question"}
                  </span>
                </div>
                <p className="text-gray-900 font-medium leading-relaxed">
                  {currentQuestion.question || currentQuestion.nextQuestion}
                </p>
              </div>

              {/* Réponse */}
              <div className="space-y-3">
                <textarea
                  placeholder="Tapez votre réponse ici..."
                  value={userAnswer}
                  onChange={function(e) { setUserAnswer(e.target.value); }}
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition resize-none"
                />

                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

                <button
                  onClick={submitAnswer}
                  disabled={!userAnswer.trim() || loading}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-medium hover:opacity-80 transition disabled:opacity-40">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Claude analyse votre réponse...
                    </span>
                  ) : "Soumettre ma réponse →"}
                </button>
              </div>
            </div>
          )}

          {/* RAPPORT FINAL */}
          {step === "report" && finalReport && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl font-extrabold mb-2">Entretien terminé !</h1>
                <p className="text-gray-400 font-light">Voici votre bilan pour le poste de {jobTitle}</p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-8 text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Score global</p>
                <div className="font-display text-7xl font-extrabold text-blue-600 mb-2">{finalReport.globalScore}</div>
                <div className="text-gray-400 font-light">/100</div>
                <p className="text-sm text-gray-500 mt-3 max-w-sm mx-auto">{finalReport.summary}</p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-8">
                <h2 className="font-display text-xl font-extrabold mb-4">
                  <span className="text-green-500">✓</span> Points forts
                </h2>
                <ul className="space-y-3">
                  {(finalReport.strengths || []).map(function(item, i) {
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
                  <span className="text-orange-500">↑</span> Axes d'amélioration
                </h2>
                <ul className="space-y-3">
                  {(finalReport.improvements || []).map(function(item, i) {
                    return (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600 font-bold text-xs mt-0.5">{i + 1}</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={function() { setStep("setup"); setMessages([]); setFinalReport(null); setJobTitle(""); setCompany(""); }}
                  className="flex-1 border-2 border-gray-200 text-gray-900 py-3 rounded-xl text-sm font-medium hover:border-gray-900 transition">
                  Nouvel entretien
                </button>
                <Link href="/cv-optimizer" className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:opacity-80 transition text-center">
                  Optimiser mon CV →
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
