import { Component, inject } from '@angular/core';
import { BreakpointService } from '@core/services/breakpoint.service';

@Component({
  selector: 'app-skeleton-doctor',
  standalone: true,
  imports: [],
  templateUrl: './doctor-skeleton.component.html',
  styleUrls: ['./doctor-skeleton.component.scss'],
})
export class DoctorSkeletonComponent {
  protected readonly breakpointService = inject(BreakpointService);
}

