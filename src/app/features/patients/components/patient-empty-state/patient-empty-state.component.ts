import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-patient-empty-state',
  imports: [TranslocoPipe],
  templateUrl: './patient-empty-state.component.html',
  styleUrl: './patient-empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientEmptyStateComponent {
  hasSearch = input.required<boolean>();
  onClearFilter = output<void>();
}


