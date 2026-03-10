const { InferenceClient } = require("@huggingface/inference");
const client = new InferenceClient(process.env.HF_TOKEN);

async function generateSuggestion(text) {
    const chatCompletion = await client.chatCompletion({
        model: "Qwen/Qwen2.5-72B-Instruct",
        messages: [
            {
                role: "user",
                content: `An assignment submission was flagged as likely AI-generated. Write brief, constructive feedback directly addressing the student (do not use placeholders like [Student's Name], just say "you" and "your"). Explain what to improve to demonstrate original thinking.\n\nSubmission:\n${text}`,
            },
        ],
        max_tokens: 1000,
    });

    return chatCompletion.choices[0].message.content;
}

module.exports = generateSuggestion;
