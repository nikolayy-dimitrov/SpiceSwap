import { Component } from '@angular/core';
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
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

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.email, this.password, this.name)
      .then(() => this.router.navigate(['/login']))
      .catch(error => console.error(error));
  }
}
