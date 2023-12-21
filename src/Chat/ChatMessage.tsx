enum FileType {
    FILE_TXT,
    DOCUMENT_WORD,
    DOCUMENT_PDF,
    IMAGE,
    EXEC_BINARY,
    UNKNOWN,
}
export type User = {
    name: string,
    userId: string,
    avatar: Avatar
} 
export type Avatar = {
    pictureUri: string,
}
export type Attachment = {
    name: string,
    uri: string,
    sizeBytes: number,
    filetype: FileType
}
export type ChatMessage = {
    from: string,
    fromIP: string,
    to: Array<string>,
    toIPs: Array<string>,
    timestampPosted: number,
    message: string,
    attachments: Attachment
}
export type ServerMsgType = {
    
}