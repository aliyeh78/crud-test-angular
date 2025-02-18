import { TestBed } from '@angular/core/testing';
import { CustomerService } from './customer.service';
import { of } from 'rxjs';
import { Customer } from '../models/customer.model';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerService]
    });
    service = TestBed.inject(CustomerService);
  });

  it('should throw error if customer is not unique', (done) => {
    const newCustomer: Customer = {
      Id: 3,
      FirstName: 'John',
      LastName: 'Doe',
      email: 'john.doe@example.com',
      DateOfBirth: '1980-01-01',
      PhoneNumber: '9876543210',
      BankAccountNumber: '0987654321'
    };

    // Since we are not actually making HTTP requests, we will simulate the behavior
    service.saveCustomer(newCustomer).subscribe({
      next: () => {
        done.fail('Expected error, but got success');
      },
      error: (err) => {
        expect(err).toEqual(new Error('Customer already exists.'));
        done();
      }
    });
  });
});
