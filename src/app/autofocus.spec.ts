import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Autofocus } from './autofocus';

@Component({
  imports: [Autofocus],
  template: `<input appAutofocus />`,
})
class HostComponent {}

describe('Autofocus', () => {
  it('ставит фокус на элемент', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    document.body.appendChild(fixture.nativeElement);

    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);

    fixture.nativeElement.remove();
  });
});