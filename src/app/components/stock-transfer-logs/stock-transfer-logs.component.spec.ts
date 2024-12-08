import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferLogsComponent } from './stock-transfer-logs.component';

describe('StockTransferLogsComponent', () => {
  let component: StockTransferLogsComponent;
  let fixture: ComponentFixture<StockTransferLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockTransferLogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockTransferLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
