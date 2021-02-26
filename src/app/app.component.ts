import { TodoService } from './todo/todo.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoading: Boolean = false;
  todoList: any[] = [];
  updateState: Boolean = false;
  taskId: string;

  todoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(private tdServide: TodoService) {}

  get title() {
    return this.todoForm.get('title');
  }
  get description() {
    return this.todoForm.get('description');
  }

  ngOnInit() {
    this.getTaskList();
  }

  getTaskList() {
    this.tdServide.getTaskList().subscribe(
      (res) => {
        this.todoList = res;
      },
      (err) => this.tdServide.presentToast('Oops!! something went wrong!!')
    );
  }

  getTaskDetails(id) {
    this.updateState = true;
    this.tdServide.getTaskDetail(id).subscribe(
      (res) => {
        this.todoForm.patchValue({
          title: res.title,
          description: res.description,
        });
        this.taskId = res._id;
      },
      (err) => this.tdServide.presentToast('Oops!! something went wrong!!')
    );
  }

  createTodo(form, isValid) {
    if (isValid) {
      let fv = {
        title: form.title,
        description: form.description,
      };

      if (this.updateState && this.taskId) {
        this.editTaskDetails(this.taskId, fv);
      } else {
        this.tdServide.createTask(fv).subscribe(
          (res) => {
            this.todoList.push(res);
            this.todoForm.reset();
          },
          (err) => this.tdServide.presentToast('Oops!! something went wrong!!')
        );
      }
    } else {
      this.tdServide.presentToast('Please fill all the fields');
    }
  }

  editTaskDetails(taskId, body) {
    this.tdServide.editTaskDetails(taskId, body).subscribe(
      (res) => {
        let index = this.todoList.findIndex((el) => el._id === taskId);
        this.todoList[index] = res;
      },
      (err) => this.tdServide.presentToast('Oops!! something went wrong!!')
    );
  }

  updateTaskStatus(isChecked, taskId) {
    let status;
    if (isChecked) status = 'Completed';
    if (!isChecked) status = 'Pending';

    this.tdServide.updateTaskStatus(taskId, { status }).subscribe(
      () => {},
      (err) => this.tdServide.presentToast('Oops!! something went wrong!!')
    );
  }
  onDeleteTask(taskId, index) {
    this.tdServide.deleteTask(taskId).subscribe(
      () => {
        this.todoList.splice(index, 1);
      },
      (err) => this.tdServide.presentToast('Oops!! something went wrong!!')
    );
  }
}
