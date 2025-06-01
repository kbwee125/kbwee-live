import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-gray-900">
      {/* Header */}
      <header className="w-full p-4 shadow-sm border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kbwee</h1>
        <nav className="space-x-4">
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Post a Job</a>
          <a href="#" className="hover:underline">Login</a>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-grow px-4 py-20 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Le recrutement humain, intelligent, équitable.
        </h2>
        <p className="text-lg md:text-xl max-w-xl mb-8">
          Une plateforme focalisée sur l'emploi. Sans distraction. Sans bullshit. Pour tous.
        </p>
        <div className="space-x-4">
          <a href="#" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Trouver un job</a>
          <a href="#" className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition">Recruter</a>
        </div>
      </main>

      {/* Features */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">Focalisé</h3>
            <p>Pas de feed social. Juste l'emploi. Rien d'autre.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Assisté par IA</h3>
            <p>CV, lettres et tri des candidatures intelligents et personnalisés.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Confiance & Transparence</h3>
            <p>Vérification via blockchain. Plus de doutes. Plus de flou.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-4 text-sm text-gray-500 border-t">
        &copy; 2025 Kbwee. Tous droits réservés.
      </footer>
    </div>
  );
}
