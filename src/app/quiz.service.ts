import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  public finalResult = new BehaviorSubject<{correct: number, wrong: number, skipped: number}>({
    correct: 0,
    wrong: 0,
    skipped: 0
  });
  public result = this.finalResult.asObservable();

  public pieResult = new BehaviorSubject<any[]>([]);
  public pieResultObs = this.pieResult.asObservable();

  constructor(public http: HttpClient) { }

  public getAllQuestions(): Observable<any> {

    const response = this.http.get('./assets/questionBank.json');

    return response;

  }
}
