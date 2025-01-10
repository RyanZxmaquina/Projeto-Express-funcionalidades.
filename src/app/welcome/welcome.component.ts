import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  message: string = 'Seja Bem-Vindo!';

  navigateToHome(): void {
    window.location.href = '/home';  // Redireciona para /home
  }
}
