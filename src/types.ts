export interface Wish {
  id: string;
  name: string;
  message: string;
  color: string; // Tailwind class or hex for pastel background
  rotation: number; // Random rotation angle in degrees (-5 to +5)
  timestamp: number;
}

export interface Moment {
  id: string;
  url: string;
  alt: string;
  caption: string;
  description: string;
  section: string;
  order: number;
  timestamp: number;
}

