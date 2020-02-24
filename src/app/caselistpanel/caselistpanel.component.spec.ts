import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaselistpanelComponent } from './caselistpanel.component';

describe('CaselistpanelComponent', () => {
  let component: CaselistpanelComponent;
  let fixture: ComponentFixture<CaselistpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaselistpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaselistpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
