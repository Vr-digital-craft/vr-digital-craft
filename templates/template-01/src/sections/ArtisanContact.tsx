import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import type { SiteConfig } from "../../../../packages/template-core/src";

export function ArtisanContact({ config }: { config: SiteConfig }) {
  const { contact, footer } = config.content;
  const details = [
    {
      label: contact.phoneLabel,
      value: config.business.phone,
      href: `tel:${config.business.phone.replace(/\s/g, "")}`,
      Icon: Phone,
    },
    {
      label: contact.emailLabel,
      value: config.business.email,
      href: `mailto:${config.business.email}`,
      Icon: Mail,
    },
    {
      label: contact.addressLabel,
      value: `${config.business.address}, ${config.business.city}`,
      Icon: MapPin,
    },
    { label: contact.hoursLabel, value: config.business.openingHours.join(" · "), Icon: Clock3 },
  ];

  return (
    <>
      <section className="artisan-contact" id="contact">
        <div>
          <p className="artisan-kicker">{contact.eyebrow}</p>
          <h2>{contact.title}</h2>
          <p>{contact.description}</p>
        </div>
        <address>
          {details.map(({ label, value, href, Icon }) => (
            <div key={label}>
              <Icon aria-hidden />
              <span>
                <small>{label}</small>
                {href ? <a href={href}>{value}</a> : <strong>{value}</strong>}
              </span>
            </div>
          ))}
        </address>
      </section>
      <footer className="artisan-footer">
        <strong>{config.business.name}</strong>
        <span>{footer.tagline}</span>
        <small>{footer.copyright}</small>
      </footer>
    </>
  );
}
