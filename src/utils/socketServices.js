class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;

    this.allDriversListeners = new Set();
    this.driverUpdateListeners = new Set();

    this.reconnectTimer = null;
    this.pingInterval = null;
    this.hasShownDisconnectLog = false;
  }

  /* ---------------- HEARTBEAT ---------------- */

  startPing() {
    this.stopPing();

    this.pingInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        console.log("💓 [ADMIN_SOCKET] ping");
        this.socket.send(JSON.stringify({ type: "ping" }));
      }
    }, 25000);
  }

  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /* ---------------- CONNECTION ---------------- */

  connectAsAdmin() {
    if (this.socket) return;

    console.log("🔌 [ADMIN_SOCKET] connecting…");

    const ws = new WebSocket(process.env.REACT_APP_SOCKET_URL);
    this.socket = ws;

    ws.onopen = () => {
      if (this.socket !== ws) return;

      console.log("✅ [ADMIN_SOCKET] connected");
      this.connected = true;
      this.hasShownDisconnectLog = false;

      // Identify admin
      ws.send(JSON.stringify({ role: "admin" }));

      this.startPing();
    };

    ws.onmessage = (e) => {
      if (this.socket !== ws) return;

      try {
        const message = JSON.parse(e.data);

        if (message.type === "allDrivers") {
          this.allDriversListeners.forEach(cb => cb(message.drivers));
        }

        if (message.type === "driverLocationUpdate") {
          this.driverUpdateListeners.forEach(cb => cb(message.drivers));
        }
      } catch (err) {
        console.error("❌ [ADMIN_SOCKET] parse failed", err);
      }
    };

    ws.onerror = (e) => {
      if (this.socket !== ws) return;
      console.error("❌ [ADMIN_SOCKET] error", e);
    };

    ws.onclose = () => {
      if (this.socket !== ws) return;

      console.warn("⚠️ [ADMIN_SOCKET] disconnected");

      this.cleanup();

      if (!this.hasShownDisconnectLog) {
        console.warn("🔁 [ADMIN_SOCKET] reconnecting…");
        this.hasShownDisconnectLog = true;
      }

      this.reconnectTimer = setTimeout(() => {
        this.connectAsAdmin();
      }, 3000);
    };
  }

  cleanup() {
    this.stopPing();
    this.connected = false;
    this.socket = null;
  }

  /* ---------------- SUBSCRIPTIONS ---------------- */

  onAllDrivers(cb) {
    this.allDriversListeners.add(cb);
    return () => this.allDriversListeners.delete(cb);
  }

  onDriverLocationUpdates(cb) {
    this.driverUpdateListeners.add(cb);
    return () => this.driverUpdateListeners.delete(cb);
  }

  disconnect() {
    console.log("🔌 [ADMIN_SOCKET] disconnect");

    this.allDriversListeners.clear();
    this.driverUpdateListeners.clear();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopPing();
    this.socket?.close();
    this.socket = null;
    this.connected = false;
  }
}

const socketService = new SocketService();
export default socketService;
