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
        <h3 style="margin-top: 0;">{{ editingId() ? 'Könyv frissítése' : 'Új könyv rögzítése' }}</h3>
        <input type="text" [(ngModel)]="currentBook.title" placeholder="Könyv címe" style="margin-right: 10px; padding: 8px; width: 200px;">
        <input type="text" [(ngModel)]="currentBook.author" placeholder="Szerző" style="margin-right: 10px; padding: 8px; width: 200px;">
        <input type="number" [(ngModel)]="currentBook.year" placeholder="Kiadás éve" style="margin-right: 10px; padding: 8px; width: 100px;">
        
        <button (click)="saveBook()" style="padding: 8px 20px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          {{ editingId() ? 'Frissítés' : 'Mentés' }}
        </button>
        
        <button *ngIf="editingId()" (click)="cancelEdit()" style="margin-left: 10px; padding: 8px 20px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          Mégse
        </button>
      </div>

      <div *ngIf="books().length === 0" style="color: #666; font-style: italic;">
        Töltés... (Vagy üres az adatbázis)
      </div>

      <ul style="list-style-type: none; padding: 0; min-height: 250px;">
        <li *ngFor="let book of paginatedBooks()" style="padding: 10px; border-bottom: 1px solid #eee; font-size: 18px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>{{ book.title }}</strong> - {{ book.author }} 
            <span style="color: #666; font-size: 14px;">({{ book.year }})</span>
          </div>
          <div>
            <button (click)="editBook(book)" style="margin-right: 10px; padding: 5px 10px; background-color: #ffc107; color: black; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
              ✏️ Szerkesztés
            </button>
            <button (click)="deleteBook(book.id)" style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
              🗑️ Törlés
            </button>
          </div>
        </li>
      </ul>

      <div *ngIf="books().length > 0" style="display: flex; justify-content: center; gap: 15px; align-items: center; margin-top: 20px;">
        <button (click)="currentPage.set(currentPage() - 1)" [disabled]="currentPage() === 1" style="padding: 8px 15px; cursor: pointer;">⬅️ Előző</button>
        <span style="font-weight: bold;">Oldal: {{ currentPage() }} / {{ totalPages() }}</span>
        <button (click)="currentPage.set(currentPage() + 1)" [disabled]="currentPage() === totalPages()" style="padding: 8px 15px; cursor: pointer;">Következő ➡️</button>
      </div>
    </div>
  `
})
export class App implements OnInit {
  books = signal<Book[]>([]);
  currentBook: Book = { title: '', author: '', year: 2024 };
  editingId = signal<string | null | undefined>(undefined);

  currentPage = signal(1); 
  pageSize = 5; 

  paginatedBooks = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.books().slice(startIndex, startIndex + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.books().length / this.pageSize));
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.http.get<Book[]>('http://localhost:5009/api/books').subscribe({
        next: (data) => this.books.set(data),
        error: (err) => console.error(err)
      });
  }

  saveBook() {
    if (!this.currentBook.title || !this.currentBook.author) return;

    if (this.editingId()) {
      this.http.put<Book>(`http://localhost:5009/api/books/${this.editingId()}`, this.currentBook).subscribe({
          next: () => {
            this.loadBooks();
            this.cancelEdit();
          },
          error: (err) => console.error(err)
        });
    } else {
      this.http.post<Book>('http://localhost:5009/api/books', this.currentBook).subscribe({
          next: (savedBook) => {
            this.books.update(books => [...books, savedBook]);
            this.cancelEdit();
            this.currentPage.set(this.totalPages());
          },
          error: (err) => console.error(err)
        });
    }
  }

  editBook(book: Book) {
    this.currentBook = { ...book };
    this.editingId.set(book.id);
  }

  cancelEdit() {
    this.currentBook = { title: '', author: '', year: 2024 };
    this.editingId.set(undefined);
  }

  deleteBook(id: string | null | undefined) {
    if (!id) return;
    if (confirm('Biztosan törölni szeretnéd ezt a könyvet?')) {
      this.http.delete(`http://localhost:5009/api/books/${id}`).subscribe({
          next: () => {
            this.loadBooks();
            if (this.paginatedBooks().length === 1 && this.currentPage() > 1) {
              this.currentPage.set(this.currentPage() - 1);
            }
          },
          error: (err) => console.error(err)
        });
    }
  }
}

