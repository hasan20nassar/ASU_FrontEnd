/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlumniStory } from '../models/AlumniStory';
import type { PatchedAlumniStory } from '../models/PatchedAlumniStory';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AlumniStoriesService {
    /**
     * @param search A search term.
     * @returns AlumniStory
     * @throws ApiError
     */
    public static alumniStoriesList(
        search?: string,
    ): CancelablePromise<Array<AlumniStory>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/alumni-stories/',
            query: {
                'search': search,
            },
        });
    }
    /**
     * @param requestBody
     * @returns AlumniStory
     * @throws ApiError
     */
    public static alumniStoriesCreate(
        requestBody: AlumniStory,
    ): CancelablePromise<AlumniStory> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/alumni-stories/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Alumni Story.
     * @returns AlumniStory
     * @throws ApiError
     */
    public static alumniStoriesRetrieve(
        id: number,
    ): CancelablePromise<AlumniStory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/alumni-stories/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this Alumni Story.
     * @param requestBody
     * @returns AlumniStory
     * @throws ApiError
     */
    public static alumniStoriesUpdate(
        id: number,
        requestBody: AlumniStory,
    ): CancelablePromise<AlumniStory> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/alumni-stories/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Alumni Story.
     * @param requestBody
     * @returns AlumniStory
     * @throws ApiError
     */
    public static alumniStoriesPartialUpdate(
        id: number,
        requestBody?: PatchedAlumniStory,
    ): CancelablePromise<AlumniStory> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/alumni-stories/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Alumni Story.
     * @returns void
     * @throws ApiError
     */
    public static alumniStoriesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/alumni-stories/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
