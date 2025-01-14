import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocationService, Country, State, Currency } from '../../services/location.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss'],
})

export class AddPaymentComponent implements OnInit {
  paymentForm!: FormGroup;

  isLoading = false;
  
  // Data lists
  countries: Country[] = [];
  states: State[] = [];
  cities: string[] = [];
  currencies: Currency[] = [];



  // Filtered options
  filteredCountries$!: Observable<Country[]>;
  filteredStates$!: Observable<State[]>;
  filteredCities$!: Observable<string[]>;
  filteredCurrencies$!: Observable<Currency[]>;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private locationService: LocationService,
    private router: Router,
  ) {}

  
  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
    this.setupAutoComplete();
    this.setupLocationDependencies();
  }

  private initForm(): void {
    this.paymentForm = this.fb.group({
      payee_first_name: ['', Validators.required],
      payee_last_name: ['', Validators.required],
      payee_phone_number: ['', Validators.required],
      payee_email: ['', [Validators.required, Validators.email]],
      payee_address_line_1: ['', Validators.required],
      payee_address_line_2: [''],
      payee_country: [null, Validators.required],
      payee_province_or_state: [{ value: null, disabled: true }],
      payee_city: [{ value: '', disabled: true }, Validators.required],
      payee_postal_code: ['', Validators.required],
      currency: [null, Validators.required],
      payee_due_date: ['', Validators.required],
      due_amount: ['', [Validators.required, Validators.min(0)]],
      discount_percent: [''],
      tax_percent: ['']
    });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    
    // Load Countries
    this.locationService.getCountries().subscribe({
      next: (countries) => {
        console.log('Loaded countries:', countries);
        this.countries = countries;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Error loading countries', error);
        this.isLoading = false;
      }
    });

    // Load Currencies
    this.locationService.getCurrencies().subscribe({
      next: (currencies) => {
        console.log('Loaded currencies:', currencies);
        this.currencies = currencies;
      },
      error: (error) => this.handleError('Error loading currencies', error)
    });
  }

  private setupAutoComplete(): void {
    // Country autocomplete
    this.filteredCountries$ = this.paymentForm.get('payee_country')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchTerm = typeof value === 'string' ? value : value?.name || '';
        return this._filterCountries(searchTerm);
      })
    );

    // State autocomplete
    this.filteredStates$ = this.paymentForm.get('payee_province_or_state')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchTerm = typeof value === 'string' ? value : value?.name || '';
        return this._filterStates(searchTerm);
      })
    );

    // City autocomplete
    this.filteredCities$ = this.paymentForm.get('payee_city')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCities(value))
    );

    // Currency autocomplete
    this.filteredCurrencies$ = this.paymentForm.get('currency')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchTerm = typeof value === 'string' ? value : value?.code || '';
        return this._filterCurrencies(searchTerm);
      })
    );
  }

  private setupLocationDependencies(): void {
    // Country change listener
    this.paymentForm.get('payee_country')!.valueChanges.subscribe(country => {
      if (country && typeof country === 'object') {
        const stateControl = this.paymentForm.get('payee_province_or_state')!;
        stateControl.enable();
        this.loadStates(country.name);
      } else {
        this.resetLocationFields();
      }
    });

    // State change listener
    this.paymentForm.get('payee_province_or_state')!.valueChanges.subscribe(state => {
      const country = this.paymentForm.get('payee_country')!.value;
      if (state && typeof state === 'object' && country) {
        const cityControl = this.paymentForm.get('payee_city')!;
        cityControl.enable();
        this.loadCities(country.name, state.name);
      } else {
        this.resetCityField();
      }
    });
  }

  private loadStates(countryName: string): void {
    this.isLoading = true;
    this.locationService.getStates(countryName).subscribe({
      next: (states) => {
        console.log('Loaded states:', states);
        this.states = states;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Error loading states', error);
        this.isLoading = false;
      }
    });
  }

  private loadCities(country: string, state: string): void {
    this.isLoading = true;
    this.locationService.getCitiesByState(country, state).subscribe({
      next: (cities) => {
        console.log('Loaded cities:', cities);
        this.cities = cities;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Error loading cities', error);
        this.isLoading = false;
      }
    });
  }

  // Display functions for autocomplete
  displayCountryFn(country: Country): string {
    return country?.name || '';
  }

  displayStateFn(state: State): string {
    return state?.name || '';
  }

  displayCurrencyFn(currency: Currency): string {
    return currency?.code || '';
  }

  // Filter functions
  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(country => 
      country.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();
    return this.states.filter(state => 
      state.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterCities(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter(city => 
      city.toLowerCase().includes(filterValue)
    );
  }

  private _filterCurrencies(value: string): Currency[] {
    const filterValue = value.toLowerCase();
    return this.currencies.filter(currency => 
      currency.code.toLowerCase().includes(filterValue) || 
      currency.name.toLowerCase().includes(filterValue)
    );
  }

  private resetLocationFields(): void {
    const stateControl = this.paymentForm.get('payee_province_or_state')!;
    const cityControl = this.paymentForm.get('payee_city')!;

    stateControl.disable();
    cityControl.disable();
    
    stateControl.setValue(null);
    cityControl.setValue('');
    
    this.states = [];
    this.cities = [];
  }

  private resetCityField(): void {
    const cityControl = this.paymentForm.get('payee_city')!;
    cityControl.disable();
    cityControl.setValue('');
    this.cities = [];
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(`${message}. Please try again.`, 'Close', { duration: 3000 });
  }


  resetForm(): void {
    this.paymentForm.reset({
      payee_first_name: '',
      payee_last_name: '',
      payee_due_date: '',
      payee_address_line_1: '',
      payee_address_line_2: '',
      payee_city: '',
      payee_province_or_state: '',
      payee_country: '',
      payee_postal_code: '',
      payee_phone_number: '',
      payee_email: '',
      currency: '',
      discount_percent: '',
      tax_percent: '',
      due_amount: '',
    });

    // Mark all controls as pristine and untouched to clear validation errors
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.markAsPristine();
      this.paymentForm.get(key)?.markAsUntouched();
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const formValue = this.paymentForm.value;
      const paymentData = {
        ...formValue,
        payee_country: formValue.payee_country.name,
        payee_province_or_state: formValue.payee_province_or_state?.name || '',
        currency: formValue.currency.code
      };
      console.log('Payment data:', paymentData);

      // Call the service to add payment
      this.paymentService.addPayment(paymentData).subscribe(
        (response) => {
          // Handle success
          this.snackBar.open('Payment added successfully!', 'Close', { duration: 3000 });
          this.resetForm(); // Reset the form after successful submission
          this.router.navigate(['/payments']);
        },
        (error) => {
          // Handle error
          console.error('Error adding payment:', error);
          this.snackBar.open('Failed to add payment. Please try again.', 'Close', { duration: 3000 });
        }
      );
    } else {
      console.error('Form is invalid');
      this.snackBar.open('Please fix the errors in the form before submitting.', 'Close', { duration: 3000 });
    }
  }
}