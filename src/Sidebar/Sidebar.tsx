import { useState } from "react";
import "./Sidebar.css";
import { SidebarMenu } from "./Components/SidebarMenu";
export const Sidebar = ({
	isEnabled,
	setEnable,
}: {
	isEnabled: boolean;
	setEnable: (enabled: boolean) => void;
}) => {
	return isEnabled ? (
		<div className="sidebar">
			<div className="sidebar-content">
				<SidebarMenu
					exitHandler={(value) => {
						setEnable(value);
					}}
				></SidebarMenu>
			</div>
		</div>
	) : (
		<></>
	);
};
