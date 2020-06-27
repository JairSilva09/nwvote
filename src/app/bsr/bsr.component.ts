import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BsrService } from './bsr.service';
@Component({
  selector: 'app-bsr',
  templateUrl: './bsr.component.html',
  styleUrls: ['./bsr.component.scss']
})
export class BsrComponent implements OnInit {
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century'
  ];

  createPostIt = false;
  overview = true;
  slideBackground = 'background-image: url(http://www.bipresents.com/';
  baseBackgroundUrl = 'background-image: url(http://www.bipresents.com/';
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  totalNumberOfSlides;
  pageCounter = ' 1/40';
  currentPageNumber = 0;
  appSlidesData: any;
  mainMenu: boolean;
  constructor(private _hotkeysService: HotkeysService, private _BsrService: BsrService,) {


    this._hotkeysService.add(new Hotkey('right', (event: KeyboardEvent): boolean => {

    this.moveForward();
      return false;
    }, undefined, 'Move to next slide'));

    this._hotkeysService.add(new Hotkey('left', (event: KeyboardEvent): boolean => {
      this.moveBackward();
      return false;
    }, undefined, 'Move to previous slide'));

    this._hotkeysService.add(new Hotkey('up', (event: KeyboardEvent): boolean => {
      this.mainMenu = true;
      return false;
    }, undefined, 'Show menu'));

    this._hotkeysService.add(new Hotkey('down', (event: KeyboardEvent): boolean => {
      this.mainMenu = false;
      return false;
    }, undefined, 'Hide menu'));

    this._hotkeysService.add(new Hotkey('o', (event: KeyboardEvent): boolean => {
      this.sideMenu();
      return false;
    }, undefined, 'Hide/Show slide overview'));
    // this._hotkeysService.add(new Hotkey('e', (event: KeyboardEvent): boolean => {
    //   this.resetSlide();
    //   return false;
    // }, undefined, 'Reset Slide'));
    this._hotkeysService.add(new Hotkey('b', (event: KeyboardEvent): boolean => {
      // this.removeBackground();
      return false;
    }, undefined, 'Remove background'));
    this._hotkeysService.add(new Hotkey('s', (event: KeyboardEvent): boolean => {
      // this.timeToDisplayticker();
      return false;
    }, undefined, 'Show stock ticker'));
    this._hotkeysService.add(new Hotkey('esc', (event: KeyboardEvent): boolean => {
      // this.displayHelp(false);
      return false;
    }, undefined, 'Hide help sheet'));
    this._hotkeysService.add(new Hotkey('shift+r', (event: KeyboardEvent): boolean => {
      // if (this.vote === true) {
      //   this.vote = false;
      // } else {
      //   this.vote = true;
      // }
      return false;
    }, undefined, ''));

  }

  ngOnInit(): void {
    this._BsrService.getNewNames('te2381').subscribe((res: any) => {
      console.log(res);
      this.appSlidesData = res;
      localStorage.setItem('appSlideData', JSON.stringify(res));
      this.totalNumberOfSlides = res.length
      this.pageCounter = '1/' + this.totalNumberOfSlides;
      this.slideBackground = this.slideBackground + res[0].SlideBGFileName + ')';
      this.currentPageNumber = 1;
      // this.slideBackground =
    })
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
    console.log(event.previousIndex, event.currentIndex);


  }
  entered(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
    console.log(event.previousIndex, event.currentIndex);

  }
  openDialog(name) { }

  // TOOLBAR MENU ACTIONS 
  moveForward() {
    this.createPostIt = false
    if (this.totalNumberOfSlides >= this.currentPageNumber) {
      this.pageCounter = this.currentPageNumber + '/' + this.totalNumberOfSlides;
      this.currentPageNumber = this.currentPageNumber + 1;
      this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[this.currentPageNumber].SlideBGFileName + ')';
    }

  }

  moveBackward() {
    this.createPostIt = false
 if (this.currentPageNumber > 0) {
      this.pageCounter = this.currentPageNumber + '/' + this.totalNumberOfSlides;
      this.currentPageNumber = this.currentPageNumber - 1;
      this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[this.currentPageNumber].SlideBGFileName + ')';
    }
  }

  postIts() {

    console.log('postIts');
  }

  sideMenu() {
    this.overview = !this.overview;
    console.log('overview');
  }
  mobileInstruccions() {

    console.log('mobileInstruccions');
  }

  home() {
    this.pageCounter = '1/' + this.totalNumberOfSlides;
    this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[0].SlideBGFileName + ')';
    this.createPostIt = false
    console.log('home');
  }

  bsr() {
  this.createPostIt = !this.createPostIt;
    console.log('bsr');
  }

  comment() {

    console.log('comment');
  }

  help() {

    console.log('help');
  }














}


export interface DialogData {
  animal: string;
  name: string;
}
// @Component({
//   selector: 'edit-name',
//   templateUrl: 'edit-name.html',
// })
// export class editName {
//   loginForm: FormGroup;
//   constructor(
//     public dialogRef: MatDialogRef<editName>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: FormBuilder) { 
//       console.log(this.data.name);
//       this.loginForm = this._formBuilder.group({
//         email: ['', Validators.required],
//         suma: [''],
//         name: [this.data.name]
//       });
//     }

//   onNoClick(): void {
//     console.log(this.data.name);

//     this.dialogRef.close();
//   }

//   submitCredentials() {}

// }