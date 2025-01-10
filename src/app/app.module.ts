import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';  // Importe as rotas

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)  // Importe o RouterModule com as rotas
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
