import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItem } from './task-item';
import { provideRouter } from '@angular/router';

describe('TaskItem', () => {
  let component: TaskItem;
  let fixture: ComponentFixture<TaskItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItem],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItem);
    fixture.componentRef.setInput('task', {
      id: 1,
      title: 'тест',
      done: false,
      priority: 'normal',
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('показывает название', () => {
    const link = fixture.nativeElement.querySelector('a') as HTMLElement;

    expect(link.textContent).toContain('тест');
  });

  it('эмитит removed с id задачи по клику на крестик', () => {
    const spy = vi.fn();
    component.removed.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button:last-of-type') as HTMLButtonElement;
    button.click();

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('эмитит toggle с id задачи по клику на чекбокс', () => {
    const spy = vi.fn();
    component.toggled.subscribe(spy);

    const button = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    button.click();

    expect(spy).toHaveBeenCalledWith(1);
  });
});
