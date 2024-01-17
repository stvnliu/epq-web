import { createContext } from "react";
import { LangType } from "./Chat/messageTypes";
export type LoginType = {
	username: string;
	lastSeen: number;
	validUntil: number;
};
export const LangContext = createContext<LangType>("en_US");
export const LoginContext = createContext<LoginType | undefined>(undefined);
