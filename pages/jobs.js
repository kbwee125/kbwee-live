import { useEffect, useState } from 'react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data.results || []);
      })
      .catch(err => {
        console.error('Erreur API côté client :', err);
        setError('Erreur lors de la récupération des annonces');
      });
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
              <strong>{job.title}</strong> chez {job.company.display_name} ({job.location.display_name})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
