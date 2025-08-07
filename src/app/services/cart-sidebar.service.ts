import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartSidebarService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$ = this.isOpenSubject.asObservable();

  openSidebar(): void {
    this.isOpenSubject.next(true);
  }

  closeSidebar(): void {
    this.isOpenSubject.next(false);
  }

  toggleSidebar(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  get isOpen(): boolean {
    return this.isOpenSubject.value;
  }
} 