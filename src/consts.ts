export const domain = window.location.hostname;
export const port = "8080";
export const connectionAddress = `wss://${domain}:${port}/ws`;
export const endpoints = {
	destination: "/app/chat",
	subscription: "/sub/chat",
	history: "/api/v1/msg/",
	user: "/api/v1/user",
	auth: "/api/v1/auth",
	oauth2: "",
};
export const contentTypes = {
	json: {
		"Content-Type": "application/json; charset=utf-8",
	},
};
