import { useContext, useState } from "react";
import { contentTypes, domain, endpoints, port } from "../consts";
import { LangContext, LoginType } from "../context";
import { User } from "../type/userTypes";
import "./Login.css";
import strings from "../Intl/strings.json";
import { ECDH } from "crypto";
const encrypt = (rawPasswordString: string) => {
	// TODO Encryption method stub
	return rawPasswordString;
};
export const Login = ({
	setLogin,
}: {
	setLogin: (newLogin: LoginType | undefined) => void;
}): React.ReactElement => {
	const [valid, setValid] = useState<boolean | undefined>(undefined);
	const [validText, setValidText] = useState<string | undefined>();
	const lang = useContext(LangContext);
	const loginPage = strings[lang].login;
	const registrationHandler = () => {
		const uname = (document.getElementById("username") as HTMLInputElement)
			.value;
		const passwd = encrypt(
			(document.getElementById("passwd") as HTMLInputElement).value
		);
		fetch(`https://${domain}:${port}${endpoints.user}`, {
			method: "POST",
			mode: "cors",
			headers: contentTypes.json,
			body: JSON.stringify({
				userName: uname,
				dateJoined: Date.now(),
				passwordHash: passwd,
			}),
		}).then((response) => {
			if (response.status === 400) {
				// 400 Bad request
				console.log("Username is taken or invalid!");
				setValid(false);
				setValidText(loginPage.error.unameTakenOrInvalid);
			} else if (response.status === 200) {
				// 200 OK
				const futureDate = new Date();
				futureDate.setHours(futureDate.getHours() + 2);
				setLogin({
					username: uname,
					lastSeen: Date.now(),
					validUntil: futureDate.getUTCMilliseconds(),
				});
				document.title = `IRC User ${uname}`;
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
		fetch(`https://${domain}:${port}${endpoints.user}?name=${uname}`, {
			method: "GET",
			mode: "cors",
		})
			.then((res) => {
				if (res.status === 404) {
					console.log("404 not found encountered");
					throw new Error(loginPage.error.unameNotExists);
				} else if (res.status === 200) {
					console.log("200 OK");
				}
				return res.json();
			})
			.then((userObject) => {
				if (!userObject) {
					return;
				}
				const user = userObject as User;
				const validLogin = passwd === user.passwordHash;
				if (!validLogin) {
					// login invalid
					throw new Error(loginPage.error.passwdInvalid);
				} else {
					// login valid
					setValid(true);
					const validUntilDate: Date = new Date();
					validUntilDate.setHours(validUntilDate.getHours() + 2);
					setLogin({
						username: user.userName,
						lastSeen: user.lastSeen,
						validUntil: validUntilDate.getUTCMilliseconds(),
					});
					document.title = `IRC User ${uname}`;
				}
			})
			.catch((reason: Error) => {
				setValid(false);
				setValidText(reason.message);
			});
	};
	return (
		<div className="login">
			<fieldset>
				<legend>{loginPage.window.title}</legend>
				<p className="uname-error-text">
					{!valid && valid !== undefined ? validText : ""}
				</p>
				<label htmlFor="username">{loginPage.window.uname}</label>
				<br />
				<input id="username" type="text"></input>
				<br />
				<label htmlFor="passwd">{loginPage.window.passwd}</label>
				<br />
				<input id="passwd" type="password"></input>
				<br />
				<button
					disabled={valid}
					type="submit"
					onClick={() => {
						loginHandler();
					}}
				>
					{loginPage.window.login}
				</button>
				<button
					disabled={valid}
					type="submit"
					onClick={() => {
						registrationHandler();
					}}
				>
					{loginPage.window.register}
				</button>
				<button
					disabled={!valid}
					type="submit"
					onClick={() => {
						setLogin(undefined);
						setValid(undefined);
					}}
				>
					{loginPage.window.logout}
				</button>
			</fieldset>
		</div>
	);
};
