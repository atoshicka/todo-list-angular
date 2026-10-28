import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Autofocus } from '../autofocus';
import { Tasks } from '../tasks';
import { TaskItem } from '../task-item/task-item';
import type { Task } from '../task';
import { Stats } from '../stats/stats';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem, ReactiveFormsModule, Autofocus, Stats],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    priority: new FormControl('normal'),
  });

  tasksService = inject(Tasks);
  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(value => this.tasksService.search.set(value ?? ''));
  }

  submit() {
    if (this.form.invalid) return;
    this.tasksService.add(
      this.form.controls.title.value ?? '',
      (this.form.controls.priority.value ?? 'normal') as Task['priority'],
    );
    this.form.reset({ title: '', priority: 'normal' });
  }
}