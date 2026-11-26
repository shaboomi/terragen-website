import pictures from "@/generated/pictures.json";

interface Entry {
  width: number;
  height: number;
  sources: { width: number; src: string }[];
}

const PICTURES: Record<string, Entry | undefined> = pictures;

/** One of TerraGen's pictures (`pnpm images`), with its sizes. */
export function Picture({ name, alt, sizes }: { name: string; alt: string; sizes: string }) {
  const picture = PICTURES[name];
  const widest = picture?.sources.at(-1);
  if (!picture || !widest) throw new Error(`no picture called "${name}" (pnpm images)`);
  return (
    // The files are already made at each width: nothing to optimise on request.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={widest.src}
      srcSet={picture.sources.map((s) => `${s.src} ${s.width}w`).join(", ")}
      sizes={sizes}
      width={picture.width}
      height={picture.height}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}

/** A plot on its sheet of paper, with the title block under it. */
export function Sheet({
  picture,
  alt,
  labels,
  sizes,
  className = "sheet",
}: {
  picture: string;
  alt: string;
  labels: string[];
  sizes: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="sheet__paper">
        <Picture name={picture} alt={alt} sizes={sizes} />
      </div>
      <figcaption className="sheet__block">
        {labels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </figcaption>
    </figure>
  );
}
