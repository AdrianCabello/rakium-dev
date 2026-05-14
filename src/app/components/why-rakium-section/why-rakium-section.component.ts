import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-why-rakium-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="porque-rakium" class="relative w-full overflow-hidden bg-[#08090D] py-24 text-white transition-colors duration-300 md:py-32">
      <div class="absolute right-0 top-10 h-72 w-72 rounded-full bg-violet-500/12 blur-3xl"></div>
      <div class="container relative mx-auto px-4">
        <div class="mx-auto max-w-4xl text-center">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-violet-200">Por qué Rakium</span>
          <h2 class="mx-auto mt-6 max-w-4xl text-3xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-5xl lg:text-6xl">
            No hacemos piezas sueltas.<br class="hidden md:block" />
            Pensamos <strong class="font-extrabold text-white">sistemas</strong>.
          </h2>
          <p class="mx-auto mt-7 max-w-5xl text-lg leading-relaxed text-zinc-300">
            Un proyecto digital no debería ser una suma de <strong class="font-semibold text-white">piezas aisladas</strong>. Por eso pensamos cada web, sistema o plataforma como parte de una estructura más grande: <strong class="font-semibold text-white">comunicación</strong>, <strong class="font-semibold text-white">experiencia</strong>, <strong class="font-semibold text-white">operación</strong> y <strong class="font-semibold text-white">crecimiento</strong>.
          </p>
        </div>

        <div class="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
          @for (item of items; track item.title) {
            <article class="rounded-[1.4rem] border border-white/10 bg-white/[0.032] p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-white/[0.055] hover:shadow-[0_16px_40px_rgba(0,0,0,0.22),0_0_32px_rgba(132,84,255,0.08)]">
              <span class="text-5xl font-bold text-violet-300/[0.10]">{{ item.number }}</span>
              <h3 class="mt-5 text-xl font-semibold text-white">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-relaxed text-zinc-400" [innerHTML]="item.text"></p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class WhyRakiumSectionComponent {
  items = [
    {
      number: '01',
      title: 'Pensamiento estratégico',
      text: 'Antes de ejecutar, entendemos <strong class="font-semibold text-zinc-100">qué necesita resolver</strong> cada proyecto.',
    },
    {
      number: '02',
      title: 'Diseño con criterio',
      text: 'Diseñamos interfaces y sistemas visuales pensados para <strong class="font-semibold text-zinc-100">comunicar y funcionar</strong>.',
    },
    {
      number: '03',
      title: 'Desarrollo funcional',
      text: 'Construimos soluciones digitales claras, escalables y <strong class="font-semibold text-zinc-100">alineadas al negocio</strong>.',
    },
  ];
}
