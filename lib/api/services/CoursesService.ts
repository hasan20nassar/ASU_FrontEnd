/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Course } from '../models/Course';
import type { PatchedCourse } from '../models/PatchedCourse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CoursesService {
    /**
     * @param search A search term.
     * @returns Course
     * @throws ApiError
     */
    public static coursesList(
        search?: string,
    ): CancelablePromise<Array<Course>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/',
            query: {
                'search': search,
            },
        });
    }
    /**
     * @param requestBody
     * @returns Course
     * @throws ApiError
     */
    public static coursesCreate(
        requestBody: Course,
    ): CancelablePromise<Course> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/courses/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Course.
     * @returns Course
     * @throws ApiError
     */
    public static coursesRetrieve(
        id: number,
    ): CancelablePromise<Course> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this Course.
     * @param requestBody
     * @returns Course
     * @throws ApiError
     */
    public static coursesUpdate(
        id: number,
        requestBody: Course,
    ): CancelablePromise<Course> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/courses/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Course.
     * @param requestBody
     * @returns Course
     * @throws ApiError
     */
    public static coursesPartialUpdate(
        id: number,
        requestBody?: PatchedCourse,
    ): CancelablePromise<Course> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/courses/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Course.
     * @returns void
     * @throws ApiError
     */
    public static coursesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/courses/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
