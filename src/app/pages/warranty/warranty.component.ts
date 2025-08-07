import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-warranty',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Warranty Information</h1>
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <a routerLink="/" class="text-orange-600 hover:text-orange-700">
                Home
              </a>
            </li>
          </ol>
        </nav>
        <div class="text-center">
          <p class="text-gray-600">Warranty information coming soon...</p>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class WarrantyComponent {} 