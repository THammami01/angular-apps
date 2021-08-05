import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss'],
})
export class AddTodoComponent {
  newDescription: string = '';

  constructor() {}

  @Input() addItem!: (description: string) => void;

  handleAddItem() {
    if (!this.newDescription) {
      alert('Please enter an item first.');
    } else {
      this.addItem(this.newDescription);
      this.newDescription = '';
    }
  }
}
