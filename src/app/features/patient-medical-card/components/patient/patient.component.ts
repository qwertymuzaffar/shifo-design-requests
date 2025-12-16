import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PatientMedicalCardModel } from '@features/patient-medical-card/models/patient-medical-card.model';
import { PatientService } from '@features/patients/services/patient.service';
import { PatientAvatarComponent } from './components/patient-avatar/patient-avatar.component';
import { PatientHeaderComponent } from './components/patient-header/patient-header.component';
import { PatientContactItemComponent } from './components/patient-contact-item/patient-contact-item.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-patient',
  imports: [PatientAvatarComponent, PatientHeaderComponent, PatientContactItemComponent, TranslocoPipe],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientComponent {
  patientService = inject(PatientService)

  patient = rxResource({
    stream: () => this.patientService.patientMedicalCardInfo$,
    defaultValue: {loading: false, data: {} as PatientMedicalCardModel}
  })
}
