import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  public questions = [];

  pagination = {
    index: 0,
    size: 1,
    count: 1
  };

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.getAll()
    this.pagination.count = this.questions.length;
  }

  getAll() {
    this.quizService.getAllQuestions().subscribe(data => {
      this.questions = data["questions"];
      console.log(this.questions)
    },
      err => {
        console.log(err)
      })
  }

  /*   get pagedQuestions() {
      return (this.questions) ?
        this.questions.slice(this.pagination.index, this.pagination.index + this.pagination.size) : [];
    } */
}
