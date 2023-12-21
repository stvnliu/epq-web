import React, { useState } from "react";
import { Message } from "./Message";
import { Client, Stomp } from "@stomp/stompjs";
import { MessageType } from "./types";
const domain = "localhost"
const port = "8080"
const connectionAddress = `ws://${domain}:${port}/ws`
const ChatWrapper = (
    {
        user,
        brokerURL,
    }:
    {
        user: string,
        brokerURL: string,
    }
): React.ReactElement => {
    const stompClient = new Client({
        brokerURL: connectionAddress
    })
    const [destination, setDestination] = useState<string>("/app/chat")
    const [connected, setConnected] = useState(false)
    const [subscribe, setSubscribe] = useState("/sub/chat")
    const [username, setUsername] = useState<string>(user)
    const [children, setChildren] = useState<React.ReactElement[]>([])
    stompClient.onConnect = (frame) => {
        setConnected(true);
        stompClient.subscribe(subscribe, (message) => {
            const {from, to, content} = JSON.parse(message.body) as MessageType
            const messageElement = <Message sender={from} text={content} />
            children.push(messageElement)
        })
    }
    stompClient.onWebSocketError = (error) => {
        console.error('Error with websocket', error);
    };
    
    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };
    
    const sendDataButtonHandler = (ev: React.MouseEvent) => {
        console.log("WebSockets handler invoked.")
        ev.preventDefault()
        const entryElement: HTMLInputElement = document.getElementById("data-entry") as HTMLInputElement
        const messageData = 
        {
            from: username,
            to: "everyone",
            content: entryElement.value
        }
        stompClient.publish({
            body: JSON.stringify(messageData),
            destination: destination
        })
    }
    const connect = () => {
        stompClient.activate()
    }
    const disconnect = () => {
        stompClient.deactivate()
    }
    // connection.addEventListener("open", (ev: Event) => {
    //     ev.preventDefault()
    //     connection.send("Hello world!")
    // })
    // connection.addEventListener("message", (ev: MessageEvent) => {
    //     ev.preventDefault()
    //     const wrappers = document.getElementsByClassName(msgWrapperClassName)

    //     // Matches data from JSON data input against ChatMessage datatype for processing
    //     const data = JSON.parse(ev.data) as ChatMessage
    //     for (let index = 0; index < wrappers.length; index++) {
    //         const element: Element | null = wrappers.item(index);
    //         if (!element) {
    //             console.error("msgWrapper class cannot be found! Message not delivered.")
    //             return
    //         }
    //         messageElementsArray.push(<Message sender={data.from} text={data.message} />)
    //         // TODO Create new message 
    //         // DDL 20 DEC
    //     }
    // })
    return (
        <div className="chat">
            <button onClick={ev => connect()}>Connect</button>
            <button onClick={ev => disconnect()}>Disconnect</button>
            <div className="chat-inner">
            {children}
            </div>
            <span><input id="data-entry"></input><button onClick={ev => sendDataButtonHandler(ev)}>Send</button></span>
        </div>
    )
}
export default ChatWrapper;