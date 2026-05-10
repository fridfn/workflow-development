export async function generateReflection(prompt) {

  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${process.env.GROQ_API_KEY}`
      },

      body: JSON.stringify({
        model: "llama3-70b-8192",

        messages: [
          {
            role: "system",
            content:
              "Kamu adalah Aurielle Nara Elowen."
          },

          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.9
      })
    }
  );

  const json = await res.json();

  return json.choices?.[0]?.message?.content;
}