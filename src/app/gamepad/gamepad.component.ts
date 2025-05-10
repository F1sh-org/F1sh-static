/* eslint-disable @angular-eslint/prefer-standalone */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataProcessService } from '../data-process.service';

interface GamepadState {
  index: number;
  isConnected: boolean;
}

@Component({
  selector: 'app-gamepad',
  standalone: false,
  templateUrl: './gamepad.component.html',
  styleUrls: ['./gamepad.component.css'],
})
export class GamepadComponent implements OnInit, OnDestroy {
  private gamepadStates = new Map<number, GamepadState>();
  private gamepadCheckInterval: any;
  public isGamepadSupported = false;
  public connectedGamepads: GamepadState[] = [];
  public isActive = false;

  constructor(private dataProcess: DataProcessService) {}

  ngOnInit(): void {
    this.checkGamepadSupport();
    window.addEventListener('gamepadconnected', this.onGamepadConnected.bind(this));
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('gamepadconnected', this.onGamepadConnected.bind(this));
    window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected.bind(this));
    clearInterval(this.gamepadCheckInterval);
  }

  public toggleGamepadCheck(): void {
    if (this.isActive) {
      this.stopGamepadCheck();
    } else {
      this.startGamepadCheck();
    }
    this.isActive = !this.isActive;
  }

  private startGamepadCheck(): void {
    if (!this.gamepadCheckInterval) {
      this.gamepadCheckInterval = setInterval(this.checkGamepadStatus.bind(this), 30);
    }
  }

  private stopGamepadCheck(): void {
    if (this.gamepadCheckInterval) {
      clearInterval(this.gamepadCheckInterval);
      this.gamepadCheckInterval = null;
    }
  }

  private checkGamepadSupport(): void {
    this.isGamepadSupported = !!navigator.getGamepads;
    if (!this.isGamepadSupported) {
      console.error('Gamepad API not supported in this browser.');
    }
  }

  private onGamepadConnected(event: GamepadEvent): void {
    const state: GamepadState = {
      index: event.gamepad.index,
      isConnected: true,
    };
    this.gamepadStates.set(event.gamepad.index, state);
    this.updateConnectedGamepads();
    console.log('Gamepad connected:', event.gamepad);
  }

  private onGamepadDisconnected(event: GamepadEvent): void {
    this.gamepadStates.delete(event.gamepad.index);
    this.updateConnectedGamepads();
    console.log('Gamepad disconnected:', event.gamepad);
    this.dataProcess.disconnectMessage();
  }

  private updateConnectedGamepads(): void {
    this.connectedGamepads = Array.from(this.gamepadStates.values());
  }

  private checkGamepadStatus(): void {
    const gamepads = navigator.getGamepads();

    for (const state of this.gamepadStates.values()) {
      const gamepad = gamepads[state.index];
      if (gamepad) {
        state.isConnected = true;
        const message = {
          gamepadIndex: gamepad.index,
          axes: Array.from(gamepad.axes).map((axis) => axis),
          buttons: Array.from(gamepad.buttons).map((button) => ({
            pressed: button.pressed,
            value: button.value,
          })),
        };
        this.dataProcess.sendGamepadData(message);
      } else {
        state.isConnected = false;
      }
    }
    this.updateConnectedGamepads();
  }

  public get hasConnectedGamepads(): boolean {
    return this.connectedGamepads.length > 0;
  }
}
