import { Component } from '@angular/core';
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = "";
  password: string = "";
  name: string = "";
  errorMessage: string = "";

  private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(private authService: AuthService, private router: Router) {}

  isValidEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  isValidPassword(password: string): boolean {
    return this.passwordRegex.test(password);
  }

  isFormValid(form: NgForm): boolean {
    return <boolean>form.valid &&
      this.name.trim().length > 3 &&
      this.isValidEmail(this.email) &&
      this.isValidPassword(this.password);
  }

  async register(form: NgForm) {
    if (!this.isFormValid(form)) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    try {
      await this.authService.register(this.email, this.password, this.name);
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Registration failed';
      console.error(error);
    }
  }
}
