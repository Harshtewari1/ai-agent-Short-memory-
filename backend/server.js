require("dotenv").config()
const app = require("./src/app")
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/services/ai.service")


const httpServer = createServer(app);

const io = new Server(httpServer, { 
    cors: {
        origin:"http://localhost:5173"
    }
});

const chatHistory = [
   
]

io.on("connection", (socket) => {
    console.log("a new client connected");
    
    socket.on("disconnect", () => {
        console.log("client disconnected");
        
    })


    socket.on("ai-message", async (data) => {
        
        console.log("Ai message recieved : ",data);
        
        chatHistory.push({
            role: "user",
            parts:[{text: data}]
        })

        const response = await generateResponse(chatHistory);

        chatHistory.push({
            role: "model",
            parts: [{text: response}]
        })
        
        console.log("Ai response : ",response);
        socket.emit("ai-message-response",response)
    })
    
});

httpServer.listen(3000, () => {
    console.log("server is runnning or port 3000");
    
})