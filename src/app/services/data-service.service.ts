import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from '../Model/global-data';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  private globalDataUrl: string =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/12-20-2020.csv';
  constructor(private http: HttpClient) {}

  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map((result) => {
        const rows = result.split('\n');
        const raw = {};

        rows.slice(1, rows.length - 1).forEach((row) => {
          const cols = row.split(/,(?=\S)/);
          const cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };

          const temp: GlobalDataSummary = raw[cs.country];
          if (temp) {
            cs.active += cs.active + temp.active;
            cs.confirmed += cs.confirmed + temp.confirmed;
            cs.deaths += cs.deaths + temp.deaths;
            cs.recovered += cs.recovered + temp.recovered;
          }
          raw[cs.country] = cs;
        });
        return <GlobalDataSummary[]>Object.values(raw);
      })
    );
  }
}
