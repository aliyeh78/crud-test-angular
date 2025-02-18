import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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
  @Input() formControlName?: string;
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() parentForm?: FormGroup;

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
    console.log('Parent Form:', this.parentForm);
    console.log('FormControl Name:', this.formControlName);
    console.log('Control:', this.control);

    if (this.parentForm && this.formControlName && !this.control) {
      console.error(`FormControl with name "${this.formControlName}" not found in parent form.`);
      throw new Error(`FormControl with name "${this.formControlName}" not found in parent form.`);
    }
  }

  // ControlValueAccessor Methods
  writeValue(value: any): void {
    if (value !== this._value) {
        this._value = value;
        if (this.control) {
            this.control.setValue(value, { emitEvent: false });
        }
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
