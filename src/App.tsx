import React from "react";
import Chat from "./Chat/Chat";
const App = (): React.ReactElement => {
    return (
        <div className="App">
            <h1>Local Area Network Chat Application</h1>
            <pre>This web application was built for the purposes of an EPQ project.</pre>
            <Chat user="testuser" />
        </div>
    )
}
export default App;