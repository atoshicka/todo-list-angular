import { Injectable, signal, computed, inject, effect } from '@angular/core';
import type { Task } from './task';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

type Filter = 'all' | 'active' | 'done';

interface ApiTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const STORAGE_KEY = 'tasks';

@Injectable({
  providedIn: 'root',
})
export class Tasks {
  tasks = signal<Task[]>([]);

  private http = inject(HttpClient);

  filter = signal<Filter>('all');
  priorityFilter = signal<Task['priority'] | 'all'>('all');
  search = signal('');

  loading = signal(false);
  loadError = signal(false);
  actionError = signal(false);

  constructor() {
    const saved = this.readSaved();
    if (saved) {
      this.tasks.set(saved);
    } else {
      this.load();
    }

    effect(() => {
      const value = JSON.stringify(this.tasks());
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {}
    });
  }

  private nextId(): number {
    const ids = this.tasks().map(task => task.id);
    return Math.max(0, ...ids) + 1;
  }

  private readSaved(): Task[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return null;

      return this.makeIdsUnique(data as Task[]);
    } catch {
      return null;
    }
  }

  private makeIdsUnique(list: Task[]): Task[] {
    const seen = new Set<number>();
    return list.map(task => {
      if (!seen.has(task.id)) {
        seen.add(task.id);
        return task;
      }
      const newId = Math.max(0, ...list.map(t => t.id), ...seen) + 1;
      seen.add(newId);
      return { ...task, id: newId };
    });
  }

  remove(id: number) {
    this.actionError.set(false);
    this.http.delete<void>(`${API_URL}/${id}`).subscribe({
      next: () => {
        this.tasks.update(list => list.filter(task => task.id !== id));
      },
      error: () => {
        this.actionError.set(true);
      },
    });
  }

  add(title: string, priority: Task['priority']) {
    this.actionError.set(false);
    const titleTrimmer = title.trim();
    if (titleTrimmer === '') return;

    this.http
      .post<ApiTodo>(API_URL, { title: titleTrimmer, completed: false, userId: 1 })
      .subscribe({
        next: todo => {
          this.tasks.update(list => [
            ...list,
            { id: this.nextId(), title: todo.title, done: todo.completed, priority },
          ]);
        },
        error: () => {
          this.actionError.set(true);
        },
      });
  }

  toggle(id: number) {
    this.actionError.set(false);
    const task = this.tasks().find(t => t.id === id);
    if (!task) return;

    this.http.patch<ApiTodo>(`${API_URL}/${id}`, { completed: !task.done }).subscribe({
      next: () => {
        this.tasks.update(list =>
          list.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
        );
      },
      error: () => {
        this.actionError.set(true);
      },
    });
  }

  rename(id: number, title: string) {
    this.actionError.set(false);

    this.http.patch<ApiTodo>(`${API_URL}/${id}`, { title }).subscribe({
      next: () => {
        this.tasks.update(list => list.map(t => (t.id === id ? { ...t, title } : t)));
      },
      error: () => {
        this.actionError.set(true);
      },
    });
  }

  load() {
    this.loading.set(true);
    this.loadError.set(false);

    this.http
      .get<ApiTodo[]>(`${API_URL}?_limit=5`)
      .pipe(
        map(todos =>
          todos.map(todo => ({
            id: todo.id,
            title: todo.title,
            done: todo.completed,
            priority: 'normal' as Task['priority'],
          })),
        ),
        catchError(() => {
          this.loadError.set(true);
          return of([] as Task[]);
        }),
      )
      .subscribe(tasks => {
        this.tasks.set(tasks);
        this.loading.set(false);
      });
  }

  remaining = computed(() => this.tasks().filter(task => !task.done).length);
  doneCount = computed(() => this.tasks().filter(task => task.done).length);

  clearDone() {
    const done = this.tasks().filter(task => task.done);
    done.forEach(task => this.remove(task.id));
  }

  visibleTasks = computed(() => {
    const currentFilter = this.filter();
    const currentPriority = this.priorityFilter();
    const currentSearch = this.search().toLowerCase().trim();
    const list = this.tasks();

    let byStatus = list;
    if (currentFilter === 'active') {
      byStatus = list.filter(task => !task.done);
    } else if (currentFilter === 'done') {
      byStatus = list.filter(task => task.done);
    }

    let byPriority = byStatus;
    if (currentPriority !== 'all') {
      byPriority = byStatus.filter(task => task.priority === currentPriority);
    }

    const found = byPriority.filter(task => task.title.toLowerCase().includes(currentSearch));

    return [...found].sort((a, b) => Number(a.done) - Number(b.done));
  });
}