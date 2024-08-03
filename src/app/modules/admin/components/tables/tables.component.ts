import { Component } from '@angular/core';
import { Table } from 'src/app/modules/menu/interfaces/Tables';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TableSelectionService } from 'src/app/shared/services/tables-selection/table-selection.service';
import { TableService } from '../../services/table.service';
import { Subscription } from 'rxjs';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent {
  tables: any[] = []; // Define your table data structure
  private searchQuerySubscription: Subscription | undefined;


  constructor(private tableService: TableService,     private searchService: SearchService
    ) {} // Replace with your actual service

  ngOnInit(): void {
    this.fetchTables();

    this.searchQuerySubscription = this.searchService.searchQuery$.subscribe((query: string) => {
      console.log('Received search query:', query); // Added console log here
      this.fetchTables(query); // Fetch tables based on the emitted search query
    });
  }

  fetchTables(searchTerm?: string) {
    this.tableService.getTables(searchTerm).subscribe((data: any) => {
      this.tables = data.map((table: any) => ({
        ...table,
        isOccupied: table.Is_occupied === 1 // Convert 1 to true, 0 to false
      }));
      console.log('Tables Data', this.tables);
    });
  }

  ngOnDestroy(): void {
    this.searchQuerySubscription?.unsubscribe(); // Unsubscribe to prevent memory leaks
  }
  

  selectTable(table: Table ) {
    this.tableService.setSelectedTable(table);
  }

}
