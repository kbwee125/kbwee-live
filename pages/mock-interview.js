import React, { useState, useRef, useEffect } from "react";
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
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  useEffect(function() {
    if (typeof window !== "undefined") {
      const supported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
      setMicSupported(supported);
      // Précharger les voix
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
      }
    }
    return function() {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  function speak(text, onEnd) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(function(v) {
      return v.lang.startsWith("fr") && (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("amélie") || v.name.toLowerCase().includes("thomas"));
    }) || voices.find(function(v) { return v.lang.startsWith("fr"); });
    if (frVoice) utterance.voice = frVoice;

    utterance.onend = function() {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = function() {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  function toggleMic() {
    if (!micSupported) {
      setError("Micro non supporté sur ce navigateur. Utilisez Chrome.");
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    stopSpeaking();
    transcriptRef.current = userAnswer;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
      setIsRecording(true);
      setError("");
    };

    recognition.onresult = function(event) {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        transcriptRef.current = (transcriptRef.current + " " + finalTranscript).trim();
      }
      setUserAnswer((transcriptRef.current + " " + interimTranscript).trim());
    };

    recognition.onend = function() {
      setIsRecording(false);
      setUserAnswer(transcriptRef.current);
    };

    recognition.onerror = function(event) {
      setIsRecording(false);
      if (event.error === "not-allowed") {
        setError("Microphone non autorisé. Cliquez sur le cadenas 🔒 dans la barre d'adresse et autorisez le micro.");
      } else if (event.error === "no-speech") {
        setError("Aucune voix détectée. Réessayez.");
      } else {
        setError("Erreur micro : " + event.error);
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      setError("Impossible de démarrer le micro. Réessayez.");
    }
  }

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
      setTimeout(function() {
        speak(data.question || "");
      }, 500);
    } catch (e) {
      setError("Erreur de connexion. Réessayez.");
    }
    setLoading(false);
  }

  async function submitAnswer() {
    if (!userAnswer.trim()) return;
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
    }
    stopSpeaking();
    setLoading(true);
    setError("");
    transcriptRef.current = "";

    const newMessages = [...messages, { role: "user", content: userAnswer }];

    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, company, action: "answer", messages: newMessages }),
      });
      const data = await response.json();
      if (data.error) { setError(data.error); setLoading(false); return; }

      const updatedMessages = [...newMessages, { role: "assistant", content: JSON.stringify(data) }];
      setMessages(updatedMessages);
      setUserAnswer("");

      if (data.isFinished && data.finalReport) {
        setFinalReport(data.finalReport);
        setStep("report");
        speak("Entretien terminé. Voici votre bilan.");
      } else {
        setCurrentQuestion(data);
        setQuestionNumber(data.questionNumber || questionNumber + 1);
        const nextQ = data.nextQuestion || data.question || "";
        const feedbackText = data.feedback ? data.feedback + ". " : "";
        setTimeout(function() {
          speak(feedbackText + nextQ);
        }, 300);
      }
    } catch (e) {
      setError("Erreur de connexion. Réessayez.");
    }
    setLoading(false);
  }

  const conversationHistory = messages.filter(function(m) {
    if (m.role === "user") return true;
    try { const p = JSON.parse(m.content); return p.feedback || p.question; } catch { return false; }
  }).map(function(m) {
    if (m.role === "user") return { role: "user", text: m.content };
    try {
      const p = JSON.parse(m.content);
      return { role: "assistant", feedback: p.feedback, score: p.score };
    } catch { return null; }
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes soundwave { 0%, 100% { height: 8px; } 50% { height: 20px; } }
        .wave-bar { width: 3px; background: #ef4444; border-radius: 2px; animation: soundwave 0.8s ease-in-out infinite; }
        .wave-bar:nth-child(2) { animation-delay: 0.1s; }
        .wave-bar:nth-child(3) { animation-delay: 0.2s; }
        .wave-bar:nth-child(4) { animation-delay: 0.3s; }
        .wave-bar:nth-child(5) { animation-delay: 0.4s; }
        @keyframes speaking { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.5); } }
        .speak-bar { width: 3px; background: #2563EB; border-radius: 2px; animation: speaking 0.6s ease-in-out infinite; }
        .speak-bar:nth-child(2) { animation-delay: 0.15s; }
        .speak-bar:nth-child(3) { animation-delay: 0.3s; }
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
                  Simulateur IA · Claude + Voix
                </div>
                <h1 className="font-display text-4xl font-extrabold tracking-tight mb-3">Mock Interview</h1>
                <p className="text-gray-400 font-light max-w-md mx-auto">
                  Un recruteur IA vous pose des questions à voix haute. Répondez à l'écrit ou au micro 🎤
                </p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-8 space-y-5">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Poste visé *</label>
                  <input type="text" placeholder="ex. Analyste KYC Senior, Product Manager..."
                    value={jobTitle} onChange={function(e) { setJobTitle(e.target.value); }}
                    onKeyDown={function(e) { if (e.key === "Enter" && jobTitle) startInterview(); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Entreprise (optionnel)</label>
                  <input type="text" placeholder="ex. Goldman Sachs, BNP Paribas..."
                    value={company} onChange={function(e) { setCompany(e.target.value); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"/>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Comment ça marche :</p>
                  <ul className="space-y-1.5">
                    {[
                      "🔊 Le recruteur IA pose les questions à voix haute",
                      "🎤 Répondez au micro — transcription automatique",
                      "⌨️ Ou tapez votre réponse si vous préférez",
                      "📊 Score final + feedback détaillé après 5 questions"
                    ].map(function(item, i) {
                      return (
                        <li key={i} className="text-xs text-gray-500">{item}</li>
                      );
                    })}
                  </ul>
                </div>

                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

                <button onClick={startInterview} disabled={!jobTitle || loading}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-medium hover:opacity-80 transition disabled:opacity-40">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Préparation...
                    </span>
                  ) : "Commencer l'entretien →"}
                </button>
              </div>
            </div>
          )}

          {/* INTERVIEW */}
          {step === "interview" && currentQuestion && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-display text-2xl font-extrabold">{jobTitle}</h1>
                  {company && <p className="text-sm text-gray-400">{company}</p>}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Question</div>
                  <div className="font-display text-2xl font-extrabold text-blue-600">{questionNumber}/5</div>
                </div>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
                <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: (questionNumber / 5 * 100) + "%" }}></div>
              </div>

              {/* Historique */}
              {conversationHistory.length > 0 && (
                <div className="space-y-3 mb-6">
                  {conversationHistory.map(function(item, i) {
                    if (item.role === "user") {
                      return (
                        <div key={i} className="flex justify-end">
                          <div className="bg-gray-900 text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-lg text-sm">{item.text}</div>
                        </div>
                      );
                    }
                    return item.feedback ? (
                      <div key={i} className="flex justify-start">
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-sm px-5 py-3 max-w-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-blue-600">Feedback</span>
                            {item.score && <span className="text-xs font-bold text-blue-600">{item.score}/10</span>}
                          </div>
                          <p className="text-sm text-blue-800">{item.feedback}</p>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {/* Question actuelle + indicateur voix */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    {currentQuestion.category || "Question"}
                  </span>
                  <div className="flex items-center gap-2">
                    {isSpeaking ? (
                      <div className="flex items-end gap-0.5 h-5">
                        <div className="speak-bar h-2"></div>
                        <div className="speak-bar h-3"></div>
                        <div className="speak-bar h-4"></div>
                        <div className="speak-bar h-3"></div>
                        <div className="speak-bar h-2"></div>
                      </div>
                    ) : null}
                    <button
                      onClick={function() {
                        if (isSpeaking) { stopSpeaking(); }
                        else { speak(currentQuestion.question || currentQuestion.nextQuestion || ""); }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                      {isSpeaking ? "⏹ Stop" : "🔊 Réécouter"}
                    </button>
                  </div>
                </div>
                <p className="text-gray-900 font-medium leading-relaxed">
                  {currentQuestion.question || currentQuestion.nextQuestion}
                </p>
              </div>

              {/* Zone réponse */}
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    placeholder={isRecording ? "🎤 Parlez — transcription en cours..." : "Tapez votre réponse ou cliquez sur 🎤"}
                    value={userAnswer}
                    onChange={function(e) {
                      setUserAnswer(e.target.value);
                      transcriptRef.current = e.target.value;
                    }}
                    rows={5}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none pr-14 ${
                      isRecording ? "border-red-400 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-gray-900"
                    }`}
                  />
                  {micSupported && (
                    <button onClick={toggleMic} type="button"
                      className={`absolute right-3 top-3 w-9 h-9 rounded-full flex items-center justify-center transition ${
                        isRecording ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}>
                      {isRecording ? (
                        <div className="flex items-end gap-0.5 h-5">
                          <div className="wave-bar"></div>
                          <div className="wave-bar"></div>
                          <div className="wave-bar"></div>
                          <div className="wave-bar"></div>
                          <div className="wave-bar"></div>
                        </div>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
                        </svg>
                      )}
                    </button>
                  )}
                </div>

                {isRecording && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"></span>
                    Enregistrement actif — cliquez sur le micro pour arrêter
                  </p>
                )}

                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

                <button onClick={submitAnswer} disabled={!userAnswer.trim() || loading}
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
                <p className="text-gray-400 font-light">Bilan pour {jobTitle}{company ? " chez " + company : ""}</p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-8 text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Score global</p>
                <div className="font-display text-7xl font-extrabold text-blue-600 mb-2">{finalReport.globalScore}</div>
                <div className="text-gray-400 font-light mb-3">/100</div>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">{finalReport.summary}</p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-8">
                <h2 className="font-display text-xl font-extrabold mb-4"><span className="text-green-500">✓</span> Points forts</h2>
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
                <h2 className="font-display text-xl font-extrabold mb-4"><span className="text-orange-500">↑</span> Axes d'amélioration</h2>
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
                  onClick={function() {
                    setStep("setup"); setMessages([]); setFinalReport(null);
                    setJobTitle(""); setCompany(""); setUserAnswer("");
                    transcriptRef.current = "";
                  }}
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
