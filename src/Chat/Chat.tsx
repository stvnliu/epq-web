import React, { useEffect, useState } from "react";
import { Message } from "./Message";
import { Client, Stomp } from "@stomp/stompjs";
import { MessageType } from "./types";
import { renderToStaticMarkup } from 'react-dom/server';
// The last bit of magic sauce to make this work
// EXPLANATION
// 
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
    // TODO solve issue with non-static markup
    stompClient.onConnect = (frame) => {
        stompClient.subscribe(subscribe, (message) => {
            console.log(`Collected new message: ${message.body}`);
            const {from, to, content} = JSON.parse(message.body) as MessageType
            const messageElement = <Message sender={from} text={content} />
            console.log(messageElement);

            // Temporary solution
            // The solution lacks interactibility - because it's static markup
            const container = document.getElementById("chat-inner") as HTMLDivElement
            
            // Truly horrible and disgusting
            container.innerHTML += renderToStaticMarkup(messageElement)
        })
    }

    // Generic error handlers
    stompClient.onWebSocketError = (error) => {
        console.error('Error with websocket', error);
    };
    
    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };
    
    // Button press event handler.
    const sendDataButtonHandler = (ev: React.MouseEvent) => {
        console.log("WebSockets handler invoked.")
        
        // There must be a react-native and non-document-getElementById way to do this
        // TODO Explore
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
        // Stomp client is disconnected after each re-render
        // This should be actively avoided
        stompClient.activate()
        return () => {
            stompClient.deactivate()
        }
    }, [])
    return (
        <div className="chat">
            <div id="chat-inner">
            </div>
            <span><input id="data-entry"></input><button onClick={ev => sendDataButtonHandler(ev)}>Send</button></span>
        </div>
    )
}
export default ChatWrapper;