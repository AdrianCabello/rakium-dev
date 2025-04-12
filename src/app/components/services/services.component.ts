import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Sparkles, Clock, Calendar, Check, ChevronRight, MessageCircle, Code, Globe, ShoppingBag, Building2, Users, Briefcase } from 'lucide-angular';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {

  
  // Define icons for use in template
  sparklesIcon = Sparkles;
  clockIcon = Clock;
  calendarIcon = Calendar;
  checkIcon = Check;
  chevronRightIcon = ChevronRight;
  messageCircleIcon = MessageCircle;
  codeIcon = Code;
  globeIcon = Globe;
  shoppingBagIcon = ShoppingBag;
  building2Icon = Building2;
  usersIcon = Users;
  briefcaseIcon = Briefcase;

  services = [
    {
      id: 1,
      title: 'Sitio Web Corporativo',
      subtitle: 'Presencia profesional en línea',
      icon: 'building2Icon',
      description: 'Sitios web profesionales que representan tu marca y conectan con tu audiencia.',
      precio: '150.000',
      incluye: [
        'Diseño personalizado',
        'Optimización SEO básica',
        'Responsive design',
        'Formulario de contacto',
        'Integración con redes sociales',
        'Panel de administración'
      ],
      rubros: [
        { name: 'Empresas', icon: 'building2Icon' },
        { name: 'Startups', icon: 'briefcaseIcon' },
        { name: 'Profesionales', icon: 'usersIcon' }
      ]
    },
    {
      id: 2,
      title: 'E-commerce',
      subtitle: 'Vende en línea',
      icon: 'shoppingBagIcon',
      description: 'Tiendas online completas con todas las funcionalidades necesarias para vender.',
      precio: '300.000',
      incluye: [
        'Catálogo de productos',
        'Carrito de compras',
        'Pasarela de pagos',
        'Gestión de inventario',
        'Panel de administración',
        'Reportes de ventas'
      ],
      rubros: [
        { name: 'Retail', icon: 'shoppingBagIcon' },
        { name: 'Servicios', icon: 'briefcaseIcon' },
        { name: 'Marketplace', icon: 'globeIcon' }
      ]
    },
    {
      id: 3,
      title: 'Aplicación Web',
      subtitle: 'Soluciones personalizadas',
      icon: 'codeIcon',
      description: 'Aplicaciones web a medida para resolver necesidades específicas de tu negocio.',
      precio: '500.000',
      incluye: [
        'Análisis de requerimientos',
        'Desarrollo a medida',
        'Base de datos',
        'API REST',
        'Autenticación de usuarios',
        'Panel de administración'
      ],
      rubros: [
        { name: 'SaaS', icon: 'codeIcon' },
        { name: 'Empresas', icon: 'building2Icon' },
        { name: 'Startups', icon: 'briefcaseIcon' }
      ]
    }
  ];

  constructor() {}
}
