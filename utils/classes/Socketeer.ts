import EventEmitter from "events";

export class Socketeer extends EventEmitter {
    static instance: Socketeer;
    static getInstance(): Socketeer {
        if (!Socketeer.instance) {
        Socketeer.instance = new Socketeer();
        }
        return Socketeer.instance;
    }
    private constructor() {
        super();
    }
    async connect() {
        const socket = new WebSocket("ws://localhost:8080");
        socket.onopen = () => {
            console.log("Connected to socket");
        };
        socket.onmessage = (event) => {
            console.log("Received message from socket", event.data);
        };
        socket.onclose = () => {
            console.log("Disconnected from socket");
        };
    }
    
}