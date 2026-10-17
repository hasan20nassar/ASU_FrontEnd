import type { AcademicCalendarEvent } from '../models/AcademicCalendarEvent';
import type { PatchedAcademicCalendarEvent } from '../models/PatchedAcademicCalendarEvent';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AcademicCalendarService {
    /**
     * @param search A search term.
     * @returns AcademicCalendarEvent
     * @throws ApiError
     */
    public static academicCalendarList(
        search?: string,
    ): CancelablePromise<Array<AcademicCalendarEvent>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/academic-calendar/',
            query: {
                'search': search,
            },
        });
    }

    /**
     * @param requestBody
     * @returns AcademicCalendarEvent
     * @throws ApiError
     */
    public static academicCalendarCreate(
        requestBody: Omit<AcademicCalendarEvent, 'id'>,
    ): CancelablePromise<AcademicCalendarEvent> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/academic-calendar/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id A unique integer value.
     * @returns AcademicCalendarEvent
     * @throws ApiError
     */
    public static academicCalendarRetrieve(
        id: number,
    ): CancelablePromise<AcademicCalendarEvent> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/academic-calendar/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id A unique integer value.
     * @param requestBody
     * @returns AcademicCalendarEvent
     * @throws ApiError
     */
    public static academicCalendarUpdate(
        id: number,
        requestBody: AcademicCalendarEvent,
    ): CancelablePromise<AcademicCalendarEvent> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/academic-calendar/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id A unique integer value.
     * @param requestBody
     * @returns AcademicCalendarEvent
     * @throws ApiError
     */
    public static academicCalendarPartialUpdate(
        id: number,
        requestBody?: PatchedAcademicCalendarEvent,
    ): CancelablePromise<AcademicCalendarEvent> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/academic-calendar/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id A unique integer value.
     * @returns void
     * @throws ApiError
     */
    public static academicCalendarDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/academic-calendar/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
