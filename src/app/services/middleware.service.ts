import { Injectable } from '@angular/core';

export interface Middleware {
  process(context: any): any;
}

@Injectable({
  providedIn: 'root',
})
export class MiddlewareService {
  private middlewares: Middleware[] = [];

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  execute(context: any) {
    for (const middleware of this.middlewares) {
      middleware.process(context);
    }
  }
}

export class cubeClickMiddleware implements Middleware {
  process(context: any): any {
    if (context.type === 'cubeClick') {
      const cube = document.getElementById("cube")
      if (cube) {
        cube.style.background = "#0091a4";
        setTimeout(() => {
          cube.style.backgroundColor = "#007180";
        }, 100);
      }
    }
    if (context.type === 'cubeClick' && context.speed <= 0.4) {
      context.speed += 0.005;
    }
    if (context.type === 'cubeClick' && context.changeHorizontalChance <= 0.01) {
      context.changeHorizontalChance += 0.00005
      context.changeVerticalChance += 0.00005
    }
  }
}
