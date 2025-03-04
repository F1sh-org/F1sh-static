import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket('ws://192.168.4.1/ws');
    this.socket.onopen = () => console.log('WebSocket connection opened');
    this.socket.onclose = () => console.log('WebSocket connection closed');
    this.socket.onerror = (error) => console.error('WebSocket error', error);
  }

  sendMessage(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }
}