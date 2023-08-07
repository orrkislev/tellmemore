'use client'

import TheThing from "@/components/TheThing"
import { useEffect, useState } from "react"

export default function Home() {
  const [text, setText] = useState('')
  const [input, setInput] = useState('')

  // useEffect(() => {
  //   const pasteEvent = (e) => setText(e.clipboardData.getData('text/plain'))
  //   document.addEventListener('paste', pasteEvent)
  //   return () => document.removeEventListener('paste', pasteEvent)
  // }, [])

  const click = async () => {
    const res = await fetch("./api/tell", {
      method: "POST",
      body: JSON.stringify({ word: input }),
    });

    const reader = res.body.getReader();
    let newResult = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const txt = new TextDecoder().decode(value)

      const txts = txt.split('\n').filter(x => x.startsWith('data:'))
      txts.forEach(t => {
        t = t.slice(6)
        if (t == '[DONE]') return;

        const json = JSON.parse(t);
        const content = json.choices[0].delta.content;
        if (content) {
          newResult += content;
          setText(newResult);
        }
      })
    }
  }


  return (
    <div style={{
      width: '30em',
      margin: '3em auto',
      marginBottom: '10em',
      display: 'flex',
      flexDirection: 'column',
      gap: '1em',
      padding: '1em',
      background: 'white',
    }}>

      {text.length == 0 &&
        <div className='lookup'>
          <input type="text" placeholder="START HERE" onChange={e => setInput(e.target.value)} />
          {input.length > 0 && <div className='tellButton' onClick={click} />}
        </div>
        // <div style={{display:'flex', flexDirection:'row', gap:'1em', alignItems:'center'}}>
        //   <img src="/paste.svg" style={{ width: '2em' }} /> 
        //   paste something
        // </div>
      }

      <TheThing text={text} />
    </div>
  )
}
