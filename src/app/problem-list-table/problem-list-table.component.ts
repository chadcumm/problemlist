import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck } from '@angular/core';
import { ProblemListService } from '../problem-list.service';

@Component({
  selector: 'app-problem-list-table',
  templateUrl: './problem-list-table.component.html',
  styleUrls: ['./problem-list-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProblemListTableComponent implements OnInit, DoCheck {

  constructor(
    public problemDS: ProblemListService,
    public cdr: ChangeDetectorRef
  ) { }

  ngDoCheck(): void {
    if (this.problemDS.refreshed_data) {
      setTimeout(() => {
        this.problemDS.refreshed_data = false;
      });
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
  }

}
