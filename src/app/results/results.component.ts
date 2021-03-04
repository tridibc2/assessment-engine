import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  result$: Observable<any>;
  pieResult$: Observable<any[]>;
  view: any[] = [700, 400];
  result = [
    {
      name: 'Germany',
      value: 8940000
    },
    {
      name: 'USA',
      value: 5000000
    },
    {
      name: 'France',
      value: 7200000
    },
      {
      name: 'UK',
      value: 6200000
    }
  ];

  constructor(private service: QuizService) {
    this.result$ = this.service.result;
    this.pieResult$ = this.service.pieResultObs;
    this.pieResult$.subscribe(val => console.log(val));
  }

  ngOnInit(): void {
  }

}
