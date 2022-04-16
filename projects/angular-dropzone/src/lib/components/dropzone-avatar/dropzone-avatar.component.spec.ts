import { ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { filter, interval, map, take, takeWhile, tap } from 'rxjs';
import { AngularDropzoneAPI } from '../../models/file.model';
import { AngularDropzoneService } from '../../services/angular-dropzone.service';
import { based64Image, dumpFiles_6 } from '../../models/dumpData';
import { DropzoneAvatarComponent } from './dropzone-avatar.component';
import { CropperjsComponent } from '../cropperjs/cropperjs.component';
import { Buffer } from 'buffer';
import { By } from '@angular/platform-browser';

describe('DropzoneAvatarComponent', () => {
  let component: DropzoneAvatarComponent;
  let fixture: ComponentFixture<DropzoneAvatarComponent>;
  let dumpFiles: Readonly<FileList>;
  let uploadService = MockProvider<AngularDropzoneService>(AngularDropzoneService, {
    uploadMedia:
      (file: File, uploadAPI: AngularDropzoneAPI) => interval(1).pipe(
        take(21),
        map((id) => id === 20 ? ({ type: 4, loaded: 100 }) : ({ type: 1, loaded: id * 5 })),
      )
  })
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropzoneAvatarComponent, CropperjsComponent],
      providers: [uploadService]
    })
      .compileComponents();
    dumpFiles = dumpFiles_6;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropzoneAvatarComponent);
    component = fixture.componentInstance;
    component.uploadAPI = new AngularDropzoneAPI('localhost', 'POST');
    fixture.detectChanges();
  });
  function zero_file() {
    expect(component).toBeTruthy();
    expect(component.files.length).toBe(0);
  }
  function dataUrlToFile(dataUrl: string, filename: string): File | undefined {
    const arr = dataUrl.split(',');
    if (arr.length < 2) { return undefined; }
    const mimeArr = arr[0].match(/:(.*?);/);
    if (!mimeArr || mimeArr.length < 2) { return undefined; }
    const mime = mimeArr[1];
    const buff = Buffer.from(arr[1], 'base64');
    return new File([buff], filename, { type: mime });
  }
  function one_file() {

    const file = dataUrlToFile(based64Image, dumpFiles[0].name);

    component.onBrowseFiles({ target: { files: { length: 1, 0: file } } } as unknown as Event);
  }
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to edit mode on valid file', () => {
    one_file();
    component.cdRef.detectChanges();
    expect(component.avatarEditMode).toBe(true);
    expect(fixture).toMatchSnapshot();

  })
  it(`shouldn't go to edit mode on invalid file name`, () => {
    component.allowedFormats = ["PNG"];
    component.ngOnInit();
    component.onBrowseFiles({ target: { files: { length: 1, 0: { ...dumpFiles[3], name: 'abc.wrongType' } } } } as unknown as Event);
    component.cdRef.detectChanges();
    expect(component.avatarEditMode).toBe(false);
    expect(fixture).toMatchSnapshot();
  })
  it(`shouldn't go to edit mode on valid file Mime type`, () => {
    component.onBrowseFiles({ target: { files: { length: 1, 0: { ...dumpFiles[3], type: 'wrongMimeType' } } } } as unknown as Event);
    component.cdRef.detectChanges();
    expect(component.avatarEditMode).toBe(false);

    expect(fixture).toMatchSnapshot();
  })
  it(`should back to first state on cancel edit`, () => {
    one_file();
    component.cdRef.detectChanges();

    expect(fixture.debugElement.query(By.css('.cancel-file')).nativeElement).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.success-file')).nativeElement).toBeTruthy();
    fixture.debugElement.query(By.css('.cancel-file')).nativeElement.dispatchEvent(new Event('click'));
    expect(component.avatarEditMode).toBe(false);
    expect(component.files.length).toBe(0);
    expect(fixture).toMatchSnapshot();
  })
  it(`should not be able to add file on editmode`, () => {
    one_file();
    component.cdRef.detectChanges();
    one_file();
    component.cdRef.detectChanges();
    one_file();
    component.cdRef.detectChanges();
    expect(component.files.length).toBe(1);
    expect(fixture).toMatchSnapshot();
  })
  it(`should upload after a sccuess crop`, fakeAsync(() => {
    const componentSpy =  jest.spyOn(component,'upload');
    one_file();
    component.cdRef.detectChanges();
    // click on success svg ? 
    component.onAvatarCropped(dataUrlToFile(based64Image, dumpFiles[0].name)!);
    expect(component.files.length).toBe(1);
    tick(800);
    expect(componentSpy).toBeCalledTimes(1);
    expect(fixture).toMatchSnapshot();
  }))

});
