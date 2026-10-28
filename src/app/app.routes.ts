import { Routes } from '@angular/router';
import { TaskList } from './task-list/task-list';
import { taskIdGuard } from './task-id.guard';

export const routes: Routes = [
  { path: '', component: TaskList },
  {
    path: 'task/:id',
    loadComponent: () => import('./task-detail/task-detail').then(m => m.TaskDetail),
    canActivate: [taskIdGuard],
  },
];