import React, { createContext, useContext, useState } from "react";
import Chat from "./Chat/Chat";
import "./App.css";
import { LangType, Message } from "./Chat/types";
import { MessageContainer } from "./Chat/MessageContainer";
import strings from "./Intl/strings.json";
import { LangContext } from "./context";

// what we call "in the business" type gymnastics
const Wrapper = (): React.ReactElement => {
	const [lang, setLang] = useState<LangType>("en_US");

	return (
		<LangContext.Provider value={lang}>
			<App
				changeLang={(value: string) => {
					setLang(value as LangType);
				}}
			/>
		</LangContext.Provider>
	);
};
const App = ({
	changeLang,
}: {
	changeLang: (value: string) => void;
}): React.ReactElement => {
	const [username, setUsername] = useState<string>();
	const [messages, setMessages] = useState<Message[]>([]);
	// const [lang, setLang] = useState<LangType>("en_US");
	const lang = useContext(LangContext);
	const home = strings[lang].homepage;
	if (!username) {
		const newName = prompt(home.userNamePrompt) as string;
		setUsername(newName);
	}
	return (
		<div className="App">
			<h1>{home.title}</h1>
			<pre>{home.description}</pre>
			<button
				onClick={(ev) => {
					const selection = prompt(home.newLangPrompt);
					changeLang(selection ? (selection as LangType) : lang);
				}}
			>
				{home.switchLang}
			</button>
			{messages.map((message) => {
				return <MessageContainer {...message} />;
			})}
			{<Chat user={username as string} />}
		</div>
	);
};
export default Wrapper;
