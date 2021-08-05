import { Component, OnInit } from '@angular/core';
import { Item, ItemsService } from './items.service';

export enum Filter {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  DONE = 'DONE',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  filter: Filter = Filter.ALL;

  allItems: Item[] = [];

  constructor(private itemsService: ItemsService) {}

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.itemsService.getItems().subscribe((res) => {
      this.allItems = res;
    });
  }

  // you can alter the local items only without fetching again
  addItem(description: string) {
    const newItem = {
      id: this.allItems.length + 1,
      description,
      done: false,
    };

    this.itemsService.addItem(newItem).subscribe(() => {
      this.getItems();
    });
  }

  toggleDone(item: Item) {
    // you can alter the local items only without fetching again
    this.itemsService.toggleItemDone(item).subscribe(() => {
      this.getItems();
    });
  }

  removeItem(id: number) {
    // you can alter the local items only without fetching again
    this.itemsService.deleteItem(id).subscribe(() => {
      this.getItems();
    });
  }

  get filteredItems(): Item[] {
    switch (this.filter) {
      case Filter.ACTIVE:
        return this.allItems.filter(({ done }) => done === false);

      case Filter.DONE:
        return this.allItems.filter(({ done }) => done === true);

      default:
        return this.allItems;
    }
  }

  handleFilterTodos(newFilter: string) {
    switch (newFilter) {
      case 'ACTIVE':
        this.filter = Filter.ACTIVE;
        break;
      case 'DONE':
        this.filter = Filter.DONE;
        break;
      default:
        this.filter = Filter.ALL;
    }
  }
}
