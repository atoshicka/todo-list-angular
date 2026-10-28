import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Tasks } from './tasks';

const LIST_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5';
const ITEM_URL = 'https://jsonplaceholder.typicode.com/todos/1';

const SERVER_TODOS = [
  { userId: 1, id: 1, title: 'первая', completed: false },
  { userId: 1, id: 2, title: 'вторая', completed: true },
];

describe('Tasks', () => {
  let service: Tasks;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Tasks);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('загружает задачи', () => {
    http.expectOne(LIST_URL).flush(SERVER_TODOS);

    expect(service.tasks().length).toBe(2);
    expect(service.loading()).toBe(false);
  });

  it('показывает ошибку, если сервер упал', () => {
    http.expectOne(LIST_URL).flush(null, { status: 500, statusText: 'Server Error' });

    expect(service.loadError()).toBe(true);
    expect(service.tasks().length).toBe(0);
  });

  it('удаляет задачу', () => {
    http.expectOne(LIST_URL).flush(SERVER_TODOS);

    service.remove(1);
    http.expectOne(ITEM_URL).flush(null);

    expect(service.tasks().length).toBe(1);
  });

  it('переключает задачу', () => {
    http.expectOne(LIST_URL).flush(SERVER_TODOS);

    service.toggle(1);
    http.expectOne(ITEM_URL).flush({});

    expect(service.tasks()[0].done).toBe(true);
  });

  it('добавляет задачу', () => {
    http.expectOne(LIST_URL).flush(SERVER_TODOS);

    service.add('новая задача', 'high');
    http
      .expectOne('https://jsonplaceholder.typicode.com/todos')
      .flush({ userId: 1, id: 201, title: 'новая задача', completed: false });

    expect(service.tasks().length).toBe(3);
    expect(service.tasks()[2].priority).toBe('high');
  });

  it('не добавляет задачу, если сервер упал', () => {
    http.expectOne(LIST_URL).flush(SERVER_TODOS);

    service.add('новая задача', 'high');

    http
      .expectOne('https://jsonplaceholder.typicode.com/todos')
      .flush(null, { status: 500, statusText: 'Server Error' });

    expect(service.actionError()).toBe(true);
    expect(service.tasks().length).toBe(SERVER_TODOS.length);
  });

  it('не удаляет задачу, если сервер упал', () => {
    http.expectOne(LIST_URL).flush(SERVER_TODOS);

    service.remove(1);

    http
      .expectOne(ITEM_URL)
      .flush(null, { status: 500, statusText: 'Server Error' });

    expect(service.actionError()).toBe(true);
    expect(service.tasks().length).toBe(SERVER_TODOS.length);
    expect(service.tasks().some(task => task.id === 1)).toBe(true);
  });

  it('сбрасывает ошибку действия при новой попытке', () => {
    http.expectOne(LIST_URL).flush(SERVER_TODOS);

    service.remove(1);

    http
      .expectOne(ITEM_URL)
      .flush(null, { status: 500, statusText: 'Server Error' });

    expect(service.actionError()).toBe(true);

    service.remove(1);
    expect(service.actionError()).toBe(false);

    http.expectOne(ITEM_URL).flush(null);
  });

  it('переименовывает задачу', () => {
    http.expectOne(LIST_URL).flush(SERVER_TODOS);

    service.rename(1, 'новое');
    http.expectOne(ITEM_URL).flush({});

    expect(service.tasks()[0].title).toBe('новое');
  });

  it('очищает выполненные задачи', () => {
    http.expectOne(LIST_URL).flush(SERVER_TODOS);

    service.clearDone();
    http.expectOne('https://jsonplaceholder.typicode.com/todos/2').flush(null);

    expect(service.tasks().length).toBe(1);
    expect(service.tasks()[0].id).toBe(1);
  });
});