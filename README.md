# 🚀 ZELL0-CLONE Chat Server

A WebSocket chat server for the ZELL0-CLONE Android walkie-talkie app.

## Features

- Real-time messaging between devices
- Support for text, voice, and image messages
- User join/leave notifications
- Message history
- Cross-platform compatibility

## Quick Deploy to Railway

1. Fork this repository
2. Go to [Railway](https://railway.app/)
3. Sign up with GitHub
4. Create new project → "Deploy from GitHub repo"
5. Select this repository
6. Railway will automatically deploy your server
7. Get your WebSocket URL (e.g., `wss://your-app.railway.app`)
8. Update your Android app with the new URL

## Local Development

```bash
npm install
npm start
```

Server will run on `ws://localhost:8080`

## Environment Variables

- `PORT`: Server port (default: 8080)

## License

MIT