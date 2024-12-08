import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExistingItemLocationComponent } from './add-existing-item-location.component';

describe('AddExistingItemLocationComponent', () => {
  let component: AddExistingItemLocationComponent;
  let fixture: ComponentFixture<AddExistingItemLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExistingItemLocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddExistingItemLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
