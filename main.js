if (localStorage.getItem("username") !== null) {

    const connection = new WebSocket(`wss://simple-chat-aedt.herokuapp.com/` /*"ws://127.0.0.1:8080" */, [ localStorage.getItem("username") ]);
    const chat = document.querySelector("#chatbox");
    const button = document.querySelector("#send");
    const select = document.getElementById("usernames");
    const username = document.getElementById("name");
    
    let currentOnlineUsers = ["all"]; 
    
    username.value = localStorage.getItem("username"); // BUG
    
    connection.onopen = (event) => {
        console.log("WebSocket is open now.");
    };
    
    connection.onclose = (event) => { 
        console.log("WebSocket is closed now.");
    };
    
    connection.onerror = (event) => {
        console.error("WebSocket error observed:", event);
    };
    
    connection.onmessage = (event) => {

        let data;
        try {
            data = JSON.parse(event["data"]); 
        } catch (error) {
            console.error(`Error onmessage ${error}`);
            return false;
        }
    
    
        if (data.type !== "info") {
            chat.innerHTML += `<div class="msgln"><span class="chat-time">${data.date}</span> <b class="user-name">From ${data.username} to ${data.to}</b> ${data.message}<br></div>`;        
        } else {
            chat.innerHTML += `<div class="msgln"><span class="chat-time">${data.date}</span> <b class="user-name-left">From ${data.username} to ${data.to}</b> <span class="left-info">${data.message} </span><br></div>`;
        }
        
        chat.scrollTop = chat.scrollHeight;
    
        if (data.connections !== undefined) {
            
            const online = document.getElementById("online");
    
            online.innerHTML = data.connections;
        
            if (data.clientNames) {
                
                currentOnlineUsers = data.clientNames;
    
                for (a in select.options) { select.options.remove(0); }
    
                currentOnlineUsers.forEach(user => {
    
                    const opt = document.createElement("option");
                    opt.value = user;
                    opt.innerHTML = user;
                    select.appendChild(opt);
        
                });
    
            }
    
        }
    
    };
    
    button.addEventListener("click", () => {
    
        const name = document.getElementById("name");
       
        localStorage.setItem("username", name.value);
       
        const message = document.getElementById("message");
        const data = {username: name.value, message: message.value, to: select.options[select.selectedIndex].text};
    
        // Send composed message to the server
        connection.send(JSON.stringify(data));
    
        // clear input fields
        message.value = "";
    
        message.focus();
        message.scrollIntoView();
    });    
} else {
    window.location.href="login.html";
}

function exitChat() {
    localStorage.removeItem("username");
}
