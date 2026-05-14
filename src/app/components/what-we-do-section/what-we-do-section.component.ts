import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-what-we-do-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="que-hacemos" class="relative w-full overflow-hidden bg-[#0D0F14] py-24 text-white transition-colors duration-300 md:py-32">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      <div class="absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div class="container relative mx-auto px-4">
        <div class="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <div class="flex items-center">
              <span class="inline-flex items-center rounded-full border border-transparent bg-[linear-gradient(#0D0F14,#0D0F14)_padding-box,linear-gradient(135deg,rgba(75,115,255,0.62),rgba(132,84,255,0.42),rgba(31,217,126,0.32))_border-box] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100 shadow-[0_0_28px_rgba(75,115,255,0.10)]">Qué hacemos</span>
            </div>
            <h2 class="mt-5 max-w-3xl text-4xl font-bold leading-[0.98] tracking-[-0.03em] md:text-6xl">
              Diseño, estrategia y desarrollo para productos digitales reales.
            </h2>
          </div>
          <div class="max-w-2xl lg:justify-self-end">
            <p class="text-xl font-semibold leading-relaxed tracking-[-0.01em] text-white md:text-2xl">
              No hacemos piezas aisladas. Construimos soluciones donde <strong>comunicación</strong>, <strong>experiencia</strong> y <strong>tecnología</strong> trabajan juntas.
            </p>
            <p class="mt-5 text-base leading-relaxed text-zinc-400">
              Desde una web institucional hasta una plataforma o sistema interno, ordenamos el problema y diseñamos una respuesta clara, escalable y usable.
            </p>
          </div>
        </div>

        <div class="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          @for (item of items; track item.title) {
            <article class="group rounded-[1.4rem] border border-white/10 bg-white/[0.032] p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/30 hover:bg-white/[0.055] hover:shadow-[0_16px_40px_rgba(0,0,0,0.22),0_0_32px_rgba(80,120,255,0.08)]">
              <span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-bold text-blue-200">{{ item.number }}</span>
              <h3 class="mt-5 text-xl font-semibold text-white">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-relaxed text-zinc-400">{{ item.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class WhatWeDoSectionComponent {
  items = [
    {
      number: '01',
      title: 'Estrategia digital',
      text: 'Ordenamos ideas, objetivos y necesidades antes de diseñar o desarrollar.',
    },
    {
      number: '02',
      title: 'Diseño y comunicación visual',
      text: 'Creamos interfaces, piezas y sistemas visuales claros, modernos y funcionales.',
    },
    {
      number: '03',
      title: 'Desarrollo web y plataformas',
      text: 'Construimos sitios, sistemas y plataformas digitales adaptadas al proyecto.',
    },
    {
      number: '04',
      title: 'Automatizaciones e integraciones',
      text: 'Conectamos procesos, herramientas y datos para que el negocio funcione mejor.',
    },
  ];
}
