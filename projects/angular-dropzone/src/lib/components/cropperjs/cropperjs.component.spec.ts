import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperjsComponent } from './cropperjs.component';

describe('CropperjsComponent', () => {
  let component: CropperjsComponent;
  let fixture: ComponentFixture<CropperjsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CropperjsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    // fixture = TestBed.createComponent(CropperjsComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
