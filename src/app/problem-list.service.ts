import { Injectable } from '@angular/core';
import { CustomService, mPageService, IColumnConfig } from '@clinicaloffice/clinical-office-mpage';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ProblemListService {
  
  private localJSONData: any[] | undefined;
  private MyProblems: boolean = true;
  public loading_data: boolean = false;

  constructor(
    public problemListDS: CustomService,
    public mPage: mPageService,
    private http: HttpClient,
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
      this.mPage.putLog('Problem Data Loaded');
     }));
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
      this.MyProblems = !this.MyProblems;
      this.mPage.putLog('toggleMyProblems this.MyProblems: ' + this.MyProblems);
    }

    get isToggleSelected(): boolean {
      return this.MyProblems;
  }

};
