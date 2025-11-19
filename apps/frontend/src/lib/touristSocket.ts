// src/lib/touristSocket.ts
import { io, Socket } from "socket.io-client";

interface TouristData {
  id: string;
  holderName: string;
  destination: string;
  status: 'active' | 'expiring' | 'expired';
  issueDate: string;
  validUntil: string;
  timestamp?: number;
}

class TouristSocketManager {
  private socket: Socket | null = null;
  private touristData: TouristData | null = null;
  private intervalId: any = null;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl, { transports: ["websocket", "polling"], reconnection: true });
    this.socket.on("connect", () => console.log("Connected to authority server:", this.socket?.id));
  }

  startSendingData(touristData: TouristData, intervalMs: number = 60000) {
    this.touristData = { ...touristData, timestamp: Date.now() };

    // Immediately send once
    this.socket?.emit("tourist-connected", this.touristData);

    // Send repeatedly every interval
    this.intervalId = setInterval(() => {
      if (this.touristData) {
        this.socket?.emit("tourist-connected", { ...this.touristData, timestamp: Date.now() });
      }
    }, intervalMs);
  }

  stopSendingData() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.touristData) {
      this.socket?.emit("tourist-disconnected", { id: this.touristData.id });
    }
    this.socket?.disconnect();
  }
}

// Singleton export
export const touristSocketManager = new TouristSocketManager("http://localhost:3000");
