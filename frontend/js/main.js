/* Draggable Part */

const draggableArr = ["userList"]

function createDragabbleElements(el) {

    let initX, initY, mousePressX, mousePressY;

    el.addEventListener("mousedown", function (event) {

        initX = this.offsetLeft;
        initY = this.offsetTop;
        mousePressX = event.clientX;
        mousePressY = event.clientY;

        el.addEventListener("mousemove", repositionElement, false);

        window.addEventListener("mouseup", function () {
            el.removeEventListener("mousemove", repositionElement, false);
        }, false);

    }, false);

    function repositionElement(event) {
        this.style.left = initX + event.clientX - mousePressX + "px";
        this.style.top = initY + event.clientY - mousePressY + "px";
    }

}


function updateDraggable(el) {

    for (let i = 0; i < draggableArr.length; i++) {
        createDragabbleElements(document.getElementById(draggableArr[i]));
        
    }

}

updateDraggable(draggableArr[0]);

/* WebSocket Part */


if (localStorage.getItem("username") !== null) {

    const connection = new WebSocket( `wss://simple-chat-aedt.herokuapp.com/` /*"wss://127.0.0.1:3000"*/, [localStorage.getItem("username")]);
    const chat = document.querySelector("#chatbox");
    const button = document.querySelector("#send");
    const select = document.getElementById("usernames");
    const usernameList = document.getElementById("usernameList");
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

        if (document.getElementById(`chat-${data.username}`)) {
            
            const minichatbox = document.getElementById(`chatbox-${data.username}`);

            if (data.type === "disconnect") {
                alert(`From ${data.username} to ${data.to}: ${data.message}`);
                exitChat();
                window.location.reload();
            }
            else if (data.type !== "info") {

                if (data.username !== localStorage.getItem("username")) {
                    minichatbox.innerHTML += `<div class="msgln"><b class="user-name">${data.username}: </b> ${data.message}<br></div>`;                    
                }

            }
            else {
                chat.innerHTML += `<div class="msgln"><span class="chat-time">${data.date}</span> <b class="user-name-left">${data.username}: </b> <span class="left-info">${data.message} </span><br></div>`;
            }
    
            minichatbox.scrollTop = minichatbox.scrollHeight;
    
            if (data.connections !== undefined) {
    
                const online = document.getElementById("online");
    
                online.innerHTML = data.connections;
    
                if (data.clientNames) {
    
                    currentOnlineUsers = data.clientNames;
    
                    usernameList.innerHTML = "";
    
                    currentOnlineUsers.forEach(user => {
                        const btn = document.createElement("button");
                        btn.innerText = user;
    
                        btn.onclick = () => { openChat(btn) };
    
                        if (user != localStorage.getItem("username")) {
                            usernameList.append(btn);
                            console.log(user);                         
                        }

    
                    });
    
                }
    
            }

        } else {
            if (data.type === "disconnect") {
                alert(`From ${data.username} to ${data.to}: ${data.message}`);
                exitChat();
                window.location.reload();
            }
            else if (data.type !== "info") {
                chat.innerHTML += `<div class="msgln"><span class="chat-time">${data.date}</span> <b class="user-name">From ${data.username} to ${data.to}</b> ${data.message}<br></div>`;
            }
            else {
                chat.innerHTML += `<div class="msgln"><span class="chat-time">${data.date}</span> <b class="user-name-left">From ${data.username} to ${data.to}</b> <span class="left-info">${data.message} </span><br></div>`;
            }
    
            chat.scrollTop = chat.scrollHeight;
    
            if (data.connections !== undefined) {
    
                const online = document.getElementById("online");
    
                online.innerHTML = data.connections;
    
                if (data.clientNames) {
    
                    currentOnlineUsers = data.clientNames;
    
                    usernameList.innerHTML = "";
    
                    currentOnlineUsers.forEach(user => {
                        const btn = document.createElement("button");
                        btn.innerText = user;
    
                        btn.onclick = () => { openChat(btn) };
    
                        usernameList.append(btn);
    
                    });
    
                }
    
            }
        }

        

    };

    button.addEventListener("click", () => {

        const name = document.getElementById("name");

        const message = document.getElementById("message");
        const data = { username: name.value, message: message.value, to: select.options[select.selectedIndex].text };

        // Send composed message to the server
        connection.send(JSON.stringify(data));

        // clear input fields
        message.value = "";

        message.focus();
        message.scrollIntoView();
    });

    /* Extra Part */

    function exitChat() {
        localStorage.removeItem("username");
    }

    function openChat(el) {

        if (document.getElementById(`chat-${el.innerHTML}`) === null) {
            const chatModal = document.getElementById("chatModals");

            const modal = `
            <div id="chat-${el.innerHTML}" style="position: fixed; user-select: none;" class="personal-chat">
                <div class="chat-popup">
                    <div class="form-container">
                        <h1>Chat to <span style="color: orange;">${el.innerHTML}</span></h1>

                        <label for="msg"><b>Message</b></label>
                        <div id="chatbox-${el.innerHTML}" class="mini-chatbox"></div>
                        <input placeholder="Type message.." name="msg" id="message-${el.innerHTML}" class="mini-message">

                        <button type="button" class="btn" onclick="sendMessage('${el.innerHTML}')">Send</button>
                        <button type="button" class="btn cancel" onclick="closeChat('chat-${el.innerHTML}')">Close</button>
                    </div>
                </div>
            </div>
            `

            chatModal.innerHTML += modal;

            draggableArr.push(`chat-${el.innerHTML}`);

            let id = `chat-${el.innerHTML}`;

            updateDraggable(id);
        } else {
            alert("Chat already exist");
        }

    }

    function closeChat(id) {

        const delChat = document.getElementById(id);

        delChat.parentNode.removeChild(delChat);

    }

    function sendMessage(id) {

        const to = id;
        const message = document.getElementById(`message-${id}`);
        
        const name = document.getElementById("name");
        const data = { username: name.value, message: message.value, to: to };
        const minichatbox = document.getElementById(`chatbox-${to}`);
        minichatbox.innerHTML += `<div class="msgln"><b class="user-name">${data.username}: </b> ${data.message}<br></div>`;
        minichatbox.scrollTop = minichatbox.scrollHeight;



        // Send composed message to the server
        connection.send(JSON.stringify(data));

        // clear input fields
        message.value = "";

        message.focus();
        message.scrollIntoView();

    }

} else {
    window.location.href = "login.html";
}

