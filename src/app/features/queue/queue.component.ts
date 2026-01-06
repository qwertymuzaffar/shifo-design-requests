import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ClipboardList, UserPlus, Play, Check, X } from 'lucide-angular';
import { QueueService } from '@core/services/queue.service';
import { QueueEntry } from '@core/models/queue.model';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueComponent {
  private queueService = inject(QueueService);

  protected readonly ClipboardList = ClipboardList;
  protected readonly UserPlus = UserPlus;
  protected readonly Play = Play;
  protected readonly Check = Check;
  protected readonly X = X;

  queueEntries = signal<QueueEntry[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadQueue();
  }

  loadQueue() {
    this.isLoading.set(true);
    this.queueService.getQueueEntries().subscribe({
      next: (entries) => {
        this.queueEntries.set(entries);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      waiting: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      no_show: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityColor(priority: number): string {
    if (priority <= 2) return 'text-red-600';
    if (priority <= 4) return 'text-yellow-600';
    return 'text-green-600';
  }
}
