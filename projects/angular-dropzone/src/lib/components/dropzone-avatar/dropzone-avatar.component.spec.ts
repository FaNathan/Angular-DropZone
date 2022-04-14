import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropzoneAvatarComponent } from './dropzone-avatar.component';

describe('DropzoneAvatarComponent', () => {
  let component: DropzoneAvatarComponent;
  let fixture: ComponentFixture<DropzoneAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropzoneAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropzoneAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
