import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function RecruiterDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: '', company: '', location: '', description: '' });
  const router = useRouter();

  // Vérifie si le recruteur est connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/recruiter/login');
      } else {
        setUser(data.user);
        fetchJobs(data.user.id);
      }
    };
    checkUser();
  }, []);

  const fetchJobs = async (userId) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error) setJobs(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('jobs').insert([
      {
        ...form,
        user_id: user.id,
      },
    ]);
    if (!error) {
      setForm({ title: '', company: '', location: '', description: '' });
      fetchJobs(user.id);
    }
  };

  const deleteJob = async (id) => {
    await supabase.from('jobs').delete().eq('id', id);
    fetchJobs(user.id);
  };

  if (!user) return <p className="text-center mt-20">Chargement...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard Recruteur</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input name="title" placeholder="Titre" className="border p-2 w-full" onChange={handleChange} value={form.title} required />
        <input name="company" placeholder="Entreprise" className="border p-2 w-full" onChange={handleChange} value={form.company} required />
        <input name="location" placeholder="Lieu" className="border p-2 w-full" onChange={handleChange} value={form.location} required />
        <textarea name="description" placeholder="Description" className="border p-2 w-full" onChange={handleChange} value={form.description} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Publier l'offre</button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Vos Offres</h2>
      <ul className="space-y-3">
        {jobs.map((job) => (
          <li key={job.id} className="border p-3 rounded flex justify-between items-start">
            <div>
              <h3 className="font-bold">{job.title}</h3>
              <p className="text-sm">{job.company} – {job.location}</p>
              <p className="text-xs mt-2">{job.description}</p>
            </div>
            <button onClick={() => deleteJob(job.id)} className="text-red-500 text-sm">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
