import { Routes } from "@angular/router";
import { AUTH_GUARD } from "@core/guards/auth.guard";
import { UserRole } from "@core/models/user.model";
import { ngxPermissionsGuard } from "ngx-permissions";

export const routes: Routes = [
   {
      path: "login",
      loadComponent: () => import("./login/login.component").then((m) => m.LoginComponent),
   },
   {
      path: "deferred-appointments",
      loadComponent: () => import("@features/deferred-appointments/deferred-appointments.component").then((m) => m.DeferredAppointmentsComponent),
   },
   {
      path: "",
      loadComponent: () => import("./layout/layout.component").then((m) => m.LayoutComponent),
      canActivate: [AUTH_GUARD],
      canActivateChild: [AUTH_GUARD],
      children: [
         {
            path: "dashboard",
            loadComponent: () => import("@features/dashboard/dashboard.component").then((m) => m.DashboardComponent),
         },
         {
            path: "doctor",
            loadComponent: () => import("@features/doctor/doctor.component").then((m) => m.DoctorComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN, UserRole.RECEPTIONIST],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "doctor/:doctor_id",
            loadChildren: () =>
               import("./features/doctor-detail/doctor-detail.routes").then((r) => r.DOCTOR_DETAIL_ROUTES),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN, UserRole.RECEPTIONIST],
                redirectTo: "dashboard"
              }
            },
         },
         {
            path: "patients",
            loadComponent: () => import("@features/patients/patients.component").then((m) => m.PatientsComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN, UserRole.RECEPTIONIST],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "patient-requests",
            loadComponent: () => import("@features/patient-requests/patient-requests.component").then((m) => m.PatientRequestsComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN, UserRole.RECEPTIONIST],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "patients/:patient_id",
            loadChildren: () =>
               import("./features/patient-medical-card/patient-medical-card.routes").then((r) => r.PATIENT_MEDICAL_CARD_ROUTES),
         },
         {
            path: "appointments",
            loadComponent: () => import("@features/appointments/appointments.component").then((m) => m.AppointmentsComponent),
            pathMatch: "full",
         },
         {
            path: "smart-scheduler",
            loadComponent: () => import("@features/smart-scheduler/smart-scheduler.component").then((m) => m.SmartSchedulerComponent),
            pathMatch: "full",
         },
          {
            path: "finances",
            loadComponent: () => import("@features/finances/finances.component").then((c) => c.FinancesComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN, UserRole.RECEPTIONIST],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "analytics",
            loadComponent: () => import("@features/analytics/analytics.component").then((m) => m.AnalyticsComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "analytics/debtors",
            loadComponent: () => import("@features/analytics/debtors/debtors.component").then((m) => m.DebtorsComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "analytics/overpayments",
            loadComponent: () => import("@features/analytics/overpayments/overpayments.component").then((m) => m.OverpaymentsComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "laboratory",
            loadComponent: () => import("@features/laboratory/laboratory.component").then((m) => m.LaboratoryComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "prescriptions",
            loadComponent: () => import("@features/prescriptions/prescriptions.component").then((m) => m.PrescriptionsComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN, UserRole.DOCTOR],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "inventory",
            loadComponent: () => import("@features/inventory/inventory.component").then((m) => m.InventoryComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "queue",
            loadComponent: () => import("@features/queue/queue.component").then((m) => m.QueueComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN, UserRole.RECEPTIONIST],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "insurance",
            loadComponent: () => import("@features/insurance/insurance.component").then((m) => m.InsuranceComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN, UserRole.RECEPTIONIST],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "loyalty",
            loadComponent: () => import("@features/loyalty/loyalty.component").then((m) => m.LoyaltyComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN, UserRole.RECEPTIONIST],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "chat",
            loadComponent: () => import("@features/chat/chat.component").then((m) => m.ChatComponent),
            pathMatch: "full",
         },
         {
            path: "staff",
            loadComponent: () => import("@features/staff/staff.component").then((m) => m.StaffComponent),
            canActivate: [ngxPermissionsGuard],
            data: {
              permissions: {
                only: [UserRole.ADMIN],
                redirectTo: "dashboard"
              }
            },
            pathMatch: "full",
         },
         {
            path: "patient-portal",
            loadComponent: () => import("@features/patient-portal/patient-portal.component").then((m) => m.PatientPortalComponent),
            pathMatch: "full",
         },
         { path: "", redirectTo: "patients", pathMatch: "full" },
      ],
   },
   {
      path: "**",
      loadComponent: () => import("./features/not-found/not-found.component").then((c) => c.NotFoundComponent),
  },
];
