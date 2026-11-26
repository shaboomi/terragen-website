import { EXPORT_FILES, GCODE, PEN_FILES } from "@/samples";
import type { Home } from "@/sanity/content";
import { Button, Cta, Features, ProTag, SHOP } from "../Parts";
import { Picture, Sheet } from "../Picture";

export function Plot({ content }: { content: Home["plot"] }) {
  return (
    <section id="plot" className="band" aria-labelledby="plot-title">
      <div className="wrap split">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="plot-title">{content.title}</h2>
          <p className="lede">{content.lede}</p>
          <Features items={content.features} />
        </div>
        <div className="plot-out">
          <Sheet {...content.sheet} sizes="(min-width: 900px) 300px, 60vw" className="sheet sheet--small" />
          <figure className="files">
            <figcaption>{content.filesCaption}</figcaption>
            <ul>
              {PEN_FILES.map((file) => (
                <li key={file}>{file}</li>
              ))}
            </ul>
            <pre className="code code--small" tabIndex={0} aria-label="The start of the first G-code file">
              <code>{GCODE}</code>
            </pre>
          </figure>
        </div>
      </div>
    </section>
  );
}

/** Which of the journey's pictures is a sheet of paper, by its place in the row. */
const JOURNEY_PAPER = new Set(["piece-1", "certificate"]);

export function Publish({ content }: { content: Home["publish"] }) {
  return (
    <section id="publish" className="band band--paper" aria-labelledby="publish-title">
      <div className="wrap">
        <p className="eyebrow">
          {content.eyebrow} <ProTag />
        </p>
        <h2 id="publish-title">{content.title}</h2>
        <p className="lede">{content.lede}</p>

        <ol className="journey">
          {content.journey.map((step) => (
            <li key={step._key}>
              <figure>
                <div
                  className={
                    JOURNEY_PAPER.has(step.picture) ? "journey__pic journey__pic--sheet" : "journey__pic"
                  }
                >
                  <Picture name={step.picture} alt={step.alt} sizes="(min-width: 900px) 300px, 80vw" />
                </div>
                <figcaption>
                  <strong>{step.lead}</strong> {step.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <figure className="wide">
          <Picture name={content.wide.picture} alt={content.wide.alt} sizes="(min-width: 1200px) 1120px, 92vw" />
          <figcaption>{content.wide.caption}</figcaption>
        </figure>

        <ul className="cards">
          {content.cards.map((card) => (
            <li key={card._key}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </li>
          ))}
        </ul>

        <div className="split split--media">
          <figure className="files files--paper">
            <figcaption>{content.filesCaption}</figcaption>
            <ul>
              {EXPORT_FILES.map((file) => (
                <li key={file}>{file}</li>
              ))}
            </ul>
          </figure>
          <Cta {...content.cta} />
        </div>
      </div>
    </section>
  );
}

/** The chain's drawings are sheets of paper; the photo and the maps are not. */
const CHAIN_PAPER = new Set(["relief", "edges-ml"]);

export function Ml({ content }: { content: Home["ml"] }) {
  return (
    <section id="ml" className="band" aria-labelledby="ml-title">
      <div className="wrap">
        <p className="eyebrow">
          {content.eyebrow} <ProTag />
        </p>
        <h2 id="ml-title">{content.title}</h2>
        <p className="lede">{content.lede}</p>

        <ol className="chain">
          {content.chain.map((link) => (
            <li key={link._key}>
              <figure>
                <div className={CHAIN_PAPER.has(link.picture) ? "chain__pic chain__pic--sheet" : "chain__pic"}>
                  <Picture
                    name={link.picture}
                    alt={link.alt}
                    sizes={link.picture === "ml-photo" ? "160px" : "(min-width: 900px) 200px, 40vw"}
                  />
                </div>
                <figcaption>{link.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <div className="split split--media">
          <Features items={content.features} />
          <Cta {...content.cta} />
        </div>
      </div>
    </section>
  );
}

function Included({ yes }: { yes: boolean }) {
  return (
    <td>
      {yes ? (
        <svg className="tick" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M2.5 8.5l3.5 3.5 7.5-8" />
        </svg>
      ) : (
        <span className="dash" aria-hidden="true"></span>
      )}
      <span className="vh">{yes ? "Included" : "Not included"}</span>
    </td>
  );
}

export function Pricing({ content }: { content: Home["pricing"] }) {
  const { price, updates } = content;
  return (
    <section id="pricing" className="band band--surface" aria-labelledby="pricing-title">
      <div className="wrap">
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="pricing-title">{content.title}</h2>
        <p className="lede">{content.lede}</p>

        <div className="table-scroll" role="region" tabIndex={0} aria-label="Free and Pro, feature by feature">
          <table className="plans">
            <thead>
              <tr>
                <td></td>
                <th scope="col">Free</th>
                <th scope="col" className="plans__pro">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {content.rows.map((row) => (
                <tr key={row._key} className={row.free ? undefined : "plans__only"}>
                  <th scope="row">{row.feature}</th>
                  <Included yes={row.free} />
                  <Included yes={row.pro} />
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">{price.label}</th>
                <td className="plans__price">{price.free}</td>
                {/* TODO(REL-5): the price is not decided (docs/07-M6-PLAN.md §4.5, open question 1). */}
                <td className="plans__price">{price.pro}</td>
              </tr>
              <tr>
                <th scope="row">{updates.label}</th>
                <td>{updates.free}</td>
                {/* TODO(REL-5): how long a key's updates run is not decided (§4.5, open question 1). */}
                <td>{updates.pro}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div id="buy" className="buy">
          <div>
            <p className="buy__line">{content.buyLine}</p>
            <p className="fine">{content.buyNote}</p>
          </div>
          <div className="actions">
            <Button href={SHOP} kind="pink" label={content.proButton} />
            <Button href="#download" kind="ghost" label={content.freeButton} />
          </div>
        </div>
      </div>
    </section>
  );
}
