import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import { ProblemListService } from '../problem-list.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  
  currentApplicationVersion = environment.appVersion;

  constructor(
    public problemListDS: ProblemListService
  ) { }

  ngOnInit(): void {
  }

}
