import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { DataProcessService } from '../data-process.service';

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

  constructor(private dataProcess: DataProcessService) {}

  ngOnInit(): void {
    this.checkGamepadSupport();
    window.addEventListener('gamepadconnected', this.onGamepadConnected.bind(this));
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected.bind(this));
    this.gamepadCheckInterval = setInterval(this.checkGamepadStatus.bind(this), 20);
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
          axes: Array.from(gamepad.axes).map(axis => this.dataProcess.map_range(axis, -1, 1, 0, 256)),
          buttons: Array.from(gamepad.buttons).map(button => ({
            pressed: button.pressed,
            value: button.value
          }))
        };
        this.dataProcess.processGamepadData(message);
      } else {
        this.isGamepadConnected = false;
      }
    }
  }
}