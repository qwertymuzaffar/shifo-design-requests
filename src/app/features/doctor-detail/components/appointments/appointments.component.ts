import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDetailComponent } from '../../doctor-detail.component';
import { LucideAngularModule, Calendar, Clock, User, FileText } from 'lucide-angular';
import { AppointmentService } from '@core/services/appointment.service';

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
  appointments = signal<any[]>([]);

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

    this.appointments.set([]);

    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'scheduled':
        return 'Scheduled';
      default:
        return status;
    }
  }
}
