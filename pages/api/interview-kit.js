export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { jobTitle, company, sector } = await req.json();

    if (!jobTitle) {
      return new Response(JSON.stringify({ error: "Poste manquant" }), { status: 400 });
    }

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
          content: `Expert RH. Grille entretien pour : ${jobTitle}${company ? " chez " + company : ""}${sector ? ", secteur " + sector : ""}.

JSON uniquement sans texte avant ou après :
{
  "title": "<titre>",
  "duration": "<durée recommandée>",
  "sections": [
    {
      "name": "<nom section>",
      "duration": "<durée>",
      "questions": [
        {
          "question": "<question>",
          "objective": "<ce qu on évalue>",
          "goodAnswer": "<éléments bonne réponse>",
          "redFlag": "<signal alerte>"
        }
      ]
    }
  ],
  "evaluationCriteria": ["<critère 1>", "<critère 2>", "<critère 3>"],
  "recommendation": "<conseil global>"
}
3 sections maximum, 3 questions par section.`,
        }],
      }),
    });

    const data = await response.json();

    if (!data.content || !data.content[0]) {
      return new Response(JSON.stringify({ error: "Réponse invalide", debug: data }), { status: 500 });
    }

    const text = data.content[0].text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
