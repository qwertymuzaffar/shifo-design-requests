import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientModel } from '@features/patients/models/patient.model';
import { Copy, LucideAngularModule, Phone, SquarePen, Trash2 } from 'lucide-angular';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { PhoneFormatPipe } from '@core/pipes/phone-format.pipe';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserRole } from '@core/models/user.model';

@Component({
  selector: 'app-patient-card',
  imports: [
    RouterLink,
    LucideAngularModule,
    CdkCopyToClipboard,
    PhoneFormatPipe,
    TranslocoPipe,
    NgxPermissionsModule,
  ],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientCardComponent {
  patient = input.required<PatientModel>();
  onEdit = output<PatientModel>();
  onDelete = output<number>();
  onCopy = output<void>();

  protected readonly Copy = Copy;
  protected readonly Phone = Phone;
  protected readonly SquarePen = SquarePen;
  protected readonly Trash2 = Trash2;
  protected readonly userRole = UserRole;
}


