import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="faq" class="relative w-full overflow-hidden bg-white py-20 transition-colors duration-300 dark:bg-[#101115] md:py-28">
      <div class="absolute left-[8%] top-28 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div class="absolute bottom-10 right-[7%] h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"></div>
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div class="container relative mx-auto px-4">
        <div class="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:items-start">
          <div class="lg:sticky lg:top-28">
            <span class="inline-flex rounded-full border border-blue-400/15 bg-blue-400/[0.055] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200">Preguntas frecuentes</span>
            <h2 class="mt-5 max-w-xl text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-zinc-950 dark:text-white md:text-5xl xl:text-6xl">
              Preguntas antes de arrancar.
            </h2>
            <p class="mt-5 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Algunas respuestas para entender tiempos, alcance, soporte e integraciones antes de definir el camino.
            </p>
          </div>

          <div class="rounded-[2rem] border border-zinc-200 bg-white/85 p-2 shadow-2xl shadow-black/5 backdrop-blur dark:border-white/10 dark:!bg-[#08090D] dark:shadow-black/25 md:p-3">
            @for (item of items; track item.question; let i = $index) {
              <article class="group overflow-hidden rounded-[1.45rem] border border-transparent transition-colors duration-300" [ngClass]="openIndex() === i ? 'border-blue-300/15 bg-blue-400/[0.075]' : 'dark:hover:border-white/10 dark:hover:bg-white/[0.03] hover:border-zinc-200 hover:bg-zinc-50'">
                <button type="button" class="flex w-full items-center justify-between gap-5 px-5 py-5 text-left md:px-6" (click)="toggle(i)" [attr.aria-expanded]="openIndex() === i">
                  <span class="flex min-w-0 items-start gap-4">
                    <span class="mt-0.5 text-xs font-bold text-blue-600 dark:text-blue-300">{{ item.number }}</span>
                    <span class="text-lg font-bold leading-snug tracking-[-0.015em] text-zinc-950 dark:text-white">{{ item.question }}</span>
                  </span>
                  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 transition-colors dark:border-white/10 dark:bg-white/[0.045] dark:text-zinc-400">
                    <i-lucide [name]="chevronIcon" class="h-4 w-4 transition-transform duration-300" [class.rotate-180]="openIndex() === i"></i-lucide>
                  </span>
                </button>
                <div class="grid transition-all duration-300" [ngClass]="openIndex() === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
                  <div class="overflow-hidden">
                    <p class="max-w-3xl px-5 pb-6 pl-[3.75rem] text-base leading-relaxed text-zinc-600 dark:text-zinc-400 md:px-6 md:pl-[4.5rem]">{{ item.answer }}</p>
                  </div>
                </div>
              </article>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class FaqSectionComponent {
  chevronIcon = ChevronDown;
  openIndex = signal(0);

  items = [
    {
      number: '01',
      question: '¿Trabajan con startups o solo con empresas establecidas?',
      answer: 'Con ambas. Adaptamos el alcance según la etapa del proyecto. Podemos trabajar desde un MVP hasta una plataforma en producción.',
    },
    {
      number: '02',
      question: '¿Cuánto tarda un proyecto?',
      answer: 'Depende del alcance. Una web institucional puede tomar entre 2 y 3 semanas. Una plataforma a medida puede tomar entre 2 y 6 meses según complejidad.',
    },
    {
      number: '03',
      question: '¿Qué pasa después del lanzamiento?',
      answer: 'Ofrecemos soporte y mantenimiento. No desaparecemos cuando entregamos el proyecto.',
    },
    {
      number: '04',
      question: '¿Pueden integrarse con sistemas que ya tenemos?',
      answer: 'Sí. Trabajamos con APIs, ERPs, CRMs y herramientas que tengan documentación de integración disponible.',
    },
    {
      number: '05',
      question: '¿Trabajan para empresas fuera de Argentina?',
      answer: 'Sí. Trabajamos para proyectos de Argentina y Latinoamérica, con comunicación en español.',
    },
    {
      number: '06',
      question: '¿Cómo se define el presupuesto?',
      answer: 'Primero entendemos el alcance. Después armamos una propuesta cerrada, con tiempos, prioridades y costos claros.',
    },
  ];

  toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? -1 : index);
  }
}
