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
