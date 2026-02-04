
const { OpenAI } = require("openai");
require("dotenv").config();

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

async function main() {
    try {
        console.log("Testing Groq API with model: llama3-70b-8192");
        const chatCompletion = await client.chat.completions.create({
            messages: [{ role: "user", content: "Hello" }],
            model: "llama3-70b-8192",
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
