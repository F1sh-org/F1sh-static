import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { DataProcessService } from './data-process.service';
@Injectable({
  providedIn: 'root'
})
export class ProgCompilerService {
  constructor(private ws:WebsocketService, dp:DataProcessService) { 
    
  }
}
