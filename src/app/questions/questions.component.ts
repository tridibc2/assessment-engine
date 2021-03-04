import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../quiz.service';

interface SelectedAnswers {
  questionId: number;
  answerIds: number[];
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  public questions = [];
  selectedQuestionIndex = 0;
  selectedAnswers: SelectedAnswers[] = [];
  showNextButton = false;
  currentPageAnswers: number[];
  currentQuestionSubmittedAnswers: number[];
  currentPageSubmitted = false;
  pageDirty = false;
  showResultPage = false;

  pagination = {
    index: 0,
    size: 1,
    count: 1
  };

  constructor(private quizService: QuizService, private router: Router) { }

  ngOnInit(): void {
    this.getAll();
    this.pagination.count = this.questions.length;
  }

  private getAll(): void {
    this.quizService.getAllQuestions().subscribe(data => {
      this.questions = this.shuffleList(data.questions);
    },
      err => {
        console.log(err);
      });
  }

  nextQuestion(index: number): void {
    this.pageDirty = false;
    this.currentPageSubmitted = false;
    if (this.questions.length - 1 !== index) {
      this.selectedQuestionIndex = index + 1;
    }
    this.currentPageAnswers = this.selectedAnswers
    .find(q => q.questionId === this.questions[this.selectedQuestionIndex]?.id)?.answerIds;
    this.currentQuestionSubmittedAnswers = this.currentPageAnswers;
  }

  prevQuestion(index: number): void {
    this.pageDirty = false;
    this.currentPageSubmitted = false;
    if (index !== 0) {
      this.selectedQuestionIndex = index - 1;
    }
    this.currentPageAnswers = this.selectedAnswers
    .find(q => q.questionId === this.questions[this.selectedQuestionIndex]?.id)?.answerIds;
    this.currentQuestionSubmittedAnswers = this.currentPageAnswers;
  }

  checked(questionId: number, answerId: number): void {
    const questionAnswer = this.selectedAnswers.find(a => a.questionId === questionId);
    this.pageDirty = !questionAnswer?.answerIds.includes(answerId);
    if (!questionAnswer) {
      this.selectedAnswers.push({ questionId, answerIds: [answerId] });
    } else {
      const answerIndex = questionAnswer.answerIds.indexOf(answerId);
      if (answerIndex !== -1) {
        questionAnswer.answerIds.splice(answerIndex, 1);
      } else {
        questionAnswer.answerIds.push(answerId);
      }
      this.selectedAnswers[this.selectedAnswers
        .indexOf(this.selectedAnswers.find(a => a.questionId === questionId))] = questionAnswer;
    }
    this.currentPageAnswers = this.selectedAnswers.find(a => a.questionId === questionId).answerIds;
    console.log(this.currentPageAnswers);
  }

  radioChecked(questionId: number, answerId: number): void {
    const questionAnswer = this.selectedAnswers.find(a => a.questionId === questionId);
    this.pageDirty = !questionAnswer?.answerIds.includes(answerId);
    if (!questionAnswer) {
      this.selectedAnswers.push({ questionId, answerIds: [answerId] });
    } else {
      questionAnswer.answerIds.pop();
      questionAnswer.answerIds.push(answerId);
      this.selectedAnswers[this.selectedAnswers
        .indexOf(this.selectedAnswers.find(a => a.questionId === questionId))] = questionAnswer;
    }
    this.currentPageAnswers = this.selectedAnswers.find(a => a.questionId === questionId).answerIds;
    console.log(this.currentPageAnswers);
  }

  isChecked(optionId: number): boolean {
    return !!this.currentPageAnswers?.find(a => a === optionId);
  }

  submitAnswer(): void {
    this.currentPageSubmitted = true;
    this.currentQuestionSubmittedAnswers = this.currentPageAnswers;
  }

  isNextDisabled(): boolean {
    return !this.currentQuestionSubmittedAnswers?.length;
  }

  isSubmitDisabled(): boolean {
    return !this.pageDirty;
  }

  showFinalSubmitButton(i: number): boolean {
    return this.questions.length === i + 1;
  }

  submitAssessment(): void {
    const condition = this.questions.length === this.selectedAnswers
      .filter(s => s.answerIds?.length > 0).length;

    if (!condition) {
      if (confirm('There are some skipped questions remaining. Are you sure to submit ?')) {
        this.calculateResult();
      }
    } else {
      this.calculateResult();
    }
  }

  calculateResult(): any {
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const correctAnswersList = [];
    this.selectedAnswers?.forEach(selectedAnswer => {
      const question = this.questions.find(q => q.id === selectedAnswer.questionId);
      const correctOptionIds = question?.options.filter(o => o.isAnswer).map(o => o.id).sort().toString().trim();
      const selectedAnswerIds = selectedAnswer?.answerIds.sort().toString().trim();
      if (correctOptionIds === selectedAnswerIds) {
        correctAnswers = correctAnswers + 1;
        correctAnswersList.push(selectedAnswer);
      } else {
        wrongAnswers = wrongAnswers + 1;
      }
    });

    const result = { correct: correctAnswers, wrong: wrongAnswers, skipped: (this.questions.length - (correctAnswers + wrongAnswers)) };
    this.quizService.finalResult.next(result);

    const categoryNames = this.questions.map(q => q.questionTypeName);
    const distinctCategoryNames = categoryNames.filter((item, i, ar) => ar.indexOf(item) === i);
    const pieChartResult = [];
    distinctCategoryNames.forEach(element => {
      const count = categoryNames.filter(c => c === element).length;
      const questionIds = this.questions.filter(q => q.questionTypeName === element).map(q => q.id);
      const marks = correctAnswersList.filter(c => questionIds.includes(c.questionId)).length;
      pieChartResult.push({ name: element, value: marks, points: marks });
    });
    this.quizService.pieResult.next(pieChartResult);
    this.router.navigate(['/result']);
  }

  shuffleList(arr): any[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /*   get pagedQuestions() {
      return (this.questions) ?
        this.questions.slice(this.pagination.index, this.pagination.index + this.pagination.size) : [];
    } */
}
