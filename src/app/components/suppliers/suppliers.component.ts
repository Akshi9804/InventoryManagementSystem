import {Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent{
}

