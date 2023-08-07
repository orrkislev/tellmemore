import { useEffect, useState } from "react"

export default function TheThing(props) {
    const [lookup, setLookup] = useState('')
    const [result, setResult] = useState(null)

    useEffect(() => {
        setLookup('')
        setResult(null)
    }, [props.text])

    const select = (e) => {
        const selection = window.getSelection()
        const text = selection.toString()
        setLookup(text)
        setResult(null)
    }

    const click = async () => {
        setResult('')

        const res = await fetch("./api/tell", {
            method: "POST",
            body: JSON.stringify({ word: lookup }),
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
                    setResult(newResult);
                }
            })
        }

    }

    return (
        <>
            <div className='txt'
                onMouseUp={select}
                onDoubleClick={select}>
                {props.text}
            </div>

            {lookup.length > 0 && (
                <>
                    <div className='lookup'>
                        <div>{lookup}</div>
                        {!result &&
                            <div className='tellButton'
                                onClick={click} />
                        }
                    </div>
                </>
            )}
            {result == '' && <div className="line-1-horizontal"></div>}
            {result && result.length > 0 && <TheThing text={result} />}
        </>
    )
}
