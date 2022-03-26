function getClientNames(clients, WebSocket) {

    const names = ["all"];

    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {

            names.push(client.protocol);

        }
    });

    return names;
}

module.exports = (server) => {

    const WebSocket = require("ws");

    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {

        ws.on("message", (data) => {

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {

                    const submitData = JSON.parse(data);

                    submitData.date = new Date().toLocaleTimeString();
                    submitData.clientNames = getClientNames(wss.clients, WebSocket);

                    if (submitData.to === "all") {
                        client.send(JSON.stringify(submitData));
                    } else if (submitData.to === client.protocol || submitData.username === client.protocol) {
                        client.send(JSON.stringify(submitData));
                    }

                }
            });
        });

        ws.on("close", () => {

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {

                    const submitData = {
                        username: ws.protocol,
                        to: "all",
                        message: "Disconnected from server",
                        date: new Date().toLocaleTimeString(),
                        type: "info",
                        connections: wss.clients.size,
                        clientNames: getClientNames(wss.clients, WebSocket)
                    }

                    client.send(JSON.stringify(submitData));
                }
            });

        });

        const clients = [];

        wss.clients.forEach(cli => {

            if (clients.indexOf(cli.protocol) !== -1) {
                
                const submitData = {
                    username: "server",
                    to: cli.protocol,
                    message: "This username already exist",
                    type: "disconnect"

                };

                cli.send(JSON.stringify(submitData));

                cli.close();

            } else {
                clients.push(cli.protocol);
            }


        });

        wss.clients.forEach((client) => {

            if (client.readyState === WebSocket.OPEN) {


                const submitData = {
                    username: ws.protocol,
                    to: "all",
                    message: "Connected to the server",
                    date: new Date().toLocaleTimeString(),
                    type: "info",
                    connections: wss.clients.size,
                    clientNames: getClientNames(wss.clients, WebSocket)
                }

                client.send(JSON.stringify(submitData));
            }
        });


    });
}