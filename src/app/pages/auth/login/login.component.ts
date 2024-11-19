import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => this.router.navigate(['/dashboard']))
      .catch(error => console.error(error));
  }
}
