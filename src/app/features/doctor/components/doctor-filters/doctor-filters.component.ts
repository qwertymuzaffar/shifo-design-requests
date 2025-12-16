import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { SpecializationModel } from '@core/models/specialization.model';

type Resource<T> = {
  isLoading: () => boolean;
  value: () => T;
  error: () => Error | undefined;
};

@Component({
  selector: 'app-doctor-filters',
  imports: [ReactiveFormsModule, TranslocoPipe],
  templateUrl: './doctor-filters.component.html',
  styleUrls: ['./doctor-filters.component.scss'],
})
export class DoctorFiltersComponent {
  specializationId = input.required<FormControl<number>>();
  search = input.required<FormControl<string>>();
  specializations = input.required<Resource<SpecializationModel[]>>();
}

