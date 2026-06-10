export const config = {
  api: { bodyParser: { sizeLimit: "1mb" } },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { jobTitle, company, sector, level } = req.body;

  if (!jobTitle) return res.status(400).json({ error: "Poste manquant" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        messages: [{
          role: "user",
          content: `Tu es un expert RH senior. Génère une grille d'entretien complète et professionnelle pour le poste suivant.

Poste : ${jobTitle}
Entreprise : ${company || "non spécifiée"}
Secteur : ${sector || "non spécifié"}
Niveau : ${level || "Senior"}

Retourne UNIQUEMENT un JSON valide sans texte avant ou après :
{
  "title": "<titre de la grille>",
  "duration": "<durée recommandée>",
  "sections": [
    {
      "name": "<nom de la section>",
      "duration": "<durée>",
      "questions": [
        {
          "question": "<question>",
          "objective": "<ce qu'on évalue>",
          "goodAnswer": "<éléments d'une bonne réponse>",
          "redFlag": "<signaux d'alerte>"
        }
      ]
    }
  ],
  "evaluationCriteria": ["<critère 1>", "<critère 2>", "<critère 3>"],
  "recommendation": "<conseil global pour cet entretien>"
}`
        }],
      }),
    });

    const data = await response.json();
    if (!data.content || !data.content[0]) return res.status(500).json({ error: "Réponse invalide" });

    const text = data.content[0].text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);
    res.status(200).json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
