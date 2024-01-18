import { useState } from "react";
import { contentTypes, domain, endpoints, port } from "../consts";
import { LoginType } from "../context";
import { User } from "../Chat/userTypes";
const encrypt = (rawPasswordString: string) => {
	// TODO Encryption method stub
	return rawPasswordString;
};
export const Login = ({
	setLogin,
}: {
	setLogin: (newLogin: LoginType) => void;
}): React.ReactElement => {
	const [valid, setValid] = useState(true);
	const registrationHandler = () => {
		const uname = (document.getElementById("username") as HTMLInputElement)
			.value;
		const passwd = encrypt(
			(document.getElementById("passwd") as HTMLInputElement).value
		);
		fetch(`http://${domain}:${port}${endpoints.user}`, {
			method: "POST",
			headers: contentTypes.json,
			body: JSON.stringify({
				userName: uname,
				dateJoined: Date.now(),
				passwordHash: passwd,
			}),
		}).then((response) => {
			if (response.status === 400) {
				console.log("Username is taken or invalid!");
			} else {
				const futureDate = new Date();
				futureDate.setHours(futureDate.getHours() + 2);
				setLogin({
					username: uname,
					lastSeen: Date.now(),
					validUntil: futureDate.getUTCMilliseconds(),
				});
			}
		});
	};
	// login button press handler
	const loginHandler = () => {
		const uname = (document.getElementById("username") as HTMLInputElement)
			.value;
		const passwd = encrypt(
			(document.getElementById("passwd") as HTMLInputElement).value
		);
		// async invocation of Fetch API
		fetch(`http://${domain}:${port}${endpoints.user}?user=${uname}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((userObject) => {
				const user = userObject as User;
				const validLogin = passwd === user.passwordHash;
				if (!validLogin) {
					// login invalid
					setValid(false); // triggers page re-render -- should refresh the page
				} else {
					// login valid
					const validUntilDate: Date = new Date();
					validUntilDate.setHours(validUntilDate.getHours() + 2);
					setLogin({
						username: user.userName,
						lastSeen: user.lastSeen,
						validUntil: validUntilDate.getUTCMilliseconds(),
					});
				}
			});
	};
	return (
		<div>
			<fieldset>
				<legend>Login window</legend>
				<p className="uname-error-text">
					{valid ? "Error in your username or password" : ""}
				</p>
				<label htmlFor="username">Username: </label>
				<input id="username" type="text"></input>
				<label htmlFor="passwd">Password: </label>
				<input id="passwd" type="password"></input>
				<button type="submit">Login</button>
				<button type="submit">Register</button>
			</fieldset>
		</div>
	);
};
