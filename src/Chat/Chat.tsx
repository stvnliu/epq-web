import React from "react";
import { Attachment, Avatar, ChatMessage, ServerMsgType, User } from "./ChatMessage";
import { connect } from "http2";
import { Message } from "./Message";
import { Client, Stomp } from "@stomp/stompjs";
const domain = "localhost"
const port = "8080"
const connectionAddress = `ws://${domain}:${port}/ws`
const stompClient = new Client()
const Chat = (
    {
        user
    }:
    {
        user: string,
    }
): React.ReactElement => {
    var messageElementsArray: JSX.Element[] = [];
    const msgWrapperClassName = "msg-wrapper"
    const connection = new WebSocket(connectionAddress)
    const sendDataButtonHandler = (ev: React.MouseEvent) => {
        console.log("WebSockets handler invoked.")
        ev.preventDefault()
        const entryElement: HTMLInputElement = document.getElementById("data-entry") as HTMLInputElement
        const messageData = 
        {
            from: user,
            to: "everyone",
            content: entryElement.value
        }
        connection.send(JSON.stringify(messageData))
    }
    connection.addEventListener("open", (ev: Event) => {
        ev.preventDefault()
        connection.send("Hello world!")
    })
    connection.addEventListener("message", (ev: MessageEvent) => {
        ev.preventDefault()
        const wrappers = document.getElementsByClassName(msgWrapperClassName)

        // Matches data from JSON data input against ChatMessage datatype for processing
        const data = JSON.parse(ev.data) as ChatMessage
        for (let index = 0; index < wrappers.length; index++) {
            const element: Element | null = wrappers.item(index);
            if (!element) {
                console.error("msgWrapper class cannot be found! Message not delivered.")
                return
            }
            messageElementsArray.push(<Message sender={data.from} text={data.message} />)
            // TODO Create new message 
            // DDL 20 DEC
        }
    })
    return (
        <div className="chat">
            <div className={msgWrapperClassName}>
            {messageElementsArray}
            </div>
            <span><input id="data-entry"></input><button onClick={ev => sendDataButtonHandler(ev)}>Send</button></span>
        </div>
    )
}
export default Chat;