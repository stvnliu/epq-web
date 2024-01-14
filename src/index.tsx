import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Wrapper from "./App";
const LangContext = createContext("en_US");
const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<LangContext.Provider value="en_US">
		<Wrapper />
	</LangContext.Provider>
);
