import { PortableText } from "next-sanity";
import { getSettings } from "@/sanity/content";

export async function Footer() {
  const { brandName, footerTagline, footerLinks, footerSmallPrint } = await getSettings();
  return (
    <footer className="foot">
      <div className="foot__in">
        <div className="foot__brand">
          <p className="brand__name">{brandName}</p>
          <p>{footerTagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul>
            {footerLinks.map((link) => (
              <li key={link._key}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <PortableText
          value={footerSmallPrint}
          components={{ block: { normal: ({ children }) => <p className="foot__small">{children}</p> } }}
        />
      </div>
    </footer>
  );
}
