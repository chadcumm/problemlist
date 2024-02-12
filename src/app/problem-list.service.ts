import { Injectable } from '@angular/core';
import { CustomService, mPageService, IColumnConfig } from '@clinicaloffice/clinical-office-mpage';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IProblemViewPrefs } from './interfaces/problem-view-prefs';

@Injectable({
  providedIn: 'root'
})

export class ProblemListService {
  
  public columnConfigProblemList: IColumnConfig = {columns: [], columnSort: [], freezeLeft: 0};
  public problemViewPrefs: IProblemViewPrefs = {MyProblems: true, ActiveProblemsOnly: true};

  private localJSONData: any[] | undefined;
  
  public loading_data: boolean = false;
  public refreshed_data: boolean = false

  constructor(
    public problemListDS: CustomService,
    public mPage: mPageService,
    private http: HttpClient,
    private _snackBar: MatSnackBar  
  ) { }

  public loadProblems(): void {
    this.loading_data = true;
    
    this.problemListDS.load({
      customScript: {
        script: [
          {
            name: 'cov_co_problemlist:group1',
            run: 'pre',
            id: 'problemdata'
          }
        ]
      }
    }, undefined, (() => { 
      this.loading_data = false;
      this.refreshed_data = true;
      this.mPage.putLog('Problem Data Loaded and Refreshed');
     }));
  }

// Load user preferences
public loadPreferences(): void {
  this.mPage.putLog('loadPreferences for prsnlId: ' + this.mPage.prsnlId + ' this.problemListDS.mpage.prsnlId: ' + this.problemListDS.mpage.prsnlId);
  this.loading_data = true;

  const prefMessage = this.problemListDS.emptyDmInfo;
  prefMessage.infoDomain = 'COV Problem List Preferences';
  prefMessage.infoName = 'view_prefs';
  prefMessage.infoDomainId = this.problemListDS.mpage.prsnlId

  this.problemListDS.executeDmInfoAction('userViewPrefs', 'r', [ prefMessage ], () => {

    // Check for user preferences and assign them
    if (this.problemListDS.isLoaded('userViewPrefs')) {
      const LoadedConfig = JSON.parse(this.problemListDS.get('userViewPrefs').dmInfo[0].longText);
      this.problemViewPrefs = LoadedConfig.columnConfig;
      this._snackBar.open('Prefrences Loaded.', 'Ok', {duration: 2000});
      this.mPage.putLog(`Loaded Preferences for ${this.problemListDS.mpage.prsnlId} ${JSON.stringify(this.problemViewPrefs)}`);
    }

    this.loadProblems()
  });
}

public savePreferences(): void {
  this.mPage.putLog(`Save Preferences for ${this.problemListDS.mpage.prsnlId} ${JSON.stringify(this.problemViewPrefs)}`);
  if (this.mPage.inMpage === true) {
    this.problemListDS.executeDmInfoAction('saveUserViewPrefs', 'w', [
      {
        infoDomain: 'COV Problem List Preferences',
        infoName: 'view_prefs',
        infoDate: new Date(),
        infoChar: '',
        infoNumber: 0,
        infoLongText: JSON.stringify({
          columnConfig: this.problemViewPrefs
        }),
        infoDomainId: this.problemListDS.mpage.prsnlId
      }
    ], () => {
      this._snackBar.open('Saved Preferences.', 'Ok', {duration: 2000});
    });
  } else {
  this._snackBar.open('Preferences Would Be Saved', 'Close', {duration: 2000});
  }
}


// Returns the problems data looking at the mPage or local JSON data
public get problems(): any[] { 
  let filteredProblemList: any[] = [];
  
  if (this.problemsLoaded) {
    if (this.mPage.inMpage === true) {
      filteredProblemList = this.problemListDS.get('problemdata').problemlist;
    } else {
      filteredProblemList = this.localJSONData?.[0]?.problemlist || [];
    }
  }

  return filteredProblemList;
}

// create a get function to return the userID from the mPage or local JSON data
public get userID(): number {
  let user: number = 0;
  if (this.problemsLoaded) {
    if (this.mPage.inMpage === true) {
      user = this.problemListDS.get('problemdata').userId;
    } else {
      user = this.localJSONData?.[0]?.userId || '';
    }
  }
  return user;
}

// use this function to load th patient data
public MasterLoadProblemData(): void {
  this.mPage.putLog('MasterLoadProblemData');
  if (this.mPage.inMpage === true) {
    this.loadProblems();
  } else {
    this.localLoadProblems();
  }
}

// Determine if patients have been loaded
public get problemsLoaded(): boolean {
  if (this.mPage.inMpage === true) {
    return this.problemListDS.isLoaded('problemdata');
  } else {
    return !!this.localJSONData;
  }
};

  // load the patient data from a local JSON file.  Useful when doing offline development.  Add the json to a patient_population.json file in the assests/data folder
  // and then run the util/scramle_data.js to scramble the data and create a cov_patient_problems_sample.json file. Delete the patient_population.json file.

public localLoadProblems(): void {
  this.loading_data = true;

  this.http.get('assets/data/scrambled_patient_problems_sample.json', { responseType: 'text' })
    .pipe(
      map((response: string) => JSON.parse(response))
    )
    .subscribe(
      (data: any) => {
        this.localJSONData = [data];
        this.loading_data = false;
        this.mPage.putLog(JSON.stringify(this.localJSONData)); // Convert this.localJSONData to a string
      },
      (error: any) => {
        console.error('Error loading patient population:', error);
        this.loading_data = false;
        
      }
    );
    }

  public toggleMyProblems(): void {
      this.problemViewPrefs.MyProblems = !this.problemViewPrefs.MyProblems;
      this.mPage.putLog('toggleMyProblems this.problemViewPrefs.MyProblems: ' + this.problemViewPrefs.MyProblems);
  }

  public toggleActiveProblems(): void {
    this.problemViewPrefs.ActiveProblemsOnly = !this.problemViewPrefs.ActiveProblemsOnly;
    this.mPage.putLog('toggleActiveProblems this.problemViewPrefs.ActiveProblemsOnly: ' + this.problemViewPrefs.ActiveProblemsOnly);
  }

  get isToggleMyProblemsSelected(): boolean {
      return this.problemViewPrefs.MyProblems;
  }

  get isToggleActiveSelected(): boolean {
    return this.problemViewPrefs.ActiveProblemsOnly;
  }

};
