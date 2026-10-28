import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TaskList } from './task-list';

const LIST_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5';
const POST_URL = 'https://jsonplaceholder.typicode.com/todos';

const SERVER_TODOS = [
  { userId: 1, id: 1, title: 'первая', completed: false },
  { userId: 1, id: 2, title: 'вторая', completed: true },
];

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    http.expectOne(LIST_URL).flush(SERVER_TODOS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('показывает загруженные задачи', () => {
    const items = fixture.nativeElement.querySelectorAll('app-task-item');

    expect(items.length).toBe(2);
  });

  it('кнопка добавления отключена, пока поле пустое', () => {
    const button = fixture.nativeElement.querySelector('.primary') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
  });

  it('добавляет задачу через форму', () => {
    component.form.controls.title.setValue('новая задача');
    component.form.controls.priority.setValue('high');
    component.submit();

    http
      .expectOne(POST_URL)
      .flush({ userId: 1, id: 201, title: 'новая задача', completed: false });

    const tasks = component.tasksService.tasks();
    expect(tasks.length).toBe(3);
    expect(tasks[2].title).toBe('новая задача');
    expect(tasks[2].priority).toBe('high');
  });

  it('очищает форму после добавления', () => {
    component.form.controls.title.setValue('новая задача');
    component.submit();

    expect(component.form.controls.title.value).toBe('');
    expect(component.form.controls.priority.value).toBe('normal');

    http.expectOne(POST_URL).flush({ userId: 1, id: 201, title: 'новая задача', completed: false });
  });

  it('не отправляет слишком короткое название', () => {
    component.form.controls.title.setValue('ab');
    component.submit();

    http.expectNone(POST_URL);
    expect(component.tasksService.tasks().length).toBe(2);
  });

  it('фильтр «Выполненные» показывает только выполненные', () => {
    component.tasksService.filter.set('done');
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('app-task-item');
    expect(items.length).toBe(1);
  });
});