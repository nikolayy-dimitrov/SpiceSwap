import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from "@angular/forms";
import { NgIf } from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = "";
  password: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  isFormValid(form: NgForm): boolean {
    return <boolean>form.valid &&
      this.email.trim().length > 0 &&
      this.password.length >= 6;
  }

  login() {
    this.authService.login(this.email, this.password)
      .then(() => this.router.navigate(['/dashboard']))
      .catch(error => console.error(error));
  }
}
