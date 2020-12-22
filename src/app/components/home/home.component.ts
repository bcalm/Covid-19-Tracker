import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private totalActive = 0;
  private totalRecovered = 0;
  private totalDeaths = 0;
  private totalConfirmed = 0;
  private globalData;
  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        this.globalData = result;
        result.forEach((cs) => {
          this.totalActive += cs.active;
          this.totalRecovered += cs.recovered;
          this.totalDeaths += cs.deaths;
          this.totalConfirmed += cs.confirmed;
        });
      },
    });
  }
}
