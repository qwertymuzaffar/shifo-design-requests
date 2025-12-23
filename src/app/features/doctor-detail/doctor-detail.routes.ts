import { Routes } from "@angular/router";

export const DOCTOR_DETAIL_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import("./doctor-detail.component").then((c) => c.DoctorDetailComponent),
    children: [
      {path: "", redirectTo: "overview", pathMatch: "full"},
      {path: "overview", loadComponent: () => import("./components/overview/overview.component").then((c) => c.DoctorOverviewComponent)},
      {path: "statistics", loadComponent: () => import("./components/statistics/statistics.component").then((c) => c.DoctorStatisticsComponent)},
      {path: "appointments", loadComponent: () => import("./components/appointments/appointments.component").then((c) => c.DoctorAppointmentsComponent)},
      {path: "schedule", loadComponent: () => import("./components/schedule/schedule.component").then((c) => c.DoctorScheduleComponent)}
    ]
  }
]
