import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateWiseData } from 'src/app/Model/data-wise-data';
import { GlobalDataSummary } from 'src/app/Model/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string[] = [];
  totalActive = 0;
  totalRecovered = 0;
  totalDeaths = 0;
  totalConfirmed = 0;
  dateWiseData;
  selectCountryData: DateWiseData[];
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart',
  };

  constructor(private service: DataServiceService) {}

  ngOnInit(): void {
    merge(
      this.service.getDateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map((result) => {
          this.data = result;
          this.data.forEach((cs) => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateValues('Afghanistan');
      },
    });
  }

  updateValues(country: string) {
    this.data.forEach((cs) => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    });
    this.selectCountryData = this.dateWiseData[country];
    this.updateChart();
  }

  updateChart() {
    const dataTable = [];
    dataTable.push(['Date', 'Cases']);
    this.selectCountryData.forEach((cs) => {
      dataTable.push([cs.date, cs.cases]);
    });
    this.lineChart = {
      chartType: 'LineChart',
      dataTable: dataTable,
      options: { height: 500 },
    };
  }
}
