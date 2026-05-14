import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-eventloop-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="featured-project" class="relative w-full overflow-hidden bg-[#070B10] py-24 text-white md:py-32">
      <span id="eventloop" class="absolute -top-24"></span>
      <div class="absolute left-1/2 top-8 h-[28rem] w-[80vw] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div class="absolute bottom-24 left-10 h-72 w-72 rounded-full bg-cyan-500/8 blur-3xl"></div>
      <div class="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"></div>

      <div class="container relative mx-auto px-4">
        <div class="mx-auto max-w-4xl text-center">
          <span class="inline-flex rounded-full border border-blue-300/20 bg-blue-400/[0.055] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-100">
            Proyecto destacado
          </span>
          <h2 class="mt-6 text-balance text-4xl font-bold leading-[0.98] tracking-[-0.03em] text-white md:text-6xl">
            Eventloop — Un producto real, desarrollado desde cero.
          </h2>
          <p class="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
            Construimos Eventloop para centralizar la venta de entradas, el control de accesos, los equipos y la operación completa de eventos en una sola plataforma.
          </p>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
            Un producto digital real, diseñado y desarrollado para productoras que necesitaban dejar atrás planillas, mensajes y controles manuales.
          </p>
        </div>

        <div class="relative mt-14 overflow-hidden rounded-[2rem] border border-blue-300/10 bg-[linear-gradient(145deg,rgba(28,48,92,0.34),rgba(12,16,32,0.76)_42%,rgba(55,36,96,0.20))] p-4 shadow-[0_34px_90px_rgba(0,0,0,0.38)] backdrop-blur md:rounded-[2.4rem] md:p-8">
          <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(80,160,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(80,160,255,0.028)_1px,transparent_1px)] bg-[size:46px_46px] opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"></div>
          <div class="pointer-events-none absolute left-1/2 top-20 h-72 w-[70%] -translate-x-1/2 rounded-full bg-blue-500/14 blur-3xl"></div>
          <div class="pointer-events-none absolute right-10 top-0 h-56 w-56 rounded-full bg-violet-500/14 blur-3xl"></div>

          <div class="relative min-h-[360px] md:min-h-[620px]">
            <div class="relative mx-auto max-w-6xl rounded-[2rem] border border-white/24 bg-[#05080D] p-3 shadow-[0_32px_90px_rgba(0,0,0,0.46)] md:rounded-[2.25rem] md:p-4">
              <div class="absolute inset-x-16 -top-8 h-20 rounded-full bg-blue-400/18 blur-2xl"></div>
              <div class="rounded-t-[1.65rem] border border-white/10 border-b-0 bg-[#111827] px-5 py-3 text-center md:rounded-t-[1.85rem]">
                <span class="text-[10px] font-bold uppercase tracking-[-0.02em] text-white/85">Eventloop</span>
              </div>
              <img
                src="/assets/clients/eventloop/1.png"
                alt="Eventloop visto en una notebook"
                class="relative aspect-[16/9] w-full rounded-b-[1.65rem] object-cover opacity-95 md:rounded-b-[1.85rem]"
                loading="lazy"
                decoding="async"
              />
              <div class="mx-auto mt-0 h-3 w-[92%] rounded-b-[1.2rem] border border-t-0 border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.025))]"></div>
              <div class="mx-auto h-2 w-[30%] rounded-b-full bg-white/16"></div>
            </div>

            <div class="absolute -bottom-1 left-5 max-w-[13.5rem] rounded-2xl border border-blue-300/18 bg-[#08101F]/88 p-4 shadow-[0_22px_55px_rgba(0,0,0,0.42)] backdrop-blur md:bottom-14 md:left-8 md:max-w-xs md:p-5">
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.72)]"></span>
                <span class="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200 md:text-xs">En producción</span>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-zinc-300 md:text-base">
                Usado por productoras, artistas y eventos reales.
              </p>
            </div>

            <div class="absolute -bottom-6 right-3 hidden w-[23%] min-w-[200px] rotate-[2deg] rounded-[2.2rem] border border-white/28 bg-[#05080D] p-2 shadow-[0_28px_70px_rgba(0,0,0,0.55)] md:block">
              <div class="absolute left-1/2 top-3 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/18"></div>
              <img
                src="/assets/clients/eventloop/5.jpeg"
                alt="Eventloop visto en un iPhone"
                class="aspect-[9/16] w-full rounded-[1.75rem] object-cover opacity-95"
                loading="lazy"
                decoding="async"
              />
              <div class="absolute inset-2 rounded-[1.75rem] border border-white/10 pointer-events-none"></div>
            </div>
          </div>

          <div class="relative mt-12 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-3">
            @for (item of casePoints; track item.label) {
              <article class="border-l border-white/10 pl-5">
                <span class="font-display text-4xl font-bold tracking-[-0.03em] text-white/10">{{ item.number }}</span>
                <h3 class="mt-2 text-lg font-bold text-white">{{ item.label }}</h3>
                <p class="mt-3 text-sm leading-relaxed text-zinc-400 md:text-base" [innerHTML]="item.text"></p>
              </article>
            }
          </div>

          <div class="relative mt-10 flex flex-col gap-8 border-t border-white/10 pt-8 lg:flex-row lg:items-end lg:justify-between">
            <div class="space-y-6">
              <div>
                <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Capacidades</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  @for (feature of features; track feature) {
                    <span class="rounded-full border border-blue-300/12 bg-blue-300/[0.045] px-3.5 py-2 text-sm font-semibold text-zinc-200">
                      {{ feature }}
                    </span>
                  }
                </div>
              </div>

              <div>
                <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Stack</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  @for (item of stack; track item) {
                    <span class="rounded-full border border-cyan-300/10 bg-cyan-300/[0.035] px-3 py-1.5 text-xs font-semibold text-zinc-400">
                      {{ item }}
                    </span>
                  }
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <a
                href="https://eventloop.ar"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center rounded-full border border-blue-300/24 bg-blue-300/[0.06] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:border-blue-200/35 hover:bg-blue-300/[0.09]"
              >
                Ver Eventloop
              </a>
              <a
                href="https://wa.me/542262497993"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors hover:border-white/18 hover:bg-white/[0.055]"
              >
                Quiero algo así
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class EventloopSectionComponent {
  casePoints = [
    {
      number: '01',
      label: 'Problema',
      text: 'Las productoras gestionaban eventos con <strong class="font-bold text-white">herramientas separadas</strong>, planillas, mensajes y controles manuales.',
    },
    {
      number: '02',
      label: 'Solución',
      text: 'Diseñamos y desarrollamos una <strong class="font-bold text-white">plataforma centralizada</strong> para vender entradas, administrar equipos y validar accesos.',
    },
    {
      number: '03',
      label: 'Resultado',
      text: 'Un <strong class="font-bold text-white">producto activo en producción</strong>, usado por productoras, artistas y eventos reales.',
    },
  ];

  features = [
    'Venta de entradas',
    'Control QR',
    'Roles y permisos',
    'Dashboard en tiempo real',
    'App mobile',
    'Mercado Pago',
  ];

  stack = ['Angular', 'JavaScript', 'Tailwind CSS', 'Mercado Pago API'];
}
