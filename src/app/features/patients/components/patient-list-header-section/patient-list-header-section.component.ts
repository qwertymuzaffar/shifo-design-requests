import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-patient-list-header-section',
  imports: [TranslocoPipe],
  templateUrl: './patient-list-header-section.component.html',
  styleUrl: './patient-list-header-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientListHeaderSectionComponent {
  total = input.required<number>();
}


