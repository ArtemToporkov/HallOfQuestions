import type { IsoString } from '../types/iso-string.ts';

export function formatTimeWithOffset(isoString: IsoString): string {
    const date = new Date(isoString);

    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');

    const offsetMinutes = -date.getTimezoneOffset();
    const offsetSign = offsetMinutes >= 0 ? '+' : '-';
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);

    return `${hh}:${mm} UTC${offsetSign}${offsetHours}`;
}