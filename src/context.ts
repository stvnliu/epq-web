import { createContext } from "react";
import { LangType } from "./type/messageTypes";
export type LoginType = {
	username: string;
	lastSeen: number;
	validUntil: number;
};
export const LangContext = createContext<LangType>("en_US");
export const LoginContext = createContext<LoginType | undefined>(undefined);
