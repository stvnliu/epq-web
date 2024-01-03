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
): React.ReactElement<{ sender: string; text: string; }> => {
    const dateTime: Date = new Date(timeMillis);
    return (<p>[{dateTime.toLocaleString(Intl.DateTimeFormat().resolvedOptions().timeZone)}] Message from {fromUserId}: {content}</p>);
};
