import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AgePipe } from '@core/pipes/patient-age.pipe';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-patient-header',
  imports: [AgePipe, TranslocoPipe],
  templateUrl: './patient-header.component.html',
  styleUrl: './patient-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientHeaderComponent {
  fullName = input.required<string>();
  birthDate = input.required<string>();
  id = input.required<number>();
}

