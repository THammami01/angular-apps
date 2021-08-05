import { Component, Input } from '@angular/core';
import { Item } from '../items.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent {
  @Input() filteredItems!: Item[];
  @Input() toggleDone!: (item: Item) => void;
  @Input() removeItem!: (id: number) => void;

  constructor() {}
}
