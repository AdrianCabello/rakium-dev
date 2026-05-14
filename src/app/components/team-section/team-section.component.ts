import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

interface TeamMember {
  initials: string;
  name: string;
  role: string;
  description: string;
  portfolioUrl?: string;
}

@Component({
  selector: 'app-team-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="equipo" class="relative w-full overflow-hidden bg-[#080A0F] py-24 text-white md:py-32">
      <div class="absolute left-[8%] top-20 h-96 w-96 rounded-full bg-blue-500/[0.11] blur-3xl"></div>
      <div class="absolute right-[4%] top-44 h-80 w-80 rounded-full bg-violet-500/[0.10] blur-3xl"></div>
      <div class="absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/[0.055] blur-3xl"></div>
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div class="container relative mx-auto px-4">
        <div class="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <div>
            <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-violet-200">Equipo</span>
            <h2 class="mt-6 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
              Las personas detrás de Rakium.
            </h2>
          </div>
          <div class="max-w-2xl lg:justify-self-end">
            <p class="text-xl font-semibold leading-relaxed tracking-[-0.01em] text-white md:text-2xl">
              No sumamos perfiles al azar. Armamos el equipo que cada producto necesita para avanzar con criterio.
            </p>
            <p class="mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
              Dirección técnica, producto, diseño, desarrollo y comunicación trabajando sobre el mismo objetivo: construir algo útil, claro y sostenible.
            </p>
          </div>
        </div>

        <div class="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(75,115,255,0.10),rgba(132,84,255,0.055),rgba(255,255,255,0.025))] p-4 shadow-2xl shadow-black/25 md:p-6">
            <div class="absolute right-8 top-8 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div class="absolute bottom-4 left-8 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl"></div>

            <div class="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-200">Nucleo principal</span>
                <h3 class="mt-2 max-w-xl text-2xl font-bold leading-tight tracking-[-0.02em] md:text-[2rem]">Producto, tecnología y dirección técnica.</h3>
              </div>
              <span class="w-fit shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs font-semibold text-zinc-300">Equipo flexible</span>
            </div>

            <div class="relative mt-7 grid gap-4 xl:grid-cols-2">
              @for (member of principalMembers; track member.initials) {
                <article class="group rounded-[1.45rem] border border-white/10 bg-[#080A0F]/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200/20 hover:bg-white/[0.045] md:p-6">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(75,115,255,0.28),rgba(132,84,255,0.20))] text-sm font-bold text-white md:h-14 md:w-14 md:text-base">
                      {{ member.initials }}
                    </div>
                    <span class="rounded-full border border-blue-300/15 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-100">Principal</span>
                  </div>

                  <h4 class="mt-6 text-2xl font-semibold leading-tight text-white">{{ member.name }}</h4>
                  <p class="mt-2 text-sm font-semibold leading-snug text-blue-200">{{ member.role }}</p>
                  <p class="mt-4 text-sm leading-relaxed text-zinc-400">{{ member.description }}</p>

                  <div class="mt-6">
                    @if (member.portfolioUrl) {
                      <a [href]="member.portfolioUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition-colors hover:text-white">
                        Ver portfolio
                      </a>
                    } @else {
                      <span class="inline-flex rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-semibold text-zinc-400">
                        Parte del equipo Rakium
                      </span>
                    }
                  </div>
                </article>
              }
            </div>

            <div class="relative mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
              <div class="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                <p class="text-xl font-bold text-blue-200">01</p>
                <p class="mt-1 text-xs leading-snug text-zinc-400">Arquitectura y producto</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                <p class="text-xl font-bold text-violet-200">02</p>
                <p class="mt-1 text-xs leading-snug text-zinc-400">Frontend e interfaces</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                <p class="text-xl font-bold text-emerald-200">03</p>
                <p class="mt-1 text-xs leading-snug text-zinc-400">Sistemas y ejecución</p>
              </div>
            </div>
          </div>

          <div class="rounded-[2rem] border border-white/10 bg-white/[0.026] p-5 md:p-6">
            <div class="flex items-center justify-between gap-4">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-[0.14em] text-violet-200">Equipo extendido</span>
                <h3 class="mt-2 text-2xl font-bold">Perfiles que se suman según el alcance.</h3>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              @for (member of supportMembers; track member.initials) {
                <article class="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.055]">
                  <div class="flex gap-4">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(75,115,255,0.18),rgba(132,84,255,0.14))] text-xs font-bold text-white/85">
                      {{ member.initials }}
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <h4 class="font-semibold text-white">{{ member.name }}</h4>
                        @if (member.portfolioUrl) {
                          <a [href]="member.portfolioUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-semibold text-blue-200 transition-colors hover:text-white">
                            Portfolio
                          </a>
                        }
                      </div>
                      <p class="mt-1 text-xs font-semibold text-blue-200">{{ member.role }}</p>
                      <p class="mt-2 text-sm leading-relaxed text-zinc-400">{{ member.description }}</p>
                    </div>
                  </div>
                </article>
              }
            </div>
          </div>
        </div>

        <div class="mt-6 rounded-[1.65rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.035),rgba(255,255,255,0.018))] p-7 md:p-8">
          <div class="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-200">Experiencia activa</span>
              <h3 class="mt-3 text-2xl font-bold md:text-3xl">Marcas reales. Problemas reales. Trabajo real.</h3>
            </div>
            <div>
              <p class="text-sm leading-relaxed text-zinc-400">
                Además de construir productos digitales, trabajamos en gestión de redes sociales, contenido y estrategia para marcas activas. Esa experiencia nos ayuda a pensar cada proyecto no solo desde lo técnico, sino también desde la comunicación, la conversión y el crecimiento.
              </p>
              <div class="mt-5 flex flex-wrap gap-2">
                @for (brand of activeExperience; track brand.name) {
                  <a [href]="brand.url" target="_blank" rel="noopener noreferrer" [class]="brand.featured ? 'rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-100 transition-colors hover:border-emerald-200/40 hover:bg-emerald-400/15' : 'rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-white/15 hover:bg-white/[0.075]'">{{ brand.name }}</a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TeamSectionComponent {
  principalMembers: TeamMember[] = [
    {
      initials: 'AC',
      name: 'Adrian Cabello',
      role: 'Frontend / Interfaces / Producto',
      description: 'Desarrollo de interfaces modernas, escalables y funcionales para productos digitales.',
      portfolioUrl: 'https://adriancabello.dev/',
    },
    {
      initials: 'NF',
      name: 'Nahuel Fernandez',
      role: 'Desarrollo / Producto / Sistemas',
      description: 'Desarrollo de funcionalidades, estructura técnica y soluciones digitales sólidas.',
    },
  ];

  supportMembers: TeamMember[] = [
    {
      initials: 'LV',
      name: 'Lautaro Vulcano',
      role: 'Diseño / Marketing / Estrategia',
      description: 'Dirección visual, comunicación y contenido estratégico para marcas y productos digitales.',
      portfolioUrl: 'https://lautarovulcano.com/',
    },
    {
      initials: 'CA',
      name: 'Candela',
      role: 'Desarrollo / Marketing / Comunicación',
      description: 'Aporta una mirada mixta entre desarrollo, comunicación y objetivos de crecimiento.',
    },
    {
      initials: 'LU',
      name: 'Lucas',
      role: 'Desarrollo / Sistemas / Implementación',
      description: 'Acompaña el desarrollo de sistemas, plataformas e implementaciones técnicas.',
    },
    {
      initials: 'ER',
      name: 'Eros',
      role: 'Frontend / UI / Responsive',
      description: 'Implementación de interfaces claras, modernas y adaptadas a distintos dispositivos.',
    },
    {
      initials: 'MA',
      name: 'Marian',
      role: 'Frontend / Interfaces / Componentes',
      description: 'Desarrollo frontend para transformar diseños en experiencias digitales funcionales.',
    },
    {
      initials: 'JA',
      name: 'Jativo',
      role: 'Frontend / UI / Implementación',
      description: 'Implementación visual y técnica de interfaces dentro del ecosistema Rakium.',
    },
  ];

  activeExperience = [
    { name: 'Eventloop', url: 'https://www.instagram.com/eventloop.ar/', featured: true },
    { name: 'Agencia Terminal', url: 'https://www.instagram.com/agenciaterminal/' },
    { name: 'Okapi Viajes', url: 'https://www.instagram.com/okapiviajestandil/' },
    { name: 'La Casita Tandil', url: 'https://www.instagram.com/lacasitatandil/' },
    { name: 'Tandil Repuestos', url: 'https://www.instagram.com/tandilrepuestos/' },
    { name: 'Tony Burger', url: 'https://www.instagram.com/tonyburger.tandil/' },
    { name: 'Change', url: 'https://www.instagram.com/change.tandil/' },
  ];
}
