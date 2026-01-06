import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MessageSquare, Send } from 'lucide-angular';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <lucide-icon [img]="MessageSquare" [size]="32" class="text-sky-500"></lucide-icon>
          <h1 class="text-3xl font-bold text-gray-800">Chat System</h1>
        </div>
        <p class="text-gray-600">Patient communication and messaging</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 class="font-semibold text-gray-800 mb-4">Conversations</h3>
          <div class="space-y-3">
            @for (conv of mockConversations; track conv.id) {
              <div class="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-200">
                <div class="flex items-start justify-between mb-1">
                  <div class="font-medium text-gray-800">{{ conv.patient }}</div>
                  <div class="text-xs text-gray-500">{{ conv.time }}</div>
                </div>
                <div class="text-sm text-gray-600 truncate">{{ conv.lastMessage }}</div>
                @if (conv.unread > 0) {
                  <div class="mt-2">
                    <span class="bg-sky-500 text-white text-xs px-2 py-1 rounded-full">{{ conv.unread }} new</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
          <div class="p-4 border-b border-gray-200">
            <h3 class="font-semibold text-gray-800">Select a conversation</h3>
          </div>

          <div class="flex-1 p-6 flex items-center justify-center">
            <div class="text-center">
              <lucide-icon [img]="MessageSquare" [size]="48" class="text-gray-300 mx-auto mb-4"></lucide-icon>
              <p class="text-gray-500">Select a conversation to start chatting</p>
            </div>
          </div>

          <div class="p-4 border-t border-gray-200">
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                disabled
              />
              <button class="bg-sky-500 text-white px-4 py-2 rounded-lg flex items-center gap-2" disabled>
                <lucide-icon [img]="Send" [size]="20"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  protected readonly MessageSquare = MessageSquare;
  protected readonly Send = Send;

  mockConversations = [
    { id: 1, patient: 'John Smith', lastMessage: 'When is my next appointment?', time: '2m ago', unread: 2 },
    { id: 2, patient: 'Sarah Johnson', lastMessage: 'Thank you for the help!', time: '1h ago', unread: 0 },
    { id: 3, patient: 'Mike Williams', lastMessage: 'Can I reschedule?', time: '3h ago', unread: 1 },
  ];
}
