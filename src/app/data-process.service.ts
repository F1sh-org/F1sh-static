import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

export interface messageData  {
  action: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  s1: string;
  s2: string;
  s3: string;
  s4: string;
  s5: string;
  s6: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataProcessService {
  constructor(private websocketService: WebsocketService) { }
  map_range(value:number, low1:number, high1:number, low2:number, high2:number):number {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
  processGamepadData(message: { 
    axes: number[]; 
    buttons: { pressed: boolean; value: number; }[] 
  }): void {
    // Filter out very small movements to prevent drift
    const deadzone = 2;
    message.axes = message.axes.map(value => 
      Math.abs(value - 128) < deadzone ? 128 : value
    );
    console.log('Processed gamepad data:', message);
    // Todo: Convert gamepad axes to motor speeds and send them to the server
    this.websocketService.sendMessage(message);
  }
}
