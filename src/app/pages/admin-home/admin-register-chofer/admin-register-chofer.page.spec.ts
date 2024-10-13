import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRegisterChoferPage } from './admin-register-chofer.page';

describe('AdminRegisterChoferPage', () => {
  let component: AdminRegisterChoferPage;
  let fixture: ComponentFixture<AdminRegisterChoferPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRegisterChoferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
