import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { getPrivacy } from "@/sanity/content";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPrivacy();
  return { title: seo.title, description: seo.description };
}

export default async function PrivacyPage() {
  const page = await getPrivacy();
  return (
    <main id="main" className="page">
      <div className="wrap">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <div className="prose">
          <p className="lede">{page.lede}</p>
          <PortableText value={page.body} />
          <h2>{page.draftTitle}</h2>
          {/* TODO(REL-5): name the host and what its logs keep, the shop and what it holds, and a contact address, once they exist (docs/07-M6-PLAN.md §4.5). */}
          <p className="note">{page.draftNote}</p>
        </div>
      </div>
    </main>
  );
}
