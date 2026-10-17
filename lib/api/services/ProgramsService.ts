/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedProgram } from '../models/PatchedProgram';
import type { Program } from '../models/Program';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProgramsService {
    /**
     * @param search A search term.
     * @returns Program
     * @throws ApiError
     */
    public static programsList(
        search?: string,
    ): CancelablePromise<Array<Program>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/programs/',
            query: {
                'search': search,
            },
        });
    }
    /**
     * @param requestBody
     * @returns Program
     * @throws ApiError
     */
    public static programsCreate(
        requestBody: Program,
    ): CancelablePromise<Program> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/programs/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Program.
     * @returns Program
     * @throws ApiError
     */
    public static programsRetrieve(
        id: number,
    ): CancelablePromise<Program> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/programs/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this Program.
     * @param requestBody
     * @returns Program
     * @throws ApiError
     */
    public static programsUpdate(
        id: number,
        requestBody: Program,
    ): CancelablePromise<Program> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/programs/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Program.
     * @param requestBody
     * @returns Program
     * @throws ApiError
     */
    public static programsPartialUpdate(
        id: number,
        requestBody?: PatchedProgram,
    ): CancelablePromise<Program> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/programs/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Program.
     * @returns void
     * @throws ApiError
     */
    public static programsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/programs/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
