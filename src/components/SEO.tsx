import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Coffee99 | Best Coffee, Burgers & Vibes in Town",
  description = "Coffee99 is your ultimate late-night spot for artisanal coffee, slaying burgers, and cinematic vibes. Visit our hubs for the best squad experience.",
  image = "https://i.ibb.co/JjPpxCTY/unnamed.jpg",
  url = "https://coffee99.in",
  type = "website",
  keywords = "coffee, burger, cafe near me, late night cafe, Coffee99, best burgers, artisanal coffee, food squad"
}) => {
  const siteName = "Coffee99";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Coffee99",
    "image": image,
    "@id": url,
    "url": url,
    "telephone": "+91 9999999999",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shivmandir",
      "addressLocality": "Siliguri",
      "addressRegion": "WB",
      "postalCode": "734011",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.7123,
      "longitude": 88.4321
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "11:00",
      "closes": "23:59"
    },
    "servesCuisine": ["Coffee", "Burgers", "Fast Food"],
    "priceRange": "$$"
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
