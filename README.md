<div id="top"></div>

<!-- PROJECT LOGO -->
<br />

  <!-- <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">Angular DropZone (Beta)</h3>
    <div align="center">
     An advanced multi purpose file uploader for Angular
  
  TBC...
  
  <a href="https://fanathan.github.io/Angular-DropZone/">Demo</a>
  </div>

  <p align="center">
  
 
<img align="center" width="530" alt="image" src="https://user-images.githubusercontent.com/102797896/161385043-c975368e-75d9-42f6-b5b1-7bd93f63a4a5.png">

  </p>
  


| Feature               | Type                                                            | Default Value | Description                                                     |
| --------------------- | --------------------------------------------------------------- | ------------- | --------------------------------------------------------------- |
| allowedFormats        | string[]                                                        | []            | Limit the type of input files                                   |
| chunk upload size     | number                                                          | 0 (disabled)  | Allow to upload huge files (chunks should be handled by server) |
| autoUpload            | boolean                                                         | true          | Start to upload automatically after adding files                |
| maxFileLimit          | number                                                          | unlimited     | Limit the number of files                                       |
| multiple              | boolean                                                         | true          | Add Single or Multiple files                                    |
| validateFunctions     | ({ fn: (file: QueuedFile) => boolean, errorMessage: string })[] | empty         | Validation functions with custom error message.                 |
| keepInvalidFiles      | boolean                                                         | true          | Keep invalid files and display an error message                 |
| maxFileSize           | number                                                          | 4000 MB       | Limit the size of the input file                                |
| fileSizeUnit          | "KB" , "MB" , "GB"                                              | "MB"          | File size unit                                                  |
| concurrentUploadLimit | number                                                          | 5             | Number of files can be uploaded concurrently                    |
| uploadAPI             | AngularDropzoneAPI                                              |               | API definition (URL,Headers,Method...)                          |

<!-- TABLE OF CONTENTS -->

<!-- ABOUT THE PROJECT -->

## Usage

### How to add a validation function:

```
const myValidateFunctions = [
{
  fn: (item) => item.size < 100000 , // logic should be here
  errorMessage: 'File size is more than expected.' // custom error message
}
]

<angular-dropzone validateFunctions="myValidateFunctions"></angular-dropzone>
```

### How to add a custom template

```
<angular-dropzone [uploadAPI]="uploadApi">
    <div style="color: darkgoldenrod; font-size: 12px">Max file size is 10 MB</div>
</angular-dropzone>
```
