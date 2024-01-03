import React, { useEffect, useState } from "react";
import { MessageContainer } from "./MessageContainer";
import { Client, Stomp, StompHeaders } from "@stomp/stompjs";
import { Message, MessageType } from "./types";
import { renderToStaticMarkup } from 'react-dom/server';
import './Chat.css';
// The last bit of magic sauce to make this work
// EXPLANATION
// 
const domain = window.location.hostname
const port = "8080"
const connectionAddress = `ws://${domain}:${port}/ws`
const endpoints = {
    destination: "/app/chat",
    subscription: "/sub/chat",
    history: "/api/v1/chat/history/"
}
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
    // TODO solve issue with non-static markup
    stompClient.onConnect = (frame) => {
        stompClient.subscribe(endpoints.subscription, (message) => {
            console.log(`Collected new message: ${message.body}`);
            const messageBody = JSON.parse(message.body) as Message
            // if (messageBody.type !== MessageType.MESSAGE) {return;}
            const messageElement = <MessageContainer {...messageBody} />
            console.log(messageElement);

            // Temporary solution
            // The solution lacks interactibility - because it's static markup
            const container = document.getElementById("chat-inner") as HTMLDivElement
            
            // Truly horrible and disgusting
            container.innerHTML += renderToStaticMarkup(messageElement)
        });
        stompClient.publish({
            body: JSON.stringify({
                type: MessageType.HELLO,
                fromUserId: user,
                toUserId: "everyone",
                content: `${user} has joined the server!`,
                timeMillis: Date.now()
            }),
            destination: endpoints.destination
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
    const sendData = () => {
        console.log("WebSockets handler invoked.")
        // There must be a react-native and non-document-getElementById way to do this
        // TODO Explore
        const entryElement: HTMLInputElement = document.getElementById("data-entry") as HTMLInputElement
        if (!entryElement.value) {alert("Message cannot be empty!"); return;}
        const messageData: Message = 
        {
            type: MessageType.MESSAGE,
            fromUserId: user,
            toUserId: "everyone",
            content: entryElement.value,
            timeMillis: Date.now()
        }
        console.log(`STOMP connection status: ${stompClient.connected}`); 
        stompClient.publish({
            body: JSON.stringify(messageData),
            destination: endpoints.destination,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
        entryElement.value = "";
    }
    useEffect(() => {
        // Stomp client is disconnected after each re-render
        // This should be actively avoided
        stompClient.activate()
        return () => {
            stompClient.deactivate()
        }
    }, [stompClient])
    // https://www.w3schools.com/jsref/obj_keyboardevent.asp
    document.addEventListener("keypress", (ev: KeyboardEvent) => {
        if (ev.key == "Enter") {
            sendData();
        }
    })
    return (
        <div className="chat">
            <div className="chat-inner-wrapper">
                <div id="chat-inner">
                </div>
            </div>
            <span className="entry-box"><input id="data-entry"></input><button onClick={() => sendData()}>Send</button></span>
        </div>
    )
}
export default ChatWrapper;