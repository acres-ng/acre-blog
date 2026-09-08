import { getSiteLinks } from "@/app/lib/acre/app-settings";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const links = await getSiteLinks();

  const downloadHref =
    links.app.oneLink ?? links.app.playStore ?? links.app.appStore;

  return (
    <NavbarClient
      homeHref={links.websiteUrl || "/"}
      contactHref={links.supportEmail ? `mailto:${links.supportEmail}` : null}
      downloadHref={downloadHref}
    />
  );
}
