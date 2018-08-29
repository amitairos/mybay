import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreatedDialogComponent } from './user-created-dialog.component';

describe('UserCreatedDialogComponent', () => {
  let component: UserCreatedDialogComponent;
  let fixture: ComponentFixture<UserCreatedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreatedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreatedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
