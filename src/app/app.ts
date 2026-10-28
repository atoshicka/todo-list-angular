import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme } from './theme';
import { Card } from './card/card';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet, Card],
})
export class App {
  title = 'Трекер задач';

  private themeService = inject(Theme);
  theme = this.themeService.theme;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}