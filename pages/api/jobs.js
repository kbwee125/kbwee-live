export default async function handler(req, res) {
  const { query = "recrutement", location = "Luxembourg", page = "1" } = req.query;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query + " " + location)}&page=${page}&num_pages=1&language=fr`;
    const response = await fetch(url, options);
    const data = await response.json();

    if (!data.data) {
      return res.status(200).json({ jobs: [] });
    }

    const jobs = data.data.map((job) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country || location,
      type: job.job_employment_type || "CDI",
      sector: job.job_required_skills?.[0] || "",
      description: job.job_description?.substring(0, 300) + "..." || "",
      created_at: job.job_posted_at_datetime_utc || new Date().toISOString(),
      apply_link: job.job_apply_link || "#",
      logo: job.employer_logo || null,
      source: job.job_publisher || "Indeed",
    }));

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Erreur JSearch :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des offres" });
  }
}
