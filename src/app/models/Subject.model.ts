export class Subject<T> {
    private observers: Array<(state: T) => void> = [];
  
    subscribe(observer: (state: T) => void): void {
      this.observers.push(observer);
    }
  
    unsubscribe(observer: (state: T) => void): void {
      this.observers = this.observers.filter((obs) => obs !== observer);
    }
  
    notify(state: T): void {
      this.observers.forEach((observer) => observer(state));
    }
  }
  