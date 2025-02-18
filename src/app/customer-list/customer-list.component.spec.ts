import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerListComponent } from './customer-list.component';

import { of } from 'rxjs';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';  // Import ReactiveFormsModule and FormBuilder
import { CustomerService } from '../core/services/customer.service';
import { InputFieldComponent } from '../shared/components/input-field/input-field.component';

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;
  let customerService: jasmine.SpyObj<CustomerService>;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    // Create a spy object for the customer service
    const spy = jasmine.createSpyObj('CustomerService', ['getCustomers']);

    TestBed.configureTestingModule({
      declarations: [CustomerListComponent , InputFieldComponent],
      imports: [ReactiveFormsModule], // Add ReactiveFormsModule to imports
      providers: [
        { provide: CustomerService, useValue: spy },
        FormBuilder  // Provide FormBuilder
      ]
    });

    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    customerService = TestBed.inject(CustomerService) as jasmine.SpyObj<CustomerService>;
    formBuilder = TestBed.inject(FormBuilder);  // Inject FormBuilder into the test
  });

  it('should load customers on component initialization', () => {
    const mockCustomers = [
      {
        Id: 1,
        FirstName: 'John',
        LastName: 'Doe',
        email: 'john.doe@example.com',
        DateOfBirth: '1980-01-01',
        PhoneNumber: '1234567890',
        BankAccountNumber: '1234567890'
      },
      {
        Id: 2,
        FirstName: 'Jane',
        LastName: 'Doe',
        email: 'jane.doe@example.com',
        DateOfBirth: '1985-05-15',
        PhoneNumber: '0987654321',
        BankAccountNumber: '0987654321'
      }
    ];

    // Mock the getCustomers method to return an observable of mock customers
    customerService.getCustomers.and.returnValue(of(mockCustomers));

    // Trigger the ngOnInit lifecycle hook
    component.ngOnInit();

    // Assert that the component's customers property is populated with mock data
    expect(component.customers).toEqual(mockCustomers);
  });
});
