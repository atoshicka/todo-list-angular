export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: 'low' | 'normal' | 'high';
}