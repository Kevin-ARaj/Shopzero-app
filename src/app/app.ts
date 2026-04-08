import { Component, signal } from '@angular/core';
import { Basepage } from './basepage/basepage';

@Component({
  selector: 'app-root',
  imports: [Basepage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Shopzero');
}
