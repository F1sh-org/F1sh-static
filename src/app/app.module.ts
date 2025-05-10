import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamepadComponent } from './gamepad/gamepad.component';
import { WebsocketService } from './websocket.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ControllerComponent } from './controller/controller.component';
import { ConfigurationComponent } from './configuration/configuration.component';

@NgModule({
  declarations: [AppComponent, GamepadComponent, ControllerComponent, ConfigurationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [WebsocketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
