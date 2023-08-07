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
        stream: true,
        messages: [
            {role: "system", content: "You are a helpful assistant."}, 
            {role: "user",   content: `tell me briefly about "${word}"`}
        ],
    });

    return new Response(completion.body, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "text/event-stream;charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      })
}

