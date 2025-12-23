import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDetailComponent } from '../../doctor-detail.component';
import { LucideAngularModule, Calendar, Clock, User, FileText } from 'lucide-angular';
import { AppointmentService } from '@core/services/appointment.service';
import { AppointmentModel } from '@models/appointment.model';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class DoctorAppointmentsComponent implements OnInit {
  private parent = inject(DoctorDetailComponent);
  private appointmentService = inject(AppointmentService);

  doctor = this.parent.doctor;
  isLoading = signal(true);
  appointments = signal<AppointmentModel[]>([]);

  protected readonly Calendar = Calendar;
  protected readonly Clock = Clock;
  protected readonly User = User;
  protected readonly FileText = FileText;

  ngOnInit(): void {
    const doctorId = this.doctor()?.id;
    if (doctorId) {
      this.loadAppointments(doctorId);
    }
  }

  private loadAppointments(doctorId: number): void {
    this.isLoading.set(true);

    this.appointmentService.getAppointments({ doctorIds: doctorId.toString() })
      .subscribe({
        next: (appointments) => {
          this.appointments.set(appointments);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading appointments:', error);
          this.appointments.set([]);
          this.isLoading.set(false);
        }
      });
  }

  getStatusColor(status: string): string {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
      case 'CANCELLED_FOREVER':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'SCHEDULED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'TEMPORARY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  }

  getStatusText(status: string): string {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'CANCELLED_FOREVER':
        return 'Cancelled';
      case 'SCHEDULED':
        return 'Scheduled';
      case 'TEMPORARY':
        return 'Temporary';
      default:
        return status;
    }
  }
}
