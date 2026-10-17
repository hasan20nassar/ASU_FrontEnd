/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Faculty } from '../models/Faculty';
import type { PatchedFaculty } from '../models/PatchedFaculty';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FacultiesService {
    /**
     * @param search A search term.
     * @returns Faculty
     * @throws ApiError
     */
    public static facultiesList(
        search?: string,
    ): CancelablePromise<Array<Faculty>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/faculties/',
            query: {
                'search': search,
            },
        });
    }
    /**
     * @param requestBody
     * @returns Faculty
     * @throws ApiError
     */
    public static facultiesCreate(
        requestBody: Faculty,
    ): CancelablePromise<Faculty> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/faculties/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Faculty.
     * @returns Faculty
     * @throws ApiError
     */
    public static facultiesRetrieve(
        id: number,
    ): CancelablePromise<Faculty> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/faculties/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this Faculty.
     * @param requestBody
     * @returns Faculty
     * @throws ApiError
     */
    public static facultiesUpdate(
        id: number,
        requestBody: Faculty,
    ): CancelablePromise<Faculty> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/faculties/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Faculty.
     * @param requestBody
     * @returns Faculty
     * @throws ApiError
     */
    public static facultiesPartialUpdate(
        id: number,
        requestBody?: PatchedFaculty,
    ): CancelablePromise<Faculty> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/faculties/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Faculty.
     * @returns void
     * @throws ApiError
     */
    public static facultiesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/faculties/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
