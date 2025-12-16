import { Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  LucideAngularModule,
  Plus,
  Settings,
} from 'lucide-angular';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserRole } from '@core/models/user.model';

@Component({
  selector: 'app-doctor-header',
  imports: [TranslocoPipe, LucideAngularModule, NgxPermissionsModule],
  templateUrl: './doctor-header.component.html',
  styleUrls: ['./doctor-header.component.scss'],
})
export class DoctorHeaderComponent {
  isSpecializationManagementVisible = input.required<boolean>();
  isProcedureManagementVisible = input.required<boolean>();
  userRole = input.required<typeof UserRole>();

  toggleSpecialization = output<void>();
  toggleProcedure = output<void>();
  openDialog = output<void>();

  protected readonly Settings = Settings;
  protected readonly Plus = Plus;
}

