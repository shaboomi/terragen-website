import { LINKS } from "@/generated/links";

/** The Pro buttons' address: the shop, or the note under the table until there is one. */
export const SHOP = LINKS.shop ?? "/#buy";

export function Button({ href, kind, label }: { href: string; kind: string; label: string }) {
  return (
    <a className={`btn btn--${kind}`} href={href}>
      <span>{label}</span>
    </a>
  );
}

export function ProTag() {
  return <span className="pro">Pro</span>;
}

export function Features({ items }: { items: { _key: string; title: string; description: string }[] }) {
  return (
    <dl className="features">
      {items.map((item) => (
        <div key={item._key}>
          <dt>{item.title}</dt>
          <dd>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Cta({ line, buttonLabel }: { line: string; buttonLabel: string }) {
  return (
    <div className="cta">
      <p className="cta__line">{line}</p>
      <Button href={SHOP} kind="pink" label={buttonLabel} />
    </div>
  );
}
