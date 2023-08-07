'use client'

import TheThing from "@/components/TheThing"
import { useEffect, useState } from "react"

export default function Home() {
  const [text, setText] = useState('')

  useEffect(() => {
    const pasteEvent = (e) => setText(e.clipboardData.getData('text/plain'))
    document.addEventListener('paste', pasteEvent)
    return () => document.removeEventListener('paste', pasteEvent)
  }, [])


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
        <div style={{display:'flex', flexDirection:'row', gap:'1em', alignItems:'center'}}>
          <img src="/paste.svg" style={{ width: '2em' }} /> 
          paste something
        </div>
      }

      <TheThing text={text} />
    </div>
  )
}
