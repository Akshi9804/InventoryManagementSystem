import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExistingItemComponent } from './add-existing-item.component';

describe('AddExistingItemComponent', () => {
  let component: AddExistingItemComponent;
  let fixture: ComponentFixture<AddExistingItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExistingItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddExistingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
