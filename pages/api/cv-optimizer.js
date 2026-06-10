export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cvBase64, jobTitle, fileName } = req.body;

  if (!cvBase64) {
    return res.status(400).json({ error: "CV manquant" });
  }

  try {
    const isTextFile = fileName && (fileName.endsWith(".txt") || fileName.endsWith(".md"));

    let messages;

    if (isTextFile) {
      const cvText = Buffer.from(cvBase64, "base64").toString("utf-8");
      messages = [
        {
          role: "user",
          content: `Tu es un expert RH et coach carrière de haut niveau. Analyse ce CV et retourne UNIQUEMENT un objet JSON valide, sans aucun texte avant ou après.

CV à analyser :
${cvText}

Poste visé : ${jobTitle || "non spécifié"}

Retourne exactement ce JSON :
{
  "score": <nombre entre 0 et 100>,
  "summary": "<résumé en 1-2 phrases du niveau global du CV>",
  "strengths": ["<point fort 1>", "<point fort 2>", "<point fort 3>"],
  "improvements": ["<amélioration prioritaire 1>", "<amélioration 2>", "<amélioration 3>", "<amélioration 4>"],
  "jobMatch": "<analyse de compatibilité avec le poste visé, ou null si non spécifié>"
}`,
        }
      ];
    } else {
      messages = [
        {
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
              text: `Tu es un expert RH et coach carrière de haut niveau. Analyse ce CV et retourne UNIQUEMENT un objet JSON valide, sans aucun texte avant ou après.

Poste visé : ${jobTitle || "non spécifié"}

Retourne exactement ce JSON :
{
  "score": <nombre entre 0 et 100>,
  "summary": "<résumé en 1-2 phrases du niveau global du CV>",
  "strengths": ["<point fort 1>", "<point fort 2>", "<point fort 3>"],
  "improvements": ["<amélioration prioritaire 1>", "<amélioration 2>", "<amélioration 3>", "<amélioration 4>"],
  "jobMatch": "<analyse de compatibilité avec le poste visé, ou null si non spécifié>"
}`,
            },
          ],
        }
      ];
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
      return res.status(500).json({ error: "Réponse Claude invalide", debug: data });
    }

    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.status(200).json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
