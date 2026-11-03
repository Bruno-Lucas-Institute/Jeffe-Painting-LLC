import { ExperienceSignature } from "@/components/experience-signature";
import { ActionIcon } from "@/components/action-icon";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-visual">
          <Image
            alt=""
            className="hero-image"
            fill
            loading="eager"
            sizes="100vw"
            src="/images/hero-interior.webp"
          />
          <div className="hero-image-wash" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            Your local painting team · Danbury, CT
          </p>
          <h1>
            A fresh coat.
            <br />
            <em>A feeling of home.</em>
          </h1>
          <p className="hero-description">
            Thoughtful painting and refinishing, done with care for the home
            you love. Proudly serving homeowners across Fairfield County.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/contact">
              Request a free estimate <ActionIcon name="estimate" />
            </Link>
            <a className="text-link" href={client.phoneHref}>
              <ActionIcon name="phone" /> Or call {client.phone}
            </a>
          </div>
          <div className="hero-proof">
            <span className="proof-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </span>
            <span>
              {client.reviewRating} from {client.reviewCount} local reviews
            </span>
          </div>
        </div>
        <ExperienceSignature />
        <span className="hero-image-caption">
          A little care goes a long way.
        </span>
        <div className="hero-side-note">JEFFE PAINTING · EST. DANBURY, CT</div>
      </section>

      <section aria-label="Why homeowners choose Jeffe Painting" className="trust-strip">
        <div className="trust-item">
          <strong>{client.reviewRating} / 5</strong>
          <span>{client.reviewCount} local reviews</span>
        </div>
        <span className="trust-divider" />
        <div className="trust-item">
          <strong>Licensed &amp; insured</strong>
          <span>Peace of mind, start to finish</span>
        </div>
        <span className="trust-divider" />
        <div className="trust-item">
          <strong>Locally owned</strong>
          <span>Danbury &amp; Fairfield County</span>
        </div>
      </section>

      <section className="section section-services">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" /> What we do
            </p>
            <h2>
              Good work lives
              <br />
              in the details.
            </h2>
          </div>
          <div className="section-intro">
            <p>
              From a single room to a full exterior refresh, we bring the same
              careful preparation and pride in the finish to every project.
            </p>
            <Link className="text-link" href="/services">
              Explore all services <ActionIcon name="arrow" />
            </Link>
          </div>
        </div>
        <div className="service-grid">
          {client.services.map((service, index) => (
            <Link
              className="service-card"
              href={service.href}
              key={service.title}
            >
              <div className="service-card-image">
                <Image
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 25vw"
                  src={service.image}
                />
                <span className="image-index">0{index + 1}</span>
              </div>
              <div className="service-card-copy">
                <span className="card-kicker">{service.label}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="card-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section transformation-section">
        <div className="transformation-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" /> Before &amp; after
          </p>
          <h2>
            Small changes.
            <br />
            <em>Remarkable difference.</em>
          </h2>
          <p>
            A tired finish can make a whole room feel dated. With the right
            preparation and a steady hand, familiar spaces can feel new again.
          </p>
          <Link className="button button-light" href="/projects">
            See the project gallery <ActionIcon name="gallery" />
          </Link>
        </div>
        <div className="transformation-images">
          <figure className="transformation-after">
            <Image
              alt="After: refreshed interior with clean, bright finishes"
              fill
              sizes="(max-width: 760px) 100vw, 40vw"
              src="/images/transformation-after.webp"
            />
            <figcaption>After</figcaption>
          </figure>
          <figure className="transformation-before">
            <Image
              alt="Before: a room ready for a fresh coat of paint"
              fill
              sizes="(max-width: 760px) 50vw, 20vw"
              src="/images/transformation-before.webp"
            />
            <figcaption>Before</figcaption>
          </figure>
          <span className="transformation-stamp">
            A home
            <br />
            refreshed
          </span>
        </div>
      </section>

      <section className="section projects-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" /> A few favorites
            </p>
            <h2>
              Made with care.
              <br />
              Made to feel like home.
            </h2>
          </div>
          <Link className="text-link" href="/projects">
            View all projects <ActionIcon name="gallery" />
          </Link>
        </div>
        <div className="project-grid">
          {client.projects.slice(0, 3).map((project, index) => (
            <Link
              className={`project-card project-card-${index + 1}`}
              href="/projects"
              key={project.title}
            >
              <div className="project-card-image">
                <Image
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                  src={project.image}
                />
              </div>
              <div className="project-caption">
                <span>{project.category}</span>
                <h3>{project.title}</h3>
              </div>
              <span className="project-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section process-section">
        <div className="process-heading">
          <p className="eyebrow">
            <span className="eyebrow-line" /> The process
          </p>
          <h2>
            Easy to start.
            <br />
            <em>Good to come home to.</em>
          </h2>
          <p>
            Clear communication and respectful work are part of a job well
            done. Here is what getting started looks like.
          </p>
        </div>
        <div className="process-steps">
          {[
            [
              "01",
              "Tell us about it",
              "Share a few details about your project and where you're located.",
            ],
            [
              "02",
              "Get a clear estimate",
              "We'll talk through the work and give you a straightforward quote.",
            ],
            [
              "03",
              "Enjoy the refresh",
              "Our crew takes care of the details, from prep through final walkthrough.",
            ],
          ].map(([number, title, description]) => (
            <div className="process-step" key={number}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="testimonial-heading">
          <p className="eyebrow">
            <span className="eyebrow-line" /> Kind words
          </p>
          <h2>
            Better homes.
            <br />
            Happier homeowners.
          </h2>
          <p className="review-summary">
            <span className="proof-stars">★★★★★</span>
            <strong>{client.reviewRating}</strong> from {client.reviewCount} local reviews
          </p>
        </div>
        <div className="testimonial-cards">
          {client.testimonials.map((testimonial) => (
            <figure className="testimonial-card" key={testimonial.name}>
              <span className="quote-mark" aria-hidden="true">
                “
              </span>
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <p className="eyebrow eyebrow-light">
            <span className="eyebrow-line" /> Let&rsquo;s talk about your project
          </p>
          <h2>
            Ready for a change
            <br />
            you can feel?
          </h2>
        </div>
        <div className="cta-actions">
          <Link className="button button-light" href="/contact">
            Request your free estimate <ActionIcon name="estimate" />
          </Link>
          <a href={client.phoneHref}><ActionIcon name="phone" /> Prefer to talk? {client.phone}</a>
        </div>
      </section>
    </>
  );
}
