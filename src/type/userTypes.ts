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
