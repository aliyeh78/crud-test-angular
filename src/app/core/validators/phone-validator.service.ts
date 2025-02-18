import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PhoneValidatorService {
  static validateMobile(control: AbstractControl): ValidationErrors | null {
    const phonePattern = /^[0-9]{10,}$/; // Ensures 10+ digits only

    if (!control.value || phonePattern.test(control.value)) {
      return null;
    }

    return { invalidMobile: true };
  }
}
