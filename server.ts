import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

interface PlayerSession {
  ws: WebSocket;
  playerId: string;
  slot: 'p1' | 'p2';
  name: string;
}

interface Room {
  code: string;
  players: Map<string, PlayerSession>;
  createdAt: number;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json());

  // In-memory active multiplayer rooms
  const rooms = new Map<string, Room>();

  // Helper to generate unique 4-digit code
  function generateRoomCode(): string {
    let code: string;
    do {
      code = Math.floor(1000 + Math.random() * 9000).toString();
    } while (rooms.has(code));
    return code;
  }

  // REST API health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', activeRooms: rooms.size });
  });

  // REST API room check
  app.get('/api/rooms/:code', (req, res) => {
    const room = rooms.get(req.params.code.trim());
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({
      code: room.code,
      playerCount: room.players.size,
      available: room.players.size < 2
    });
  });

  // Attach WebSocket server on the same HTTP server port 3000
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    let currentRoomCode: string | null = null;
    let currentPlayerId: string | null = null;

    ws.on('message', (data: string) => {
      try {
        const msg = JSON.parse(data.toString());

        switch (msg.type) {
          case 'CREATE_ROOM': {
            const code = generateRoomCode();
            const playerId = 'p-' + Math.random().toString(36).substring(2, 9);
            const room: Room = {
              code,
              players: new Map(),
              createdAt: Date.now()
            };

            const session: PlayerSession = {
              ws,
              playerId,
              slot: 'p1',
              name: msg.name || 'Modi ji'
            };
            room.players.set(playerId, session);
            rooms.set(code, room);

            currentRoomCode = code;
            currentPlayerId = playerId;

            ws.send(JSON.stringify({
              type: 'ROOM_CREATED',
              code,
              slot: 'p1',
              playerId,
              name: session.name
            }));
            break;
          }

          case 'JOIN_ROOM': {
            const code = (msg.code || '').trim();
            const room = rooms.get(code);

            if (!room) {
              ws.send(JSON.stringify({
                type: 'ERROR',
                message: `Room code ${code} not found. Check code or create a new room.`
              }));
              return;
            }

            if (room.players.size >= 2) {
              ws.send(JSON.stringify({
                type: 'ERROR',
                message: `Room ${code} is already full (2/2 players).`
              }));
              return;
            }

            const playerId = 'p-' + Math.random().toString(36).substring(2, 9);
            const session: PlayerSession = {
              ws,
              playerId,
              slot: 'p2',
              name: msg.name || 'Abhijit dipke'
            };
            room.players.set(playerId, session);

            currentRoomCode = code;
            currentPlayerId = playerId;

            // Notify joiner
            ws.send(JSON.stringify({
              type: 'ROOM_JOINED',
              code,
              slot: 'p2',
              playerId,
              name: session.name,
              opponentName: Array.from(room.players.values()).find(p => p.slot === 'p1')?.name || 'Player 1'
            }));

            // Notify player 1 that match can begin!
            const p1 = Array.from(room.players.values()).find(p => p.slot === 'p1');
            if (p1 && p1.ws.readyState === WebSocket.OPEN) {
              p1.ws.send(JSON.stringify({
                type: 'OPPONENT_JOINED',
                opponentName: session.name,
                code
              }));
            }
            break;
          }

          case 'GAME_INPUT': {
            if (!currentRoomCode) return;
            const room = rooms.get(currentRoomCode);
            if (!room) return;

            // Broadcast movement input to other player
            room.players.forEach(p => {
              if (p.playerId !== currentPlayerId && p.ws.readyState === WebSocket.OPEN) {
                p.ws.send(JSON.stringify({
                  type: 'OPPONENT_INPUT',
                  vx: msg.vx,
                  vy: msg.vy,
                  slot: msg.slot
                }));
              }
            });
            break;
          }

          case 'GAME_EVENT': {
            if (!currentRoomCode) return;
            const room = rooms.get(currentRoomCode);
            if (!room) return;

            // Broadcast combat events (pickup, shoot, damage, voice line)
            room.players.forEach(p => {
              if (p.playerId !== currentPlayerId && p.ws.readyState === WebSocket.OPEN) {
                p.ws.send(JSON.stringify({
                  type: 'SYNC_GAME_EVENT',
                  event: msg.event
                }));
              }
            });
            break;
          }

          case 'RESTART_MATCH': {
            if (!currentRoomCode) return;
            const room = rooms.get(currentRoomCode);
            if (!room) return;

            room.players.forEach(p => {
              if (p.ws.readyState === WebSocket.OPEN) {
                p.ws.send(JSON.stringify({
                  type: 'MATCH_RESTARTED'
                }));
              }
            });
            break;
          }
        }
      } catch (err) {
        console.error('WS parse error:', err);
      }
    });

    ws.on('close', () => {
      if (currentRoomCode && currentPlayerId) {
        const room = rooms.get(currentRoomCode);
        if (room) {
          room.players.delete(currentPlayerId);
          // Notify remaining player
          room.players.forEach(p => {
            if (p.ws.readyState === WebSocket.OPEN) {
              p.ws.send(JSON.stringify({
                type: 'OPPONENT_DISCONNECTED'
              }));
            }
          });
          // Clean up empty room
          if (room.players.size === 0) {
            rooms.delete(currentRoomCode);
          }
        }
      }
    });
  });

  // Clean old rooms after 30 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [code, room] of rooms.entries()) {
      if (now - room.createdAt > 30 * 60 * 1000 && room.players.size === 0) {
        rooms.delete(code);
      }
    }
  }, 5 * 60 * 1000);

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Arena Battle server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
