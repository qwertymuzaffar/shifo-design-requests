import { AppointmentStatus } from '@features/appointments/models/appointment.model';

export function getAppointmentColor(status: AppointmentStatus): string {
  switch (status) {
    case AppointmentStatus.COMPLETED:
      return 'bg-green-100 border-green-200 text-green-800';
    case AppointmentStatus.CANCELLED:
      return 'bg-red-100 border-red-200 text-red-800';
    case AppointmentStatus.SCHEDULED:
      return 'bg-blue-100 border-blue-200 text-blue-800';
    case AppointmentStatus.TEMPORARY:
      return 'bg-yellow-100 border-yellow-200 text-yellow-800';
    case AppointmentStatus.CANCELLED_FOREVER:
      return 'bg-pink-100 border-pink-200 text-pink-800';
    default:
      return 'bg-blue-100 border-blue-200 text-blue-800';
  }
}

