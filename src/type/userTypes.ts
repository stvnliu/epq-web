import { URL } from "url";

export type UserAvatar = {
        iconUrls: URL[];
};
export type User = {
        id: number;
        userName: string;
        dateJoined: number;
        lastSeen: number;
        passwordHash: string;
        // avatar: UserAvatar;
};
export type AuthData = {
        success: boolean;
        hasProfile: boolean;
        exists: boolean;
        authMessage: string;
        authResponseTimestampMillis: number;
}
