import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDrawerComponent } from './address-drawer.component';

describe('AddressDrawerComponent', () => {
  let component: AddressDrawerComponent;
  let fixture: ComponentFixture<AddressDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
