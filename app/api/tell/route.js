import { Configuration, OpenAIApi } from 'openai-edge'
const config = new Configuration({
  apiKey: process.env.API_KEY
})
const openai = new OpenAIApi(config)
 
export const runtime = 'edge'

export async function POST(req) {
    const body = await req.json()
    const word = body.word

    console.log(`got ${word}`)

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "You are a helpful assistant."}, 
            {role: "user",   content: `tell me more about "${word}"`}
        ],
    });

    const res = {
        text:completion.data.choices[0].message.content
    }
    return new Response(JSON.stringify(res), {
        status: 200,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
}

