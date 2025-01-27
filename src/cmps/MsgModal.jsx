export function MsgModal({ text }) {
    return (
        <section className={`msg-modal ${text ? 'show' : ''}`}>
            <span>{text}</span>
        </section>
    )
}