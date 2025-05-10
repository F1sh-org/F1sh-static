import { isDevMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
  .then(() => {
    if ('serviceWorker' in navigator && !isDevMode()) {
      navigator.serviceWorker.register('ngsw-worker.js');
    }
  })
  .catch((err) => console.error(err));
