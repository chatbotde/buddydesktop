import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: "<api key>",
    baseURL: "https://api.x.ai/v1",
    timeout: 360000,  // Timeout after 3600s for reasoning models
});

const stream = await openai.chat.completions.create({
  model: "grok-4",
  messages: [
    { role: "system", content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy." },
    {
      role: "user",
      content: "What is the meaning of life, the universe, and everything?",
    }
  ],
  stream: true
});

for await (const chunk of stream) {
    console.log(chunk.choices[0].delta.content);
}