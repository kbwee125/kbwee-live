import { useEffect, useState } from 'react';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const appId = process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
        const apiKey = process.env.NEXT_PUBLIC_ADZUNA_API_KEY;
        const country = 'lu'; // Luxembourg
        const resultsPerPage = 5;

        const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${apiKey}&results_per_page=${resultsPerPage}&content-type=application/json`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
          setJobs(data.results);
        } else {
          console.error('Aucune donnée reçue depuis Adzuna', data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces :', error);
      }
    }

    fetchJobs();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Annonces récentes</h1>
      {jobs.length === 0 ? (
        <p>Aucune annonce disponible.</p>
      ) : (
        <ul>
          {jobs.map((job, index) => (
            <li key={index}>
              <h3>{job.title}</h3>
              <p>{job.company.display_name}</p>
              <p>{job.location.display_name}</p>
              <p>{job.description}</p>
              <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">Voir l’annonce</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
