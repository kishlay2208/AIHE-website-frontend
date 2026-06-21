import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformDriveUrl(url: string | undefined): string | undefined {
  if (!url || typeof url !== 'string') return url;
  
  // Handle Google Drive file links
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/uc\?id=|drive\.google\.com\/drive\/folders\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    const fileId = match[1];
    // Use the direct image content link which is more reliable for embedding
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  
  return url;
}

export function parseDate(dateStr: any): Date | null {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  
  const str = String(dateStr).trim();
  // Try standard YYYY-MM-DD
  let d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  
  // Try DD-MM-YYYY or DD/MM/YYYY
  const parts = str.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed
      const year = parseInt(parts[2], 10);
      d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return d;
    }
    if (parts[0].length === 4) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return d;
    }
  }
  return null;
}

export function isCourseLive(startDateStr: string, endDateStr?: string): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const start = parseDate(startDateStr);
  if (!start) return false;

  const startVal = new Date(start);
  startVal.setHours(0, 0, 0, 0);

  const end = parseDate(endDateStr);
  const endVal = end ? new Date(end) : new Date(startVal.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default fallback
  endVal.setHours(23, 59, 59, 999);

  return now >= startVal && now <= endVal;
}

export function isCourseUpcoming(startDateStr: string): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const start = parseDate(startDateStr);
  if (!start) return false;

  const startVal = new Date(start);
  startVal.setHours(0, 0, 0, 0);

  return startVal >= now;
}

export function formatDate(dateStr: any): string {
  if (!dateStr) return "";
  const d = parseDate(dateStr);
  if (!d) return String(dateStr);
  
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

