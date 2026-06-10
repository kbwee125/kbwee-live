export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cvBase64, jobTitle, isText, cvText } = req.body;

  if (!cvBase64 && !cvText) {
    return res.status(400).json({ error: "CV manquant" });
  }

  try {
    let messages;

    if (isText && cvText) {
      messages = [{
        role: "user",
        content: `Tu es un expert RH et coach carrière. Analyse ce CV et retourne UNIQUEMENT un JSON valide sans texte avant ou après.

CV :
${cvText}

Poste visé : ${jobTitle || "non spécifié"}

JSON :
{
  "score": <0-100>,
  "summary": "<résumé global>",
  "strengths": ["<force 1>", "<force 2>", "<force 3>"],
  "improvements": ["<amélioration 1>", "<amélioration 2>", "<amélioration 3>"],
  "jobMatch": "<compatibilité avec le poste>"
}`,
      }];
    } else {
      messages = [{
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: cvBase64,
            },
          },
          {
            type: "text",
            text: `Tu es un expert RH et coach carrière. Analyse ce CV et retourne UNIQUEMENT un JSON valide sans texte avant ou après.

Poste visé : ${jobTitle || "non spécifié"}

JSON :
{
  "score": <0-100>,
  "summary": "<résumé global>",
  "strengths": ["<force 1>", "<force 2>", "<force 3>"],
  "improvements": ["<amélioration 1>", "<amélioration 2>", "<amélioration 3>"],
  "jobMatch": "<compatibilité avec le poste>"
}`,
          },
        ],
      }];
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
        messages,
      }),
    });

    const data = await response.json();

    if (!data.content || !data.content[0]) {
      return res.status(500).json({ error: "Réponse invalide", debug: data });
    }

    const text = data.content[0].text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);
    res.status(200).json(parsed);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
