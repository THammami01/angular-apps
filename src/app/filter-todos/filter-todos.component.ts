import { Component, Input } from '@angular/core';
import { Filter } from '../app.component';

@Component({
  selector: 'app-filter-todos',
  templateUrl: './filter-todos.component.html',
  styleUrls: ['./filter-todos.component.scss'],
})
export class FilterTodosComponent {
  @Input() filter!: Filter;
  @Input() handleFilterTodos!: (newFilter: string) => void;

  constructor() {}

}
