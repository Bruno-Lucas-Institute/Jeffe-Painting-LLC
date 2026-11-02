import { client } from "@/config/client";

export function BrandLogo() {
  return (
    <span className="brand-logo" aria-label={client.businessName} role="img">
      <span className="brand-logo-name" aria-hidden="true">{client.logo.name}</span>
      <span className="brand-logo-tagline" aria-hidden="true">{client.logo.tagline}</span>
    </span>
  );
}
