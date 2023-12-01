import { Injectable } from '@angular/core';
import { CustomService } from '@clinicaloffice/clinical-office-mpage';

@Injectable({
  providedIn: 'root'
})
export class ProblemListService {

  public loading_data = false;

  constructor(
    public custSvc: CustomService
  ) { }

  public loadProblems(): void {
    this.loading_data = true;

    this.custSvc.load({
      customScript: {
        script: [
          {
            name: 'cov_co_problemlist:group1',
            run: 'pre',
            id: 'problemdata'
          }
        ]
      }
    }, undefined, (() => { this.loading_data = false }));
  }

// Returns the appointments data
public get problems(): any[] {
  return this.custSvc.get('problemdata').problemlist;
}

// Determine if appointments have been loaded
public get problemsLoaded(): boolean {
  return this.custSvc.isLoaded('problemdata');
}  
}
 
