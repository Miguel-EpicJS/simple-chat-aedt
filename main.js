const connection = new WebSocket(`wss://simple-chat-aedt.herokuapp.com/`, [ localStorage.getItem("username") || "Anonimo" ]);
const button = document.querySelector("#send");
const select = document.getElementById("usernames");

let currentOnlineUsers = ["all"];

document.getElementById("name").value = localStorage.getItem("username");

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
    const chat = document.querySelector("#chatbox");

    const data = JSON.parse(event["data"]); 

    chat.scrollTop = chat.scrollHeight;

    if (data.type !== "info") {
        chat.innerHTML += `<div class="msgln"><span class="chat-time">${data.date}</span> <b class="user-name">${data.username}</b> ${data.message}<br></div>`;        
    } else {
        chat.innerHTML += `<div class="msgln"><span class="chat-time">${data.date}</span> <b class="user-name-left">${data.username}</b> <span class="left-info">${data.message} </span><br></div>`;
    }

    if (data.connections !== undefined) {
        
        const online = document.getElementById("online");

        online.innerHTML = data.connections;

        console.log(data);

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
    const data = {username: name.value, message: message.value, date: new Date().toLocaleTimeString(), to: select.options[select.selectedIndex].text};

    // Send composed message to the server
    connection.send(JSON.stringify(data));

    // clear input fields
    message.value = "";

    message.focus();
    message.scrollIntoView();
});