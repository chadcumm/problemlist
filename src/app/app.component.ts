import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {mPageService} from "@clinicaloffice/clinical-office-mpage";
import {environment} from '../environments/environment';
import { ProblemListService } from './problem-list.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentApplicationVersion = environment.appVersion;
  constructor(
    public activatedRoute: ActivatedRoute,
    public mPage: mPageService,
    public problemDS: ProblemListService
  ) { }

  ngOnInit(): void {

    // Grab any parameters in the URL (Used in Cerner Components)
    this.activatedRoute.queryParams.subscribe(params => {
      this.mPage.personId = params.personId ? parseInt(params.personId) : this.mPage.personId;
      this.mPage.encntrId = params.encounterId ? parseInt(params.encounterId) : this.mPage.encntrId;
      this.mPage.prsnlId = params.userId ? parseInt(params.userId) : this.mPage.prsnlId;
    });

    // Perform MPage Initialization
    setTimeout((e: any) => {
      this.mPage.setMaxInstances(2, true, 'CHART');
      this.mPage.putLog("MPage Initialized " + this.mPage.personId + " " + this.mPage.encntrId + " " + this.mPage.prsnlId + " " + this.mPage.inMpage);
      console.log('MPage Initialized');
      console.log('MPage Service:', this.mPage);
      console.log('Mpage Service: inMpage: ', this.mPage.inMpage);
      // Add your initialization code here - do not place outside setTimeout function
      if (this.mPage.inMpage === true) {
        this.problemDS.loadProblems();
      } else {
        this.problemDS.localLoadProblems();
      }
    }, 0);
  }

}
