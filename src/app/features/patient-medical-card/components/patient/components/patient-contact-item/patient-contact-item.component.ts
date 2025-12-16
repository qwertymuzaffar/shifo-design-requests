import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-patient-contact-item',
  imports: [NgClass],
  templateUrl: './patient-contact-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientContactItemComponent {
  icon = input.required<string>();
  label = input<string>();
  value = input.required<string>();
  colSpan = input<string>('');
}
