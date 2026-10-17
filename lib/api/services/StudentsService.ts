/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedStudent } from "../models/PatchedStudent";
import type { Student } from "../models/Student";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class StudentsService {
  /**
   * @param search A search term.
   * @returns Student
   * @throws ApiError
   */
  public static studentsList(
    search?: string,
  ): CancelablePromise<Array<Student>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/students/",
      query: {
        search: search,
      },
    });
  }
  /**
   * @param requestBody
   * @returns Student
   * @throws ApiError
   */
  public static studentsCreate(
    requestBody: Student,
  ): CancelablePromise<Student> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/students/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param id A unique integer value identifying this Student.
   * @returns Student
   * @throws ApiError
   */
  public static studentsRetrieve(id: number): CancelablePromise<Student> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/students/{id}/",
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A unique integer value identifying this Student.
   * @param requestBody
   * @returns Student
   * @throws ApiError
   */
  public static studentsUpdate(
    id: number,
    requestBody: Student,
  ): CancelablePromise<Student> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/students/{id}/",
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param id A unique integer value identifying this Student.
   * @param requestBody
   * @returns Student
   * @throws ApiError
   */
  public static studentsPartialUpdate(
    id: number,
    requestBody?: PatchedStudent,
  ): CancelablePromise<Student> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/students/{id}/",
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param id A unique integer value identifying this Student.
   * @returns void
   * @throws ApiError
   */
  public static studentsDestroy(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/students/{id}/",
      path: {
        id: id,
      },
    });
  }

  /**
   * Bulk transfer students to a new program/department
   */
  public static studentsBulkTransfer(requestBody: {
    student_ids: number[];
    target_program_id: number;
  }): CancelablePromise<{ detail: string; transferred_count: number }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/students/bulk-transfer/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
}
