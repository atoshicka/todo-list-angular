import { TestBed } from '@angular/core/testing';
import { Theme } from './theme';

describe('Theme', () => {
  let service: Theme;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(Theme);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('по умолчанию тема light', () => {
    expect(service.theme()).toBe('light');
  });

  it('переключается на dark', () => {
    service.toggleTheme();
    
    expect(service.theme()).toBe('dark');
  });

  it('после двух переключений снова light', () => {
    service.toggleTheme();
    service.toggleTheme();

    expect(service.theme()).toBe('light');
  });

  it('сохраняет тему в localStorage', () => {
    service.toggleTheme();
    TestBed.tick();

    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
