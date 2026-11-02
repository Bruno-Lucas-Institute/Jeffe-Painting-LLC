export const client = {
  businessName: "Jeffe Painting LLC",
  logo: { name: "JEFFE", tagline: "Painting LLC" },
  shortName: "Jeffe Painting",
  phone: "(855) 772-3391",
  phoneHref: "tel:+18557723391",
  email: "jeffe8138@gmail.com",
  location: "Danbury, CT",
  serviceArea: "Fairfield County, CT",
  serviceTowns: [
    "Danbury",
    "Ridgefield",
    "Westport",
    "Greenwich",
    "Stamford",
    "Fairfield",
  ],
  yearsExperience: 25,
  reviewRating: "5.0",
  reviewCount: "97+",
  copyrightYear: 2026,
  hours: [
    { days: "Monday–Saturday", hours: "8:00 AM–5:30 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
  socialLinks: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/people/Jeffe-Painting-LLC/61571465634865/",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/jeffe_painting_llc/",
    },
  ],
  services: [
    {
      title: "Interior painting",
      description:
        "Thoughtful preparation and clean, lasting finishes for walls, ceilings, trim, doors, and the details that make a room feel complete.",
      href: "/services#interior",
      image: "/images/interior-painting.webp",
      imageAlt: "Freshly finished interior with crisp trim and painted walls",
      label: "Inside your home",
    },
    {
      title: "Exterior painting",
      description:
        "Weather-ready finishes for siding, shutters, doors, trim, and porches, applied with care for your home's character.",
      href: "/services#exterior",
      image: "/images/exterior-painting.webp",
      imageAlt: "Recently painted home exterior with clean white trim",
      label: "Curb appeal",
    },
    {
      title: "Cabinet refinishing",
      description:
        "Give your kitchen a fresh start with detailed cabinet preparation and a smooth finish, without replacing the cabinets you have.",
      href: "/services#cabinets",
      image: "/images/cabinet-refinishing.webp",
      imageAlt: "Refinished kitchen cabinetry in a rich charcoal finish",
      label: "A kitchen refresh",
    },
    {
      title: "Closet painting",
      description:
        "Refresh closets, shelving, doors, and built-ins with a considered finish that brings a little more polish to everyday spaces.",
      href: "/services#closets",
      image: "/images/closet-painting.webp",
      imageAlt: "Custom painted built-in cabinetry and shelving",
      label: "The finishing touch",
    },
  ],
  projects: [
    {
      title: "A kitchen, renewed",
      category: "Cabinet refinishing",
      image: "/images/project-kitchen.webp",
      imageAlt: "Bright white kitchen with freshly painted cabinets",
    },
    {
      title: "A deeper shade, a fresh feel",
      category: "Cabinet refinishing",
      image: "/images/project-sage-kitchen.webp",
      imageAlt: "Sage green kitchen cabinets with brass hardware",
    },
    {
      title: "Clean lines, lasting finish",
      category: "Interior painting",
      image: "/images/project-wainscoting.webp",
      imageAlt: "Crisp white painted interior doors and wainscoting",
    },
    {
      title: "A welcoming first impression",
      category: "Exterior painting",
      image: "/images/project-exterior.webp",
      imageAlt: "Painted cedar-shake home exterior with white entry trim",
    },
    {
      title: "Storage with a finished look",
      category: "Closets & built-ins",
      image: "/images/project-mudroom.webp",
      imageAlt: "Painted mudroom cabinetry with brass hardware",
    },
    {
      title: "A room, refreshed",
      category: "Interior painting",
      image: "/images/transformation-after.webp",
      imageAlt: "A completed painting transformation in a homeowner's space",
    },
  ],
  testimonials: [
    {
      quote:
        "Their attention to detail shows in every step—from prep work like sanding and filling nail pops to the smooth, drip-free finishes and sharp, clean lines around trim and edges.",
      name: "Janet Bruehlman",
      location: "Ridgefield, CT",
    },
    {
      quote:
        "Their ability to renew my maple kitchen cabinets without the high cost of new cabinets was outstanding. My cabinets now look perfect and amazingly beautiful.",
      name: "Kelly Carvalho",
      location: "Local homeowner",
    },
  ],
} as const;
