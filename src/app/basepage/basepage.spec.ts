import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Basepage } from './basepage';

describe('Basepage', () => {
  let component: Basepage;
  let fixture: ComponentFixture<Basepage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Basepage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Basepage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
