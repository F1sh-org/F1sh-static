/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private socket: WebSocket | null = null;
  msg: any;
  constructor() {}

  connect(): void {
    if (this.socket) {
      return; // Already connected
    }

    this.socket = new WebSocket(localStorage.getItem('websocketUrl') || environment.websocketUrl);
    this.socket.onopen = () => console.log('WebSocket connection opened');
    this.socket.onclose = () => console.log('WebSocket connection closed');
    this.socket.onerror = (error) => console.error('WebSocket error', error);
    this.socket.addEventListener('message', (event) => {
      this.msg = event.data;
    });
  }
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }
  getData(): any {
    return this.msg;
  }
  reqData(): void {
    const sent = {
      action: 'get',
    };
    this.sendMessage(sent);
  }
  ngOnDestroy() {
    this.disconnect();
  }
}
