import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Intstructors } from './intstructors';

describe('Intstructors', () => {
  let component: Intstructors;
  let fixture: ComponentFixture<Intstructors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Intstructors],
    }).compileComponents();

    fixture = TestBed.createComponent(Intstructors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
