import React, { useContext, useEffect, useState } from "react";
import Chat from "./Chat/Chat";
import "./App.css";
import { LangType, Message } from "./type/messageTypes";
import { MessageDisplay } from "./MessageDisplay/MessageDisplay";
import strings from "./Intl/strings.json";
import { LangContext, LoginContext, LoginType } from "./context";
import { contentTypes, domain, endpoints, port } from "./consts";
import { Login } from "./Login/Login";
// what we "in the business" call type gymnastics
const Wrapper = (): React.ReactElement => {
	const [lang, setLang] = useState<LangType>("en_US");
	const [login, setLogin] = useState<LoginType | undefined>(undefined);
	useEffect(() => {
		document.title = login
			? `IRC logged in as ${login.username}`
			: "IRC Chat";
	}, [login]);
	return (
		<LangContext.Provider value={lang}>
			<h1>{strings[lang].homepage.title}</h1>
			<p>{strings[lang].homepage.description}</p>
			<LoginContext.Provider value={login}>
				{/* callbacks for altering the Lang/Login contexts */}
				<Login
					setLogin={(value) => {
						setLogin(value);
					}}
				></Login>
				{login ? (
					<App
						changeLang={(value: string) => {
							setLang(value as LangType);
						}}
					/>
				) : (
					<></>
				)}
			</LoginContext.Provider>
		</LangContext.Provider>
	);
};
const setNameOnServer = async (name: string) => {
	const responseRaw = await fetch(
		`http://${domain}:${port}${endpoints.user}`,
		{
			method: "POST",
			mode: "cors",
			headers: contentTypes.json,
			body: JSON.stringify({
				userName: name,
				dateJoined: Date.now(),
			}),
		}
	);
	if (responseRaw.status === 400) {
		return { success: false, reason: "Username taken or invalid!" };
	} else return { success: true, reason: "" };
};
const validateName = (name: string): boolean => {
	// TODO Name validation
	return !(name === null || name === undefined || name === "");
};

const App = ({
	changeLang,
}: {
	changeLang: (value: string) => void;
}): React.ReactElement => {
	const [username, setUsername] = useState<string>();
	const [messages, setMessages] = useState<Message[]>([]);
	const login = useContext(LoginContext);
	const lang = useContext(LangContext);
	const home = strings[lang].homepage;
	// TODO refine setName logic -- move to Login handler
	const setNamePrompt = () => {
		var newName = prompt(home.userNamePrompt) as string;
		while (!validateName(newName)) {
			console.log(newName);

			prompt("Username invalid! Please enter again.") as string;
		}
		setNameOnServer(newName).then((value) => {
			if (!value.success) {
				alert(value.reason);
				return true;
			} else {
				setUsername(newName);
				return false;
			}
		});
	};
	// if (!username) {
	// 	var newName = prompt(home.userNamePrompt) as string;
	// 	while (!validateName(newName)) {
	// 		console.log(newName);

	// 		prompt("Username invalid! Please enter again.") as string;
	// 	}
	// 	setUsername(newName);
	// }
	if (!login) {
		return <></>;
	} else
		return (
			<div className="App">
				<button
					onClick={(ev) => {
						const selection = prompt(home.newLangPrompt);
						changeLang(selection ? (selection as LangType) : lang);
					}}
				>
					{home.switchLang}
				</button>
				<button
					onClick={(ev) => {
						// For passing new username to the backend
						// In the future, this could be done with the async/await JS/TS syntax
						const newUsername = prompt("New username: ");
						fetch(`${endpoints.user}?name=${newUsername}`, {
							method: "POST",
						})
							.then((response) => {
								return response.json();
							})
							.then((responseBody: { success: boolean }) => {
								if (responseBody.success) {
									setUsername(newUsername as string);
								} else {
									console.error(
										"Server POST message failed."
									);
									alert(
										"The server encountered an internal error."
									);
								}
							});
					}}
				>
					Change Username
				</button>
				{messages.map((message) => {
					return <MessageDisplay {...message} />;
				})}
				{<Chat user={login.username as string} />}
			</div>
		);
};
export default Wrapper;
