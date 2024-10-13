import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPaymentHistoryPage } from './admin-payment-history.page';

describe('AdminPaymentHistoryPage', () => {
  let component: AdminPaymentHistoryPage;
  let fixture: ComponentFixture<AdminPaymentHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPaymentHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
