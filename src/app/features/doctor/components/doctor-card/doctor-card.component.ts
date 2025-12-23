import { Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LucideAngularModule, Phone, Copy, SquarePen, Trash2, Clock, Wallet, Award } from 'lucide-angular';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { PhoneFormatPipe } from '@core/pipes/phone-format.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserRole } from '@core/models/user.model';
import { Doctor } from '@features/doctor/models/doctor';
import { BreakpointService } from '@core/services/breakpoint.service';

@Component({
  selector: 'app-doctor-card',
  imports: [
    TranslocoPipe,
    LucideAngularModule,
    CdkCopyToClipboard,
    PhoneFormatPipe,
    NgxPermissionsModule,
  ],
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.scss'],
})
export class DoctorCardComponent {
  doctor = input.required<Doctor>();
  onEdit = output<Doctor>();
  onDelete = output<number>();
  onCopy = output<void>();
  onClick = output<Doctor>();

  protected readonly Phone = Phone;
  protected readonly Copy = Copy;
  protected readonly SquarePen = SquarePen;
  protected readonly Trash2 = Trash2;
  protected readonly Clock = Clock;
  protected readonly Wallet = Wallet;
  protected readonly Award = Award;
  protected readonly userRole = UserRole;

  constructor(protected readonly breakpointService: BreakpointService) {}

  handleCardClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('button') && !target.closest('[cdkCopyToClipboard]')) {
      this.onClick.emit(this.doctor());
    }
  }
}

