import { PriorityLabelPipe } from './priority-label-pipe';

describe('PriorityLabelPipe', () => {
  const pipe = new PriorityLabelPipe();

  it('переводит приоритеты на русский', () => {
    expect(pipe.transform('low')).toBe('Низкий');
    expect(pipe.transform('normal')).toBe('Средний');
    expect(pipe.transform('high')).toBe('Высокий');
  });
});
