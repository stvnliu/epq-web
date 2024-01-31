export const enum MessageType {
        MESSAGE = "MESSAGE",
        CHNAME = "CHNAME",
        HELLO = "HELLO",
        DATA = "DATA",
}
export enum SystemMessageCode {
        REQ,
        RES,
        ERR,
}
export type HistoryFetchResult = {
        count: number;
        items: Array<ChatMessage>;
};
export type ErrorResult = {
        text: string;
};
export type TimestampSendRequest = {
        ts: number;
};
export type SystemMessage = {
        code: SystemMessageCode;
        data: HistoryFetchResult | ErrorResult | TimestampSendRequest;
};
export type ChatMessage = {
        fromUserId: string;
        toUserId: string;
        content: string;
        timeMillis: number;
};
export type HelloMessage = {
        fromUserId: string;
        timeMillis: number;
};
export type DataMessage = {};
export type Message = {
        type: MessageType;
        // data: SystemMessage | ChatMessage | HelloMessage
        fromUserId: string;
        toUserId: string;
        content: string;
        timeMillis: number;
};
// Type gymnastics to provide dynamic ESLint support
export const acceptedLangs = ["en_US", "zh_TW", "el_GR", "ar_SA"] as const;
export type LangType = (typeof acceptedLangs)[number];
