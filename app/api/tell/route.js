import { Configuration, OpenAIApi } from "openai";

export async function POST(req) {
    const configuration = new Configuration({
        apiKey: process.env.API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const body = await req.json()
    const word = body.word

    console.log(`got ${word}`)

    const res = {text:'hello'}
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "You are a helpful assistant."}, 
                {role: "user",   content: `tell me more about "${word}"`}
            ],
        });
        console.log(completion)
        res = {
            text:completion.data.choices[0].message.content
        }
    } catch (error) {
        console.log(error)
    }
    
    return new Response(JSON.stringify(res), {
        status: 200,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
}