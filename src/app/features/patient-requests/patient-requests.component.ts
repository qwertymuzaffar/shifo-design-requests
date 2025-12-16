import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LucideAngularModule, ArrowLeft, Search, Filter, Check, X, Trash2, Eye } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { PatientRequest } from '../patients/models/patient-request.model';

@Component({
  selector: 'app-patient-requests',
  imports: [
    TranslocoPipe,
    LucideAngularModule,
    FormsModule,
  ],
  templateUrl: './patient-requests.component.html',
  styleUrl: './patient-requests.component.scss',
})
export class PatientRequestsComponent {
  readonly ArrowLeftIcon = ArrowLeft;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly CheckIcon = Check;
  readonly XIcon = X;
  readonly Trash2Icon = Trash2;
  readonly EyeIcon = Eye;

  searchQuery = signal('');
  selectedStatus = signal<string>('all');
  selectedRequest = signal<PatientRequest | null>(null);

  mockRequests = signal<PatientRequest[]>([
    {
      id: '1',
      fullName: 'Алиев Фарход Рахимович',
      phone: '+992 93 123 45 67',
      birthDate: '1990-05-15',
      address: { city: 'Душанбе', street: 'ул. Рудаки', house: '25', apartment: '12' },
      emergencyContact: { name: 'Алиева Нигора', phone: '+992 93 765 43 21', relation: 'Жена' },
      allergies: 'Пенициллин',
      medicalHistory: 'Гипертония, диабет 2 типа',
      phoneInsurance: '+992 93 111 22 33',
      telegramUserId: 'tg_user_123456',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      fullName: 'Каримова Мухаббат Абдуллоевна',
      phone: '+992 90 234 56 78',
      birthDate: '1985-08-22',
      address: { city: 'Душанбе', street: 'пр. Сомони', house: '45', apartment: '8' },
      emergencyContact: { name: 'Каримов Абдулло', phone: '+992 90 876 54 32', relation: 'Муж' },
      allergies: 'Аспирин, йод',
      medicalHistory: 'Астма',
      phoneInsurance: '+992 90 222 33 44',
      telegramUserId: 'tg_user_789012',
      status: 'pending',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      fullName: 'Рахимов Джавлон Бахриддинович',
      phone: '+992 92 345 67 89',
      birthDate: '1995-03-10',
      address: { city: 'Душанбе', street: 'ул. Фирдавси', house: '78', apartment: '15' },
      emergencyContact: { name: 'Рахимова Дилором', phone: '+992 92 987 65 43', relation: 'Мать' },
      telegramUserId: 'tg_user_345678',
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      fullName: 'Назарова Шахноза Шерзодовна',
      phone: '+992 91 456 78 90',
      birthDate: '1992-11-30',
      address: { city: 'Душанбе', street: 'ул. Айни', house: '12', apartment: '3' },
      emergencyContact: { name: 'Назаров Шерзод', phone: '+992 91 098 76 54', relation: 'Отец' },
      allergies: 'Сульфаниламиды',
      medicalHistory: 'Язва желудка',
      phoneInsurance: '+992 91 333 44 55',
      telegramUserId: 'tg_user_901234',
      status: 'pending',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      fullName: 'Сафаров Искандар Махмудович',
      phone: '+992 93 567 89 01',
      birthDate: '1988-07-18',
      address: { city: 'Душанбе', street: 'ул. Лахути', house: '33', apartment: '20' },
      emergencyContact: { name: 'Сафарова Зарина', phone: '+992 93 109 87 65', relation: 'Жена' },
      medicalHistory: 'Здоров',
      phoneInsurance: '+992 93 444 55 66',
      telegramUserId: 'tg_user_567890',
      status: 'approved',
      reviewNotes: 'Все данные проверены и корректны',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      fullName: 'Махмудов Рустам Шарифович',
      phone: '+992 90 678 90 12',
      birthDate: '1993-02-25',
      address: { city: 'Душанбе', street: 'ул. Пушкина', house: '55', apartment: '7' },
      emergencyContact: { name: 'Махмудова Гулнора', phone: '+992 90 210 98 76', relation: 'Сестра' },
      allergies: 'Антибиотики',
      telegramUserId: 'tg_user_678901',
      status: 'rejected',
      reviewNotes: 'Дублирующий запрос',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  constructor(private router: Router) {}

  get filteredRequests() {
    let filtered = this.mockRequests();

    if (this.selectedStatus() !== 'all') {
      filtered = filtered.filter(r => r.status === this.selectedStatus());
    }

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(r =>
        r.fullName.toLowerCase().includes(query) ||
        r.phone.includes(query)
      );
    }

    return filtered;
  }

  get pendingCount() {
    return this.mockRequests().filter(r => r.status === 'pending').length;
  }

  get approvedCount() {
    return this.mockRequests().filter(r => r.status === 'approved').length;
  }

  get rejectedCount() {
    return this.mockRequests().filter(r => r.status === 'rejected').length;
  }

  goBack() {
    this.router.navigate(['/patients']);
  }

  viewDetails(request: PatientRequest) {
    this.selectedRequest.set(request);
  }

  closeDetails() {
    this.selectedRequest.set(null);
  }

  approveRequest(request: PatientRequest) {
    const requests = this.mockRequests();
    const index = requests.findIndex(r => r.id === request.id);
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        status: 'approved',
        updatedAt: new Date().toISOString(),
      };
      this.mockRequests.set([...requests]);
    }
    this.closeDetails();
  }

  rejectRequest(request: PatientRequest) {
    const requests = this.mockRequests();
    const index = requests.findIndex(r => r.id === request.id);
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        status: 'rejected',
        updatedAt: new Date().toISOString(),
      };
      this.mockRequests.set([...requests]);
    }
    this.closeDetails();
  }

  deleteRequest(request: PatientRequest) {
    const requests = this.mockRequests().filter(r => r.id !== request.id);
    this.mockRequests.set(requests);
    this.closeDetails();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} мин назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ч назад`;
    } else if (diffDays < 7) {
      return `${diffDays} дн назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  }

  getAddress(address: any): string {
    if (!address) return '';
    return `${address.city}, ${address.street} ${address.house}${address.apartment ? ', кв. ' + address.apartment : ''}`;
  }
}
