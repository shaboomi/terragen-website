import { LINKS } from "@/generated/links";
import type { Home } from "@/sanity/content";
import { Button } from "../Parts";
import { Picture } from "../Picture";

export function Who({ content }: { content: Home["who"] }) {
  return (
    <section id="who" className="band" aria-labelledby="who-title">
      <div className="wrap">
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="who-title">{content.title}</h2>
        <ul className="people">
          {content.people.map((person) => (
            <li key={person._key}>
              {/* A framed mockup fills its box; a drawing sits on paper. */}
              <div
                className={
                  person.picture.startsWith("mockup-") ? "people__pic" : "people__pic people__pic--sheet"
                }
              >
                <Picture name={person.picture} alt={person.alt} sizes="(min-width: 900px) 360px, 92vw" />
              </div>
              <h3>{person.title}</h3>
              <p>{person.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Journal({ content }: { content: Home["journal"] }) {
  return (
    <section id="journal" className="band band--surface" aria-labelledby="journal-title">
      <div className="wrap">
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="journal-title">{content.title}</h2>
        <p className="lede">{content.lede}</p>
        {/* TODO(REL-5): the journal. These are the kinds of post planned, not posts. */}
        <ul className="journal">
          {content.topics.map((topic) => (
            <li key={topic._key}>
              <span className="journal__soon">{content.soonLabel}</span>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Download({ content }: { content: Home["download"] }) {
  const downloads: [string, string | null][] = Object.entries(LINKS.downloads);
  return (
    <section id="download" className="band band--lime" aria-labelledby="download-title">
      <div className="wrap">
        <h2 id="download-title">{content.title}</h2>
        <p className="lede">{content.lede}</p>
        <ul className="get">
          {/* A link when there is an address, a plain note when not. */}
          {downloads.map(([platform, url]) => (
            <li key={platform} className="get__item">
              <h3>{platform}</h3>
              {url ? <Button href={url} kind="lime" label="Download" /> : <p className="get__soon">Not released yet</p>}
            </li>
          ))}
          <li className="get__item">
            <h3>{content.browserTitle}</h3>
            <Button href={LINKS.app} kind="ink" label={content.appLabel} />
          </li>
        </ul>
      </div>
    </section>
  );
}
