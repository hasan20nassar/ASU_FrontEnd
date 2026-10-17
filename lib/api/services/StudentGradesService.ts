/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedStudentGrade } from '../models/PatchedStudentGrade';
import type { StudentGrade } from '../models/StudentGrade';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentGradesService {
    /**
     * @returns StudentGrade
     * @throws ApiError
     */
    public static studentGradesList(): CancelablePromise<Array<StudentGrade>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student-grades/',
        });
    }
    /**
     * @param requestBody
     * @returns StudentGrade
     * @throws ApiError
     */
    public static studentGradesCreate(
        requestBody: StudentGrade,
    ): CancelablePromise<StudentGrade> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/student-grades/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Student Grade.
     * @returns StudentGrade
     * @throws ApiError
     */
    public static studentGradesRetrieve(
        id: number,
    ): CancelablePromise<StudentGrade> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/student-grades/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this Student Grade.
     * @param requestBody
     * @returns StudentGrade
     * @throws ApiError
     */
    public static studentGradesUpdate(
        id: number,
        requestBody: StudentGrade,
    ): CancelablePromise<StudentGrade> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/student-grades/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Student Grade.
     * @param requestBody
     * @returns StudentGrade
     * @throws ApiError
     */
    public static studentGradesPartialUpdate(
        id: number,
        requestBody?: PatchedStudentGrade,
    ): CancelablePromise<StudentGrade> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/student-grades/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this Student Grade.
     * @returns void
     * @throws ApiError
     */
    public static studentGradesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/student-grades/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
