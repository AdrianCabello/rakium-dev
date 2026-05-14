import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-problem-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="problema" class="w-full bg-zinc-100 dark:bg-zinc-900 py-20 md:py-28 transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-4xl text-center">
          <span class="text-sm font-semibold tracking-[0.22em] text-blue-600 dark:text-blue-400 uppercase">Por que importa</span>
          <h2 class="mt-5 text-3xl md:text-5xl font-bold leading-tight text-zinc-950 dark:text-white">
            Muchas empresas contratan desarrollo web. Pocas consiguen un producto.
          </h2>
          <p class="mt-6 text-lg md:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            Hay agencias que entregan sitios. Nosotros construimos herramientas que resuelven problemas reales: plataformas que venden, sistemas que ordenan operaciones y productos digitales que crecen con el negocio. La diferencia no está en el diseño. Está en entender qué necesita resolver tu empresa antes de escribir una sola línea de código.
          </p>
          <blockquote class="mt-10 border-l-4 border-blue-600 dark:border-blue-400 bg-white/70 dark:bg-zinc-950/50 px-6 py-5 text-left text-xl md:text-2xl italic font-medium text-zinc-900 dark:text-zinc-100 shadow-sm">
            "No entregamos proyectos. Lanzamos productos."
          </blockquote>
        </div>
      </div>
    </section>
  `,
})
export class ProblemSectionComponent {}
