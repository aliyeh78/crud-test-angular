import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CustomerFormComponent } from './customer-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CustomerService } from '../core/services/customer.service';
import { PhoneValidatorService } from '../core/validators/phone-validator.service';
import { of } from 'rxjs';
import { InputFieldComponent } from '../shared/components/input-field/input-field.component';

describe('CustomerFormComponent', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;
  let customerServiceSpy: jasmine.SpyObj<CustomerService>;

  beforeEach(async () => {
    customerServiceSpy = jasmine.createSpyObj('CustomerService', ['saveCustomer']);

    await TestBed.configureTestingModule({
      declarations: [CustomerFormComponent, InputFieldComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CustomerService, useValue: customerServiceSpy },
        PhoneValidatorService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.customerForm.value).toEqual({
      FirstName: '',
      LastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      bankAccountNumber: ''
    });
  });

  it('should mark form as invalid when fields are empty', () => {
    expect(component.customerForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    Object.keys(component.customerForm.controls).forEach(key => {
      component.customerForm.controls[key].setValue('');
      expect(component.customerForm.controls[key].valid).toBeFalse();
    });
  });

  it('should validate email format', () => {
    const emailControl = component.customerForm.controls['email'];
    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBeFalse();

    emailControl.setValue('valid@example.com');
    expect(emailControl.valid).toBeTrue();
  });

  it('should validate bank account number pattern', () => {
    const bankAccountControl = component.customerForm.controls['bankAccountNumber'];
    bankAccountControl.setValue('123');
    expect(bankAccountControl.valid).toBeFalse();

    bankAccountControl.setValue('1234567890');
    expect(bankAccountControl.valid).toBeTrue();
  });

  it('should not call saveCustomer if form is invalid', () => {
    component.customerForm.controls['email'].setValue('invalid-email');
    component.onSubmit();
    expect(customerServiceSpy.saveCustomer).not.toHaveBeenCalled();
  });

  it('should call saveCustomer and reset the form on submit', fakeAsync(() => {
    customerServiceSpy.saveCustomer.and.returnValue(of(undefined));

    component.customerForm.setValue({
      FirstName: 'John',
      LastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '09121234567',
      dateOfBirth: '1990-01-01',
      bankAccountNumber: '1234567890'
    });

    expect(component.customerForm.valid).toBeTrue();
    component.onSubmit();
    tick();

    expect(customerServiceSpy.saveCustomer).toHaveBeenCalledWith(jasmine.objectContaining({
      FirstName: 'John',
      LastName: 'Doe',
      email: 'john.doe@example.com'
    }));


  // Check if the form is reset to empty strings
  expect(component.customerForm.value).toEqual({
    FirstName: '',
    LastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    bankAccountNumber: ''
  });
  expect(component.submitted).toBeFalse();
  }));
});
