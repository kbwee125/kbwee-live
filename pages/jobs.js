import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase :', error.message);
        setError("Erreur lors du chargement des annonces.");
      } else {
        setJobs(data);
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
          {jobs.map((job, index) => (
            <li key={job.id}>
              <strong>{job.title}</strong> chez <em>{job.company}</em> – {job.location}
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
