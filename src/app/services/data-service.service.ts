import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DateWiseData } from '../Model/data-wise-data';
import { GlobalDataSummary } from '../Model/global-data';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  private globalDataUrl: string =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/12-20-2020.csv';
  private dataWiseDataUrl =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  constructor(private http: HttpClient) {}

  getDateWiseData() {
    return this.http.get(this.dataWiseDataUrl, { responseType: 'text' }).pipe(
      map((result) => {
        const rows = result.split('\n');
        const header = rows[0];
        const dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        const mainData = {};
        rows.slice(1, rows.length - 1).forEach((row) => {
          const cols = row.split(/,(?=\S)/);
          const con = cols[1];
          cols.splice(0, 4);
          mainData[con] = [];
          cols.forEach((value, index) => {
            const dw: DateWiseData = {
              cases: +value,
              date: new Date(Date.parse(dates[index])),
              country: con,
            };
            mainData[con].push(dw);
          });
        });
        return mainData;
      })
    );
  }

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
