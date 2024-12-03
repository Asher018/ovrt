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
    this.middlewareService.use(new cubeClickMiddleware()); // using the click middleware

    // subscribing to gameState: timer and score
    this.gameState.subscribeToScore((newScore) => {
      this.updateScoreDisplay(newScore);
    });

    this.gameState.subscribeToTimeLeft((newTimeLeft) => {
      this.updateTimerDisplay(newTimeLeft);
    });
  }

  async startGame() {
    this.reset(); // resets the variables
    this.showStartButton = false;
    this.timer(); // starts the timer
    await this.handleCubeMovement(); // makes the cube move
    this.showStartButton = true;
  }

  async handleCubeMovement() {
    const cube = document.getElementById("cube"); // getting the cube element
    if (!cube) {return;}
    while (this.gameState.timeLeft > 0) { // while the player has time
      await this.delay(5) // wait 5 milliseconds to update the cube's movement
      
      // creating two random numbers to change cube's direction later on
      const horizontalDice = Math.random();
      const verticalDice = Math.random(); 
      
      // resetting cube's position
      if (!cube.style.left) {cube.style.left = "0.1%"}
      if (!cube.style.top) {cube.style.top = "0.1%"}

      // getting left and top values
      const leftValue = parseFloat(cube.style.left.split("%")[0]);
      const topValue = parseFloat(cube.style.top.split("%")[0]);

      // change the direction if the cube reached the end of the box OR if the random number is within the chance
      if (leftValue >= 91 || leftValue <= 0 || horizontalDice <= this.changeHorizontalChance) { // because the cube's width is 9%
        this.directionRight = !this.directionRight
      }
      if (topValue >= 84 || topValue <= 0 || verticalDice <= this.changeVerticalChance) { // because the cube's height is 16%
        this.directionDown = !this.directionDown
      }

      // adding move value to the cube based on the direction and changing its actual position
      const valueToAddHorizontal = this.directionRight? this.speed : -this.speed
      const valueToAddVertical = this.directionDown? this.speed : -this.speed
      cube.style.left = (leftValue + valueToAddHorizontal).toString() + "%";
      cube.style.top = (topValue + valueToAddVertical).toString() + "%";
    }
  }

  async timer() { // timer that runs every 100 ms to subtract 0.1 second from the timer
    while (this.gameState.timeLeft > 0) {
      await this.delay(100);
      this.gameState.timeLeft = parseFloat((this.gameState.timeLeft - 0.1).toFixed(1));
    }
  }

  delay(ms: number): Promise<void> { // delay function for delaying functions
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  clickedOnCube() {
    // setting context to the middleware
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
