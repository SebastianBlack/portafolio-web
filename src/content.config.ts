import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Texto en los dos idiomas. Los dos son obligatorios.
const t = z.object({ es: z.string().min(1), en: z.string().min(1) });

// Imagen o video. El tipo se deduce de la extensión (.mp4 = video).
// alt: describe la imagen para lectores de pantalla y Google.
const media = z.object({
  src: z.string().regex(/\.(webp|jpg|jpeg|png|avif|gif|mp4)$/i, 'Usa .webp, .jpg, .png, .avif, .gif o .mp4'),
  alt: t,
});

// Bloques del cuerpo del caso. Cada bloque tiene una proporción fija definida en project.css.
const block = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), eyebrow: t, heading: t, body: t }),
  z.object({ type: z.literal('grid-2'), items: z.array(media).length(2) }), // 4:3 · 980×735
  z.object({ type: z.literal('grid-3'), items: z.array(media).length(3) }), // 3:4 · 700×933
  z.object({ type: z.literal('wide'), item: media }),                      // libre · 2360×1032
  z.object({ type: z.literal('full'), item: media }),                      // borde a borde, libre
]);

const cases = defineCollection({
  // El nombre de la carpeta es la URL: cases/gastro-app/case.yaml → /projects/gastro-app/
  loader: glob({
    pattern: '*/case.yaml',
    base: './src/content/cases',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    type: z.enum(['branding', 'producto']),
    // draft: no se publica · hidden: se publica sin listar y con noindex · published: visible
    status: z.enum(['draft', 'hidden', 'published']),
    order: z.number().int(),
    year: z.number().int(),
    client: z.string().min(1),
    images: z.string().startsWith('/images/').endsWith('/'), // carpeta en public/
    title: t,
    seo: z.object({
      title: t, // se completa con " — Sebastian Black"
      description: z.object({ es: z.string().min(50).max(160), en: z.string().min(50).max(160) }),
    }),
    category: t,
    services: t,
    tagline: t,
    card: z.object({
      thumb: z.string(),
      video: z.string().endsWith('.mp4').optional(),
      trail: z.array(z.string()).min(1),
    }),
    hero: media,
    blocks: z.array(block).min(1),
  }),
});

export const collections = { cases };
