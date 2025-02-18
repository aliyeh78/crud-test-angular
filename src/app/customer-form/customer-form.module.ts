import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerFormComponent } from './customer-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CustomerFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [CustomerFormComponent]
})
export class CustomerFormModule {}
