import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },  // Pode ser uma página inicial se necessário
  { path: '**', component: WelcomeComponent }  // Rota curinga para páginas de erro
];
