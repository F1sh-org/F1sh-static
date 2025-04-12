import { Component } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { DataProcessService } from '../data-process.service';
@Component({
  selector: 'app-controller',
  standalone: false,
  templateUrl: './controller.component.html',
  styleUrl: './controller.component.css'
})
export class ControllerComponent {
  constructor(private dpSrv: DataProcessService, private ws: WebsocketService) {}
  connect() {
    this.dpSrv.connect();
  }

  disconnect() {
    this.dpSrv.disconnect();
  }

  connStatus() {
    return this.ws.isConnected();
  }
}
