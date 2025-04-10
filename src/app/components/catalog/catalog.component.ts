import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit {
  // Properties for filtering
  tabs: string[] = ['all', 'business', 'portfolio', 'ecommerce', 'blog'];
  activeTab: string = 'all';
  
  // Current year for footer
  currentYear: number = new Date().getFullYear();
  
  // Services data
  services: any[] = [
    {
      title: 'Business Website',
      icon: 'briefcase',
      idealPara: 'Small businesses and startups',
      precio: '$500 - $1,000',
      incluye: [
        'Responsive design',
        'Contact form',
        'SEO basics',
        'Up to 5 pages',
        'Social media integration'
      ]
    },
    {
      title: 'Portfolio Website',
      icon: 'image',
      idealPara: 'Artists, photographers, designers',
      precio: '$400 - $800',
      incluye: [
        'Gallery showcase',
        'About page',
        'Contact form',
        'Social media links',
        'Mobile-friendly design'
      ]
    },
    {
      title: 'E-commerce Website',
      icon: 'shopping-cart',
      versions: [
        {
          name: 'Basic Store',
          precio: '$800 - $1,500',
          idealPara: 'Small online stores',
          incluye: [
            'Product catalog',
            'Shopping cart',
            'Payment integration',
            'Order management',
            'Basic analytics'
          ]
        },
        {
          name: 'Advanced Store',
          precio: '$1,500 - $3,000',
          idealPara: 'Growing businesses',
          incluye: [
            'All Basic features',
            'Inventory management',
            'Customer accounts',
            'Reviews and ratings',
            'Advanced analytics',
            'Marketing tools'
          ]
        }
      ]
    },
    {
      title: 'Blog Website',
      icon: 'pen-tool',
      idealPara: 'Content creators, writers',
      precio: '$400 - $800',
      incluye: [
        'Blog post system',
        'Categories and tags',
        'Comment system',
        'Newsletter integration',
        'Social sharing'
      ]
    }
  ];
  
  // Hosting plans
  hostingPlans: any[] = [
    {
      name: 'Basic',
      price: '10',
      features: [
        '1GB storage',
        '10GB bandwidth',
        '5 databases',
        'Email support',
        'Weekly backups'
      ]
    },
    {
      name: 'Professional',
      price: '25',
      features: [
        '5GB storage',
        '50GB bandwidth',
        'Unlimited databases',
        'Priority support',
        'Daily backups',
        'SSL certificate'
      ]
    },
    {
      name: 'Enterprise',
      price: '50',
      features: [
        '20GB storage',
        'Unlimited bandwidth',
        'Unlimited databases',
        '24/7 support',
        'Hourly backups',
        'SSL certificate',
        'Dedicated IP'
      ]
    }
  ];
  
  // Maintenance services
  maintenanceServices: any[] = [
    {
      name: 'Basic Maintenance',
      price: '20',
      period: 'month',
      features: [
        'Security updates',
        'Performance monitoring',
        'Monthly reports',
        'Email support'
      ]
    },
    {
      name: 'Standard Maintenance',
      price: '35',
      period: 'month',
      features: [
        'All Basic features',
        'Weekly backups',
        'Content updates',
        'Priority support',
        'SEO maintenance'
      ]
    },
    {
      name: 'Premium Maintenance',
      price: '50',
      period: 'month',
      features: [
        'All Standard features',
        'Daily backups',
        'Unlimited content updates',
        '24/7 support',
        'Advanced SEO',
        'Performance optimization'
      ]
    }
  ];
  
  // Additional services
  extras: any[] = [
    {
      name: 'Advanced SEO',
      description: 'Comprehensive SEO optimization to improve your search engine rankings',
      price: '60'
    },
    {
      name: 'Multilanguage Support',
      description: 'Add multiple language support to your website',
      price: '50'
    },
    {
      name: 'Custom Animations',
      description: 'Add custom animations and visual effects to enhance user experience',
      price: '40'
    }
  ];
  
  // Filtered services based on active tab
  get filteredServices(): any[] {
    if (this.activeTab === 'all') {
      return this.services;
    }
    return this.services.filter(service => 
      service.title.toLowerCase().includes(this.activeTab.toLowerCase())
    );
  }
  
  constructor() { }

  ngOnInit(): void {
  }
  
  // Method to set active tab
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
} 