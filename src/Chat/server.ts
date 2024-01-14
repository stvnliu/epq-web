import { Client } from "@stomp/stompjs";
import { Message, MessageType } from "./types";
const domain = window.location.hostname
const port = "8080"
const connectionAddress = `ws://${domain}:${port}/ws`
const endpoints = {
    destination: "/app/chat",
    subscription: "/sub/chat",
    history: "/api/v1/msg/"
}
export const createStompConnection = (user: string, subUpdateHandler: (message: Message) => void) => {
    const stompClient = new Client({
        brokerURL: connectionAddress
    })
    stompClient.onConnect = (frame) => {
        stompClient.subscribe(endpoints.subscription, (message) => {
            console.log(`Collected new message: ${message.body}`);
            const messageBody = JSON.parse(message.body) as Message
            console.log(messageBody);
            subUpdateHandler(messageBody);
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
    return stompClient;
}