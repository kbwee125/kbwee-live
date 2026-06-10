export const config = {
  api: {
    bodyParser: { sizeLimit: "1mb" },
    responseLimit: false,
  },
  maxDuration: 30,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { jobTitle, company, sector } = req.body;
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
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: `Expert RH. Grille d'entretien pour : ${jobTitle}${company ? " chez " + company : ""}${sector ? ", secteur " + sector : ""}.

JSON uniquement, sans texte avant ou après :
{
  "title": "<titre>",
  "duration": "<durée>",
  "sections": [
    {
      "name": "<section>",
      "duration": "<durée>",
      "questions": [
        {
          "question": "<question>",
          "objective": "<objectif>",
          "goodAnswer": "<bonne réponse>",
          "redFlag": "<signal alerte>"
        }
      ]
    }
  ],
  "evaluationCriteria": ["<critère 1>", "<critère 2>", "<critère 3>"],
  "recommendation": "<conseil>"
}

3 sections max, 3 questions par section.`,
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
