import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Products } from '../services/products';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-basepage',
  imports: [RouterLink,RouterOutlet,RouterLinkActive,FormsModule],
  templateUrl: './basepage.html',
  styleUrl: './basepage.css',
})
export class Basepage {

}
