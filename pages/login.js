import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [lang, setLang] = useState("fr");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const t = {
    fr: {
      signin: "Connexion", signup: "Inscription",
      email: "Adresse email", password: "Mot de passe",
      btnLogin: "Se connecter", btnSignup: "Créer mon compte",
      switchToSignup: "Pas encore inscrit ?", switchToLogin: "Déjà inscrit ?",
      switchLinkSignup: "Créer un compte", switchLinkLogin: "Se connecter",
      tagline: "Recrutement humain et intelligent.",
      comingSoon: "Fonctionnalité bientôt disponible.",
      forgot: "Mot de passe oublié ?",
    },
    en: {
      signin: "Sign in", signup: "Sign up",
      email: "Email address", password: "Password",
      btnLogin: "Sign in", btnSignup: "Create my account",
      switchToSignup: "Not registered yet?", switchToLogin: "Already have an account?",
      switchLinkSignup: "Create an account", switchLinkLogin: "Sign in",
      tagline: "Human and intelligent recruitment.",
      comingSoon: "Feature coming soon.",
      forgot: "Forgot password?",
    },
  };

  const copy = t[lang];

  const handleSubmit = function(e) {
    e.preventDefault();
    setMessage(copy.comingSoon);
    setMessageType("info");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 h-16">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight flex-shrink-0">Kbwee</Link>
        <div className="flex items-center gap-3 ml-4">
          <button onClick={function() { setLang(lang === "fr" ? "en" : "fr"); }}
            className="text-xs font-medium text-gray-400 hover:text-gray-900 transition border border-gray-200 px-3 py-1.5 rounded-lg">
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-sm py-16">
          <div className="text-center mb-8">
            <span className="font-display text-2xl font-extrabold tracking-tight">Kbwee</span>
            <p className="text-sm text-gray-400 mt-1 font-light">{copy.tagline}</p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8">
            <div className="flex border border-gray-200 rounded-xl p-1 mb-6">
              <button onClick={function() { setIsLogin(true); setMessage(""); }}
                className={isLogin ? "flex-1 text-sm py-2 rounded-lg bg-gray-900 text-white font-medium" : "flex-1 text-sm py-2 rounded-lg text-gray-400 hover:text-gray-900 font-medium"}>
                {copy.signin}
              </button>
              <button onClick={function() { setIsLogin(false); setMessage(""); }}
                className={!isLogin ? "flex-1 text-sm py-2 rounded-lg bg-gray-900 text-white font-medium" : "flex-1 text-sm py-2 rounded-lg text-gray-400 hover:text-gray-900 font-medium"}>
                {copy.signup}
              </button>
            </div>

            {message && (
              <div className={messageType === "error" ? "text-sm text-center px-4 py-3 rounded-xl mb-4 bg-red-50 text-red-600" : "text-sm text-center px-4 py-3 rounded-xl mb-4 bg-blue-50 text-blue-600"}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">{copy.email}</label>
                <input type="email" placeholder="exemple@email.com" value={email}
                  onChange={function(e) { setEmail(e.target.value); }} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">{copy.password}</label>
                <input type="password" placeholder="••••••••" value={password}
                  onChange={function(e) { setPassword(e.target.value); }} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"/>
              </div>
              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-xs text-gray-400 hover:text-gray-900 transition">{copy.forgot}</button>
                </div>
              )}
              <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:opacity-80 transition mt-2">
                {isLogin ? copy.btnLogin : copy.btnSignup}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-xs text-gray-300">ou</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>

            <button onClick={function() { setMessage(copy.comingSoon); setMessageType("info"); }}
              className="w-full border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-600 hover:border-gray-900 hover:text-gray-900 transition flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            {isLogin ? copy.switchToSignup : copy.switchToLogin}{" "}
            <button onClick={function() { setIsLogin(!isLogin); setMessage(""); }}
              className="text-gray-900 font-medium hover:underline">
              {isLogin ? copy.switchLinkSignup : copy.switchLinkLogin}
            </button>
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-200 px-8 py-4 text-center">
        <p className="text-xs text-gray-300">© 2026 Kbwee</p>
      </footer>
    </div>
  );
}
