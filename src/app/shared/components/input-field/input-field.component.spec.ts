import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ControlValueAccessor, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() formControlName: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() parentForm?: FormGroup; // Add this input property

  private _value: any = '';

  // Getter to safely access the form control
  get control(): FormControl | null {
    if (!this.parentForm || !this.formControlName) {
      console.warn('No parent form or formControlName provided!');
      return null;
    }
    return this.parentForm.get(this.formControlName) as FormControl;
  }

  ngOnInit(): void {
    if (this.parentForm && this.formControlName && !this.control) {
      // If the form control is not already in the parent form, create it
      this.parentForm.addControl(this.formControlName, new FormControl('', Validators.required));
    }
  }

  // ControlValueAccessor Methods
  writeValue(value: any): void {
    this._value = value;
    if (this.control) {
      this.control.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.control) {
      isDisabled ? this.control.disable() : this.control.enable();
    }
  }

  // Internal Methods
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this._value = target.value;
    if (this.control) {
      this.control.setValue(this._value, { emitEvent: true });
    }
    this.onChange(this._value);
  }

  // Helper Methods
  isControlTouched(): boolean {
    return this.control?.touched ?? false;
  }

  isControlInvalid(): boolean {
    return this.control?.invalid ?? false;
  }

  hasError(errorName: string): boolean {
    return this.control?.hasError(errorName) ?? false;
  }
}
