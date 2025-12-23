import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDetailComponent } from '../../doctor-detail.component';
import { LucideAngularModule, Calendar, DollarSign, TrendingUp, Users } from 'lucide-angular';
import { AppointmentService } from '@core/services/appointment.service';

@Component({
  selector: 'app-doctor-statistics',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class DoctorStatisticsComponent implements OnInit {
  private parent = inject(DoctorDetailComponent);
  private appointmentService = inject(AppointmentService);

  doctor = this.parent.doctor;
  isLoading = signal(true);
  totalAppointments = signal(0);
  completedAppointments = signal(0);
  totalRevenue = signal(0);
  averageRating = signal(0);

  protected readonly Calendar = Calendar;
  protected readonly DollarSign = DollarSign;
  protected readonly TrendingUp = TrendingUp;
  protected readonly Users = Users;

  ngOnInit(): void {
    const doctorId = this.doctor()?.id;
    if (doctorId) {
      this.loadStatistics(doctorId);
    }
  }

  private loadStatistics(doctorId: number): void {
    this.isLoading.set(true);

    this.totalAppointments.set(0);
    this.completedAppointments.set(0);
    this.totalRevenue.set(0);
    this.averageRating.set(0);

    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }
}
