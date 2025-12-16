import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-patient-search',
  imports: [ReactiveFormsModule, TranslocoPipe],
  templateUrl: './patient-search.component.html',
  styleUrl: './patient-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientSearchComponent {
  searchControl = input.required<any>();
}

