import { Component, input, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { LucideAngularModule, X, LoaderCircle, Trash2 } from 'lucide-angular';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserRole } from '@core/models/user.model';

@Component({
  selector: 'app-procedure-management',
  imports: [
    FormsModule,
    TranslocoPipe,
    LucideAngularModule,
    NgxPermissionsModule,
  ],
  templateUrl: './procedure-management.component.html',
  styleUrls: ['./procedure-management.component.scss'],
})
export class ProcedureManagementComponent {
  isVisible = input.required<boolean>();
  procedures = input.required<any>();
  newProcedureName = input.required<string>();
  isCreating = input.required<boolean>();
  showAll = input.required<boolean>();

  close = output<void>();
  create = output<void>();
  delete = output<number>();
  toggleShowAll = output<void>();
  newProcedureNameChange = output<string>();

  protected readonly X = X;
  protected readonly LoaderCircle = LoaderCircle;
  protected readonly Trash2 = Trash2;
  protected readonly userRole = UserRole;

  visibleProcedures = computed(() => {
    const allProcedures = this.procedures().value();
    if (this.showAll() || allProcedures.length <= 12) {
      return allProcedures;
    }
    return allProcedures.slice(0, 12);
  });
}

