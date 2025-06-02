import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Profil() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifie si un utilisateur est connecté
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login"); // Redirige si non connecté
      } else {
        setUser(data.user);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) {
    return <p className="text-center mt-20">Chargement du profil...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4">
      <div className="w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>ID :</strong> {user.id}</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
