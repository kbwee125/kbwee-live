// pages/api/jobs.js
export default async function handler(req, res) {
  const appId = process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
  const apiKey = process.env.NEXT_PUBLIC_ADZUNA_API_KEY;
  const country = 'gb';
  const resultsPerPage = 5;

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${apiKey}&results_per_page=${resultsPerPage}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json({ results: data.results || [] });
  } catch (error) {
    console.error('Erreur API côté serveur :', error);
    res.status(500).json({ error: 'Erreur interne lors de la récupération des annonces' });
  }
}
