import "./Topbar.css";
import strings from "../Intl/strings.json";
import { useContext } from "react";
import { LangContext } from "../context";
import menu from "./menu.png";
export const Topbar = ({
	setSidebarEnable,
}: {
	setSidebarEnable: (enabled: boolean) => void;
}) => {
	const lang = useContext(LangContext);
	return (
		<div className="topbar">
			<img
				onClick={() => {
					setSidebarEnable(true);
				}}
				src={menu}
				width="100px"
				height="100px"
				alt="Open Selection Menu"
			></img>
			<span className="topbar-span">
				<h1 className="topbar-span children">
					{strings[lang].homepage.title}
				</h1>
			</span>
		</div>
	);
};
