const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store connected clients and messages
const clients = new Map();
const messageHistory = [];
const users = new Set();

console.log('🚀 ZELL0-CLONE Chat Server Starting...');
console.log('📡 Server will be available at: ws://YOUR_IP:8080');

wss.on('connection', (ws, req) => {
    const clientId = Date.now() + Math.random();
    clients.set(clientId, ws);
    
    console.log(`👤 New client connected: ${clientId}`);
    
    // Send current message history to new client
    if (messageHistory.length > 0) {
        ws.send(JSON.stringify({
            type: 'history',
            messages: messageHistory.slice(-50) // Last 50 messages
        }));
    }
    
    // Send current users list
    ws.send(JSON.stringify({
        type: 'user_list',
        users: Array.from(users)
    }));
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log(`📨 Received: ${message.type} from ${message.user}`);
            
            switch (message.type) {
                case 'join':
                    users.add(message.user);
                    broadcastToAll({
                        type: 'join',
                        user: message.user,
                        room: message.room,
                        content: `${message.user} joined THE-RING`,
                        timestamp: Date.now()
                    });
                    break;
                    
                case 'text':
                case 'voice':
                case 'image':
                    const chatMessage = {
                        type: message.type,
                        user: message.user,
                        room: message.room,
                        content: message.content,
                        timestamp: Date.now(),
                        reactions: {},
                        status: 'sent'
                    };
                    
                    messageHistory.push(chatMessage);
                    broadcastToAll(chatMessage);
                    break;
                    
                case 'leave':
                    users.delete(message.user);
                    broadcastToAll({
                        type: 'leave',
                        user: message.user,
                        room: message.room,
                        content: `${message.user} left THE-RING`,
                        timestamp: Date.now()
                    });
                    break;
            }
        } catch (error) {
            console.error('❌ Error parsing message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log(`👋 Client disconnected: ${clientId}`);
        clients.delete(clientId);
    });
    
    ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error);
        clients.delete(clientId);
    });
});

function broadcastToAll(message) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messageStr);
        }
    });
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎉 ZELL0-CLONE Chat Server running on port ${PORT}`);
    console.log('🌐 To test across networks:');
    console.log('   1. Find your IP address (ipconfig on Windows)');
    console.log('   2. Update your app to use: ws://YOUR_IP:8080');
    console.log('   3. Make sure port 8080 is open in your firewall');
});

// Handle server shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    wss.close();
    server.close();
    process.exit(0);
}); 