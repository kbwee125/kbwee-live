// pages/jobs.js
import { useEffect, useState } from 'react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(error => console.error('Erreur de chargement des annonces :', error));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Annonces récentes</h1>
      {jobs.length === 0 ? (
        <p>Aucune annonce disponible.</p>
      ) : (
        <ul style={{ marginTop: '1rem' }}>
          {jobs.map((job, index) => (
            <li key={index} style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{job.title}</h2>
              <p><strong>Entreprise :</strong> {job.company}</p>
              <p><strong>Lieu :</strong> {job.location}</p>
              <p>{job.description}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
