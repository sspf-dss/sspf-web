import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserAttributeComponent } from './update-user-attribute.component';

describe('UpdateUserAttributeComponent', () => {
  let component: UpdateUserAttributeComponent;
  let fixture: ComponentFixture<UpdateUserAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateUserAttributeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateUserAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
