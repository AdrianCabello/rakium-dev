import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-process-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="proceso" class="relative w-full overflow-hidden bg-white py-24 transition-colors duration-300 dark:bg-[#08090D] md:py-32">
      <div class="absolute left-1/2 top-[61%] hidden h-px w-[76vw] -translate-x-1/2 bg-[linear-gradient(90deg,rgba(75,115,255,0),rgba(75,115,255,0.12),rgba(132,84,255,0.10),rgba(31,217,126,0.11),rgba(31,217,126,0))] md:block"></div>
      <div class="absolute right-0 top-44 h-80 w-80 rounded-full bg-violet-500/8 blur-3xl"></div>
      <div class="absolute left-1/3 bottom-16 h-64 w-64 rounded-full bg-emerald-500/7 blur-3xl"></div>
      <div class="container relative mx-auto px-4">
        <div class="mx-auto mb-11 max-w-3xl text-center">
          <div class="flex items-center justify-center gap-3">
            <span class="h-px w-10 bg-gradient-to-r from-transparent to-blue-400/45"></span>
            <span class="inline-flex items-center rounded-full border border-transparent bg-[linear-gradient(#08090D,#08090D)_padding-box,linear-gradient(135deg,rgba(75,115,255,0.55),rgba(132,84,255,0.38),rgba(31,217,126,0.34))_border-box] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100 shadow-[0_0_28px_rgba(75,115,255,0.10)]">
              Proceso
            </span>
            <span class="h-px w-10 bg-gradient-to-l from-transparent to-emerald-400/35"></span>
          </div>
          <h2 class="mt-4 text-4xl font-bold leading-none tracking-[-0.03em] text-zinc-950 dark:text-white md:text-6xl">Cómo trabajamos.</h2>
          <p class="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-lg">Cada proyecto arranca entendiendo el problema, no adivinándolo.</p>
        </div>

        <div class="relative grid gap-5 md:grid-cols-5">
          @for (step of steps; track step.number) {
            <article class="relative z-10 flex min-h-[232px] overflow-hidden rounded-[1.35rem] border border-zinc-200/70 bg-white/90 p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 dark:border-white/10 dark:!bg-zinc-950 dark:shadow-[0_18px_55px_rgba(0,0,0,0.18)] md:p-6">
              <span class="absolute -right-2 -top-9 text-8xl font-bold tracking-[-0.06em] text-blue-600/[0.026] dark:text-blue-300/[0.032]">{{ step.number }}</span>
              <div class="relative flex h-full flex-col">
                <span class="text-base font-bold tracking-[-0.01em] text-blue-600 dark:text-blue-400 md:text-sm">{{ step.number }}</span>
                <h3 class="mt-7 text-[1.42rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-zinc-950 dark:text-white md:mt-6 md:text-[1.12rem]">{{ step.title }}</h3>
                <p class="mt-5 text-[1.12rem] leading-[1.55] text-zinc-600 dark:text-zinc-400 md:text-[0.98rem]" [innerHTML]="step.description"></p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProcessSectionComponent {
  steps = [
    {
      number: '01',
      title: 'Diagnóstico',
      description: 'Entendemos el <strong class="font-semibold text-zinc-950 dark:text-white">negocio</strong>, el problema y qué conviene construir.',
    },
    {
      number: '02',
      title: 'Alcance',
      description: 'Definimos <strong class="font-semibold text-zinc-950 dark:text-white">prioridades</strong>, tiempos, funciones y presupuesto.',
    },
    {
      number: '03',
      title: 'Diseño + arquitectura',
      description: 'Diseñamos la <strong class="font-semibold text-zinc-950 dark:text-white">experiencia</strong> y la estructura técnica.',
    },
    {
      number: '04',
      title: 'Desarrollo',
      description: 'Construimos por <strong class="font-semibold text-zinc-950 dark:text-white">etapas</strong>, con revisiones claras.',
    },
    {
      number: '05',
      title: 'Lanzamiento + soporte',
      description: 'Lanzamos, <strong class="font-semibold text-zinc-950 dark:text-white">medimos</strong> y acompañamos la evolución.',
    },
  ];
}
