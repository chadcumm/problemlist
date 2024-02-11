import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
import {environment} from '../../environments/environment';
import { ProblemListService } from '../problem-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent implements OnInit {
  
  currentApplicationVersion = environment.appVersion;

  constructor(
    public problemListDS: ProblemListService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

}
