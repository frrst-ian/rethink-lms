async function generateSuggestion(text) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 500,
            messages: [
                {
                    role: "user",
                    content: `This assignment submission was flagged as likely AI-generated. Write brief, constructive feedback for the student explaining what to improve to demonstrate original thinking. Submission: ${text}`,
                },
            ],
        }),
    });

    const data = await res.json();
    console.log("data:", data);
    return data.content[0].text;
}

module.exports = generateSuggestion;
