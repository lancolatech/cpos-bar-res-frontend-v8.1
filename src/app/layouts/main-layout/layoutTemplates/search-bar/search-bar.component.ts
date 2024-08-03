import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  query: string = '';

  constructor(private searchService: SearchService) {}

  onInputChange() {
    this.searchService.updateSearchQuery(this.query);
  }

}
