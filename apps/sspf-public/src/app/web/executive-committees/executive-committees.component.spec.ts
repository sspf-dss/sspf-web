import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveCommitteesComponent } from './executive-committees.component';

describe('ExecutiveCommitteesComponent', () => {
  let component: ExecutiveCommitteesComponent;
  let fixture: ComponentFixture<ExecutiveCommitteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutiveCommitteesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutiveCommitteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
