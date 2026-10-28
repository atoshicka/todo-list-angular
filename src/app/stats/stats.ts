import { Component, computed, inject } from '@angular/core';
import { Tasks } from '../tasks';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  tasksService = inject(Tasks);

  total = computed(() => this.tasksService.tasks().length);
  done = computed(() => this.tasksService.doneCount());
  percent = computed(() => {
    const total = this.total();
    return total === 0 ? 0 : Math.round((this.done() / total) * 100);
  });
}
