import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Customer } from '../core/models/customer.model';
import { CustomerService } from '../core/services/customer.service';
import { UniqueemailDirective } from '../shared/directives/unique-emial.directive';
import { PhoneValidatorService } from '../core/validators/phone-validator.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent {

  customerForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      FirstName: ['', [Validators.required, Validators.minLength(2)]],
      LastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, PhoneValidatorService.validateMobile]],
      dateOfBirth: ['', [Validators.required]],
      bankAccountNumber: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.customerForm.valid) {
      this.customerService.saveCustomer(this.customerForm.value);
      alert('Customer saved successfully!');

      // Reset form fields explicitly with empty strings
      this.customerForm.reset();
      this.customerForm.patchValue({
        FirstName: '',
        LastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        bankAccountNumber: ''
      });

      this.submitted = false;
    }
  }


}
