import { Component, OnInit } from '@angular/core';
import { cubeClickMiddleware, MiddlewareService } from 'src/app/services/middleware.service';
import { GameState } from 'src/app/models/GameState.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MainComponent implements OnInit {
  gameState = new GameState();
  speed: number = 0.1;
  directionRight: boolean = true;
  directionDown: boolean = true;
  showStartButton: boolean = true;

  changeVerticalChance: number = 0.0005;
  changeHorizontalChance: number = 0.0005;

  constructor(private middlewareService: MiddlewareService) {}

  async ngOnInit(): Promise<void> {
    this.middlewareService.use(new cubeClickMiddleware());
    this.gameState.subscribeToScore((newScore) => {
      this.updateScoreDisplay(newScore);
    });

    this.gameState.subscribeToTimeLeft((newTimeLeft) => {
      this.updateTimerDisplay(newTimeLeft);
    });
  }

  async startGame() {
    this.reset();
    this.showStartButton = false;
    this.timer();
    await this.handleCubeMovement();
    this.showStartButton = true;
  }

  async handleCubeMovement() {
    const cube = document.getElementById("cube");
    if (!cube) {return;}
    while (this.gameState.timeLeft > 0) {
      await this.delay(5)
      
      const horizontalDice = Math.random();
      const verticalDice = Math.random();
      
      if (!cube.style.left) {cube.style.left = "0.1%"}
      if (!cube.style.top) {cube.style.top = "0.1%"}
      const leftValue = parseFloat(cube.style.left.split("%")[0]);
      const topValue = parseFloat(cube.style.top.split("%")[0]);
      if (leftValue >= 91 || leftValue <= 0 || horizontalDice <= this.changeHorizontalChance) { // because the cube's width is 9%
        this.directionRight = !this.directionRight
      }
      if (topValue >= 84 || topValue <= 0 || verticalDice <= this.changeVerticalChance) { // because the cube's height is 16%
        this.directionDown = !this.directionDown
      }

      const valueToAddHorizontal = this.directionRight? this.speed : -this.speed
      const valueToAddVertical = this.directionDown? this.speed : -this.speed
      cube.style.left = (leftValue + valueToAddHorizontal).toString() + "%";
      cube.style.top = (topValue + valueToAddVertical).toString() + "%";
    }
  }

  async timer() {
    while (this.gameState.timeLeft > 0) {
      await this.delay(100);
      this.gameState.timeLeft = parseFloat((this.gameState.timeLeft - 0.1).toFixed(1));
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  clickedOnCube() {
    const context = {
      type: 'cubeClick', 
      speed: this.speed,
      timeLeft: this.gameState.timeLeft,
      changeHorizontalChance: this.changeHorizontalChance,
      changeVerticalChance: this.changeVerticalChance,
    };
    this.middlewareService.execute(context);

    this.speed = context.speed;
    this.gameState.timeLeft += 0.3;
    this.gameState.score += 1;
  }

  reset() {
    this.speed = 0.1;
    this.directionRight = true;
    this.directionDown = true;
    this.showStartButton = true;
  
    this.changeVerticalChance = 0.0005;
    this.changeHorizontalChance = 0.0005;
  
    this.gameState.timeLeft = 5;
  
    this.gameState.score = 0;
    const cube = document.getElementById("cube");
    if (cube) {
      cube.style.left = "0.1%";
      cube.style.top = "0.1%";
    }
    const timer = document.getElementById("timer");
    if (timer) {
      timer.style.backgroundColor = "#2fff5f;";
    }
  }

  updateScoreDisplay(newScore: number) {
    const score = document.getElementById("score");
    if (!score) {return;}
    score.style.transform = `rotateZ(${newScore}deg)`;
  }

  updateTimerDisplay(newTimeLeft: number) {
    const timer = document.getElementById("timer");
    if (!timer) { return;}
    if (newTimeLeft <= 1) {
      timer.style.backgroundColor = "#ff0000";
    }
    else if (newTimeLeft <= 2) {
      timer.style.backgroundColor = "#ff9d00";
    }
    else if (newTimeLeft <= 3) {
      timer.style.backgroundColor = "#ffff00";
    }
    else if (newTimeLeft > 3) {
      timer.style.backgroundColor = "#2fff5f";
    }
  }

}
