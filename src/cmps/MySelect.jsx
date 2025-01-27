import { useState } from "react"

export function MySelect({ options, selected, setSelected }) {
    const [show, setShow] = useState(false)

    function handleSelect(idx) {
        setSelected(idx + 1)
        setShow(!show)
    }

    return (
        <section className="my-select" >
            <div className="selected" onClick={() => setShow(!show)}>
                <span>{options[selected - 1]}</span>
                <img className={`${show ? 'close' : 'open'}`} src="https://res.cloudinary.com/dollaguij/image/upload/v1701785794/wednesday/bwudwrzkha2pdcy3ga7q.svg" alt="" />
            </div>
            {show && <ul className="options">
                {options.map((month, idx) =>
                    <li value={idx} key={idx} onClick={() => handleSelect(idx)}>
                        <span>{month}</span>
                        {idx === selected - 1 && <img src="https://res.cloudinary.com/dollaguij/image/upload/v1699194254/svg/checked_paj0fg.svg" alt="" />}
                    </li>
                )}
            </ul>}
        </section>
    )
}