import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputFieldComponent } from './components/input-field/input-field.component';

@NgModule({
  declarations: [
    InputFieldComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    InputFieldComponent
  ]
})
export class SharedModule { }
