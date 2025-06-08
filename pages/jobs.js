import { useEffect, useState } from 'react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/getJobs');
        const data = await response.json();

        if (response.ok) {
          setJobs(data.jobs || []);
        } else {
          console.error('Erreur Supabase API :', data.error);
          setError("Erreur lors de la récupération des annonces");
        }
      } catch (err) {
        console.error('Erreur requête :', err);
        setError("Erreur lors de la récupération des annonces");
      }
    };

    fetchJobs();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Annonces récentes</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {jobs.length === 0 ? (
        <p>Aucune annonce disponible.</p>
      ) : (
        <ul>
          {jobs.map((job, i) => (
            <li key={i}>
              <strong>{job.title}</strong> chez {job.company} à {job.location}
              <br />
              {job.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
