
const { OpenAI } = require("openai");
require("dotenv").config();

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

async function main() {
    try {
        console.log("Listing models...");
        const list = await client.models.list();
        console.log("Available models:");
        list.data.forEach(model => console.log(model.id));
    } catch (error) {
        console.error("Error listing models:", error.message);
    }
}

main();
