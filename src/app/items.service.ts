import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Item {
  id: number;
  description: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  handleError(err: HttpErrorResponse) {
    return throwError('An error occured. Please try again later.');
  }

  getItems(): Observable<Item[]> {
    return this.http
      .get<Item[]>(`${this.url}/items`)
      .pipe(catchError(this.handleError));
  }

  addItem(newItem: Item): Observable<Item> {
    return this.http.post<Item>(`${this.url}/items`, newItem);
  }

  toggleItemDone(item: Item): Observable<Item> {
    return this.http.patch<Item>(`${this.url}/items/${item.id}`, {
      ...item,
      done: !item.done,
    });
  }

  deleteItem(id: number): Observable<Item> {
    return this.http.delete<Item>(`${this.url}/items/${id}`);
  }
}
