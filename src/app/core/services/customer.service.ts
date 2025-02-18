import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private customersKey = 'customers'; // Key for localStorage
  private customers: Customer[] = [
    { Id: 1, FirstName: 'John', LastName: 'Doe', email: 'john.doe@example.com', DateOfBirth: '1980-01-01', PhoneNumber: '1234567890', BankAccountNumber: '1234567890' },
    { Id: 2, FirstName: 'Jane', LastName: 'Doe', email: 'jane.doe@example.com', DateOfBirth: '1985-05-15', PhoneNumber: '1234567890', BankAccountNumber: '1234567890' },
  ]; // Mocked initial data

  constructor() {}

  // Mock API - Create or update customer
  saveCustomer(customer: Customer): Observable<void> {
    return new Observable<void>((observer) => {
      const existingCustomerIndex = this.customers.findIndex(c => c.Id === customer.Id);

      if (existingCustomerIndex !== -1) {
        // Update existing customer
        this.customers[existingCustomerIndex] = { ...this.customers[existingCustomerIndex], ...customer };
        console.log('Customer updated:', this.customers[existingCustomerIndex]);
      } else {
        // Add new customer
        if (this.isUniqueCustomer(customer)) {
          customer.Id = this.customers.length + 1; // Mock auto-increment ID
          this.customers.push(customer);
          console.log('Customer added:', customer);
        } else {
          observer.error(new Error('Customer already exists.')); // Throw error to notify
          return; // Exit the method early if the customer is not unique
        }
      }

      // Simulate an API call with a delay
      setTimeout(() => {
        localStorage.setItem(this.customersKey, JSON.stringify(this.customers));
        observer.next(); // Notify that operation is complete
        observer.complete(); // Complete the observable
      }, 1000); // Mock delay of 1 second
    }).pipe(delay(1000)); // Simulated API delay
  }

  // Mock API - Get list of customers (should return an Observable)
  getCustomers(): Observable<Customer[]> {
    return of(this.customers).pipe(delay(500)); // Simulate API call delay
  }

  // Mock API - Delete a customer by ID
  deleteCustomer(id: number): Observable<void> {
    this.customers = this.customers.filter(customer => customer.Id !== id);
    console.log('Customer deleted:', id);

    localStorage.setItem(this.customersKey, JSON.stringify(this.customers));

    return of(undefined).pipe(delay(1000)); // Return Observable<void>
  }

  // Check if the customer is unique based on FirstName, LastName, and DateOfBirth
  private isUniqueCustomer(customer: Customer): boolean {
    return !this.customers.some(
      c => c.FirstName === customer.FirstName &&
           c.LastName === customer.LastName &&
           c.DateOfBirth === customer.DateOfBirth
    );
  }

  // Check if the email is already taken
  isEmailTaken(email: string): Observable<boolean> {
    const isTaken = this.customers.some(customer => customer.email === email);
    return of(isTaken).pipe(delay(500)); // Simulate API call delay
  }
}
