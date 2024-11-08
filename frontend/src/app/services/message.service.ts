// src/app/services/message.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://localhost:5000/api/messages';

  constructor(private http: HttpClient) {}

  sendMessage(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, message);
  }

  getMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
}
