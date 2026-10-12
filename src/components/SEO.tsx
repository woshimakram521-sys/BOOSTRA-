import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: string;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalPath = '',
  ogType = 'website',
  noindex = false,
}) => {
  useEffect(() => {
    // 1. Document Title
    document.title = title;

    // 2. Helper to set/create meta elements
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Set standard descriptions and keywords
    setMetaTag('description', description);
    if (keywords) {
      setMetaTag('keywords', keywords);
    }

    // 4. Robots indexing directive
    setMetaTag('robots', noindex ? 'noindex, follow' : 'index, follow');

    // 5. OpenGraph
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', ogType, true);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}${canonicalPath || window.location.pathname}`;
    setMetaTag('og:url', fullUrl, true);
    setMetaTag('og:image', `${origin}/favicon.svg`, true);

    // 6. Twitter / X Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', `${origin}/favicon.svg`);

    // 7. Canonical link tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);
  }, [title, description, keywords, canonicalPath, ogType, noindex]);

  return null;
};
