import React, { useState } from "react";
import ChatWrapper from "./Chat/Chat";
const App = (): React.ReactElement => {
    const [username, setUsername] = useState<string>()
    if (!username) {
        const newName = prompt("Username:") as string
        setUsername(newName)
    }
    return (
        <div className="App">
            <h1>Local Area Network Chat Application</h1>
            <pre>This web application was built for the purposes of an EPQ project.</pre>
            
            {<ChatWrapper user={username as string} brokerURL=""/> }
        </div>
    )
}
export default App;