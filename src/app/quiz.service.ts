import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(public http: HttpClient) { }

  public getAllQuestions(): Observable<any> {

    let response = this.http.get('./assets/questionBank.json');

    return response;

  }
}
