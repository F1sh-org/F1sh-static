/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

export interface messageData {
  gamepadIndex: number;
  axes: number[];
  buttons: {
    pressed: boolean;
    value: number;
  }[];
}
export interface gamepadData {
  action: string;
  data: gamepadObject[];
}

export interface gamepadObject {
  axes: number[];
  buttons: number[];
}

export interface messageDataAction {
  action: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataProcessService {
  private intervalId: any;
  constructor(private websocketService: WebsocketService) {}
  disconnectMessage(): void {
    const sent: messageDataAction = {
      action: 'gamepadDisconnected',
    };
    this.websocketService.sendMessage(sent);
  }
  connect() {
    this.websocketService.connect();
    this.intervalId = setInterval(() => this.updateData(), 100);
  }

  disconnect() {
    this.websocketService.disconnect();
    clearInterval(this.intervalId);
  }
  sendGamepadData(message: messageData): void {
    // Filter out very small movements to prevent drift
    const deadzone = 0.008;
    message.axes = message.axes.map((value) => (Math.abs(value) < deadzone ? 0 : value));
    const sent: gamepadData = {
      action: 'gamepad',
      data: [
        {
          axes: message.axes,
          buttons: message.buttons.map((button) => button.value),
        },
      ],
    };
    //console.log('Gamepad data sent:', sent);
    this.websocketService.sendMessage(sent);
  }
  updateData(): void {
    if (this.websocketService.isConnected()) {
      this.websocketService.reqData();
      const msg = this.websocketService.getData();
      //console.log('Data from server:', msg);
    }
  }
}
