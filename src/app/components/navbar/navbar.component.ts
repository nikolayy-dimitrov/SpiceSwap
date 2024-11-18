import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(public AuthService: AuthService) {}

  logout(): void {
    this.AuthService.logout();
  }
}
