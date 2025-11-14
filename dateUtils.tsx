/**
 * Utility functions for handling dates in GMT+7 (WIB - Waktu Indonesia Barat)
 */

/**
 * Get current date in GMT+7 as YYYY-MM-DD format
 */
export function getCurrentDateWIB(): string {
  const now = new Date();
  // Convert to GMT+7 (UTC+7)
  const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  return wibTime.toISOString().split('T')[0];
}

/**
 * Get current month in GMT+7 as YYYY-MM format
 */
export function getCurrentMonthWIB(): string {
  const now = new Date();
  // Convert to GMT+7 (UTC+7)
  const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  return wibTime.toISOString().slice(0, 7);
}

/**
 * Get current datetime in GMT+7 for datetime-local input
 */
export function getCurrentDateTimeWIB(): string {
  const now = new Date();
  // Convert to GMT+7 (UTC+7)
  const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  return wibTime.toISOString().slice(0, 16);
}

/**
 * Format date string to Indonesian locale with GMT+7 consideration
 */
export function formatDateWIB(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { 
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date string to short Indonesian format with GMT+7
 */
export function formatDateShortWIB(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { 
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Format time string to Indonesian locale with GMT+7
 */
export function formatTimeWIB(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', { 
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format datetime to Indonesian locale with GMT+7
 */
export function formatDateTimeWIB(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', { 
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format month string (YYYY-MM) to Indonesian month name
 */
export function formatMonthWIB(monthString: string): string {
  const date = new Date(monthString + '-01');
  return date.toLocaleDateString('id-ID', { 
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long'
  });
}

/**
 * Format month-year for charts (short format)
 */
export function formatMonthShortWIB(monthString: string): string {
  const date = new Date(monthString + '-01');
  return date.toLocaleDateString('id-ID', { 
    timeZone: 'Asia/Jakarta',
    month: 'short',
    year: '2-digit'
  });
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Get date object in GMT+7
 */
export function getDateInWIB(dateString?: string): Date {
  const date = dateString ? new Date(dateString) : new Date();
  // This returns a date object that represents the time in WIB
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
}
