import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InitialsPipe } from '@core/pipes/initials.pipe';

@Component({
  selector: 'app-patient-avatar',
  imports: [InitialsPipe],
  templateUrl: './patient-avatar.component.html',
  styleUrl: './patient-avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientAvatarComponent {
  fullName = input.required<string>();
}

