import { getSiteLinks } from "@/app/lib/acre/app-settings";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const links = await getSiteLinks();

  return <NavbarClient websiteUrl={links.websiteUrl} />;
}
