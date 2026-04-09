import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Book } from './api/models/book';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto;">
      <h1 style="color: #2c3e50;">📚 Könyvnyilvántartó</h1>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0;">Új könyv rögzítése</h3>
        <input type="text" [(ngModel)]="newBook.title" placeholder="Könyv címe" style="margin-right: 10px; padding: 8px; width: 200px;">
        <input type="text" [(ngModel)]="newBook.author" placeholder="Szerző" style="margin-right: 10px; padding: 8px; width: 200px;">
        <input type="number" [(ngModel)]="newBook.year" placeholder="Kiadás éve" style="margin-right: 10px; padding: 8px; width: 100px;">
        <button (click)="addBook()" style="padding: 8px 20px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          Mentés
        </button>
      </div>

      <div *ngIf="books().length === 0" style="color: #666; font-style: italic;">
        Töltés... (Vagy üres az adatbázis)
      </div>

      <ul style="list-style-type: none; padding: 0; min-height: 250px;">
        <li *ngFor="let book of paginatedBooks()" style="padding: 10px; border-bottom: 1px solid #eee; font-size: 18px;">
          <strong>{{ book.title }}</strong> - {{ book.author }} 
          <span style="color: #666; font-size: 14px;">({{ book.year }})</span>
        </li>
      </ul>

      <div *ngIf="books().length > 0" style="display: flex; justify-content: center; gap: 15px; align-items: center; margin-top: 20px;">
        <button 
          (click)="currentPage.set(currentPage() - 1)" 
          [disabled]="currentPage() === 1"
          style="padding: 8px 15px; cursor: pointer;">
          ⬅️ Előző
        </button>
        
        <span style="font-weight: bold;">
          Oldal: {{ currentPage() }} / {{ totalPages() }}
        </span>

        <button 
          (click)="currentPage.set(currentPage() + 1)" 
          [disabled]="currentPage() === totalPages()"
          style="padding: 8px 15px; cursor: pointer;">
          Következő ➡️
        </button>
      </div>

    </div>
  `
})
export class App implements OnInit {
  books = signal<Book[]>([]);
  newBook: Book = { title: '', author: '', year: 2024 };


  currentPage = signal(1); 
  pageSize = 5; 


  paginatedBooks = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.books().slice(startIndex, startIndex + this.pageSize);
  });


  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.books().length / this.pageSize));
  });
  // ----------------------------------------------------

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {

    this.http.get<Book[]>('http://localhost:5009/api/books')
      .subscribe({
        next: (data) => this.books.set(data),
        error: (err) => console.error('Hiba a betöltéskor:', err)
      });
  }

  addBook() {
    if (!this.newBook.title || !this.newBook.author) {
      alert('Kérlek töltsd ki a címet és a szerzőt!');
      return;
    }


    this.http.post<Book>('http://localhost:5009/api/books', this.newBook)
      .subscribe({
        next: (savedBook) => {
          this.books.update(currentBooks => [...currentBooks, savedBook]);
          this.newBook = { title: '', author: '', year: 2024 };
          

          this.currentPage.set(this.totalPages());
        },
        error: (err) => console.error('Hiba a mentéskor:', err)
      });
  }
}

