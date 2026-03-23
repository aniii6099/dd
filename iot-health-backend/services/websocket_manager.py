from fastapi import WebSocket
from typing import List
import json


class ConnectionManager:
    """
    Manages all active WebSocket connections and broadcasts messages.
    """

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"🔌 New WS client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """Remove a disconnected WebSocket from the pool."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"🔌 WS client disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, data: dict):
        """
        Broadcast a JSON-serialisable dict to all active clients.
        Dead connections are cleaned up automatically.
        """
        message = json.dumps(data, default=str)
        disconnected = []

        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                disconnected.append(connection)

        for conn in disconnected:
            self.disconnect(conn)


# Singleton instance shared across the application
manager = ConnectionManager()
