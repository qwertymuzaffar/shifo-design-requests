import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function customEmailValidator(): ValidatorFn {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    const isValid = emailRegex.test(value);
    return isValid ? null : { email: true };
  };
}
