import React, { useState } from "react";
import ChatWrapper from "./Chat/ChatWrapper";
import "./App.css";
import { Message } from "./Chat/types";
import { MessageContainer } from "./Chat/MessageContainer";
const App = (): React.ReactElement => {
	const [username, setUsername] = useState<string>();
	const [messages, setMessages] = useState<Message[]>([]);
	if (!username) {
		const newName = prompt("Username:") as string;
		setUsername(newName);
	}
	return (
		<div className="App">
			<h1>Local Area Network Chat Application</h1>
			<pre>
				This web application was built for the purposes of an EPQ
				project.
			</pre>
			{messages.map((message) => {
				return <MessageContainer {...message} />;
			})}
			{
				<ChatWrapper
					user={username as string}
				/>
			}
		</div>
	);
};
export default App;
