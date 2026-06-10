export const config = {
  api: {
    bodyParser: {
      sizeLimit: "2mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobTitle, company, messages, action } = req.body;

  if (!jobTitle) {
    return res.status(400).json({ error: "Poste manquant" });
  }

  try {
    let systemPrompt;
    let apiMessages;

    if (action === "start") {
      systemPrompt = `Tu es un recruteur senior expérimenté qui conduit un entretien d'embauche professionnel pour le poste de ${jobTitle}${company ? " chez " + company : ""}. 

Règles :
- Pose UNE seule question à la fois
- Questions progressives : d'abord présentation, puis expérience, puis cas pratiques
- Ton professionnel mais humain
- Réponds UNIQUEMENT en JSON : {"question": "<ta question>", "questionNumber": 1, "category": "<Présentation|Expérience|Compétences|Cas pratique|Motivation>"}
- Commence par demander une présentation du candidat`;

      apiMessages = [{
        role: "user",
        content: "Commence l'entretien."
      }];

    } else if (action === "answer") {
      systemPrompt = `Tu es un recruteur senior pour le poste de ${jobTitle}${company ? " chez " + company : ""}.

Règles :
- Analyse la réponse du candidat
- Donne un feedback constructif et précis
- Pose la question suivante
- Après 5 questions, termine avec un bilan final
- Réponds UNIQUEMENT en JSON :
{
  "feedback": "<feedback sur la réponse précédente>",
  "score": <score 1-10 pour cette réponse>,
  "nextQuestion": "<prochaine question ou null si entretien terminé>",
  "questionNumber": <numéro>,
  "category": "<catégorie>",
  "isFinished": <true|false>,
  "finalReport": <null ou {"globalScore": <0-100>, "summary": "<bilan>", "strengths": ["<force>"], "improvements": ["<amélioration>"]}>
}`;

      apiMessages = messages.map(function(m) {
        return { role: m.role, content: m.content };
      });

    } else {
      return res.status(400).json({ error: "Action invalide" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        system: systemPrompt,
        messages: apiMessages,
      }),
    });

    const data = await response.json();

    if (!data.content || !data.content[0]) {
      return res.status(500).json({ error: "Réponse Claude invalide", debug: data });
    }

    const text = data.content[0].text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);
    res.status(200).json(parsed);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
