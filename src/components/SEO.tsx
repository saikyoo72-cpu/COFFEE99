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
  title = "Coffee99 | Best Coffee, Burgers & Vibes in Siliguri",
  description = "Coffee99 is Siliguri's premium local cafe chain for late-night vibes, artisanal pour-overs, handcrafted customized burgers, and cozy social tables.",
  image = "https://coffee99.in/og_image.png",
  url = "https://coffee99.in",
  type = "website",
  keywords = "coffee99, coffee99.in, coffee99 official website, coffee99 siliguri, coffee99 cafe, coffee99 menu, best cafe in siliguri, best coffee shop in siliguri, burgers and coffee in siliguri, coffee shop near khalpara, premium cafe in siliguri, coffee99 khalpara, coffee99 satyajit sarani, best burgers in siliguri, cafe vibes in siliguri"
}) => {
  const siteName = "Coffee99";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  // Complete Local Schema Ecosystem (JSON-LD)
  const structuredDataGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://coffee99.in/#organization",
        "name": "Coffee99",
        "url": "https://coffee99.in",
        "logo": "https://coffee99.in/logo_black_bg.png",
        "image": "https://coffee99.in/logo_black_bg.png",
        "description": "Coffee99 is Siliguri's premier local cafe, coffee house, and burger restaurant brand, delivering artisanal coffee blends, premium fast food combos, and aesthetic youth spaces.",
        "telephone": "+918927707769",
        "sameAs": [
          "https://www.instagram.com/coffee99shivmandir/",
          "https://www.facebook.com/shivmandircoffee99/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://coffee99.in/#website",
        "url": "https://coffee99.in",
        "name": "Coffee99",
        "description": "Coffee99 | Best Coffee, Burgers & Vibes in Siliguri",
        "publisher": {
          "@id": "https://coffee99.in/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://coffee99.in/menu?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Restaurant",
        "@id": "https://coffee99.in/#shivmandir-branch",
        "name": "Coffee99 - Shivmandir (Main Branch)",
        "image": "https://i.ibb.co/0jz0Shfm/unnamed.jpg",
        "priceRange": "$$",
        "servesCuisine": ["Coffee", "Burgers", "Fast Food", "Beverages"],
        "telephone": "+918927707769",
        "url": "https://coffee99.in/branch/shivmandir",
        "menu": "https://coffee99.in/branch/shivmandir",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Shivmandir, Near Sri Nara Singha Vidyapith",
          "addressLocality": "Siliguri",
          "addressRegion": "West Bengal",
          "postalCode": "734011",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 26.7100,
          "longitude": 88.3500
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "10:00",
          "closes": "22:00"
        }
      },
      {
        "@type": "Restaurant",
        "@id": "https://coffee99.in/#hakimpara-branch",
        "name": "Coffee99 - Hakimpara Branch",
        "image": "https://i.ibb.co/vxWPCj2t/image.jpg",
        "priceRange": "$$",
        "servesCuisine": ["Coffee", "Burgers", "Fast Food", "Beverages"],
        "telephone": "+918927707769",
        "url": "https://coffee99.in/branch/hakimpara",
        "menu": "https://coffee99.in/branch/hakimpara",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Hakimpara, Near Yellow Building",
          "addressLocality": "Siliguri",
          "addressRegion": "West Bengal",
          "postalCode": "734001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 26.7200,
          "longitude": 88.4200
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "10:00",
          "closes": "22:00"
        }
      },
      {
        "@type": "Restaurant",
        "@id": "https://coffee99.in/#shalbari-branch",
        "name": "Coffee99 - Shalbari Branch",
        "image": "https://i.ibb.co/4nXGw2tv/unnamed.jpg",
        "priceRange": "$$",
        "servesCuisine": ["Coffee", "Burgers", "Fast Food", "Beverages"],
        "telephone": "+918927707769",
        "url": "https://coffee99.in/branch/shalbari",
        "menu": "https://coffee99.in/branch/shalbari",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Shalbari, Near Jio Mart",
          "addressLocality": "Siliguri",
          "addressRegion": "West Bengal",
          "postalCode": "734001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 26.7000,
          "longitude": 88.3800
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "12:00",
          "closes": "21:30"
        }
      },
      {
        "@type": "Restaurant",
        "@id": "https://coffee99.in/#bara-mohansingh-branch",
        "name": "Coffee99 - Medical More Branch (Bara Mohansingh)",
        "image": "https://i.ibb.co/CpwB72zX/image.jpg",
        "priceRange": "$$",
        "servesCuisine": ["Coffee", "Burgers", "Fast Food", "Beverages"],
        "telephone": "+918927707769",
        "url": "https://coffee99.in/branch/bara-mohansingh",
        "menu": "https://coffee99.in/branch/bara-mohansingh",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Medical More, Near Mukta Nursing Home, Bara Mohansingh",
          "addressLocality": "Siliguri",
          "addressRegion": "West Bengal",
          "postalCode": "734012",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 26.6800,
          "longitude": 88.3200
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "10:00",
          "closes": "22:00"
        }
      },
      {
        "@type": "Restaurant",
        "@id": "https://coffee99.in/#ashram-para-branch",
        "name": "Coffee99 - Ashram Para Branch",
        "image": "https://i.ibb.co/K4GjvKN/image.jpg",
        "priceRange": "$$",
        "servesCuisine": ["Coffee", "Burgers", "Fast Food", "Beverages"],
        "telephone": "+918927707769",
        "url": "https://coffee99.in/branch/ashram-para",
        "menu": "https://coffee99.in/branch/ashram-para",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Ashram Para, Near Anjali Jewellers",
          "addressLocality": "Siliguri",
          "addressRegion": "West Bengal",
          "postalCode": "734001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 26.7225,
          "longitude": 88.4230
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "10:00",
          "closes": "22:00"
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Alternate Favicon properties matching Google favicon criteria */}
      <link rel="shortcut icon" href="/favicon.svg" />
      <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/favicon.svg" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Coffee99" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Graph Schema LD-JSON */}
      <script type="application/ld+json">
        {JSON.stringify(structuredDataGraph)}
      </script>
    </Helmet>
  );
};

export default SEO;
