import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');

  get searchQuery$() {
    return this.searchQuerySubject.asObservable();
  }

  updateSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }
}
