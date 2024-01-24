import {Message, MessageType } from "../type/messageTypes"
export const dataMsgHandler = (msg: Message) => {
        if (msg.type !== MessageType.DATA) {return <></>}      
}
export const chnameMsgHandler = () => {}
