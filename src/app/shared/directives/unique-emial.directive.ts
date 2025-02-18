import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map, catchError, switchMap } from 'rxjs/operators';
import { CustomerService } from '../../core/services/customer.service';

@Directive({
  selector: '[appUniqueemail]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UniqueemailDirective,
      multi: true
    }
  ]
})
export class UniqueemailDirective implements AsyncValidator {

  constructor(private customerService: CustomerService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return this.customerService.isEmailTaken(control.value).pipe(
      debounceTime(500), // Wait for user to stop typing
      switchMap((isTaken: boolean) => isTaken ? of({ uniqueemail: true }) : of(null)),
      catchError(() => of(null)) // In case of error, assume email is unique
    );
  }
}
