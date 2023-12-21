import React from "react";

export const Message = (
    {
        sender, text,
    }: {
        sender: string;
        text: string;
    }
): React.ReactElement<{ sender: string; text: string; }> => {

    return (<p>Message from {sender}: {text}</p>);
};
