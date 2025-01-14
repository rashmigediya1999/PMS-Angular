import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface Country {
  name: string;
  iso2: string;
  iso3: string;
  states: State[];
}

export interface State {
  name: string;
  state_code: string;
}

export interface Currency {
  name: string;
  code: string;
  symbol?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private baseUrl = 'https://countriesnow.space/api/v0.1';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<any>(`${this.baseUrl}/countries`).pipe(
      map(response => {
        return response.data.map((country: any) => ({
          name: country.country,
          iso2: country.iso2 || '',
          iso3: country.iso3 || '',
          states: country.states || []
        }));
      }),
      catchError(error => {
        console.error('Error fetching countries:', error);
        return throwError(() => new Error('Failed to load countries'));
      })
    );
  }

  getStates(country: string): Observable<State[]> {
    return this.http.post<any>(
      `${this.baseUrl}/countries/states`,
      { country },
      { headers: this.headers }
    ).pipe(
      map(response => {
        if (!response.data?.states) {
          return [];
        }
        return response.data.states.map((state: any) => ({
          name: state.name,
          state_code: state.state_code || ''
        }));
      }),
      catchError(error => {
        console.error('Error fetching states:', error);
        return throwError(() => new Error('Failed to load states'));
      })
    );
  }

  getCitiesByState(country: string, state: string): Observable<string[]> {
    return this.http.post<any>(
      `${this.baseUrl}/countries/state/cities`,
      { country, state },
      { headers: this.headers }
    ).pipe(
      map(response => {
        if (!response.data) {
          return [];
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching cities:', error);
        return throwError(() => new Error('Failed to load cities'));
      })
    );
  }

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<any>(`${this.baseUrl}/countries/currency`).pipe(
      map(response => {
        const uniqueCurrencies = new Map<string, Currency>();
        response.data.forEach((item: any) => {
          if (!uniqueCurrencies.has(item.currency)) {
            uniqueCurrencies.set(item.currency, {
              code: item.currency,
              name: item.currency,
              symbol: item.symbol || ''
            });
          }
        });
        return Array.from(uniqueCurrencies.values());
      }),
      catchError(error => {
        console.error('Error fetching currencies:', error);
        return throwError(() => new Error('Failed to load currencies'));
      })
    );
  }
}