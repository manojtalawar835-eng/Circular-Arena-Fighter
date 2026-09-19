import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

interface HttpPlayer {
  playerId: string;
  slot: 'p1' | 'p2';
  name: string;
  vx: number;
  vy: number;
  lastSeen: number;
}

interface Room {
  code: string;
  createdAt: number;
  p1: HttpPlayer | null;
  p2: HttpPlayer | null;
  events: Array<{ id: string; type: string; data?: any; time: number }>;
  restartCounter: number;
  wsClients: Map<string, WebSocket>;
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
    let attempts = 0;
    do {
      code = Math.floor(1000 + Math.random() * 9000).toString();
      attempts++;
    } while (rooms.has(code) && attempts < 1000);
    return code;
  }

  // REST API health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', activeRooms: rooms.size });
  });

  // REST API: Create Room
  app.post('/api/rooms/create', (req, res) => {
    const { name = 'Modi ji' } = req.body;
    const code = generateRoomCode();
    const playerId = 'p-' + Math.random().toString(36).substring(2, 9);

    const room: Room = {
      code,
      createdAt: Date.now(),
      p1: {
        playerId,
        slot: 'p1',
        name,
        vx: 0,
        vy: 0,
        lastSeen: Date.now()
      },
      p2: null,
      events: [],
      restartCounter: 0,
      wsClients: new Map()
    };

    rooms.set(code, room);

    res.json({
      success: true,
      code,
      playerId,
      slot: 'p1',
      name
    });
  });

  // REST API: Join Room
  app.post('/api/rooms/join', (req, res) => {
    const code = String(req.body.code || '').trim();
    const name = req.body.name || 'Abhijit dipke';
    const room = rooms.get(code);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: `Room code ${code} not found. Please verify the 4-digit code.`
      });
    }

    if (room.p2 && Date.now() - room.p2.lastSeen < 20000) {
      return res.status(400).json({
        success: false,
        error: `Room ${code} is already full (2/2 players).`
      });
    }

    const playerId = 'p-' + Math.random().toString(36).substring(2, 9);
    room.p2 = {
      playerId,
      slot: 'p2',
      name,
      vx: 0,
      vy: 0,
      lastSeen: Date.now()
    };

    // Broadcast to any connected WebSockets
    room.wsClients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'OPPONENT_JOINED',
          opponentName: name,
          code
        }));
      }
    });

    res.json({
      success: true,
      code,
      playerId,
      slot: 'p2',
      name,
      opponentName: room.p1?.name || 'Player 1'
    });
  });

  // REST API: Send movement input or action
  app.post('/api/rooms/input', (req, res) => {
    const { code, playerId, vx = 0, vy = 0, event, restart } = req.body;
    const room = rooms.get(String(code || '').trim());

    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    if (room.p1 && room.p1.playerId === playerId) {
      room.p1.vx = vx;
      room.p1.vy = vy;
      room.p1.lastSeen = Date.now();
    } else if (room.p2 && room.p2.playerId === playerId) {
      room.p2.vx = vx;
      room.p2.vy = vy;
      room.p2.lastSeen = Date.now();
    }

    if (restart) {
      room.restartCounter++;
    }

    if (event) {
      room.events.push({
        id: Math.random().toString(36).substring(2, 8),
        type: event.type,
        data: event.data,
        time: Date.now()
      });
      if (room.events.length > 20) room.events.shift();
    }

    res.json({ success: true });
  });

  // REST API: Poll Room State (Reliable HTTP Long/Fast Polling)
  app.get('/api/rooms/:code/poll', (req, res) => {
    const code = req.params.code.trim();
    const playerId = String(req.query.playerId || '');
    const room = rooms.get(code);

    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    const isP1 = room.p1?.playerId === playerId;
    const isP2 = room.p2?.playerId === playerId;

    // Update player heartbeat
    if (isP1 && room.p1) room.p1.lastSeen = Date.now();
    if (isP2 && room.p2) room.p2.lastSeen = Date.now();

    const opponent = isP1 ? room.p2 : room.p1;
    const opponentActive = opponent ? (Date.now() - opponent.lastSeen < 12000) : false;

    res.json({
      success: true,
      code: room.code,
      hasOpponent: !!opponent && opponentActive,
      opponentName: opponentActive ? opponent?.name : null,
      opponentSlot: opponent?.slot || null,
      opponentVx: opponentActive ? (opponent?.vx || 0) : 0,
      opponentVy: opponentActive ? (opponent?.vy || 0) : 0,
      restartCounter: room.restartCounter,
      events: room.events.filter(e => Date.now() - e.time < 3000)
    });
  });

  // Attach WebSocket server on /ws path as secondary option
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    let currentRoomCode: string | null = null;
    let currentPlayerId: string | null = null;

    ws.on('message', (data: string) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === 'CREATE_ROOM') {
          const code = generateRoomCode();
          const playerId = 'p-' + Math.random().toString(36).substring(2, 9);
          const room: Room = {
            code,
            createdAt: Date.now(),
            p1: { playerId, slot: 'p1', name: msg.name || 'Modi ji', vx: 0, vy: 0, lastSeen: Date.now() },
            p2: null,
            events: [],
            restartCounter: 0,
            wsClients: new Map()
          };
          room.wsClients.set(playerId, ws);
          rooms.set(code, room);
          currentRoomCode = code;
          currentPlayerId = playerId;

          ws.send(JSON.stringify({
            type: 'ROOM_CREATED',
            code,
            slot: 'p1',
            playerId,
            name: room.p1?.name
          }));
        } else if (msg.type === 'JOIN_ROOM') {
          const code = (msg.code || '').trim();
          const room = rooms.get(code);

          if (!room) {
            ws.send(JSON.stringify({ type: 'ERROR', message: `Room code ${code} not found.` }));
            return;
          }

          const playerId = 'p-' + Math.random().toString(36).substring(2, 9);
          room.p2 = { playerId, slot: 'p2', name: msg.name || 'Abhijit dipke', vx: 0, vy: 0, lastSeen: Date.now() };
          room.wsClients.set(playerId, ws);
          currentRoomCode = code;
          currentPlayerId = playerId;

          ws.send(JSON.stringify({
            type: 'ROOM_JOINED',
            code,
            slot: 'p2',
            playerId,
            name: room.p2?.name,
            opponentName: room.p1?.name || 'Player 1'
          }));

          room.wsClients.forEach((client, pid) => {
            if (pid !== playerId && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'OPPONENT_JOINED',
                opponentName: room.p2?.name,
                code
              }));
            }
          });
        } else if (msg.type === 'GAME_INPUT') {
          if (!currentRoomCode) return;
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          if (room.p1?.playerId === currentPlayerId) {
            room.p1.vx = msg.vx;
            room.p1.vy = msg.vy;
          } else if (room.p2?.playerId === currentPlayerId) {
            room.p2.vx = msg.vx;
            room.p2.vy = msg.vy;
          }

          room.wsClients.forEach((client, pid) => {
            if (pid !== currentPlayerId && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'OPPONENT_INPUT',
                vx: msg.vx,
                vy: msg.vy,
                slot: msg.slot
              }));
            }
          });
        }
      } catch (err) {
        console.error('WS error:', err);
      }
    });

    ws.on('close', () => {
      if (currentRoomCode && currentPlayerId) {
        const room = rooms.get(currentRoomCode);
        if (room) {
          room.wsClients.delete(currentPlayerId);
        }
      }
    });
  });

  // Clean old rooms after 30 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [code, room] of rooms.entries()) {
      if (now - room.createdAt > 30 * 60 * 1000) {
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
