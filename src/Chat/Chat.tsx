import React from "react";
const domain = "localhost"
const port = "8080"
const connectionAddress = `ws://${domain}:${port}`
const Message = (
    {
        sender,
        text,
        objects,
    }:
    {
        sender: string, // TODO Create specific sender object type
        text: string,
        objects?: Array<any>,
    }
    ): React.ReactElement => {
    
    return (<></>)
}
const Chat = (): React.ReactElement => {
    const msgWrapperClassName = "msg-wrapper"
    const connection = new WebSocket(connectionAddress)
    connection.addEventListener("open", (ev: Event) => {
        ev.preventDefault()
        connection.send("Hello world!")
    })
    connection.addEventListener("message", (ev: MessageEvent) => {
        ev.preventDefault()
        const wrappers = document.getElementsByClassName(msgWrapperClassName)
        const data = JSON.parse(ev.data)
        for (let index = 0; index < wrappers.length; index++) {
            const element: Element | null = wrappers.item(index);
            if (!element) {
                console.error("msgWrapper class cannot be found! Message not delivered.")
                return
            }
        }
    })
    return (
        <div className="chat">
            <div className={msgWrapperClassName}>
            </div>
            <input></input>
        </div>
    )
}
