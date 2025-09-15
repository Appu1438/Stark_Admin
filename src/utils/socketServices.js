class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;

    this.onAllDriversCallback = null;
    this.onDriverUpdatesCallback = null;
  }

  connectAsAdmin() {
    if (this.socket) return;

    this.socket = new WebSocket(process.env.REACT_APP_SOCKET_URL);

    this.socket.onopen = () => {
      console.log("✅ Admin socket connected");
      this.connected = true;

      // identify as admin
      this.socket?.send(JSON.stringify({ role: "admin" }));
    };

    this.socket.onclose = () => {
      this.connected = false;
      setTimeout(() => this.connectAsAdmin(), 3000);
    };

    this.socket.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data);
        if (message.type === "allDrivers" && this.onAllDriversCallback) {
          this.onAllDriversCallback(message.drivers);
        }
        if (message.type === "driverLocationUpdate" && this.onDriverUpdatesCallback) {
          this.onDriverUpdatesCallback(message.drivers);
        }
      } catch (err) {
        console.error("Admin socket parse failed", err);
      }
    };
  }

  onAllDrivers(callback) {
    this.onAllDriversCallback = callback;
  }

  onDriverLocationUpdates(callback) {
    this.onDriverUpdatesCallback = callback;
  }

  clearListeners() {
    this.onAllDriversCallback = null;
    this.onDriverUpdatesCallback = null;
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

const socketService = new SocketService();
export default socketService;
