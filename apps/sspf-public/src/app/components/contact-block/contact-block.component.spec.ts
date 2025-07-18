import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactBlockComponent } from './contact-block.component';

describe('ContactBlockComponent', () => {
  let component: ContactBlockComponent;
  let fixture: ComponentFixture<ContactBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
