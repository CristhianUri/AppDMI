import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrivesHomePage } from './drives-home.page';

describe('DrivesHomePage', () => {
  let component: DrivesHomePage;
  let fixture: ComponentFixture<DrivesHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivesHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
