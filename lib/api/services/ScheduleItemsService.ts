/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedScheduleItem } from '../models/PatchedScheduleItem';
import type { ScheduleItem } from '../models/ScheduleItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ScheduleItemsService {
    /**
     * @returns ScheduleItem
     * @throws ApiError
     */
    public static scheduleItemsList(): CancelablePromise<Array<ScheduleItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/schedule-items/',
        });
    }
    /**
     * @param requestBody
     * @returns ScheduleItem
     * @throws ApiError
     */
    public static scheduleItemsCreate(
        requestBody: ScheduleItem,
    ): CancelablePromise<ScheduleItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/schedule-items/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Schedule Item.
     * @returns ScheduleItem
     * @throws ApiError
     */
    public static scheduleItemsRetrieve(
        id: number,
    ): CancelablePromise<ScheduleItem> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/schedule-items/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this Schedule Item.
     * @param requestBody
     * @returns ScheduleItem
     * @throws ApiError
     */
    public static scheduleItemsUpdate(
        id: number,
        requestBody: ScheduleItem,
    ): CancelablePromise<ScheduleItem> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/schedule-items/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Schedule Item.
     * @param requestBody
     * @returns ScheduleItem
     * @throws ApiError
     */
    public static scheduleItemsPartialUpdate(
        id: number,
        requestBody?: PatchedScheduleItem,
    ): CancelablePromise<ScheduleItem> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/schedule-items/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Schedule Item.
     * @returns void
     * @throws ApiError
     */
    public static scheduleItemsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/schedule-items/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
