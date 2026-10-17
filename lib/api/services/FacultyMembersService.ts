/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FacultyMember } from '../models/FacultyMember';
import type { PatchedFacultyMember } from '../models/PatchedFacultyMember';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FacultyMembersService {
    /**
     * @param search A search term.
     * @returns FacultyMember
     * @throws ApiError
     */
    public static facultyMembersList(
        search?: string,
    ): CancelablePromise<Array<FacultyMember>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/faculty-members/',
            query: {
                'search': search,
            },
        });
    }
    /**
     * @param requestBody
     * @returns FacultyMember
     * @throws ApiError
     */
    public static facultyMembersCreate(
        requestBody: FacultyMember,
    ): CancelablePromise<FacultyMember> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/faculty-members/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Faculty Member.
     * @returns FacultyMember
     * @throws ApiError
     */
    public static facultyMembersRetrieve(
        id: number,
    ): CancelablePromise<FacultyMember> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/faculty-members/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this Faculty Member.
     * @param requestBody
     * @returns FacultyMember
     * @throws ApiError
     */
    public static facultyMembersUpdate(
        id: number,
        requestBody: FacultyMember,
    ): CancelablePromise<FacultyMember> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/faculty-members/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Faculty Member.
     * @param requestBody
     * @returns FacultyMember
     * @throws ApiError
     */
    public static facultyMembersPartialUpdate(
        id: number,
        requestBody?: PatchedFacultyMember,
    ): CancelablePromise<FacultyMember> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/faculty-members/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Faculty Member.
     * @returns void
     * @throws ApiError
     */
    public static facultyMembersDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/faculty-members/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
