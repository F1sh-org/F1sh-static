import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-configuration',
  standalone: false,
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css',
})
export class ConfigurationComponent {
  websocketUrl: string;
  constructor() {
    // Check if websocketUrl exists in localStorage
    if (!localStorage.getItem('websocketUrl')) {
      // If it doesn't exist, set it using the environment value
      localStorage.setItem('websocketUrl', environment.websocketUrl);
    }
    this.websocketUrl = localStorage.getItem('websocketUrl') || environment.websocketUrl;
  }

  updateWebsocketUrl() {
    localStorage.setItem('websocketUrl', this.websocketUrl);
    window.location.reload();
  }
}
