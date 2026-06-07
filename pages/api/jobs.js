export default async function handler(req, res) {
  const { query = "analyst", location = "Luxembourg", page = "1" } = req.query;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const searchQuery = `${query} ${location}`;
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=${page}&num_pages=1&date_posted=all`;

    const response = await fetch(url, options);
    const data = await response.json();

    // Debug — on retourne tout pour voir ce qui se passe
    if (!data.data || data.data.length === 0) {
      return res.status(200).json({ 
        jobs: [],
        debug: {
          status: data.status,
          message: data.message || "No data",
          query: searchQuery,
          key_present: !!process.env.RAPIDAPI_KEY,
          key_length: process.env.RAPIDAPI_KEY?.length || 0,
        }
      });
    }

    const jobs = data.data.map((job) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city ? `${job.job_city}, ${job.job_country}` : job.job_country || location,
      type: job.job_employment_type === "FULLTIME" ? "CDI"
        : job.job_employment_type === "PARTTIME" ? "Temps partiel"
        : job.job_employment_type === "INTERN" ? "Stage"
        : job.job_employment_type || "CDI",
      sector: job.job_required_skills?.[0] || "",
      description: job.job_description ? job.job_description.substring(0, 300) + "..." : "",
      created_at: job.job_posted_at_datetime_utc || new Date().toISOString(),
      apply_link: job.job_apply_link || "#",
      logo: job.employer_logo || null,
      source: job.job_publisher || "Indeed",
    }));

    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      key_present: !!process.env.RAPIDAPI_KEY,
    });
  }
}
