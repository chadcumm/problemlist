import { Component, OnInit,ChangeDetectionStrategy, ChangeDetectorRef, DoCheck } from '@angular/core';
import {environment} from '../../environments/environment';
import { ProblemListService } from '../problem-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mPageService } from '@clinicaloffice/clinical-office-mpage';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent implements OnInit, DoCheck {
  
  currentApplicationVersion = environment.appVersion;

  constructor(
    public problemListDS: ProblemListService,
    private _snackBar: MatSnackBar,
    public cdr: ChangeDetectorRef,
    public mPage: mPageService
  ) { }

  ngDoCheck(): void {
    if (this.problemListDS.refreshed_data === true) {
      setTimeout(() => {
        this.problemListDS.refreshed_data = false;
        this.mPage.putLog('Problem Table Refreshed-TopBar:ngDoCheck');
        this.cdr.detectChanges();
      });
    }
  }

  ngOnInit(): void {
  }

}
