import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (isLogin) {
      // Connexion
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage("Erreur : " + error.message);
      } else {
        setMessage("Connexion réussie ✅");
      }
    } else {
      // Inscription
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setMessage("Erreur : " + error.message);
      } else {
        setMessage("Compte créé ✅ Vous pouvez vous connecter.");
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">
          {isLogin ? "Connexion" : "Inscription"}
        </h1>
        {message && <p className="text-sm text-center text-red-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isLogin ? "Se connecter" : "Créer un compte"}
          </button>
        </form>
        <p className="text-sm text-center">
          {isLogin ? "Pas encore inscrit ?" : "Déjà inscrit ?"}{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}
