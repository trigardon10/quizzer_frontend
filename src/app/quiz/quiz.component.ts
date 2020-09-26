import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../common/session.service';
import { Entry } from '../entry/entities/Entry';
import { User } from '../user/entity/User';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  entries: Entry[];
  users: Record<number, User>;

  hintRevealed: Record<number, boolean> = {};
  answerRevealed: Record<number, boolean> = {};
  results: Record<number, number> = {};
  /**
   * 0 = Start
   *
   * 1 = Fragen
   *
   * 2 = Resultat
   *
   * 3 = Keine Fragen vorhanden
   */
  state = 0;
  currentEntry = 0;

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.entries = this.sessionService.getEntriesForQuiz(10);
    this.users = this.sessionService.getUsersAsMap();
    if (this.entries.length === 0) {
      this.state = 3;
    }
  }

  start(): void {
    this.state = 1;
  }

  continue(): void {
    this.currentEntry++;
    if (this.currentEntry >= this.entries.length) {
      this.state = 2;

      // TODO Send to Server
    }
  }

  again(): void {
    this.entries = this.sessionService.getEntriesForQuiz(10);
    this.users = this.sessionService.getUsersAsMap();

    this.hintRevealed = {};
    this.answerRevealed = {};
    this.results = {};
    this.state = 0;
    this.currentEntry = 0;
  }
}
