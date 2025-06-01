import React, { useState } from "react";

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "CDI",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis :", formData);
    alert("Offre enregistrée (non persistée)");
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Publier une offre d'emploi</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div>
          <label className="block mb-1">Intitulé du poste</label>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={formData.title}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Entreprise</label>
          <input
            type="text"
            name="company"
            onChange={handleChange}
            value={formData.company}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Lieu</label>
          <input
            type="text"
            name="location"
            onChange={handleChange}
            value={formData.location}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Type de contrat</label>
          <select
            name="type"
            onChange={handleChange}
            value={formData.type}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            onChange={handleChange}
            value={formData.description}
            className="w-full border px-4 py-2 rounded"
            rows="4"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Publier
        </button>
      </form>
    </div>
  );
}
