import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriorityLabelPipe } from '../priority-label-pipe';
import { Task } from '../task';

@Component({
  selector: 'app-task-item',
  imports: [RouterLink, PriorityLabelPipe],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItem {
  task = input.required<Task>();

  toggled = output<number>();
  removed = output<number>();
  renamed = output<{id: number; title: string}>();

  editing = signal(false);

  onToggle() {
    this.toggled.emit(this.task().id);
  }

  onRemove() {
    this.removed.emit(this.task().id);
  }

  saveTitle(value: string) {
    const trimmerValue = value.trim();
    if (trimmerValue !== '' && trimmerValue !== this.task().title) {
      this.renamed.emit({ id: this.task().id, title: trimmerValue });
    }
    this.editing.set(false);
  }
}