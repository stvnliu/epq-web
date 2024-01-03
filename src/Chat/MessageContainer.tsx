import React from "react";
import { Message, MessageType } from "./types";

export const MessageContainer = (
    {
        type,
        fromUserId,
        toUserId,
        content,
        timeMillis,
    }: Message
): React.ReactElement<Message> => {
    const dateTime: Date = new Date(timeMillis);
    /*  FIXED funny error
    *   DESCRIPTION
    *   The line below was
    *   return (<p>[{dateTime.toLocaleString(Intl.DateTimeFormat().resolvedOptions().timeZone)}]...</p>)
    *   The line incorrectly generated a value of "UTC" as the parameter to toLocaleString()
    *   While "UTC" is an accepted string value, in EEST, aka. "Europe/Athens" timezone string is not an acceptable parameter.
    *   This caused the return statement to fail, and the message fails to render, despite it being correctly committed to the db.
    *   Funny clown moment 🤡
    */  
    return (<p>[{dateTime.toLocaleString()}] Message from {fromUserId}: {content}</p>);
};
