import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Stats } from './stats';

const LIST_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5';

describe('Stats', () => {
  let fixture: ComponentFixture<Stats>;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Stats],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Stats);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('считает всего, выполненные и процент', () => {
    http.expectOne(LIST_URL).flush([
      { userId: 1, id: 1, title: 'первая', completed: false },
      { userId: 1, id: 2, title: 'вторая', completed: true },
    ]);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.total()).toBe(2);
    expect(component.done()).toBe(1);
    expect(component.percent()).toBe(50);

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Всего: 2');
    expect(text).toContain('Выполнено: 1 (50%)');
  });

  it('при пустом списке процент равен 0', () => {
    http.expectOne(LIST_URL).flush([]);
    fixture.detectChanges();

    expect(fixture.componentInstance.percent()).toBe(0);
  });
});