import type { Metadata } from "next";
import { Graph, Hero, How, Ink, Styles } from "@/components/home/Create";
import { Download, Journal, Who } from "@/components/home/More";
import { Ml, Plot, Pricing, Publish } from "@/components/home/Sell";
import { getHome } from "@/sanity/content";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHome();
  return { title: seo.title, description: seo.description };
}

export default async function HomePage() {
  const home = await getHome();
  return (
    <main id="main">
      <Hero content={home.hero} />
      <Styles content={home.styles} />
      <How content={home.how} />
      <Ink content={home.ink} />
      <Graph content={home.graph} />
      <Plot content={home.plot} />
      <Publish content={home.publish} />
      <Ml content={home.ml} />
      <Pricing content={home.pricing} />
      <Who content={home.who} />
      <Journal content={home.journal} />
      <Download content={home.download} />
    </main>
  );
}
