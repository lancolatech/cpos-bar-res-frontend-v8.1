import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableSelectionService {

  constructor() { }

  private selectedTableSubject = new BehaviorSubject<string | null>(null);
  selectedTable$ = this.selectedTableSubject.asObservable();

  setSelectedTable(table: string | null) {
    this.selectedTableSubject.next(table);
  }
}
