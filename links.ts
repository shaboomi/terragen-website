// Every address the website does not have yet, in one place.
//
// The site is live; the shop and the installers do not exist yet
// (docs/07-M6-PLAN.md step 37 and §4.5). A `null` is drawn as
// "not released yet", never as a dead link.

export const LINKS = {
  // TODO(REL-5): the shop's page for a Pro licence key (open question 1: which
  // shop, the price, the update window). Until then the Pro buttons go to the
  // note under the comparison table.
  shop: null as string | null,

  // TODO(REL-5): the web build, deployed beside the site at /app with COOP and
  // COEP headers (open question 4: a host that sets custom headers). The path
  // is the plan's; nothing is deployed there.
  app: "/app/",

  // TODO(REL-5): the installers that release.yml builds (step 34), one address
  // a platform once a release is published.
  downloads: {
    Windows: null as string | null,
    macOS: null as string | null,
    Linux: null as string | null,
  },

  // TODO(REL-5): a contact address for the privacy statement.
  contact: null as string | null,
};
