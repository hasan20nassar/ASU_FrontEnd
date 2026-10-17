/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Event } from '../models/Event';
import type { PatchedEvent } from '../models/PatchedEvent';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventsService {
    /**
     * @param search A search term.
     * @returns Event
     * @throws ApiError
     */
    public static eventsList(
        search?: string,
    ): CancelablePromise<Array<Event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/events/',
            query: {
                'search': search,
            },
        });
    }
    /**
     * @param requestBody
     * @returns Event
     * @throws ApiError
     */
    public static eventsCreate(
        requestBody: Event,
    ): CancelablePromise<Event> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/events/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Event.
     * @returns Event
     * @throws ApiError
     */
    public static eventsRetrieve(
        id: number,
    ): CancelablePromise<Event> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/events/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this Event.
     * @param requestBody
     * @returns Event
     * @throws ApiError
     */
    public static eventsUpdate(
        id: number,
        requestBody: Event,
    ): CancelablePromise<Event> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/events/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Event.
     * @param requestBody
     * @returns Event
     * @throws ApiError
     */
    public static eventsPartialUpdate(
        id: number,
        requestBody?: PatchedEvent,
    ): CancelablePromise<Event> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/events/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Event.
     * @returns void
     * @throws ApiError
     */
    public static eventsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/events/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
