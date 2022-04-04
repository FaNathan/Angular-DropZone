<div id="top"></div>
<!-- <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h1 align="left">Angular DropZone</h3>
    <div align="left">
     An advanced multi purpose file uploader for Angular
     TBC...
  
  <br/>
  <a href="https://fanathan.github.io/Angular-DropZone/">Demo</a>
  </div>


<!-- TABLE OF CONTENTS -->
<!-- <details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>
-->



<!-- ABOUT THE PROJECT -->
### About The Project



<img align="center" width="530" alt="image" src="https://user-images.githubusercontent.com/102797896/161385043-c975368e-75d9-42f6-b5b1-7bd93f63a4a5.png">


### Built With

* [Angular](https://angular.io/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
<!-- ## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

 -->
### Installation

1. Install the package
     * npm
        ```sh
        npm install angular-dropzone
        ```
    or 
    
     * yarn
        ```sh
        yarn add angular-dropzone
        ```
2. import Module

      ```typescript
        import { AngularDropzoneModule } from 'angular-dropzone';



        @NgModule({
          declarations: [
            AppComponent
          ],
          imports: [
            ...
            AngularDropzoneModule   <----
          ],
          providers: [],
          bootstrap: [AppComponent]
        })
      ```
 3.    add your api to  ts file 
       ```typescript
        // test.component.ts
        uploadApi = new AngularDropzoneAPI('http://sample_url:5000/FileUpload', 'POST');
        ```
        
        ```html
        <angular-dropzone [uploadAPI]="uploadApi"></angular-dropzone>
        ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage



  


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

```typescript
    const myValidateFunctions = [
      {
        fn: (item) => item.size < 100000 , // logic should be here
        errorMessage: 'File size is more than expected.' // custom error message
      },
      ...
    ]

    <angular-dropzone validateFunctions="myValidateFunctions"></angular-dropzone>
```

### How to add a custom template

```html
    <angular-dropzone [uploadAPI]="uploadApi">
        <div style="color: darkgoldenrod; font-size: 12px">Max file size is 10 MB</div>
    </angular-dropzone>
```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
<!-- ## Roadmap

- [x] Add Changelog
- [x] Add back to top links
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
    - [ ] Chinese
    - [ ] Spanish

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

 -->

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
<!-- ## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#top">back to top</a>)</p>
 -->


<!-- ACKNOWLEDGMENTS -->
<!-- ## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#top">back to top</a>)</p>
 -->


