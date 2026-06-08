export default async function handler(req, res) {
  const { query = "developpeur", location = "", page = "1" } = req.query;

  try {
    // 1. Obtenir le token d'accès
    const tokenResponse = await fetch(
      "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.FRANCE_TRAVAIL_CLIENT_ID,
          client_secret: process.env.FRANCE_TRAVAIL_CLIENT_SECRET,
          scope: "api_offresdemploiv2 o2dsoffre",
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(401).json({
        error: "Token invalide",
        debug: tokenData,
      });
    }

    // 2. Rechercher les offres
    const params = new URLSearchParams({
      motsCles: query,
      range: `${(parseInt(page) - 1) * 20}-${parseInt(page) * 20 - 1}`,
    });

    if (location) {
      params.append("commune", location);
    }

    const offresResponse = await fetch(
      `https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
        },
      }
    );

    const offresData = await offresResponse.json();

    if (!offresData.resultats) {
      return res.status(200).json({ jobs: [], debug: offresData });
    }

    const jobs = offresData.resultats.map((offre) => ({
      id: offre.id,
      title: offre.intitule,
      company: offre.entreprise?.nom || "Entreprise confidentielle",
      location: offre.lieuTravail?.libelle || "France",
      type: offre.typeContrat || "CDI",
      sector: offre.secteurActiviteLibelle || "",
      description: offre.description?.substring(0, 300) + "..." || "",
      created_at: offre.dateCreation || new Date().toISOString(),
      apply_link: offre.origineOffre?.urlOrigine || "https://www.francetravail.fr",
      source: "France Travail",
      salary: offre.salaire?.libelle || null,
    }));

    res.status(200).json({ jobs, total: offresData.Content_Range || jobs.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
