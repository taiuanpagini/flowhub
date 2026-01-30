import * as signalR from '@microsoft/signalr';

const HUB_URL = import.meta.env.VITE_HUB_URL || 'http://localhost:5000/hubs/prowine';

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  async start() {
    if (this.connection) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onreconnecting(() => {
      console.log('SignalR: Reconnecting...');
      this.isConnected = false;
    });

    this.connection.onreconnected(() => {
      console.log('SignalR: Reconnected');
      this.isConnected = true;
    });

    this.connection.onclose(() => {
      console.log('SignalR: Connection closed');
      this.isConnected = false;
    });

    try {
      await this.connection.start();
      this.isConnected = true;
      console.log('SignalR: Connected successfully');
      
      // Registra todos os listeners existentes
      this.listeners.forEach((callback, eventName) => {
        this.connection.on(eventName, callback);
      });
    } catch (error) {
      console.error('SignalR: Connection failed', error);
      this.isConnected = false;
      throw error;
    }
  }

  async stop() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.isConnected = false;
      console.log('SignalR: Disconnected');
    }
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, callback);
    }
    
    if (this.connection) {
      this.connection.on(eventName, callback);
    }
  }

  off(eventName) {
    if (this.connection && this.listeners.has(eventName)) {
      this.connection.off(eventName);
      this.listeners.delete(eventName);
    }
  }

  async invoke(methodName, ...args) {
    if (!this.connection || !this.isConnected) {
      throw new Error('SignalR: Not connected');
    }
    return await this.connection.invoke(methodName, ...args);
  }

  async joinGroup(groupName) {
    return await this.invoke('JoinGroup', groupName);
  }

  async leaveGroup(groupName) {
    return await this.invoke('LeaveGroup', groupName);
  }
}

export const signalRService = new SignalRService();
export default signalRService;
