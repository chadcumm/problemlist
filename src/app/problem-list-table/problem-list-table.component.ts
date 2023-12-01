import { Component, OnInit } from '@angular/core';
import { ProblemListService } from '../problem-list.service';

@Component({
  selector: 'app-problem-list-table',
  templateUrl: './problem-list-table.component.html',
  styleUrls: ['./problem-list-table.component.scss']
})
export class ProblemListTableComponent implements OnInit {

  constructor(
    public problemDS: ProblemListService
  ) { }

  ngOnInit(): void {
  }

}
