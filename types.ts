export interface Player {
  name: string;
  uuid?: string;
}

export interface ServerStatus {
  online: boolean;
  players: {
    online: number;
    max: number;
    list?: string[]; // The API returns string[] for player names
  };
  motd?: {
    clean: string[];
  };
}

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  description: string;
  features?: string[];
  category: 'vip' | 'pass' | 'unban' | 'coins';
}

export interface CartItem extends StoreItem {
  cartId: string;
}

export interface Command {
  name: string;
  desc: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text?: string;
  image?: string; // Base64 or URL
  isThinking?: boolean;
}

export enum AiMode {
  FAST = 'fast',
  THINKING = 'thinking',
  CREATIVE = 'creative', // For image generation
  STANDARD = 'standard'
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';

export type Language = 'pt' | 'en' | 'es';