import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserRole } from '@core/models/user.model';

@Component({
  selector: 'app-patient-list-header',
  imports: [TranslocoPipe, NgxPermissionsModule],
  templateUrl: './patient-list-header.component.html',
  styleUrl: './patient-list-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientListHeaderComponent {
  onAddClick = output<void>();
  onNewRequestsClick = output<void>();
  pendingRequestsCount = input<number>(0);
  protected readonly userRole = UserRole;
}


