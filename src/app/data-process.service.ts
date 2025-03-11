import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

export interface messageDataMotor  {
  action: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
}

export interface messageDataServo  {
  action: string;
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
  private intervalId: any;
  constructor(private websocketService: WebsocketService) {
  this.intervalId = setInterval(() => this.updateData(),20);
  }
  map_range(value:number, low1:number, high1:number, low2:number, high2:number):number {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
  disconnectMotor(): void { 
    // stop the robot
    const sent: messageDataMotor = {
      action: "motor",
      c1: "0",
      c2: "0",
      c3: "0",
      c4: "0"
    }
    this.websocketService.sendMessage(sent); 
  }
  processGamepadData(message: { 
    axes: number[]; 
    buttons: { pressed: boolean; value: number; }[] 
  }): void {
    // Filter out very small movements to prevent drift
    const deadzone = 2;
    const speed = 4095;
    message.axes = message.axes.map(value => 
      Math.abs(value - 128) < deadzone ? 128 : value
    );
    console.log('Processed gamepad data:', message);
    // Implement your own logic here
    var nJoyX:number = message.axes[0]; // read x-joystick
    var nJoyY:number = message.axes[1]; // read y-joystick
    var nMotMixL:number; // Motor (left) mixed output
    var nMotMixR:number; // Motor (right) mixed output
    var temp:boolean = (nJoyY * nJoyX > 0);
    if (nJoyX) // Turning
    {
      nMotMixL = -nJoyX + (nJoyY * (temp ? 0 : 1));
      nMotMixR = nJoyX + (nJoyY * (!temp ? 0 : 1));
    } else // Forward or Reverse
    {
      nMotMixL = nJoyY;
      nMotMixR = nJoyY;
    }
    var c1:number = 0;
    var c2:number = 0;
    var c3:number = 0;
    var c4:number = 0;
    if (nMotMixR > 0)
      {
        c3 = nMotMixR;
        c3 = this.map_range(c3, 0, 128, 0, speed);
      }
    
      else if (nMotMixR < 0)
      {
        c4 = Math.abs(nMotMixR);
        c4 = this.map_range(c4, 0, 128, 0, speed);
      }
    
      if (nMotMixL > 0)
      {
        c1 = nMotMixL;
        c1 = this.map_range(c1, 0, 128, 0, speed);
      }
      else if (nMotMixL < 0)
      {
        c2 = Math.abs(nMotMixL);
        c2 = this.map_range(c2, 0, 128, 0, speed);
      }
    // this will be sent to the robot
    const sent: messageDataMotor = {
      action: "motor",
      c1: c1.toString(),
      c2: c2.toString(),
      c3: c3.toString(),
      c4: c4.toString()
    }
    this.websocketService.sendMessage(sent); 
  }
  updateData(): void {
    this.websocketService.reqData();
    const msg = this.websocketService.getData();
    console.log('Data from server:', msg);
  }
}
