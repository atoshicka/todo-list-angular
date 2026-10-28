import { Pipe, PipeTransform } from '@angular/core';
import type { Task } from './task';

@Pipe({
  name: 'priorityLabel',
})
export class PriorityLabelPipe implements PipeTransform {
  transform(value: Task['priority']): string {
    const labels = { low: 'Низкий', normal: 'Средний', high: 'Высокий' };
    return labels[value];
  }
}
