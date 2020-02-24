import { Component, OnInit, Inject } from '@angular/core';
import { GetLoginStatusService } from "../_messages/getloginstatus.service";
import { ChangeDetectorRef } from "@angular/core";
import { Subscription, Observable } from 'rxjs';
import { AssignmentService } from "../_services/assignment.service";
import { OpenAssignmentService } from "../_messages/openassignment.service";
import { ProgressSpinnerService } from "../_messages/progressspinner.service";
import { MatSnackBar, MatDialog } from '@angular/material';
import {MatDialogModule, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';





@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  bLoggedIn: boolean = false;
  userName$: string = "";
  subscription: Subscription;
  isProgress$: boolean = false;

  progressSpinnerMessage: any;
  progressSpinnerSubscription: Subscription;

 
  bUseNewRow : boolean;
  bUseRepeatPageInstructions: boolean;
  bUsePagePageInstructions: boolean;
  bUseLocalOptionsForDataPage: boolean;
  bUseLocalOptionsForClipboardPage: boolean;

  constructor(private glsservice: GetLoginStatusService, 
              private cdRef: ChangeDetectorRef,
              private aservice: AssignmentService,
              private oaservice: OpenAssignmentService,
              private snackBar: MatSnackBar,
              private settingsDialog: MatDialog,
              private psservice: ProgressSpinnerService) { }

  ngOnInit() {

    if (localStorage.getItem("userName")) {
      // if have a userName, then have already logged in
      this.bLoggedIn = true;

      this.userName$ = localStorage.getItem("userFullName");

     }


    this.subscription = this.glsservice.getMessage().subscribe(
        message => {
          if (message.loginStatus === 'LoggedIn') {
            this.bLoggedIn = true;
            this.userName$ = localStorage.getItem("userFullName");
          }
          else {
            this.bLoggedIn = false;
            localStorage.clear();
          }

          this.cdRef.detectChanges();
        }

    );

    // handle showing and hiding the progress spinner
    this.progressSpinnerSubscription = this.psservice.getMessage().subscribe(message => { 
      this.progressSpinnerMessage = message;

      this.showHideProgress(this.progressSpinnerMessage.show);
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.progressSpinnerSubscription.unsubscribe();
  }

  getNextWork() {

    this.psservice.sendMessage(true);

    this.aservice.getAssignment("next").subscribe(
      assignmentResponse => {
        let nextWork : any = assignmentResponse.body;

        if (nextWork.ID && nextWork.ID != "") {

          let nextAssignment = {};
         
          let arCase = nextWork.caseID.split(" ");
          let currentCaseName = "GetNext";
          if (arCase.length > 1) {
            currentCaseName = arCase[1];
          }

          nextAssignment["pxRefObjectInsName"] = currentCaseName;
          nextAssignment["pxRefObjectKey"] = nextWork.caseID;
          nextAssignment["pzInsKey"] = nextWork.ID;

          this.oaservice.sendMessage(currentCaseName, nextAssignment);
          
        }
        else {
          let snackBarRef = this.snackBar.open("No next actions to go to", "Ok");
        }


      },
      assignmentError => {
        let snackBarRef = this.snackBar.open("Errors from get assignment:" + assignmentError.errors, "Ok");
      }
    );
  }

  showHideProgress(bShow: boolean) {
    this.isProgress$ = bShow;
    this.cdRef.detectChanges();
  }

  showSettings() {


    this.bUseNewRow = localStorage.getItem("useNewRow") == "true" ? true : false;
    this.bUseRepeatPageInstructions = localStorage.getItem("useRepeatPageInstructions") == "true" ? true : false;
    this.bUsePagePageInstructions = localStorage.getItem("usePagePageInstructions") == "true" ? true : false;
    this.bUseLocalOptionsForDataPage = localStorage.getItem("useLocalOptionsForDataPage") == "true" ? true : false;
    this.bUseLocalOptionsForClipboardPage = localStorage.getItem("useLocalOptionsForClipboardPage") == "true" ? true : false;


    const dialogRef = this.settingsDialog.open(SettingsdialogComponent, {
      width: '550px',
      data: { bUseNewRow: this.bUseNewRow, 
        bUseRepeatPageInstructions : this.bUseRepeatPageInstructions,
        bUsePagePageInstructions: this.bUsePagePageInstructions,
        bUseLocalOptionsForDataPage: this.bUseLocalOptionsForDataPage,
        bUseLocalOptionsForClipboardPage : this.bUseLocalOptionsForClipboardPage
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result != undefined) {
        localStorage.setItem("useNewRow", result.bUseNewRow.toString());
        localStorage.setItem("useRepeatPageInstructions", result.bUseRepeatPageInstructions.toString());
        localStorage.setItem("usePagePageInstructions", result.bUsePagePageInstructions.toString());
        localStorage.setItem("useLocalOptionsForDataPage", result.bUseLocalOptionsForDataPage.toString());
        localStorage.setItem("useLocalOptionsForClipboardPage", result.bUseLocalOptionsForClipboardPage.toString());
      }
    });
  }

  logOff() {
    this.glsservice.sendMessage("LoggedOff");
    
  }

}





export interface SettingsData {
  bUseNewRow : boolean;
  bUseRepeatPageInstructions: boolean;
  bUsePagePageInstructions: boolean;
  bUseLocalOptionsForDataPage: boolean;
  bUseLocalOptionsForClipboardPage: boolean;
}

@Component({
  selector: 'settingsdialog',
  templateUrl: './settingsdialog.component.html',
  styleUrls: ['./settingsdialog.component.scss']
})
export class SettingsdialogComponent implements OnInit {



  constructor(
    public dialogRef: MatDialogRef<SettingsdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsData) { }

  ngOnInit() {
  }

  closeDialog() { 
    this.dialogRef.close({ bUseNewRow: this.data.bUseNewRow, 
      bUseRepeatPageInstructions: this.data.bUseRepeatPageInstructions,
      bUsePagePageInstructions: this.data.bUsePagePageInstructions,
      bUseLocalOptionsForDataPage: this.data.bUseLocalOptionsForDataPage,
      bUseLocalOptionsForClipboardPage: this.data.bUseLocalOptionsForClipboardPage });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
