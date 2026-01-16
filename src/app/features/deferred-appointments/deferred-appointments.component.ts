import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeferredAppointmentService } from '@core/services/deferred-appointment.service';
import { DeferredAppointmentModel } from '@core/models/deferred-appointment.model';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-deferred-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deferred-appointments.component.html',
  styleUrls: ['./deferred-appointments.component.scss']
})
export class DeferredAppointmentsComponent implements OnInit {
  private deferredAppointmentService = inject(DeferredAppointmentService);
  private userService = inject(UserService);

  appointments = signal<DeferredAppointmentModel[]>([]);
  loading = signal(false);
  currentDoctorId = signal<number | null>(null);
  filterStatus = signal<'all' | 'pending' | 'taken'>('pending');

  ngOnInit() {
    this.loadCurrentDoctor();
    this.loadAppointments();
  }

  loadCurrentDoctor() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.currentDoctorId.set(user.id);
      },
      error: (err: unknown) => {
        console.error('Error loading current doctor:', err);
      }
    });
  }

  loadAppointments() {
    this.loading.set(true);
    const status = this.filterStatus() === 'all' ? undefined : this.filterStatus();

    this.deferredAppointmentService.getDeferredAppointments(status).subscribe({
      next: (appointments) => {
        this.appointments.set(appointments);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error('Error loading deferred appointments:', err);
        this.loading.set(false);
      }
    });
  }

  setFilter(status: 'all' | 'pending' | 'taken') {
    this.filterStatus.set(status);
    this.loadAppointments();
  }

  takeAppointment(appointmentId: string) {
    const doctorId = this.currentDoctorId();
    if (!doctorId) {
      alert('Unable to identify current doctor');
      return;
    }

    if (!confirm('Are you sure you want to take this appointment?')) {
      return;
    }

    this.deferredAppointmentService.takeAppointment(appointmentId, doctorId).subscribe({
      next: () => {
        alert('Appointment taken successfully!');
        this.loadAppointments();
      },
      error: (err: unknown) => {
        console.error('Error taking appointment:', err);
        alert('Failed to take appointment. Please try again.');
      }
    });
  }

  cancelAppointment(appointmentId: string) {
    if (!confirm('Are you sure you want to cancel this deferred appointment?')) {
      return;
    }

    this.deferredAppointmentService.cancelDeferredAppointment(appointmentId).subscribe({
      next: () => {
        alert('Appointment cancelled successfully!');
        this.loadAppointments();
      },
      error: (err: unknown) => {
        console.error('Error cancelling appointment:', err);
        alert('Failed to cancel appointment. Please try again.');
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'taken':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'taken':
        return 'Taken';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }
}
