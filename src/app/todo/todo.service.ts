import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  createTask(data): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }
  getTaskList(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/get-list');
  }

  getTaskDetail(id): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/get-task-detail/' + id);
  }

  updateTaskStatus(taskId, status): Observable<any> {
    return this.http.patch<any>(
      this.baseUrl + '/update-task-status/' + taskId,
      status
    );
  }

  editTaskDetails(taskId, body) {
    return this.http.patch<any>(this.baseUrl + '/update-task/' + taskId, body);
  }

  deleteTask(taskId) {
    return this.http.delete<any>(this.baseUrl + '/delete-task/' + taskId);
  }

  presentToast(message: string) {
    return this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }
}
