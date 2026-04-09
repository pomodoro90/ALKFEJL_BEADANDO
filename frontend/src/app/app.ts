import { Component, OnInit, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Book } from './api/models/book';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>📚 Könyv Nyilvántartó</h1>
      
      <div *ngIf="books().length === 0">Töltés... (Vagy üres az adatbázis)</div>

      <ul style="font-size: 18px;">
        <li *ngFor="let book of books()">
          <strong>{{ book.title }}</strong> - {{ book.author }}
        </li>
      </ul>
    </div>
  `
})
export class App implements OnInit {

  books = signal<Book[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Book[]>('http://localhost:5009/api/books')
      .subscribe({
        next: (data) => {

          this.books.set(data);
          console.log('Sikeresen lekérve a képernyőre is:', data);
        },
        error: (err) => {
          console.error('Hiba történt a lekérés során:', err);
        }
      });
  }
}
