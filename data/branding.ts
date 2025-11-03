export interface BrandingConfig {
    brandName: string;
    logoUrl: string;
    colors: {
      primary: string;
      accent: string;
      text: string;
      light: string;
      overlayOpacity: number;
    };
    font: string;
    ctaStyle: {
      backgroundColor: string;
      textColor: string;
      shape: 'rounded' | 'pill';
      text: string;
    };
    disclaimer: string;
  }
  
  export const brandingConfig: BrandingConfig = {
    brandName: "Lockwood & Carter Real Estate",
    logoUrl: "https://www.lockwoodandcarter.com/20250903_1915_Monogram%20with%20Transparency_remix_01k481z814e0a9007y5pvb4cew.png",
    colors: {
      primary: "#0D1117", // from tailwind config
      accent: "#D4AF37",  // brand-gold from tailwind config
      text: '#E6EDF3',    // brand-text from tailwind config
      light: '#8B949E',   // brand-light from tailwind config
      overlayOpacity: 0.6,
    },
    font: "Montserrat, sans-serif",
    ctaStyle: {
      backgroundColor: "#D4AF37", // brand-gold
      textColor: "#0D1117",     // brand-primary
      shape: "rounded",
      text: "Register Now →",
    },
    disclaimer: "Marketed exclusively by Lockwood & Carter Real Estate",
  };
  