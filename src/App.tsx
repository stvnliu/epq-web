import React from "react";
import ChatWrapper from "./Chat/Chat";
const App = (): React.ReactElement => {
    return (
        <div className="App">
            <h1>Local Area Network Chat Application</h1>
            <pre>This web application was built for the purposes of an EPQ project.</pre>
            <ChatWrapper user="testuser" brokerURL=""/>
        </div>
    )
}
export default App;