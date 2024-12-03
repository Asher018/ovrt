import { Subject } from "./Subject.model";

export class GameState {
    private scoreSubject = new Subject<number>();
    private timeLeftSubject = new Subject<number>();
  
    private _score = 0;
    private _timeLeft = 5;
  
    get score() {
      return this._score;
    }
  
    set score(value: number) {
      this._score = value;
      this.scoreSubject.notify(this._score);
    }
  
    get timeLeft() {
      return this._timeLeft;
    }
  
    set timeLeft(value: number) {
      this._timeLeft = value;
      this.timeLeftSubject.notify(this._timeLeft);
    }
  
    subscribeToScore(observer: (score: number) => void): void {
      this.scoreSubject.subscribe(observer);
    }
  
    subscribeToTimeLeft(observer: (timeLeft: number) => void): void {
      this.timeLeftSubject.subscribe(observer);
    }
  }
  