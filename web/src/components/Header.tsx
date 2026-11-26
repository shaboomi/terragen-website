import { getSettings } from "@/sanity/content";
import { Button } from "./Parts";

export async function Header() {
  const { brandName, headerLinks, headerButton } = await getSettings();
  return (
    <>
      <a className="skip" href="#main">
        Skip to the content
      </a>
      <header className="bar">
        <div className="bar__in">
          {/* A full load, as every link here: Behaviour binds to the page once. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="brand" href="/" aria-label={`${brandName}, home`}>
            <svg className="brand__mark" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">
              <rect x="5" y="2.5" width="22" height="27" rx="1.5" fill="#fbf9f3" stroke="#111111" strokeWidth="1.5" />
              <path
                d="M9 11.5l7-5.2M9 16.5l14-10.4M9 21.5l14-10.4M12.5 24l10.5-7.8"
                fill="none"
                stroke="#111111"
                strokeWidth="1.1"
                strokeLinecap="round"
                opacity=".5"
              />
              <path
                d="M8.5 19.5c2.6-4.4 5.2-4.4 7.5 0s4.9 4.4 7.5 0"
                fill="none"
                stroke="#e83b68"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
            <span className="brand__name">{brandName}</span>
          </a>
          <button className="bar__menu" type="button" aria-expanded="false" aria-controls="nav">
            Menu
          </button>
          <nav id="nav" className="nav" aria-label="Main">
            <ul>
              {headerLinks.map((link) => (
                <li key={link._key}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
            <Button href="/#download" kind="ink" label={headerButton} />
          </nav>
        </div>
      </header>
    </>
  );
}
