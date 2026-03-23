from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.websocket_manager import manager

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    /ws — WebSocket endpoint.

    Clients (browser) connect here to receive real-time sensor data.
    The connection is kept alive until the client disconnects.
    Data is PUSHED by the POST /api/data route via the manager.
    """
    await manager.connect(websocket)
    try:
        # Keep the connection open; listen for ping/close frames
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
