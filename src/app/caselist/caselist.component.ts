import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DatapageService } from '../_services/datapage.service';
import { Subscription, Observable } from 'rxjs';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { OpenAssignmentService } from '../_messages/openassignment.service';
import { RefreshWorkListService } from '../_messages/refreshworklist.service';
import { ProgressSpinnerService } from "../_messages/progressspinner.service";
import { CaseService } from '../_services/case.service';



@Component({
  selector: 'app-caselist',
  templateUrl: './caselist.component.html',
  styleUrls: ['./caselist.component.scss']
})
export class CaselistComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  worklist$: MatTableDataSource<any>;
  works$: Object;
  headers: any;

  message: any;
  subscription: Subscription;

  displayedColumns = ['ID','status', 'name','urgency' ,'createTime'];


  constructor(
    private caseService: CaseService

  ) { }

  ngOnInit() {
    this.getCaseList();
  }



  getCaseList() {

    let dsubscription = this.caseService.cases().subscribe(

      response => {

        this.worklist$ = new MatTableDataSource<any>(this.getResults(response.body));

        console.log("Case List", this.worklist$);
        this.headers = response.headers;

        this.worklist$.paginator = this.paginator;
        this.worklist$.sort = this.sort;

        dsubscription.unsubscribe();

      },
      err => {
        alert("Error form case list:" + err.errors);
      }
    );



  }

  getResults(data) {
    return data.cases;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
