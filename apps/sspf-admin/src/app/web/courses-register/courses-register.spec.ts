import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesRegister } from './courses-register';

describe('CoursesRegister', () => {
  let component: CoursesRegister;
  let fixture: ComponentFixture<CoursesRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
