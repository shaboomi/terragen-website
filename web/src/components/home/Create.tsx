import hero from "@/generated/hero.json";
import { LINKS } from "@/generated/links";
import styles from "@/generated/styles.json";
import { NOISE_RINGS } from "@/samples";
import type { Home } from "@/sanity/content";
import { Button, Features, ProTag } from "../Parts";
import { Picture, Sheet } from "../Picture";
import { Wall } from "./Wall";

export function Hero({ content }: { content: Home["hero"] }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__in">
        <div className="hero__copy">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1 id="hero-title">{content.title}</h1>
          <p className="lede">{content.lede}</p>
          <div className="actions">
            <Button href="#download" kind="lime" label={content.downloadLabel} />
            <Button href={LINKS.app} kind="ghost" label={content.appLabel} />
            <Button href="#pricing" kind="pink" label={content.proLabel} />
          </div>
          <p className="hero__note">{content.note}</p>
        </div>
        <figure className="sheet sheet--hero">
          <div className="sheet__paper">
            {/* The harmonograph's one stroke, as the pen draws it. */}
            <svg
              className="hero-plot"
              viewBox={hero.viewBox}
              role="img"
              aria-label="A harmonograph: one unbroken line looping into a figure of crossed ellipses."
            >
              <path pathLength="1" d={hero.d} />
            </svg>
          </div>
          <figcaption className="sheet__block">
            {content.sheetLabels.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </figcaption>
        </figure>
      </div>
      <div className="wrap">
        <a className="explore" href="#styles">
          {content.exploreLabel}
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
            <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" />
          </svg>
        </a>
      </div>
    </section>
  );
}

const count = (category: string): number => styles.filter((s) => s.category === category).length;

export function Styles({ content }: { content: Home["styles"] }) {
  const counts = [
    ["image-tone", content.countLabels.photo],
    ["generative", content.countLabels.generative],
    ["scripted", content.countLabels.scripted],
    ["sources", content.countLabels.sources],
  ] as const;
  return (
    <section id="styles" className="band" aria-labelledby="styles-title">
      <div className="wrap">
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="styles-title">{content.title.replaceAll("{{styles}}", String(styles.length))}</h2>
        <p className="lede">{content.lede}</p>

        <ul className="inputs">
          {content.inputs.map((input) => (
            <li key={input._key}>
              <Sheet {...input} sizes="(min-width: 900px) 260px, 45vw" />
            </li>
          ))}
        </ul>

        <div className="wall__head">
          <ul className="counts" aria-label="Styles by kind">
            {counts.map(([category, label]) => (
              <li key={category}>
                <strong>{count(category)}</strong> {label}
              </li>
            ))}
          </ul>
          <div className="wall__controls">
            <button className="chip" type="button" data-wall-pause>
              Pause
            </button>
            <button className="chip" type="button" data-wall-names aria-pressed="false">
              Show names
            </button>
          </div>
        </div>
      </div>
      <Wall />
      <div className="wrap">
        <p className="fine">{content.note}</p>
      </div>
    </section>
  );
}

export function How({ content }: { content: Home["how"] }) {
  return (
    <section id="how" className="band band--paper" aria-labelledby="how-title">
      <div className="wrap">
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="how-title">{content.title}</h2>
        <ol className="stages">
          {content.stages.map((stage, i) => (
            <li key={stage._key}>
              <span className="stages__no" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>
                {stage.title}
                {stage.pro && (
                  <>
                    {" "}
                    <ProTag />
                  </>
                )}
              </h3>
              <p>{stage.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Ink({ content }: { content: Home["ink"] }) {
  return (
    <section id="ink" className="band" aria-labelledby="ink-title">
      <div className="wrap split">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="ink-title">{content.title}</h2>
          <p className="lede">{content.lede}</p>
          <Features items={content.features} />
        </div>
        <div className="compare">
          {content.figures.map((figure) => (
            <figure key={figure._key}>
              <Picture name={figure.picture} alt={figure.alt} sizes="(min-width: 900px) 520px, 92vw" />
              <figcaption>{figure.caption}</figcaption>
            </figure>
          ))}
          <p className="fine">{content.note}</p>
        </div>
      </div>
    </section>
  );
}

export function Graph({ content }: { content: Home["graph"] }) {
  return (
    <section id="graph" className="band band--surface" aria-labelledby="graph-title">
      <div className="wrap">
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="graph-title">{content.title}</h2>
        <p className="lede">{content.lede}</p>

        <div className="split split--media">
          <figure className="shot">
            <Picture name={content.figure.picture} alt={content.figure.alt} sizes="(min-width: 900px) 560px, 92vw" />
            <figcaption>{content.figure.caption}</figcaption>
          </figure>
          <Features items={content.features} />
        </div>

        <div className="split split--media split--flip">
          <div>
            <h3>{content.codeTitle}</h3>
            <p>{content.codeText}</p>
            <pre className="code" tabIndex={0} aria-label="The script of the Noise rings style">
              <code>{NOISE_RINGS}</code>
            </pre>
          </div>
          <Sheet {...content.codeSheet} sizes="(min-width: 900px) 400px, 80vw" />
        </div>
      </div>
    </section>
  );
}
