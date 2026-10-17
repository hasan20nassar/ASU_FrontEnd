/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DayEnum } from './DayEnum';
export type ScheduleItem = {
    readonly id: number;
    course: number;
    readonly courseCode: string;
    readonly courseNameAr: string;
    readonly courseNameEn: string;
    day: DayEnum;
    dayAr: string;
    dayEn: string;
    time: string;
    room: string;
    instructor: string;
    instructorEn: string;
};

