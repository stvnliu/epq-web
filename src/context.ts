import { createContext } from "react";
import { LangType } from "./Chat/types";

export const LangContext = createContext<LangType>("en_US");