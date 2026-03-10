const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_TOKEN);

async function detectAI(content) {

    const words = content.trim().split(/\s+/).filter(Boolean);
    if (words.length < 100) {
        return {
            ai_percentage: null,
            isFlagged: false,
            skipped: true,
            reason: "Too short for analysis",
        };
    }

    const output = await client.textClassification({
        model: "openai-community/roberta-base-openai-detector",
        inputs: content,
        provider: "hf-inference",
    });

    const fakeScore = output.find((r) => r.label === "Fake")?.score ?? 0;

    return {
        ai_percentage: fakeScore,
        isFlagged: fakeScore > 0.7,
    };
}

module.exports = detectAI;
