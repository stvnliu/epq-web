import "./Avatar.css";
import placeholderImage from "./placeholder.jpg";
export const Avatar = () => {
	return (
		<div className="avatar">
			<img src={placeholderImage} width="75px"></img>
		</div>
	);
};
