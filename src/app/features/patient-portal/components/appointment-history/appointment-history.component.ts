import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '@core/services/appointment.service';
import { AppointmentModel } from '@models/appointment.model';
import { AppointmentStatus } from '@features/appointments/models/appointment.model';

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.scss']
})
export class AppointmentHistoryComponent implements OnInit {
  private appointmentService = inject(AppointmentService);

  appointments = signal<AppointmentModel[]>([]);
  loading = signal(false);
  filter = signal<'all' | 'upcoming' | 'past' | 'cancelled'>('all');

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading.set(true);
    this.appointmentService.getAppointments({}).subscribe({
      next: (appointments) => {
        const filtered = appointments.filter(a => a.patientId === 1);
        this.appointments.set(filtered);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error('Error loading appointments:', err);
        this.loading.set(false);
      }
    });
  }

  setFilter(filter: 'all' | 'upcoming' | 'past' | 'cancelled') {
    this.filter.set(filter);
  }

  get filteredAppointments(): AppointmentModel[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (this.filter()) {
      case 'upcoming':
        return this.appointments().filter(a => {
          const appointmentDate = new Date(a.date);
          return appointmentDate >= today && a.status !== AppointmentStatus.CANCELLED;
        });
      case 'past':
        return this.appointments().filter(a => {
          const appointmentDate = new Date(a.date);
          return appointmentDate < today && a.status !== AppointmentStatus.CANCELLED;
        });
      case 'cancelled':
        return this.appointments().filter(a => a.status === AppointmentStatus.CANCELLED);
      default:
        return this.appointments();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  canCancel(appointment: AppointmentModel): boolean {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    return appointmentDate > now && appointment.status !== AppointmentStatus.CANCELLED && appointment.status !== AppointmentStatus.COMPLETED;
  }

  cancelAppointment(appointmentId: number) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    this.appointmentService.updateAppointment(appointmentId, { status: AppointmentStatus.CANCELLED }).subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Error cancelling appointment:', err);
        alert('Failed to cancel appointment. Please try again.');
      }
    });
  }
}
