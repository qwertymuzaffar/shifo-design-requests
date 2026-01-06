import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineBookingComponent } from './components/online-booking/online-booking.component';
import { MyDocumentsComponent } from './components/my-documents/my-documents.component';
import { AppointmentHistoryComponent } from './components/appointment-history/appointment-history.component';

@Component({
  selector: 'app-patient-portal',
  standalone: true,
  imports: [
    CommonModule,
    OnlineBookingComponent,
    MyDocumentsComponent,
    AppointmentHistoryComponent
  ],
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.scss']
})
export class PatientPortalComponent {
  activeTab = signal<'booking' | 'documents' | 'history'>('booking');

  setActiveTab(tab: 'booking' | 'documents' | 'history') {
    this.activeTab.set(tab);
  }
}
