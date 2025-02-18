import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CustomerListComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [CustomerListComponent],
})
export class CustomerListModule {}
