import { useContext, useState } from "react";
import { contentTypes, domain, endpoints, port } from "../consts";
import { LangContext, LoginType } from "../context";
import { AuthData, User } from "../type/userTypes";
import "./Login.css";
import strings from "../Intl/strings.json";
import { ECDH } from "crypto";
import { digestMessage } from "../crypto";
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
	// TODO mk unit test
	const registrationHandler = () => {
		const uname = (document.getElementById("username") as HTMLInputElement)
			.value;
		digestMessage((document.getElementById("passwd") as HTMLInputElement).value).then((passwd) => {
			fetch(`https://${domain}:${port}${endpoints.register}`, {
				method: "POST",
				mode: "cors",
				headers: contentTypes.json,
				body: JSON.stringify({
					userName: uname,
					newUserPassword: passwd,
				}),
			})
			.then((res) => res.json()).then((body) => {
				const response = body as AuthData;
				if (response.exists && !response.success) {throw new Error(loginPage.error.unameTakenOrInvalid)}
				getProfile(uname).then((user) => {
					setValid(true);
					const futureDate = new Date();
					futureDate.setHours(futureDate.getHours() + 2);
					setLogin({
						username: user.userName,
						lastSeen: Date.now(),
						validUntil: futureDate.getUTCMilliseconds(),
					});
					document.title = `IRC User ${user.userName}`;
				});
			})
			.catch((error: Error) => {
				setValid(false);
				setValidText(error.message);
			})
		});
	};

	// TODO Make unit test
	const getProfile = async(userName: string): Promise<User> => {
		const res = await (await fetch(`https://${domain}:${port}${endpoints.user}?name=${userName}`,
		{
			method: "GET",
			mode: "cors"
		}
		)).json()
		return res;
	}
	// login button press handler
	// TODO make unit test
	const loginHandler = () => {
		const uname = (document.getElementById("username") as HTMLInputElement)
			.value;
		digestMessage(
			(document.getElementById("passwd") as HTMLInputElement).value
		).then((passwd) => {
			// async invocation of Fetch API
			fetch(`https://${domain}:${port}${endpoints.auth}`, {
				method: "POST",
				mode: "cors",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					userName: uname,
					userPasswordHash: passwd,
				})
			})
				.then(res => res.json())
				.then((body) => {
					const response = body as AuthData;
					if (!response.exists) {throw new Error(loginPage.error.unameNotExists)}
					else if (!response.success) {throw new Error(loginPage.error.passwdInvalid)}
					else {
						getProfile(uname).then((user) => {
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
						});
					}
				})
				.catch((reason: Error) => {
					setValid(false);
					setValidText(reason.message);
				});
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
