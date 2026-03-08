const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_TOKEN);

async function detectAI(content) {
    if (!content?.trim()) {
        throw new Error("Content is required for AI detection");
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