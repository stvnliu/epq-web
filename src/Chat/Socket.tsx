import { Client } from "@stomp/stompjs"
import { useState } from "react"
import { Message } from "./Message"
import { MessageType } from "./types"

const Socket = (
    {
        address,
        user,
        messageCallback,
    }:
    {
        address: string,
        user: string,
        messageCallback: (element: JSX.Element) => {},
    }
) => {
    const stompClient = new Client({
        brokerURL: address
    })
    const destination = "/app/chat"
    const subscribe = "/sub/chat"
    stompClient.onConnect = (frame) => {
        stompClient.subscribe(subscribe, (message) => {
            console.log(`Collected new message: ${message.body}`);
            const {from, to, content} = JSON.parse(message.body) as MessageType
            const messageElement = <Message sender={from} text={content} />
            // return message to parent
            messageCallback(messageElement)
        })
    }
    stompClient.onWebSocketError = (error) => {
        console.error('Error with websocket', error);
    };
    
    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };
    
    const send = () => {
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
    }
    stompClient.activate()
    return (<></>)
}
export default Socket;