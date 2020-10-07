import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BsrService } from './bsr.service';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


///CKEDITOR NOTES, para que el toolbar del editor pueda ser configurado
//  es necesario de instalar el ckeditor4  y el ckeditor5 y 
//  en el index.html importar el script <script src="https://cdn.ckeditor.com/4.14.1/full-all/ckeditor.js"></script>
//  <ckeditor  [(ngModel)]="model.editorData" [data]="dataEditor" [config]="ckconfig"></ckeditor>

@Component({
  selector: 'app-bsr',
  templateUrl: './bsr.component.html',
  styleUrls: ['./bsr.component.scss']
})
export class BsrComponent implements OnInit {

  @ViewChild('slider') slider;

  postItListTheme = 'post-it-list-theme'
  loginForm: FormGroup;
  isMouseOver: boolean = false;
  sliderVal = 51;
  totalNumberOfnames = 51;
  slideCss = 'none';
  // projectId = 'rg2327';
  projectId = 'te2687';
  createPostIt = true;
  isDeleteButon = false;
  isSearching = false;
  overview = false;
  isNSR = false;
  isScreenButton = true;
  isScreeningNames = false;
  slideBackground = 'url(http://www.bipresents.com/';
  baseBackgroundUrl = 'url(http://www.bipresents.com/';
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  totalNumberOfSlides: any;
  pageCounter = ' 1/40';
  currentPageNumber = 0;
  appSlidesData: any;
  mainMenu: boolean;
  conceptData: any = [];
  newPost: Object;
  newName: any;
  conceptid: any;
  deletePost: Object;
  nameCandidates: any = [];
  nameBox = true;
  nameBoxB = true;
  myMaxWith = '900px';
  myMaxRWith = '900px';
  myMaxRightWith = '8px';
  showSlider: boolean = false;
  positPresentationIndex: number;
  appSearchSlidesData: any;
  slideBackground2: string;
  nameIndexCounter = 0;
  constructor(private _formBuilder: FormBuilder, private _hotkeysService: HotkeysService, private _BsrService: BsrService, public dialog: MatDialog) {

    // keyboard keymaps
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
    // this._hotkeysService.add(new Hotkey('b', (event: KeyboardEvent): boolean => {
    //   // this.removeBackground();
    //   return false;
    // }, undefined, 'Remove background'));
    // this._hotkeysService.add(new Hotkey('s', (event: KeyboardEvent): boolean => {
    //   // this.timeToDisplayticker();
    //   return false;
    // }, undefined, 'Show stock ticker'));
    this._hotkeysService.add(new Hotkey('esc', (event: KeyboardEvent): boolean => {
      this._hotkeysService.cheatSheetToggle.next(false);
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
    this.postItListTheme = localStorage.getItem('post-it-list-theme');
    this._BsrService.getSlides(this.projectId).subscribe((res: any) => {
      console.log(res);
      this.appSlidesData = res;
      this.appSearchSlidesData = res;
      localStorage.setItem('appSlideData', JSON.stringify(res));
      this.totalNumberOfSlides = res.length
      this.pageCounter = '1/' + this.totalNumberOfSlides;
      this.slideBackground = this.slideBackground + res[0].SlideBGFileName + ')';
      this.currentPageNumber = 1;
    })

    this._BsrService.getPost().subscribe((res: any) => {
      this.conceptData = JSON.parse(res[0].bsrData);
      if (JSON.parse(res[0].bsrData).presentationtype = 'NSR') {
        this.isNSR = true;
      }
      console.log(this.conceptData);
    });

    this._BsrService.getNameCandidates(this.projectId).subscribe((res: any) => {
      res.forEach(name => {
        name.html = name.html.replace(/\\/g,'');
      });
      this.nameCandidates = (res.length > 0)?res:[];
    });
    
    this.loginForm = this._formBuilder.group({
      rationale: [''],
      suma: [''],
      name: ['']
    });

    if (this.slider) {
      this.slider.value = 51;
    }
    this.slideCss = 'block';
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.conceptData.concepts, event.previousIndex, event.currentIndex);
    console.log(event.previousIndex, event.currentIndex);
    let orderArray = [];
    this.conceptData.concepts.forEach(ele => {
      orderArray.push(JSON.stringify(ele.conceptid))
    });
    this._BsrService.postItOrder(this.projectId, orderArray).subscribe(arg => {

      this._BsrService.getPost().subscribe((res: any) => {
        this.conceptData = JSON.parse(res[0].bsrData);
        if (JSON.parse(res[0].bsrData).presentationtype = 'NSR') {
          this.isNSR = true;

        }
        console.log(this.conceptData);
      });

    });

  }
  entered(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.conceptData.concepts, event.previousIndex, event.currentIndex);
    console.log(event.previousIndex, event.currentIndex);
  }


  // TOOLBAR MENU ACTIONS 
  moveForward() {
    this.createPostIt = false;
    if (this.totalNumberOfSlides >= this.currentPageNumber) {
      this.pageCounter = this.currentPageNumber + '/' + this.totalNumberOfSlides;
      this.currentPageNumber = this.currentPageNumber + 1;
      this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[this.currentPageNumber].SlideBGFileName + ')';
      if (this.appSlidesData[this.currentPageNumber].SlideType === "NameSummary") {
        this.positPresentationIndex = this.currentPageNumber;
        this.createPostIt = true;
      }
    }
  }

  moveBackward() {
    this.createPostIt = false
    if (this.currentPageNumber > 0) {
      this.pageCounter = this.currentPageNumber + '/' + this.totalNumberOfSlides;
      this.currentPageNumber = this.currentPageNumber - 1;
      this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[this.currentPageNumber].SlideBGFileName + ')';
      if (this.appSlidesData[this.currentPageNumber].SlideType === "NameSummary") {
        this.positPresentationIndex = this.currentPageNumber;
        this.createPostIt = true;
      }
    }
  }

  submitNewName() {

    this.loginForm.value.name.split(',').forEach(element => {
      this._BsrService.sendNewName(element, this.isNSR).subscribe(arg => {
      });
    });
    setTimeout(() => {
      this._BsrService.getNameCandidates(this.projectId).subscribe((res: any) => {
        this.nameCandidates = res;
      });
    }, 300);
  }

  newBlankPostIt() {
    let newConcepData = {
      projectId: this.projectId,
      conceptid: '0',
      concept: 'Concept',
      conceptorder: '0',
      attributes: [],
      names: []
    }
    this._BsrService.newPost(JSON.stringify(newConcepData)).subscribe(arg => {
      this._BsrService.getPost().subscribe((res: any) => {
        this.conceptData = JSON.parse(res[0].bsrData);
      });
    });

  }

  sideMenu() {
    this.overview = !this.overview;
    console.log('overview');
  }

  mobileInstruccions() {

    console.log('mobileInstruccions');
  }

  home() {
    this.currentPageNumber = 1;
    this.pageCounter = '1/' + this.totalNumberOfSlides;
    this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[0].SlideBGFileName + ')';
    this.createPostIt = false
    console.log('home');
  }

  bsr() {
    this.createPostIt = !this.createPostIt;
    this.currentPageNumber = (this.positPresentationIndex) ? this.positPresentationIndex : 58;
    console.log('bsr');
  }

  comment() {

    console.log('comment');
  }


  displayHelp(display: boolean) {
    (display) ? this._hotkeysService.cheatSheetToggle.next() : this._hotkeysService.cheatSheetToggle.next(display);
    this._hotkeysService.cheatSheetToggle.next(true)
  }


  goToSlide(i) {
    this.slideBackground = this.baseBackgroundUrl + this.appSlidesData[i].SlideBGFileName + ')';
    this.createPostIt = false
    console.log('slide ' + i);
  }
  // onResizeEnd(event: ResizeEvent): void {
  //   console.log('Element was resized', event);
  // }
  openDialog(item, nameid): void {


    const dialogRef = this.dialog.open(editPost, {
      // width: ((nameid === 'edit')?'80%':'100%'),
      // height: ((nameid === 'edit') ? '700px' : '200px'),
      data: { name: item, nameId: nameid }
    });


    this.conceptid = item.conceptid;

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this._BsrService.deletePost(this.conceptid).subscribe(arg => {
          this._BsrService.getPost().subscribe((res: any) => {
            this.conceptData = JSON.parse(res[0].bsrData);
            console.log(this.conceptData);
          });
        });
      } else if (result === 'deleteName') {
        this._BsrService.getNameCandidates(this.projectId).subscribe((res: any) => {
          this.nameCandidates = res;
        });
      } else if (result === 'savePost') {
        this._BsrService.getPost().subscribe((res: any) => {
          this.conceptData = JSON.parse(res[0].bsrData);
          if (JSON.parse(res[0].bsrData).presentationtype = 'NSR') {
            this.isNSR = true;
          }
          console.log(this.conceptData);
        });
      }
      this._BsrService.getNameCandidates(this.projectId).subscribe((res: any) => {
        this.nameCandidates = res;
      });
    }
    );
  }



  toggleNamebox() {
    //  this.nameBox = !this.nameBox;
    //  this.nameBoxB = !this.nameBoxB;

    if (this.nameIndexCounter === 0) {
      this.nameIndexCounter++;
      this.onInputChange(52);
    } else if (this.nameIndexCounter === 1) {
      this.nameIndexCounter++;
      this.onInputChange(30);
    } else {
      this.nameIndexCounter = 0;
      this.onInputChange(15);
    }

    this.nameIndexCounter
    this.showSlider = false;
    // this.showSlider = !this.showSlider;
    if (this.showSlider) {
      this.slideCss = 'block';
    } else {
      this.slideCss = 'none';
    }
  }



  onInputChange(value: number) {
    console.log("This is emitted as the thumb slides");
    // console.log(value);
    if (value > 51) {
      this.myMaxWith = '935px';
      this.myMaxRWith = '300px';
      this.myMaxRightWith = '-1px';
      this.nameBox = false;
      this.nameBoxB = false;
      this.isScreenButton = false;
    } else if (value <= 51 && value > 25) {
      this.myMaxWith = '925px';
      this.myMaxRWith = '340px';
      this.myMaxRightWith = '8px';
      this.nameBox = true;
      this.nameBoxB = true;
      this.isScreenButton = true;
    } else if (value <= 25) {
      this.myMaxWith = '335px';
      this.myMaxRWith = '636px';
      this.myMaxRightWith = '352px';
      this.nameBox = true;
      this.nameBoxB = false;
      this.isScreenButton = true;
    }
  }

  searchTerm(searchValue: string): void {
    if (searchValue.length <= 1) {
      this.isSearching = false;
      this.appSearchSlidesData = [];
    } else {
      this.isSearching = true;
      this.appSlidesData.forEach(element => {
        // if (element.DisplayName.includes(searchValue)) {
        if (element.SlideBGFileName.toUpperCase().includes(searchValue.toUpperCase())) {
          this.appSearchSlidesData.push(element);
        }
      });

      
    }

  }


  theme(): void {
    if (this.postItListTheme == 'post-it-list-theme') {
      this.postItListTheme = 'post-it-list'
    } else {
      this.postItListTheme = 'post-it-list-theme'
    }
    localStorage.setItem('post-it-list-theme', this.postItListTheme);
    let audio = new Audio();
    audio.src = "../../../assets/sound/tap.wav";
    audio.volume = 0.2;
    audio.load();
    audio.play();
  }

  screenNames(){
    this.isScreeningNames = !this.isScreeningNames;
  }

}


import { MatSliderChange } from '@angular/material/slider';

// CKEDITOR WYSIWYG // **************************************************************************************************

export interface DialogData {
  nameId: any;
  name: any;
}


export interface PeriodicElement {
  synonyms: string;
  position: number;
  weight: number;
  symbol: string;
}



@Component({
  selector: 'editPost',
  templateUrl: 'editPost-it.html',
  styleUrls: ['./bsr.component.scss']
})
export class editPost {

  ckconfig: any;
  synonyms: any;
  loginForm: FormGroup;
  isDeleting = false;
  isDeletingName = false;
  dataEditor = '<p>Hello, world!</p>';
  infoMessage = true;
  popupwindowData: { form: FormGroup; oldValue: string; };
  title: string;
  editName: string;
  concept: any;
  projectId = 'te2687';
  // projectId = 'rg2327';
  public model = {
    editorData: '',
    namesData: ''
  };

  isMobileInfo: boolean;
  allComplete: boolean;
  isSynonymBox = false;


  displayedColumns: string[] = ['position', 'name', 'weight'];
  synonymWord: string;
  dataSource: any[];
  constructor(
    public dialogRef: MatDialogRef<editPost>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: FormBuilder, private _BsrService: BsrService,) {
    this.editName = this.data.nameId;
    this.dataEditor = this.data.name.html;
    this.model.editorData = this.data.name.html;
    this.title = this.data.name.Name;

    if (this.data.name.Name) {
      this.concept = this.data.name.Name;
    } else {
      this.concept = this.data.name.concept;
      this.isDeletingName = true;
    }
    if (this.data.nameId === 'delete') {
      this.infoMessage = true;
      this.isDeleting = false;
      // this.isDeletingName = false;
    } else if (this.data.nameId === 'edit') {
      this.infoMessage = false;
      this.isDeleting = false;
    }
    else {
      this.infoMessage = true;
      this.isDeleting = false;
    }

    if (this.data.name === 'mobileInfo') {
      this.infoMessage = false;
      this.isDeleting = false;
      this.isMobileInfo = true;
    }

    this.ckconfig = {
      allowedContent: false,
      width: '99.6%',
      contentsCss: ["body {font-size: 20px;}"],
      height: 370,
      forcePasteAsPlainText: true,
      toolbarLocation: 'top',
      toolbarGroups: [
        { name: 'clipboard', groups: ['clipboard', ''] },
        { name: 'insert' },
        { name: 'forms' },
        { name: 'tools' },
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'others' },
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'colors' },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
        { name: 'styles' },
        { name: 'links' },
        { name: 'about' }
      ],
      addPlugins: 'simplebox,tabletools',
      removePlugins: 'horizontalrule,tabletools,specialchar,about,others',
      removeButtons: 'tableselection,Image,Superscript,Subscript,Save,NewPage,Preview,Print,Templates,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Find,Select,Button,ImageButton,HiddenField,CopyFormatting,CreateDiv,BidiLtr,BidiRtl,Language,Flash,PageBreak,Iframe,ShowBlocks,Cut,Copy,Paste,Table,Format,Source,Maximize,Styles,Anchor,SpecialChar,PasteFromWord,PasteText,Scayt,RemoveFormat,Indent,Outdent,Blockquote'

    }

    this.loginForm = this._formBuilder.group({
      rationale: [''],
      suma: [''],
      name: [this.concept]
    });

  }



  onReady(editor) {
    // editor.ui.getEditableElement().parentElement.insertBefore(
    //   editor.ui.view.toolbar.element,
    //   editor.ui.getEditableElement()
    // );
  }

  buttonOption(option) {

    if (option === 'delete') {
      this.isDeleting = false;
      this.dialogRef.close('delete');
    }
    else if (option === 'savePost') {
      this.isDeleting = false;



      let newConcepData = {
        projectId: this.projectId,
        concept: this.loginForm.value.name,
        conceptid: JSON.stringify(this.data.name.conceptid),
        attributesArray: this.data.name.attributes,
        namesArray: this.model.namesData.split("\n"),
        conceptHtml: this.model.editorData
      }
      this._BsrService.updatePost(JSON.stringify(newConcepData)).subscribe(arg => {
        this.dialogRef.close('savePost');
      });

    }
    else if (option === 'deleteName') {
      this.isDeleting = false;
      this._BsrService.deleteName(this.data.name.NameId).subscribe(arg => { });
      this.dialogRef.close('deleteName');
    } else {
      this.dialogRef.close('cancel');
    }
    this.loginForm.value.suma.split('\n').forEach(element => {
      this._BsrService.sendNewName(element, false).subscribe(arg => {
      });
    });

  }

  onNoClick(): void {
    this.popupwindowData = {
      form: this.loginForm,
      oldValue: this.data.name
    }
    this.dialogRef.close(this.popupwindowData);
  }


  async getSynonyms() {
    this.synonymWord = await navigator.clipboard.readText();
    this.isSynonymBox = true;
    this._BsrService.getSinonyms(this.synonymWord).subscribe((res: any) => {
      let counter = 0
      this.dataSource = [];
      res.forEach(synonym => {
        this.dataSource.push({ position: counter, synonyms: synonym.word, weight: 1.0079, symbol: 'H' })
        counter++;
      });
      console.log(res);
    })
  }

  setAll(evt) {
    this.model.editorData = this.model.editorData.concat('<p>' + evt + '</p>');
  }

  addSynonymsToEditor() {
    this.isSynonymBox = false;
    // this.model.editorData = this.model.editorData.concat('<p>' + this.dataSource[0].synonyms + '</p>');
  }

}