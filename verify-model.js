
const { OpenAI } = require("openai");
require("dotenv").config();

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

async function main() {
    try {
        const modelName = "openai/gpt-oss-safeguard-20b"; // The model user requested
        console.log(`Testing Groq API with model: ${modelName}`);
        const chatCompletion = await client.chat.completions.create({
            messages: [{ role: "user", content: "Halo, balas dengan 'Tes berhasil!'" }],
            model: modelName,
        });
        console.log("Success:", chatCompletion.choices[0]?.message?.content);
    } catch (error) {
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Full Error:", error);
        }
    }
}

main();
