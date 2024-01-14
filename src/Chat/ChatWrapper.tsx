import React, { ReactElement, useEffect, useRef, useState } from "react";
import { MessageContainer } from "./MessageContainer";
import { Client, Stomp, StompHeaders } from "@stomp/stompjs";
import { Message, MessageType } from "./types";
import { renderToStaticMarkup } from "react-dom/server";
import "./Chat.css";
// The last bit of magic sauce to make this work
// EXPLANATION
//
const domain = window.location.hostname;
const port = "8080";
const connectionAddress = `ws://${domain}:${port}/ws`;
const endpoints = {
	destination: "/app/chat",
	subscription: "/sub/chat",
	history: "/api/v1/msg/",
};
const ChatWrapper = ({ user }: { user: string }): React.ReactElement => {
	const [messages, setMessages] = useState<ReactElement[]>([]);
	let stompClientRef = useRef(
		new Client({
			brokerURL: connectionAddress,
		})
	);
	// TODO solve issue with non-static markup
	stompClientRef.current.onConnect = (frame) => {
		stompClientRef.current.subscribe(endpoints.subscription, (message) => {
			console.log(`Collected new message: ${message.body}`);
			const messageBody = JSON.parse(message.body) as Message;
			console.log(messageBody);
			setMessages((message) => {
				return message.concat([
					<MessageContainer
						key={`${messageBody.type}@${messageBody.timeMillis}`}
						{...messageBody}
					/>,
				]);
			});
			console.log(messages);
		});
		stompClientRef.current.publish({
			body: JSON.stringify({
				type: MessageType.HELLO,
				fromUserId: user,
				toUserId: "everyone",
				content: `${user} has joined the server!`,
				timeMillis: Date.now(),
			}),
			destination: endpoints.destination,
		});
	};

	// Generic error handlers
	stompClientRef.current.onWebSocketError = (error) => {
		console.error("Error with websocket", error);
	};

	stompClientRef.current.onStompError = (frame) => {
		console.error("Broker reported error: " + frame.headers["message"]);
		console.error("Additional details: " + frame.body);
	};

	// Button press event handler.
	const sendData = () => {
		console.log("WebSockets handler invoked.");
		// There must be a react-native and non-document-getElementById way to do this
		// TODO Explore
		const entryElement: HTMLInputElement = document.getElementById(
			"data-entry"
		) as HTMLInputElement;
		if (!entryElement.value) {
			alert("Message cannot be empty!");
			return;
		}
		const messageData: Message = {
			type: MessageType.MESSAGE,
			fromUserId: user,
			toUserId: "everyone",
			content: entryElement.value,
			timeMillis: Date.now(),
		};
		console.log(
			`STOMP connection status: ${stompClientRef.current.connected}`
		);
		stompClientRef.current.publish({
			body: JSON.stringify(messageData),
			destination: endpoints.destination,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
		});
		entryElement.value = "";
	};
	useEffect(() => {
		// Stomp client is disconnected after each re-render
		// This should be actively avoided
		stompClientRef.current.activate();
		return () => {
			stompClientRef.current.deactivate();
		};
	}, [stompClientRef]);
	// https://www.w3schools.com/jsref/obj_keyboardevent.asp
	document.addEventListener("keypress", (ev: KeyboardEvent) => {
		if (ev.key == "Enter") {
			sendData();
		}
	});
	return (
		<div className="chat">
            <div className="chat-inner-wrapper">
                {messages}
            </div>
			<span className="entry-box">
				<input id="data-entry"></input>
				<button onClick={() => sendData()}>Send</button>
			</span>
		</div>
	);
};
export default ChatWrapper;
