import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressLine } from './address-line';

describe('AddressLine', () => {
  let component: AddressLine;
  let fixture: ComponentFixture<AddressLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressLine],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressLine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
