export enum MessageType {
    MESSAGE,
    SYSTEM,
    HELLO,
    DATA,
}
export type Message = {
    type: MessageType,
    fromUserId: string,
    toUserId: string,
    content: string,
    timeMillis: number
}