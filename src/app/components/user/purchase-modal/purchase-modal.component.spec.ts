import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseModalComponent } from './purchase-modal.component';

describe('PurchaseModalComponent', () => {
  let component: PurchaseModalComponent;
  let fixture: ComponentFixture<PurchaseModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseModalComponent]
    });
    fixture = TestBed.createComponent(PurchaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
