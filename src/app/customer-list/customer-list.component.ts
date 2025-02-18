import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Customer } from '../core/models/customer.model';
import { CustomerService } from '../core/services/customer.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customerForm!: FormGroup;
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null; // Customer being edited, if any
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.loadCustomers();
  }

  // Load customers from the service
  loadCustomers(): void {
    this.loading = true;
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.loading = false;
    });
  }

  // Add or update customer
  onSubmit(): void {
    if (this.customerForm.valid) {
      this.loading = true;
      if (this.selectedCustomer) {
        // Update existing customer
        this.updateCustomer();
      } else {
        // Add new customer
        this.addCustomer();
      }
    }
  }

  // Add new customer
  addCustomer(): void {
    const newCustomer: Customer = this.customerForm.value;
    this.customerService.saveCustomer(newCustomer).subscribe(
      () => {
        this.loadCustomers(); // Reload customers
        this.resetForm(); // Reset form after adding
        this.loading = false;
      },
      (error) => {
        console.error('Error adding customer:', error);
        this.loading = false;
      }
    );
  }

  // Update existing customer
  updateCustomer(): void {
    if (this.selectedCustomer) {
      this.customerService.saveCustomer({ ...this.selectedCustomer, ...this.customerForm.value }).subscribe(
        () => {
          this.loadCustomers(); // Reload customers after update
          this.resetForm(); // Reset form after update
          this.loading = false;
        },
        (error) => {
          console.error('Error updating customer:', error);
          this.loading = false;
        }
      );
    }
  }

  // Edit customer (populate form with selected customer data)
  editCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.customerForm.patchValue({
      FirstName: customer.FirstName,
      LastName: customer.LastName,
      email: customer.email,
    });
  }

  // Delete customer
  deleteCustomer(id: number): void {
    this.loading = true;
    this.customerService.deleteCustomer(id).subscribe(
      () => {
        this.loadCustomers(); // Reload customers after deletion
        this.loading = false;
      },
      (error) => {
        console.error('Error deleting customer:', error);
        this.loading = false;
      }
    );
  }

  // Reset the form
  resetForm(): void {
    this.customerForm.reset();
    this.selectedCustomer = null;
  }
}
