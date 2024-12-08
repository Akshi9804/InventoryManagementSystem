import { Component } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MenubarComponent,RouterOutlet],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

}
