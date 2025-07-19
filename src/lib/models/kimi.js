import { Client } from "openai";

const client = new Client({
    apiKey: process.env.KIMI_API_KEY,
    baseURL: "https://api.moonshot.ai/v1",
});

const messages = [
    {
        role: "user",
        content: "The lengths of the two legs of a right triangle are 3 cm and 4 cm respectively. Find the length of the hypotenuse of this right triangle.",
    }
];

const stream = client.chat.completions.create({
    model: "kimi-k1.5-preview",
    messages: messages,
    temperature: 0.3,
    stream: true,
    max_tokens: 8192,
});

for await (const chunk of stream) {
    if (chunk.choices[0].delta) {
        if (chunk.choices[0].delta.content) {
            console.log(chunk.choices[0].delta.content);
        }
    }
}