

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { take, tap, map, interval, throwError, of } from 'rxjs';

import { MockBuilder, MockInstance, MockProvider, MockReset, MockService } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { DropzoneAdvancedComponent } from './dropzone-advanced.component';
import { FileStatus, defaultConcurrentUploadLimit } from '../../models/constants';
import { dumpFiles_6 } from '../../models/dumpData';
import { AngularDropzoneAPI } from '../../models/file.model';
import { ConvertSizeUnitPipe } from '../../pipes/convert-size-unit.pipe';
import { AngularDropzoneService } from '../../services/angular-dropzone.service';

/*
  On HTTP Error => keep the file in list
  On Validation Error => decide based on keepInvalidFiles
  On Max File Count Error => ditto
*/
describe('AngularDropzoneAdvancedComponent', () => {
  let component: DropzoneAdvancedComponent;
  let fixture: ComponentFixture<DropzoneAdvancedComponent>;
  let dumpFiles: Readonly<FileList>;
  let uploadService = MockProvider<AngularDropzoneService>(AngularDropzoneService, {
    uploadMedia:
      (file: File, uploadAPI: AngularDropzoneAPI) => interval(1).pipe(
        take(21),
        map((id) => id === 20 ? ({ type: 4, loaded: 100 }) : ({ type: 1, loaded: id * 5 })),
      )
  })

  function zero_file() {
    expect(component).toBeTruthy();
    expect(component.files.length).toBe(0);
  }
  function one_file() {
    component.onBrowseFiles({ target: { files: { length: 1, 0: dumpFiles[0] } } } as unknown as Event);
  }
  function many_files() {
    component.onBrowseFiles({ target: { files: dumpFiles } } as unknown as Event);
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropzoneAdvancedComponent, ConvertSizeUnitPipe],
      providers: [uploadService]
    }).compileComponents();
    fixture = TestBed.createComponent(DropzoneAdvancedComponent);
    component = fixture.componentInstance;
    component.uploadAPI = new AngularDropzoneAPI('localhost', 'POST');
    window.HTMLElement.prototype.scrollIntoView = () => { };
    dumpFiles = dumpFiles_6;
    fixture.detectChanges();
  });
  describe(`All files' status should be Completed on successful upload`, () => {
    test('zero file', () => {
      zero_file();
      expect(component.files.length).toBe(0);
      expect(fixture).toMatchSnapshot()
    })

    test('one file', () => {
      one_file();
      expect(component.files.length).toBe(1);
      expect(component.files[0].status).toBe(FileStatus.Uploading);
      expect(fixture).toMatchSnapshot()
    })
    test('one file finished', fakeAsync(() => {
      one_file();
      expect(component.files.length).toBe(1);
      tick(21);
      expect(component.files[0].status).toBe(FileStatus.Completed);
      expect(fixture).toMatchSnapshot()
    }))

    test('many files', fakeAsync(() => {
      many_files();
      expect(component.files.length).toBe(6);
      tick(6 * 21);
      expect(component.files.filter(f => f.status === FileStatus.Completed).length).toBe(6);
      expect(fixture).toMatchSnapshot()
    }))

  });
  describe(`All files' status should be Canceled on Error`, () => {
    beforeAll(() => {
      MockInstance.remember();
      MockInstance(AngularDropzoneService, (instance, injector) => {
        instance.uploadMedia = (file: File, uploadAPI: AngularDropzoneAPI) => throwError(() => new Error('oh'));
      })
    });

    test('zero file', () => {
      zero_file();
      expect(component.files.length).toBe(0);
      expect(fixture).toMatchSnapshot()
    })

    test('one file', fakeAsync(() => {
      one_file();
      tick(21);
      expect(component.files.length).toBe(1);
      expect(component.files[0].status).toBe(FileStatus.Canceled);
      expect(fixture).toMatchSnapshot()
    }))
    test('many files', fakeAsync(() => {
      many_files();
      expect(component.files.length).toBe(6);
      tick(6 * 21);
      expect(component.files.filter(f => f.status === FileStatus.Canceled).length).toBe(dumpFiles.length)
      expect(fixture).toMatchSnapshot()
    }))
    afterAll(MockInstance.restore)
  }
  )
  describe(`resume upload`, () => {
    test('one file', fakeAsync(() => {
      one_file();
      tick(10);
      expect(component.files.length).toBe(1);
      fixture.debugElement.query(By.css('.active-cancel')).nativeElement.click();
      expect(component.files[0].status).toBe(FileStatus.Canceled);
      tick(5);
      expect(component.concurrentUploadLimit).toBe(defaultConcurrentUploadLimit);
      fixture.debugElement.query(By.css('.active-restart')).nativeElement.click();
      expect(component.files[0].status).toBe(FileStatus.Uploading);
      expect(component.concurrentUploadLimit).toBe(defaultConcurrentUploadLimit - 1);
      tick(21);
      expect(component.files[0].status).toBe(FileStatus.Completed);
      expect(component.concurrentUploadLimit).toBe(defaultConcurrentUploadLimit);
      expect(fixture).toMatchSnapshot();
    }))
  }
  )
  describe(`cancel upload`, () => {
    test('one file', fakeAsync(() => {
      one_file();
      tick(10);
      expect(component.files.length).toBe(1);
      fixture.debugElement.query(By.css('.active-cancel')).nativeElement.click();
      expect(component.files[0].status).toBe(FileStatus.Canceled);
      tick(11);
      expect(component.concurrentUploadLimit).toBe(defaultConcurrentUploadLimit);
      expect(fixture).toMatchSnapshot();
    }))
    test('many files', fakeAsync(() => {
      many_files();
      expect(component.files.length).toBe(6);
      tick(10);
      expect(component.files.filter(f => f.status === FileStatus.Uploading).length).toBe(defaultConcurrentUploadLimit);
      component.onCancel(2);
      tick(5);
      component.onCancel(1);
      tick(6 * 21);
      expect(component.files.filter(f => f.status === FileStatus.Canceled).length).toBe(2);
      expect(component.files.filter(f => f.status === FileStatus.Completed).length).toBe(4);
      expect(fixture).toMatchSnapshot()
    }))
  }
  )
  describe(`upload more than max concurrent file`, () => {
    test('6 files', fakeAsync(() => {
      many_files();
      tick(10);
      expect(component.files.filter(f => f.status === FileStatus.Pending).length).toBe(1);
      expect(component.files.filter(f => f.status === FileStatus.Uploading).length).toBe(5);
      tick(11);
      expect(component.files.filter(f => f.status === FileStatus.Pending).length).toBe(0);
      expect(component.files.filter(f => f.status === FileStatus.Uploading).length).toBe(1);
      expect(component.files.filter(f => f.status === FileStatus.Completed).length).toBe(5);
      expect(component.concurrentUploadLimit).toBe(defaultConcurrentUploadLimit - 1)
        ;
      tick(21);
      expect(component.files.filter(f => f.status === FileStatus.Pending).length).toBe(0);
      expect(component.files.filter(f => f.status === FileStatus.Uploading).length).toBe(0);
      expect(component.files.filter(f => f.status === FileStatus.Completed).length).toBe(6);
      expect(component.concurrentUploadLimit).toBe(defaultConcurrentUploadLimit)
      expect(fixture).toMatchSnapshot();
    }))
  }
  )
  describe(`add new file`, () => {
    test('in the middle of another upload', fakeAsync(() => {
      one_file();
      tick(10);
      expect(component.files.length).toBe(1);
      expect(component.concurrentUploadLimit).toBe(defaultConcurrentUploadLimit - 1);
      one_file();
      tick(5);
      expect(component.files.filter(f => f.status === FileStatus.Uploading).length).toBe(2);
      tick(6);
      expect(component.files.filter(f => f.status === FileStatus.Completed).length).toBe(1);
      tick(15);
      expect(component.files.filter(f => f.status === FileStatus.Completed).length).toBe(2);

      expect(fixture).toMatchSnapshot();
    }))
  }
  )

  describe(`Unit match fileSizeUnit`, () => {
    test('MB', () => {
      one_file();

      expect(fixture.debugElement.query(By.css('.pill.size')).nativeElement.innerHTML).toContain('MB')
      expect(fixture).toMatchSnapshot();
    })
    test('KB', () => {
      component.fileSizeUnit = 'KB';
      component.ngOnInit();
      one_file();
      expect(fixture.debugElement.query(By.css('.pill.size')).nativeElement.innerHTML).toContain('KB')
      expect(fixture).toMatchSnapshot();
    })
  }
  )

  describe(`Unit toggle `, () => {
    test('MB', fakeAsync(() => {
      one_file();
      tick(10);
      fixture.debugElement.query(By.css('.pill.size')).nativeElement.click();
      tick(5);
      expect(fixture.debugElement.query(By.css('.pill.size')).nativeElement.innerHTML).toContain('GB')
      expect(fixture).toMatchSnapshot();
      fixture.debugElement.query(By.css('.pill.size')).nativeElement.click();
      tick(5);
      expect(fixture.debugElement.query(By.css('.pill.size')).nativeElement.innerHTML).toContain('KB')
      tick(2);
      expect(fixture).toMatchSnapshot();
    })
    )
  }
  )
  describe(`Validate functions `, () => {
    beforeEach(() => {
      component.validateFunctions.push({ fn: (item) => !item.file.lastModified.toString().includes('Error'), errorMessage: 'Wrong File' }, { fn: (item) => !item.file.lastModified.toString().includes('Error'), errorMessage: 'Wrong File2' }); // second file should reject
    })
    test('one file', fakeAsync(() => {
      component.onBrowseFiles({ target: { files: { length: 1, 0: dumpFiles[1] } } } as unknown as Event);
      expect(component.files[0].error.length).toBe(2);
      tick(10);
      expect(component.concurrentUploadLimit).toBe(5);
      expect(fixture).toMatchSnapshot();
    }))
    test('many files', fakeAsync(() => {
      many_files();
      tick(6 * 21);
      expect(component.files[1].error.length).toBe(2);
      expect(component.concurrentUploadLimit).toBe(5)
      expect(fixture).toMatchSnapshot();
    }))
    test('one file - ignore invalid file', fakeAsync(() => {
      component.keepInvalidFiles = false;
      component.onBrowseFiles({ target: { files: { length: 1, 0: dumpFiles[1] } } } as unknown as Event);
      expect(component.files.length).toBe(0);
      tick(10);
      expect(component.concurrentUploadLimit).toBe(5);
      expect(fixture).toMatchSnapshot();
    }))
    test('many files- ignore invalid file', fakeAsync(() => {
      component.keepInvalidFiles = false;
      many_files();
      tick(6 * 21);
      expect(component.files.length).toBe(5);
      expect(component.concurrentUploadLimit).toBe(5)
      expect(fixture).toMatchSnapshot();
    }))
    test('max file size', fakeAsync(() => {
      component.maxFileSize = 0;
      component.ngOnInit();
      many_files();
      tick(6 * 21);
      expect(component.files.filter(f => f.status === FileStatus.Unsupported).length).toBe(6);
      expect(fixture).toMatchSnapshot();
    }))
    test('allowed Formats', fakeAsync(() => {
      component.allowedFormats = ['JPG', 'PNG'];
      component.ngOnInit();
      many_files();
      tick(6 * 21);
      expect(component.files.filter(f => f.status === FileStatus.Unsupported).length).toBe(2);
      expect(fixture).toMatchSnapshot();
    }))
  }
  )
  describe(`max file limit`, () => {
    beforeEach(() => {
      component.maxFileLimit = 2;
    })
    test('limit 2 files', fakeAsync(() => {
      component.keepInvalidFiles = false;
      many_files();
      tick(6 * 21);
      expect(component.files.length).toBe(2);
      expect(component.concurrentUploadLimit).toBe(5)
      expect(fixture).toMatchSnapshot();
    }))
    test('limit 2 files - keep invalid files', fakeAsync(() => {
      component.keepInvalidFiles = true;
      many_files();
      tick(6 * 21);
      expect(component.files.length).toBe(6);
      expect(component.concurrentUploadLimit).toBe(5)
      expect(fixture).toMatchSnapshot();
    }))
    test('limit 2 files - keep invalid files and validation error', fakeAsync(() => {
      component.validateFunctions.push({ fn: (item) => !item.file.lastModified.toString().includes('Error'), errorMessage: 'Wrong File' }, { fn: (item) => !item.file.lastModified.toString().includes('Error'), errorMessage: 'Wrong File2' });
      component.keepInvalidFiles = true;
      many_files();
      tick(6 * 21);
      expect(component.files.length).toBe(6);
      expect(component.files.filter(f => f.status === FileStatus.Completed).length).toBe(2);
      expect(component.concurrentUploadLimit).toBe(5)
      expect(component.maxFileLimit).toBe(2)
      expect(fixture).toMatchSnapshot();
    }))
  })

  describe('autoUpload off', () => {
    beforeEach(() => {
      component.autoUpload = false;
    });
    test('zero file', () => {
      zero_file();
      expect(component.files.length).toBe(0);
      expect(fixture).toMatchSnapshot()
    })

    test('one file', fakeAsync(() => {
      one_file();
      expect(component.files.length).toBe(1);
      expect(component.files[0].status).toBe(FileStatus.Ready);
      expect(component.concurrentUploadLimit).toBe(4)
      component.onStartUpload();
      tick(10);
      expect(component.files[0].status).toBe(FileStatus.Uploading);
      expect(component.concurrentUploadLimit).toBe(4)
      tick(11);
      expect(component.files[0].status).toBe(FileStatus.Completed);
      expect(component.concurrentUploadLimit).toBe(5)
      expect(fixture).toMatchSnapshot()
    }))

    test('many files', fakeAsync(() => {
      many_files();
      expect(component.files.length).toBe(6);
      expect(component.files.filter(f => f.status === FileStatus.Ready).length).toBe(5);
      expect(component.concurrentUploadLimit).toBe(0)
      expect(component.files.filter(f => f.status === FileStatus.Pending).length).toBe(1);
      component.onStartUpload();
      tick(21);
      expect(component.files.filter(f => f.status === FileStatus.Ready).length).toBe(0);
      expect(component.files.filter(f => f.status === FileStatus.Uploading).length).toBe(1);
      tick(21);
      expect(component.files.filter(f => f.status === FileStatus.Completed).length).toBe(6);
      expect(component.concurrentUploadLimit).toBe(5)
      expect(fixture).toMatchSnapshot()
    }))
  })





































  //   // function runIts() {



  //   // it(`shouldn't start upload if autoUpload is False`, () => {
  //   //   // component.maxFileLimit = 1;
  //   //   dropZoneServiceMock.uploadMedia.calls.reset();
  //   //   component.autoUpload = false;
  //   //   component.onBrowseFiles({ target: { files: dumpFiles } } as unknown as Event);
  //   //   expect(dropZoneServiceMock.uploadMedia).toHaveBeenCalledTimes(0);

  //   // })

  //   // it('wip write test for chunk upload', () => {

  //   // })
  //   // it('remove errors after restart', () => {

  //   // })



});


