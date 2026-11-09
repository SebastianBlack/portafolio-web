# Cómo agregar un caso de estudio

Cada caso es una carpeta con un archivo `case.yaml`. La web arma sola la página del caso, la tarjeta en la portada y los listados, el "siguiente proyecto", el sitemap y los textos para Google.

## Pasos

1. **Imágenes:** crea `public/images/<nombre-del-caso>/` y exporta ahí las imágenes desde Figma, al tamaño exacto de cada bloque (tabla de abajo).
2. **Contenido:** copia una plantilla de `docs/plantillas/` a `src/content/cases/<nombre-del-caso>/case.yaml`.
   - El nombre de la carpeta es la URL: `cases/la-mastermind/` → `/projects/la-mastermind/`.
   - Usa minúsculas y guiones, sin tildes ni espacios.
3. **Empieza con `status: draft`:** el caso no se publica mientras escribes.
4. **Revisa en local:** `npm run dev`. Si falta algo obligatorio, el build te dice qué y dónde.
5. **Publica:** cambia a `status: published`, y haz commit y push en una rama para ver la vista previa de Vercel antes de pasarlo a `main`.

## Estados

| `status` | Página | Portada y listados | Google |
|---|---|---|---|
| `draft` | No se genera | No | No |
| `hidden` | Se genera (link oculto) | No | `noindex`, fuera del sitemap |
| `published` | Se genera | Sí | Sí |

## Bloques del cuerpo

Los bloques van en `blocks`, en el orden que quieras y las veces que quieras. La proporción la fija el bloque: una imagen con otra proporción se recorta.

| `type` | Qué es | Tamaño de exportación |
|---|---|---|
| `text` | Etiqueta, titular y párrafo | — |
| `grid-2` | 2 imágenes lado a lado (4:3) | 980 × 735 cada una |
| `grid-3` | 3 imágenes en fila (3:4) | 700 × 933 cada una |
| `wide` | Una imagen ancha, con margen | 2360 × 1032 (libre) |
| `full` | Una imagen de borde a borde | libre |

Fuera de los bloques:

| Campo | Tamaño |
|---|---|
| `hero` | 2360 × 1080 |
| `card.thumb` (tarjeta) | 980 × 735 |
| `card.trail` (estela de la portada) | 490 × 340 |

Cualquier imagen puede ser un video `.mp4`: el bloque lo detecta por la extensión.

### Pie de foto (opcional)

Cada imagen puede llevar un `caption`, que se ve debajo en mayúsculas pequeñas. No reemplaza al `alt`:

- `alt` (obligatorio): describe lo que se ve. Ej.: "Logo nuevo de La Mastermind: símbolo de dos M y logotipo".
- `caption` (opcional): da contexto. Ej.: "El nuevo".

```yaml
- src: 02.webp
  alt: { es: "Logo nuevo de …", en: "New … logo" }
  caption: { es: "El nuevo", en: "The new one" }
```

### Texto con varios párrafos

`body` puede ser un solo párrafo o una lista. En la lista, `lead` es una palabra destacada en blanco al inicio (opcional). `body` también se puede omitir, y el bloque queda solo con etiqueta y titular.

```yaml
- type: text
  eyebrow: { es: "Identidad", en: "Identity" }
  heading: { es: "Una estructura de pensamiento…", en: "A structure of thought…" }
  body:
    - lead: { es: "Logo", en: "Logo" }
      text: { es: "El símbolo…", en: "The symbol…" }
    - lead: { es: "Color", en: "Color" }
      text: { es: "El magenta…", en: "Magenta…" }
```

## Reglas que revisa el build

- Todo texto va en español (`es`) y en inglés (`en`). Cada caso se publica en dos páginas: `/projects/<nombre>/` en español y `/en/projects/<nombre>/` en inglés, cada una con su propio texto.
- Cada imagen y video lleva `alt` en los dos idiomas: describe qué se ve, no "imagen 1".
- `seo.description`: entre 50 y 160 caracteres por idioma.
- `seo.title` es el título de la pestaña y de Google; se le agrega " — Sebastian Black".
- `order` define el orden en la portada y en "siguiente proyecto" (1 = primero).
