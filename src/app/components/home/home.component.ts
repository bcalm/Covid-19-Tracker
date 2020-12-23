import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  totalActive = 0;
  totalRecovered = 0;
  totalDeaths = 0;
  totalConfirmed = 0;
  globalData;
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart',
  };

  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
  };
  constructor(private dataService: DataServiceService) {}

  initChart() {
    const dataTable = [];
    dataTable.push(['Country', 'Cases']);
    this.globalData.forEach((cs) => {
      if (cs.confirmed > 10_00_000) dataTable.push([cs.country, cs.confirmed]);
    });

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: dataTable,
      options: { Country: 'Cases', height: 500 },
    };

    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: dataTable,
      options: { Country: 'Cases', height: 500 },
    };
  }

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
        this.initChart();
      },
    });
  }
}
