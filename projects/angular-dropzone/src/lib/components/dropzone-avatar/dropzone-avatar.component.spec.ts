import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { interval, map, take } from 'rxjs';
import { AngularDropzoneAPI } from '../../models/file.model';
import { AngularDropzoneService } from '../../services/angular-dropzone.service';

import { DropzoneAvatarComponent } from './dropzone-avatar.component';

describe('DropzoneAvatarComponent', () => {
  let component: DropzoneAvatarComponent;
  let fixture: ComponentFixture<DropzoneAvatarComponent>;
  let uploadService = MockProvider<AngularDropzoneService>(AngularDropzoneService, {
    uploadMedia:
      (file: File, uploadAPI: AngularDropzoneAPI) => interval(1).pipe(
        take(21),
        map((id) => id === 20 ? ({ type: 4, loaded: 100 }) : ({ type: 1, loaded: id * 5 })),
      )
  })
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropzoneAvatarComponent],
      providers: [uploadService]
    })
      .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropzoneAvatarComponent);
    component = fixture.componentInstance;
    component.uploadAPI = new AngularDropzoneAPI('localhost', 'POST');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
