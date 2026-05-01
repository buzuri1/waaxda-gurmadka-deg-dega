import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function parseCasualties(khasaaraha: string | null): { deaths: number; injuries: number } {
  if (!khasaaraha) return { deaths: 0, injuries: 0 };
  
  let deaths = 0;
  let injuries = 0;
  
  const deathMatch = khasaaraha.match(/(\d+)\s*dhimasho/i);
  const injuryMatch = khasaaraha.match(/(\d+)\s*dhaawac/i);
  
  if (deathMatch) deaths = parseInt(deathMatch[1]);
  if (injuryMatch) injuries = parseInt(injuryMatch[1]);
  
  return { deaths, injuries };
}

export const DISTRICTS = [
  'Waberi', 'Hodan', 'Hamar Weyne', 'Yaqshid', 'Karaan',
  'Shangani', 'Wadajir', 'Dharkenley', 'Hamar Jajab', 'Abdiaziz',
  'Shibis', 'Bondhere', 'Daynile', 'Kahda', 'Heliwa', 'Gubadley', 'Howl-Wadaag'
];

export const PROPERTY_TYPES = [
  'Dab Guri', 'Dab Dukaan', 'Dab Suuq', 'Dab Gaari', 'Dab Xafiis', 'Dab Cunto karis', 'Xaalado Kale'
];

export const FIRE_CAUSES = [
  'Koronto', 'Koronto Gaaban', 'Sigaar ama Shidaal', 'Gaas ama Shidaal',
  'Shoolad Gaas', 'Ujeedo (Arson)', 'Shidaal', 'La Garanaayo', 'Xaalado Kale'
];

export const STATUS_OPTIONS = [
  { value: 'furan', label: 'Furan', color: 'red' },
  { value: 'baaraandegaynaya', label: 'Baaraandegaynaya', color: 'amber' },
  { value: 'xidhan', label: 'Xidhan', color: 'green' },
];
