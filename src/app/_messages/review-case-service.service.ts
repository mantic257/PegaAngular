import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewCaseService {

  private subject = new Subject<any>();

  sendMessage(sCaseID: string) {
    console.log("ReviewCaseService sendMessage: " + sCaseID);
      this.subject.next({ caseID: sCaseID});
  }

  clearMessage() {
      this.subject.next();
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }
}
