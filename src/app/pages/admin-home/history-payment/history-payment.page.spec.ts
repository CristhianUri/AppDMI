import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryPaymentPage } from './history-payment.page';

describe('HistoryPaymentPage', () => {
  let component: HistoryPaymentPage;
  let fixture: ComponentFixture<HistoryPaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
