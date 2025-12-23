export interface DoctorSchedule {
  id?: string;
  doctorId: number;
  dayOfWeek: number;
  isWorking: boolean;
  startTime: string;
  endTime: string;
  breakStart?: string | null;
  breakEnd?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeekSchedule {
  [dayOfWeek: number]: DoctorSchedule;
}
