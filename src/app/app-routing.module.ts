import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { EntryComponent } from './entry/entry.component';
import { LoginComponent } from './login/login.component';
import { FrameComponent } from './frame/frame.component';
import { QuizComponent } from './quiz/quiz.component';
import { AppGuard } from './common/app.guard'

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'app',
    component: FrameComponent,
    canActivate: [AppGuard],
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UserComponent,
      },
      {
        path: 'quiz',
        component: QuizComponent,
      },
      {
        path: 'entries',
        component: EntryComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
