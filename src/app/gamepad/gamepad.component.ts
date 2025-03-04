import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-gamepad',
  standalone: false,
  templateUrl: './gamepad.component.html',
  styleUrls: ['./gamepad.component.css']
})
export class GamepadComponent implements OnInit, OnDestroy {
  private gamepadIndex: number | null = null;
  private gamepadCheckInterval: any;
  public isGamepadSupported: boolean = false;
  public isGamepadConnected: boolean = false;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.checkGamepadSupport();
    window.addEventListener('gamepadconnected', this.onGamepadConnected.bind(this));
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected.bind(this));
    this.gamepadCheckInterval = setInterval(this.checkGamepadStatus.bind(this), 100);
  }

  ngOnDestroy(): void {
    window.removeEventListener('gamepadconnected', this.onGamepadConnected.bind(this));
    window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected.bind(this));
    clearInterval(this.gamepadCheckInterval);
  }

  private checkGamepadSupport(): void {
    this.isGamepadSupported = !!navigator.getGamepads;
    if (!this.isGamepadSupported) {
      console.error('Gamepad API not supported in this browser.');
    }
  }

  private onGamepadConnected(event: GamepadEvent): void {
    this.gamepadIndex = event.gamepad.index;
    console.log('Gamepad connected:', event.gamepad);
  }

  private onGamepadDisconnected(event: GamepadEvent): void {
    if (this.gamepadIndex === event.gamepad.index) {
      this.gamepadIndex = null;
    }
    console.log('Gamepad disconnected:', event.gamepad);
  }

  private checkGamepadStatus(): void {
    if (this.gamepadIndex !== null) {
      const gamepad = navigator.getGamepads()[this.gamepadIndex];
      if (gamepad) {
        this.isGamepadConnected = true;
        const message = {
          axes: Array.from(gamepad.axes).map(axis => this.map_range(axis, -1, 1, 0, 256)),
          buttons: Array.from(gamepad.buttons).map(button => ({
            pressed: button.pressed,
            value: button.value
          }))
        };
        this.processGamepadData(message);
      } else {
        this.isGamepadConnected = false;
      }
    }
  }
  private map_range(value:number, low1:number, high1:number, low2:number, high2:number):number {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
  private processGamepadData(message: { 
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