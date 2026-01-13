class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;

    this.allDriversListeners = new Set();
    this.driverUpdateListeners = new Set();

    this.reconnectTimer = null;
  }

  connectAsAdmin() {
    if (this.socket) return;

    console.log("[ADMIN SOCKET] Connecting…");

    const ws = new WebSocket(process.env.REACT_APP_SOCKET_URL);
    this.socket = ws;

    ws.onopen = () => {
      // 🔐 SAFETY CHECK
      if (this.socket !== ws) {
        console.warn("[ADMIN SOCKET] Stale socket opened, ignoring");
        return;
      }

      console.log("✅ Admin socket connected");
      this.connected = true;

      // ✅ SAFE SEND
      ws.send(JSON.stringify({ role: "admin" }));
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
        console.error("❌ Admin socket parse failed", err);
      }
    };

    ws.onerror = (e) => {
      if (this.socket !== ws) return;
      console.error("❌ Admin socket error", e);
    };

    ws.onclose = () => {
      if (this.socket !== ws) return;

      console.warn("⚠️ Admin socket closed");
      this.connected = false;
      this.socket = null;

      this.reconnectTimer = setTimeout(() => {
        this.connectAsAdmin();
      }, 3000);
    };
  }


  // ✅ SUBSCRIBE / UNSUBSCRIBE
  onAllDrivers(cb) {
    this.allDriversListeners.add(cb);
    return () => this.allDriversListeners.delete(cb);
  }

  onDriverLocationUpdates(cb) {
    this.driverUpdateListeners.add(cb);
    return () => this.driverUpdateListeners.delete(cb);
  }

  disconnect() {
    console.log("[ADMIN SOCKET] Disconnecting");

    this.allDriversListeners.clear();
    this.driverUpdateListeners.clear();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.socket?.close();
    this.socket = null;
    this.connected = false;
  }
}

const socketService = new SocketService();
export default socketService;
