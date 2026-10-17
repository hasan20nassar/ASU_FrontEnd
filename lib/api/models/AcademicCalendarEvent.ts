export type AcademicCalendarEvent = {
    readonly id: number;
    eventAr: string;
    eventEn: string;
    dateAr: string;
    dateEn: string;
    order?: number;
    readonly created_at?: string;
};
