import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import type {
  HousingFeature,
  PatchedHousingFeature,
  StudentClub,
  PatchedStudentClub,
  SportActivity,
  PatchedSportActivity,
  CampusLifeOverview,
  PatchedCampusLifeOverview,
  CampusLifeStats,
} from "../models/CampusLife";

export class CampusLifeService {
  // ==========================================
  // Housing Features
  // ==========================================
  public static housingList(query?: {
    search?: string;
  }): CancelablePromise<Array<HousingFeature>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/campus-life/housing-features/",
      query: {
        search: query?.search,
      },
    });
  }

  public static housingCreate(
    requestBody: HousingFeature
  ): CancelablePromise<HousingFeature> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/campus-life/housing-features/",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static housingUpdate(
    id: number,
    requestBody: HousingFeature | PatchedHousingFeature
  ): CancelablePromise<HousingFeature> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/campus-life/housing-features/{id}/",
      path: { id },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static housingDelete(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/campus-life/housing-features/{id}/",
      path: { id },
    });
  }

  // ==========================================
  // Student Clubs
  // ==========================================
  public static clubsList(query?: {
    search?: string;
  }): CancelablePromise<Array<StudentClub>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/campus-life/student-clubs/",
      query: {
        search: query?.search,
      },
    });
  }

  public static clubsCreate(
    requestBody: StudentClub
  ): CancelablePromise<StudentClub> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/campus-life/student-clubs/",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static clubsUpdate(
    id: number,
    requestBody: StudentClub | PatchedStudentClub
  ): CancelablePromise<StudentClub> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/campus-life/student-clubs/{id}/",
      path: { id },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static clubsDelete(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/campus-life/student-clubs/{id}/",
      path: { id },
    });
  }

  // ==========================================
  // Sport Activities
  // ==========================================
  public static sportsList(query?: {
    search?: string;
  }): CancelablePromise<Array<SportActivity>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/campus-life/sport-activities/",
      query: {
        search: query?.search,
      },
    });
  }

  public static sportsCreate(
    requestBody: SportActivity
  ): CancelablePromise<SportActivity> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/campus-life/sport-activities/",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static sportsUpdate(
    id: number,
    requestBody: SportActivity | PatchedSportActivity
  ): CancelablePromise<SportActivity> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/campus-life/sport-activities/{id}/",
      path: { id },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static sportsDelete(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/campus-life/sport-activities/{id}/",
      path: { id },
    });
  }

  // ==========================================
  // Campus Life Overview & Stats
  // ==========================================
  public static overviewGet(): CancelablePromise<CampusLifeOverview> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/campus-life/overview/",
    });
  }

  public static overviewUpdate(
    id: number,
    requestBody: CampusLifeOverview | PatchedCampusLifeOverview
  ): CancelablePromise<CampusLifeOverview> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/campus-life/overview/{id}/",
      path: { id },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static statsGet(): CancelablePromise<CampusLifeStats> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/campus-life/overview/stats/",
    });
  }
}
