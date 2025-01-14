import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  cards = [
    { title: 'Card 1' },
    { title: 'Card 2' }
  ];

  openLink(url: string): void {
    window.open(url, '_blank');
  }
}


