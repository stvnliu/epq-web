import "../Sidebar.css";
import { Avatar } from "./Avatar";
export const SidebarMenuItem = ({
	text,
	href,
	handler,
}: {
	text: string;
	href?: string;
	handler?: () => void;
}) => {
	return (
		<div
			className="sidebar-menu-item"
			onClick={
				handler
					? () => {
							handler();
					  }
					: () => {}
			}
		>
			<li>
				<span>
					<i>{href ? <a href={href}>{text}</a> : text}</i>
				</span>
			</li>
			<hr></hr>
		</div>
	);
};
export const SidebarMenu = ({
	exitHandler,
}: {
	exitHandler: (enabled: boolean) => void;
}) => {
	return (
		<div className="sidebar-menu">
			<Avatar></Avatar>
			<SidebarMenuItem text="My Account"></SidebarMenuItem>
			<SidebarMenuItem text="Personalisation"></SidebarMenuItem>
			<SidebarMenuItem text="Language"></SidebarMenuItem>
			<SidebarMenuItem text="Server Configuration"></SidebarMenuItem>
			<SidebarMenuItem
				text="Return to homepage"
				handler={() => exitHandler(false)}
			></SidebarMenuItem>
		</div>
	);
};
