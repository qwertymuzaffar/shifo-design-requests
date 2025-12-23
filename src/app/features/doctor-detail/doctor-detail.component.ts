import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '@core/services/toast.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { DoctorService } from '@core/services/doctor.service';
import { Doctor } from '../doctor/models/doctor';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [
    TranslocoPipe,
    RouterModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './doctor-detail.component.html',
  styleUrl: './doctor-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorDetailComponent implements OnInit {
  doctorService = inject(DoctorService);
  activeRoute = inject(ActivatedRoute);
  toastService = inject(ToastService);
  loading = signal(false);
  doctor = signal<Doctor | null>(null);

  ngOnInit(): void {
    const doctorId = this.activeRoute.snapshot.paramMap.get("doctor_id");
    if (doctorId) {
      this.loading.set(true);
      this.doctorService.getDoctorById(+doctorId).subscribe({
        next: (doctor: Doctor) => {
          this.loading.set(false);
          this.doctor.set(doctor);
        },
        error: (err) => {
          this.loading.set(false);
          this.toastService.openToast(err.message, 'Error', 'error');
        },
      });
    }
  }
}
