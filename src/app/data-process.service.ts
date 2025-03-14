import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

export interface messageData {
  gamepadIndex: number;
  axes: number[];
  buttons: {
    pressed: boolean;
    value: number;
  }[];
};
export interface gamepadData {
  action: string;
  gamepad: gamepadObject[];
}

export interface gamepadObject {
  axes: number[];
  buttons: number[];
}

export interface messageDataAction  {
  action: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataProcessService {
  private intervalId: any;
  constructor(private websocketService: WebsocketService) {
  this.intervalId = setInterval(() => this.updateData(),100);
  }
  disconnectMessage(): void { 
    const sent: messageDataAction = {
      action: "gamepadDisconnected",
    }
    this.websocketService.sendMessage(sent); 
  }
  sendGamepadData(message: messageData): void {
    // Filter out very small movements to prevent drift
    const deadzone = 0.005;
    message.axes = message.axes.map(value => 
      Math.abs(value) < deadzone ? 0 : value
    );
    const sent: gamepadData = {
      action: "gamepad",
      gamepad: [{
        axes: message.axes,
        buttons: message.buttons.map(button => button.value)
      }]
    }
    console.log('Gamepad data sent:', sent);
    this.websocketService.sendMessage(sent);
  }
  updateData(): void {
    this.websocketService.reqData();
    const msg = this.websocketService.getData();
    console.log('Data from server:', msg);
  }
}
