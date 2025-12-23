import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDetailComponent } from '../../doctor-detail.component';
import { LucideAngularModule, Phone, Mail, Clock, Wallet, Award, Stethoscope } from 'lucide-angular';
import { PhoneFormatPipe } from '@core/pipes/phone-format.pipe';

@Component({
  selector: 'app-doctor-overview',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PhoneFormatPipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class DoctorOverviewComponent {
  private parent = inject(DoctorDetailComponent);
  doctor = computed(() => this.parent.doctor());

  protected readonly Phone = Phone;
  protected readonly Mail = Mail;
  protected readonly Clock = Clock;
  protected readonly Wallet = Wallet;
  protected readonly Award = Award;
  protected readonly Stethoscope = Stethoscope;
}
