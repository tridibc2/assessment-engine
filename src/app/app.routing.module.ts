import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionsComponent } from './questions/questions.component';
import { ResultsComponent } from './results/results.component';


const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'quiz',
        pathMatch: 'full'
    },
    {
        path: 'quiz',
        component: QuestionsComponent
    },
    {
        path: 'result',
        component: ResultsComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
