import React from "react";

export default function Jobs() {
  const jobs = [
    {
      title: "Développeur Fullstack",
      company: "TechLux",
      location: "Luxembourg",
      type: "CDI",
    },
    {
      title: "Responsable RH",
      company: "FinTrust",
      location: "Esch-sur-Alzette",
      type: "CDD",
    },
    {
      title: "UX Designer Junior",
      company: "Kbwee Inc.",
      location: "Remote",
      type: "Stage",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Offres d'emploi</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {jobs.map((job, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.company} - {job.location}</p>
            <span className="text-xs inline-block mt-2 bg-blue-100 text-blue-600 px-2 py-1 rounded">
              {job.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
