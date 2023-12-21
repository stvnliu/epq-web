import React, { useEffect, useState } from "react";
import { Message } from "./Message";
import { Client, Stomp } from "@stomp/stompjs";
import { MessageType } from "./types";
import { renderToStaticMarkup } from 'react-dom/server';
const domain = window.location.hostname
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
    const destination = "/app/chat"
    const subscribe = "/sub/chat"
    // const [children, setChildren] = useState<React.ReactElement[]>([])
    stompClient.onConnect = (frame) => {
        stompClient.subscribe(subscribe, (message) => {
            console.log(`Collected new message: ${message.body}`);
            const {from, to, content} = JSON.parse(message.body) as MessageType
            const messageElement = <Message sender={from} text={content} />
            // setChildren((prev) => [...prev, messageElement])
            console.log(messageElement);

            // Temporary solution
            const container = document.getElementById("chat-inner") as HTMLDivElement
            container.innerHTML += renderToStaticMarkup(messageElement)
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
        
        const entryElement: HTMLInputElement = document.getElementById("data-entry") as HTMLInputElement
        const messageData = 
        {
            from: user,
            to: "everyone",
            content: entryElement.value
        }
        console.log(`STOMP connection status: ${stompClient.connected}`);
        
        stompClient.publish({
            body: JSON.stringify(messageData),
            destination: destination
        })
        ev.preventDefault()
    }
    useEffect(() => {
        stompClient.activate()
        return () => {
            stompClient.deactivate()
        }
    }, [])
    return (
        <div className="chat">
            {/* <button onClick={ev => {connect()}} disabled={connected}>Connect</button>
            <button onClick={ev => {disconnect()}} disabled={!connected}>Disconnect</button> */}
            <div id="chat-inner">
            {/* {children} */}
            </div>
            <span><input id="data-entry"></input><button onClick={ev => sendDataButtonHandler(ev)}>Send</button></span>
        </div>
    )
}
export default ChatWrapper;