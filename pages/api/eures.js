export default async function handler(req, res) {
  const { query = "", location = "Luxembourg", page = "1" } = req.query;

  try {
    const body = {
      dataSetRequest: {
        pageNumber: parseInt(page),
        pageSize: 20,
        sortSearch: "BEST_MATCH",
        queryKeyword: query || location,
        locationCodes: ["LU"],
        resultsLanguage: "fr",
      }
    };

    const response = await fetch(
      "https://europa.eu/eures/eures-searchengine/page/jv-list/search?pageLang=fr&pageId=jv-list",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!data.jobVacancyList || data.jobVacancyList.length === 0) {
      return res.status(200).json({ jobs: [], debug: data });
    }

    const jobs = data.jobVacancyList.map(function(job) {
      return {
        id: job.header?.jobVacancyId || Math.random().toString(),
        title: job.header?.jobTitle || "Poste non spécifié",
        company: job.header?.employerName || "Entreprise confidentielle",
        location: job.header?.placeOfWork || "Luxembourg",
        type: job.header?.contractType || "CDI",
        sector: job.header?.occupationLabel || "",
        description: job.body?.jobDescription?.substring(0, 300) + "..." || "",
        created_at: job.header?.publicationStartDate || new Date().toISOString(),
        apply_link: "https://europa.eu/eures/portal/jv-se/jv-details/" + (job.header?.jobVacancyId || ""),
        source: "EURES Luxembourg",
      };
    });

    res.status(200).json({ jobs, total: data.totalCount || jobs.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
