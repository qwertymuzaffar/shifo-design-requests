import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '@core/services/doctor.service';
import { SpecializationService } from '@core/services/specialization.service';
import { AppointmentService } from '@core/services/appointment.service';
import { Doctor } from '@features/doctor/models/doctor';
import { SpecializationModel } from '@core/models/specialization.model';
import { AppointmentStatus } from '@features/appointments/models/appointment.model';

interface TimeSlot {
  time: string;
  available: boolean;
}

@Component({
  selector: 'app-online-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './online-booking.component.html',
  styleUrls: ['./online-booking.component.scss']
})
export class OnlineBookingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private doctorService = inject(DoctorService);
  private specializationService = inject(SpecializationService);
  private appointmentService = inject(AppointmentService);

  bookingForm: FormGroup;
  specializations = signal<SpecializationModel[]>([]);
  doctors = signal<Doctor[]>([]);
  availableSlots = signal<TimeSlot[]>([]);
  loading = signal(false);
  submitting = signal(false);

  minDate: string;

  constructor() {
    this.bookingForm = this.fb.group({
      specialization: ['', Validators.required],
      doctor: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      symptoms: ['', Validators.required],
      notes: ['']
    });

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadSpecializations();
    this.setupFormListeners();
  }

  loadSpecializations() {
    this.loading.set(true);
    this.specializationService.getSpecializations().subscribe({
      next: (specs) => {
        this.specializations.set(specs);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading specializations:', err);
        this.loading.set(false);
      }
    });
  }

  setupFormListeners() {
    this.bookingForm.get('specialization')?.valueChanges.subscribe((specializationId) => {
      if (specializationId) {
        this.loadDoctorsBySpecialization(Number(specializationId));
        this.bookingForm.patchValue({ doctor: '', time: '' });
        this.availableSlots.set([]);
      }
    });

    this.bookingForm.get('doctor')?.valueChanges.subscribe((doctorId) => {
      const date = this.bookingForm.get('date')?.value;
      if (doctorId && date) {
        this.loadAvailableSlots(Number(doctorId), date);
        this.bookingForm.patchValue({ time: '' });
      }
    });

    this.bookingForm.get('date')?.valueChanges.subscribe((date) => {
      const doctorId = this.bookingForm.get('doctor')?.value;
      if (doctorId && date) {
        this.loadAvailableSlots(Number(doctorId), date);
        this.bookingForm.patchValue({ time: '' });
      }
    });
  }

  loadDoctorsBySpecialization(specializationId: number) {
    this.loading.set(true);
    this.doctorService.getDoctors().subscribe({
      next: (pagination) => {
        const filtered = pagination.items.filter(d => d.specialization?.id === specializationId);
        this.doctors.set(filtered);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error('Error loading doctors:', err);
        this.loading.set(false);
      }
    });
  }

  loadAvailableSlots(doctorId: number, date: string) {
    const slots: TimeSlot[] = [
      { time: '09:00', available: true },
      { time: '09:30', available: true },
      { time: '10:00', available: false },
      { time: '10:30', available: true },
      { time: '11:00', available: true },
      { time: '11:30', available: false },
      { time: '12:00', available: true },
      { time: '13:00', available: true },
      { time: '13:30', available: true },
      { time: '14:00', available: false },
      { time: '14:30', available: true },
      { time: '15:00', available: true },
      { time: '15:30', available: true },
      { time: '16:00', available: true },
      { time: '16:30', available: false },
      { time: '17:00', available: true }
    ];

    this.availableSlots.set(slots);
  }

  selectTime(time: string, available: boolean) {
    if (available) {
      this.bookingForm.patchValue({ time });
    }
  }

  submitBooking() {
    if (this.bookingForm.invalid) {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting.set(true);
    const formValue = this.bookingForm.value;

    const appointmentData = {
      patient_id: 1,
      doctor_id: Number(formValue.doctor),
      appointment_date: formValue.date,
      appointment_time: formValue.time,
      duration: 30,
      symptoms: formValue.symptoms,
      notes: formValue.notes,
      status: AppointmentStatus.SCHEDULED
    };

    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: () => {
        alert('Appointment booked successfully!');
        this.bookingForm.reset();
        this.doctors.set([]);
        this.availableSlots.set([]);
        this.submitting.set(false);
      },
      error: (err: unknown) => {
        console.error('Error booking appointment:', err);
        alert('Failed to book appointment. Please try again.');
        this.submitting.set(false);
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return 'This field is required';
      }
    }
    return '';
  }
}
