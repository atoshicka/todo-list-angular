import { Component, computed, inject, input } from '@angular/core';
import { Tasks } from '../tasks';
import { RouterLink } from '@angular/router';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-detail',
  imports: [RouterLink],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail {
  id = input.required<string>();
  tasksService = inject(Tasks);

  seconds = toSignal(interval(1000), { initialValue: 0 });

  priorityLabels = {
    low: 'Низкий',
    normal: 'Средний',
    high: 'Высокий',
  };

  task = computed(() => 
    this.tasksService.tasks().find(task => String(task.id) === this.id())
  );
}
