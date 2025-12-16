import { Component, input, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { LucideAngularModule, X, LoaderCircle, Trash2 } from 'lucide-angular';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserRole } from '@core/models/user.model';

@Component({
  selector: 'app-specialization-management',
  imports: [
    FormsModule,
    TranslocoPipe,
    LucideAngularModule,
    NgxPermissionsModule,
  ],
  templateUrl: './specialization-management.component.html',
  styleUrls: ['./specialization-management.component.scss'],
})
export class SpecializationManagementComponent {
  isVisible = input.required<boolean>();
  specializations = input.required<any>();
  newSpecializationName = input.required<string>();
  isCreating = input.required<boolean>();
  showAll = input.required<boolean>();

  close = output<void>();
  create = output<void>();
  delete = output<number>();
  toggleShowAll = output<void>();
  newSpecializationNameChange = output<string>();

  protected readonly X = X;
  protected readonly LoaderCircle = LoaderCircle;
  protected readonly Trash2 = Trash2;
  protected readonly userRole = UserRole;

  visibleSpecializations = computed(() => {
    const allSpecs = this.specializations().value();
    if (this.showAll() || allSpecs.length <= 12) {
      return allSpecs;
    }
    return allSpecs.slice(0, 12);
  });
}

