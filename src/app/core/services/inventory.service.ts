import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  InventoryCategory,
  InventoryItem,
  InventoryStock,
  InventoryTransaction,
  InventoryAlert
} from '@models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private httpClient = inject(HttpClient);
  private baseUrl = '/api';

  getCategories(): Observable<InventoryCategory[]> {
    const params = new HttpParams().set('is_active', 'eq.true');
    return this.httpClient.get<InventoryCategory[]>(`${this.baseUrl}/inventory_categories`, { params });
  }

  getItems(categoryId?: number, search?: string): Observable<InventoryItem[]> {
    let params = new HttpParams()
      .set('select', '*,category:inventory_categories(*),stock:inventory_stock(*)');
    if (categoryId) {
      params = params.set('category_id', `eq.${categoryId}`);
    }
    if (search) {
      params = params.set('or', `(name.ilike.*${search}*,sku.ilike.*${search}*)`);
    }
    return this.httpClient.get<InventoryItem[]>(`${this.baseUrl}/inventory_items`, { params });
  }

  getItem(id: number): Observable<InventoryItem> {
    const params = new HttpParams()
      .set('select', '*,category:inventory_categories(*),stock:inventory_stock(*)');
    return this.httpClient.get<InventoryItem[]>(`${this.baseUrl}/inventory_items?id=eq.${id}`, { params })
      .pipe(map((items: InventoryItem[]) => items[0]));
  }

  createItem(item: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.httpClient.post<InventoryItem[]>(`${this.baseUrl}/inventory_items`, item, {
      headers: { 'Prefer': 'return=representation' }
    }).pipe(map((items: InventoryItem[]) => items[0]));
  }

  updateItem(id: number, item: Partial<InventoryItem>): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/inventory_items?id=eq.${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/inventory_items?id=eq.${id}`);
  }

  getTransactions(itemId?: number): Observable<InventoryTransaction[]> {
    let params = new HttpParams()
      .set('select', '*,item:inventory_items(*)')
      .set('order', 'transaction_date.desc');
    if (itemId) {
      params = params.set('item_id', `eq.${itemId}`);
    }
    return this.httpClient.get<InventoryTransaction[]>(`${this.baseUrl}/inventory_transactions`, { params });
  }

  createTransaction(transaction: Partial<InventoryTransaction>): Observable<InventoryTransaction> {
    return this.httpClient.post<InventoryTransaction[]>(`${this.baseUrl}/inventory_transactions`, transaction, {
      headers: { 'Prefer': 'return=representation' }
    }).pipe(map((transactions: InventoryTransaction[]) => transactions[0]));
  }

  getAlerts(resolved: boolean = false): Observable<InventoryAlert[]> {
    const params = new HttpParams()
      .set('is_resolved', `eq.${resolved}`)
      .set('select', '*,item:inventory_items(*)')
      .set('order', 'created_at.desc');
    return this.httpClient.get<InventoryAlert[]>(`${this.baseUrl}/inventory_alerts`, { params });
  }

  resolveAlert(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/inventory_alerts?id=eq.${id}`, {
      is_resolved: true,
      resolved_at: new Date().toISOString()
    });
  }
}
