"use client";

import { ActionIcon } from "@/components/action-icon";
import type { FormEvent } from "react";
import { useState } from "react";
import { client } from "@/config/client";

export function EstimateForm() {
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fields = [
      ["Name", formData.get("name")],
      ["Email", formData.get("email")],
      ["Phone", formData.get("phone")],
      ["Town or ZIP code", formData.get("town")],
      ["Service", formData.get("service")],
      ["Project details", formData.get("details")],
    ];
    const body = fields.map(([label, value]) => `${label}: ${value}`).join("\n");
    const subject = encodeURIComponent("Painting estimate request");
    const message = encodeURIComponent(body);

    setNotice("Your email app is opening. Review your request and send it to Jefferson.");
    window.location.href = `mailto:${client.email}?subject=${subject}&body=${message}`;
  }

  return (
    <form className="estimate-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Your name
          <input autoComplete="name" name="name" required />
        </label>
        <label>
          Email address
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label>
          Phone number
          <input autoComplete="tel" name="phone" required type="tel" />
        </label>
        <label>
          Town or ZIP code
          <input autoComplete="postal-code" name="town" required />
        </label>
        <label className="form-full">
          What can we help with?
          <select defaultValue="" name="service" required>
            <option disabled value="">
              Choose a service
            </option>
            {client.services.map((service) => (
              <option key={service.title} value={service.title}>
                {service.title}
              </option>
            ))}
            <option value="Other painting project">Something else</option>
          </select>
        </label>
        <label className="form-full">
          Tell us a little about your project
          <textarea
            name="details"
            placeholder="What would you like painted or refreshed?"
            required
            rows={5}
          />
        </label>
      </div>
      <button className="button" type="submit">
        Prepare my estimate request <ActionIcon name="send" />
      </button>
      <p aria-live="polite" className="form-note">
        {notice ||
          "This opens your email app so you can review and send your request."}
      </p>
    </form>
  );
}
