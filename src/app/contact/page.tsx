import type { Metadata } from "next";
import Link from "next/link";
import { EstimateForm } from "@/components/estimate-form";
import { client } from "@/config/client";

export const metadata: Metadata = {
  title: "Request a Free Painting Estimate",
  description:
    "Contact Jeffe Painting for a free painting estimate in Danbury and Fairfield County, CT. Call or share a few details about your project.",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero contact-hero">
        <p className="eyebrow">
          <span className="eyebrow-line" /> Let&rsquo;s make a plan
        </p>
        <h1>
          Tell us what
          <br />
          <em>you have in mind.</em>
        </h1>
        <p>
          Share a few details and Jefferson will be in touch to talk through
          your project and arrange a free estimate.
        </p>
        <a className="text-link" href={client.phoneHref}>
          Or call {client.phone} <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="contact-section">
        <div className="contact-form-panel">
          <div className="form-heading">
            <p className="eyebrow">
              <span className="eyebrow-line" /> Request an estimate
            </p>
            <h2>Let&rsquo;s talk about<br />your project.</h2>
            <p>Every detail helps us get a better sense of what you need.</p>
          </div>
          <EstimateForm />
        </div>
        <aside className="contact-aside">
          <div className="contact-aside-block">
            <p className="eyebrow">
              <span className="eyebrow-line" /> Call or email
            </p>
            <a className="contact-detail" href={client.phoneHref}>
              {client.phone}
            </a>
            <a className="contact-detail" href={`mailto:${client.email}`}>
              {client.email}
            </a>
          </div>
          <div className="contact-aside-block">
            <p className="eyebrow">
              <span className="eyebrow-line" /> Where we work
            </p>
            <p>
              Based in {client.location}
              <br />
              Serving {client.serviceArea}
            </p>
            <p className="town-list">{client.serviceTowns.join(" · ")}</p>
          </div>
          <div className="contact-aside-block">
            <p className="eyebrow">
              <span className="eyebrow-line" /> Office hours
            </p>
            {client.hours.map((item) => (
              <div className="hours-row" key={item.days}>
                <span>{item.days}</span>
                <span>{item.hours}</span>
              </div>
            ))}
          </div>
          <div className="contact-note">
            <span aria-hidden="true">✳</span>
            <p>
              Not sure what you need? That&rsquo;s okay. A quick call is a great
              place to start.
            </p>
            <Link href="/services">Explore our services ↗</Link>
          </div>
        </aside>
      </section>
    </>
  );
}
