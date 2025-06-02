import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: ""
  });

  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("jobs").insert([form]);

    if (error) {
      setMessage("❌ Erreur : " + error.message);
    } else {
      setMessage("✅ Offre enregistrée !");
      setForm({ title: "", company: "", location: "", description: "" });
      // Optionnel : router.push("/jobs")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold mb-4">Poster une offre</h1>

        <input name="title" placeholder="Intitulé du poste" required onChange={handleChange} value={form.title} className="border p-2 w-full" />
        <input name="company" placeholder="Entreprise" required onChange={handleChange} value={form.company} className="border p-2 w-full" />
        <input name="location" placeholder="Lieu" required onChange={handleChange} value={form.location} className="border p-2 w-full" />
        <textarea name="description" placeholder="Description du poste" required onChange={handleChange} value={form.description} className="border p-2 w-full" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Publier</button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
