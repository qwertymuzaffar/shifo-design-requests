import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  templateId?: number;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  template_type: string;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private httpClient = inject(HttpClient);
  private edgeFunctionUrl = `${environment.supabaseUrl}/functions/v1/send-email-notification`;

  sendEmail(request: SendEmailRequest): Observable<any> {
    return this.httpClient.post(this.edgeFunctionUrl, request);
  }

  sendAppointmentReminder(
    patientEmail: string,
    patientName: string,
    appointmentDate: string,
    appointmentTime: string,
    doctorName: string,
    appointmentType: string
  ): Observable<any> {
    const body = this.formatAppointmentReminderEmail({
      patientName,
      appointmentDate,
      appointmentTime,
      doctorName,
      appointmentType,
    });

    return this.sendEmail({
      to: patientEmail,
      subject: `Appointment Reminder - ${appointmentDate} at ${appointmentTime}`,
      body,
    });
  }

  sendLabResultsNotification(
    patientEmail: string,
    patientName: string,
    testDate: string,
    testNames: string
  ): Observable<any> {
    const body = this.formatLabResultsEmail({
      patientName,
      testDate,
      testNames,
    });

    return this.sendEmail({
      to: patientEmail,
      subject: 'Your Laboratory Results are Ready',
      body,
    });
  }

  sendWelcomeEmail(patientEmail: string, patientName: string): Observable<any> {
    const body = this.formatWelcomeEmail(patientName);

    return this.sendEmail({
      to: patientEmail,
      subject: 'Welcome to Our Clinic',
      body,
    });
  }

  private formatAppointmentReminderEmail(data: {
    patientName: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorName: string;
    appointmentType: string;
  }): string {
    return `
Dear ${data.patientName},

This is a reminder about your upcoming appointment:

Date: ${data.appointmentDate}
Time: ${data.appointmentTime}
Doctor: ${data.doctorName}
Type: ${data.appointmentType}

Please arrive 10 minutes early for check-in.

If you need to reschedule, please contact us at least 24 hours in advance.

Best regards,
Clinic Team
    `.trim();
  }

  private formatLabResultsEmail(data: {
    patientName: string;
    testDate: string;
    testNames: string;
  }): string {
    return `
Dear ${data.patientName},

Your laboratory test results are now available. Please log in to your patient portal to view them, or visit our clinic to discuss them with your doctor.

Test Date: ${data.testDate}
Tests Performed: ${data.testNames}

If you have any questions, please contact us.

Best regards,
Clinic Team
    `.trim();
  }

  private formatWelcomeEmail(patientName: string): string {
    return `
Dear ${patientName},

Welcome to our clinic! We are pleased to have you as our patient.

Your account has been successfully created. You can now:
- Schedule appointments online
- View your medical records
- Access lab results
- Manage prescriptions

Your loyalty program account has also been activated. You'll earn points with each visit!

If you need any assistance, please don't hesitate to contact us.

Best regards,
Clinic Team
    `.trim();
  }
}
