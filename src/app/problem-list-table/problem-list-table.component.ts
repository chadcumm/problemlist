import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ProblemListService } from '../problem-list.service';

@Component({
  selector: 'app-problem-list-table',
  templateUrl: './problem-list-table.component.html',
  styleUrls: ['./problem-list-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProblemListTableComponent implements OnInit {

  constructor(
    public problemDS: ProblemListService
  ) { }

  ngOnInit(): void {
  }

}
