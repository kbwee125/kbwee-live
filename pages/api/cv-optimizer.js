import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = new IncomingForm();

    const { fields, files } = await new Promise(function(resolve, reject) {
      form.parse(req, function(err, fields, files) {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const jobTitle = fields.jobTitle || "non spécifié";
    const cvFile = files.cv;

    if (!cvFile) {
      return res.status(400).json({ error: "CV manquant" });
    }

    const filePath = cvFile[0] ? cvFile[0].filepath : cvFile.filepath;
    const fileName = cvFile[0] ? cvFile[0].originalFilename : cvFile.originalFilename;
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString("base64");
    const isText = fileName && (fileName.endsWith(".txt") || fileName.endsWith(".md"));

    let messages;

    if (isText) {
      const cvText = fileBuffer.toString("utf-8");
      messages = [{
        role: "user",
        content: `Tu es un expert RH et coach carrière. Analyse ce CV et retourne UNIQUEMENT un JSON valide sans texte avant ou après.

CV :
${cvText}

Poste visé : ${jobTitle}

JSON attendu :
{
  "score": <0-100>,
  "summary": "<résumé global en 1-2 phrases>",
  "strengths": ["<force 1>", "<force 2>", "<force 3>"],
  "improvements": ["<amélioration 1>", "<amélioration 2>", "<amélioration 3>", "<amélioration 4>"],
  "jobMatch": "<compatibilité avec le poste visé>"
}`
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
              data: base64,
            },
          },
          {
            type: "text",
            text: `Tu es un expert RH et coach carrière. Analyse ce CV et retourne UNIQUEMENT un JSON valide sans texte avant ou après.

Poste visé : ${jobTitle}

JSON attendu :
{
  "score": <0-100>,
  "summary": "<résumé global en 1-2 phrases>",
  "strengths": ["<force 1>", "<force 2>", "<force 3>"],
  "improvements": ["<amélioration 1>", "<amélioration 2>", "<amélioration 3>", "<amélioration 4>"],
  "jobMatch": "<compatibilité avec le poste visé>"
}`
          }
        ]
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
