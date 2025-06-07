import { useEffect, useState } from 'react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
    const apiKey = process.env.NEXT_PUBLIC_ADZUNA_API_KEY;
    const country = 'gb';
    const resultsPerPage = 5;

    console.log('Vérif debug : appId =', appId, '| apiKey =', apiKey); // <- debug Vercel

    const url ='/api/adzuna';

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Réponse Adzuna', data); // <- debug API
        setJobs(data.results || []);
      })
      .catch((err) => {
        console.error('Erreur API Adzuna :', err);
        setError('Erreur lors de la récupération des annonces');
      });
  }, []);

  return (
    <div>
      <h1>Annonces récentes</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {jobs.length === 0 ? (
        <p>Aucune annonce disponible.</p>
      ) : (
        <ul>
          {jobs.map((job, i) => (
            <li key={i}>
              <strong>{job.title}</strong> chez <em>{job.company.display_name}</em> à {job.location.display_name}
              <p>{job.description?.slice(0, 120)}...</p>
              <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">Voir</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
