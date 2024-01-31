import React, { useContext } from "react";
import { Message, MessageType } from "../type/messageTypes";
import { LangContext } from "../context";
import strings from "../Intl/strings.json";
import "./MessageDisplay.css";
import { queryByRole } from "@testing-library/react";
export const MessageDisplay = ({
	type,
	fromUserId,
	toUserId,
	content,
	timeMillis,
}: Message): React.ReactElement<Message> => {
	const dateTime: Date = new Date(timeMillis);
	const lang = useContext(LangContext);
	const msgPage = strings[lang].chat;
	/*  FIXED funny error
	 *   DESCRIPTION
	 *   The line below was
	 *   return (<p>[{dateTime.toLocaleString(Intl.DateTimeFormat().resolvedOptions().timeZone)}]...</p>)
	 *   The line incorrectly generated a value of "UTC" as the parameter to toLocaleString()
	 *   While "UTC" is an accepted string value, in EEST, aka. "Europe/Athens" timezone string is not an acceptable parameter.
	 *   This caused the return statement to fail, and the message fails to render, despite it being correctly committed to the db.
	 *   Funny clown moment 🤡
	 */
	const timeString = `${
		dateTime.getHours() > 12
			? dateTime.getHours() - 12
			: dateTime.getHours()
	}:${
		dateTime.getMinutes() >= 10
			? dateTime.getMinutes()
			: `0${dateTime.getMinutes().toString()}`
	} ${dateTime.getHours() > 12 ? "PM" : "AM"}`;
	switch (type) {
		case MessageType.HELLO as MessageType:
			return (
				<p className="msg">
					[{timeString}]{" "}
					{msgPage.joinMessage.replace("$userName", fromUserId)}
				</p>
			);
		case MessageType.MESSAGE as MessageType:
			return (
				<p className="msg">
					[{timeString}]{" "}
					{msgPage.serverMessage
						.replace("$userName", fromUserId)
						.replace("$content", content)}
				</p>
			);
		case MessageType.DATA as MessageType:
			return <></>;
		case MessageType.CHNAME as MessageType:
			return <></>;
		default:
			console.error("Illegal MessageType reported!");
			return (
				<p className="msg-err">
					[{timeString}] **THIS MESSAGE CANNOT BE CORRECTLY SHOWN
					BECAUSE THE CLIENT ENCOUNTERED AN ERROR**
				</p>
			);
	}
};
