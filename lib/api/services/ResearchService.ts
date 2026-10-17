import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import type {
  ResearchCenter,
  PatchedResearchCenter,
  ResearchArea,
  PatchedResearchArea,
  ResearchPublication,
  PatchedResearchPublication,
  ResearchStats,
} from "../models/Research";
import type { UploadResult } from "./MediaUploadService";

export class ResearchService {
  // ==========================================
  // Research Centers
  // ==========================================
  public static centersList(query?: {
    search?: string;
  }): CancelablePromise<Array<ResearchCenter>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/research-centers/",
      query: {
        search: query?.search,
      },
    });
  }

  public static centersCreate(requestBody: ResearchCenter): CancelablePromise<ResearchCenter> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/research-centers/",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static centersUpdate(
    id: number,
    requestBody: ResearchCenter | PatchedResearchCenter
  ): CancelablePromise<ResearchCenter> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/research-centers/{id}/",
      path: { id },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static centersDelete(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/research-centers/{id}/",
      path: { id },
    });
  }

  // ==========================================
  // Research Areas
  // ==========================================
  public static areasList(query?: {
    search?: string;
  }): CancelablePromise<Array<ResearchArea>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/research-areas/",
      query: {
        search: query?.search,
      },
    });
  }

  public static areasCreate(requestBody: ResearchArea): CancelablePromise<ResearchArea> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/research-areas/",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static areasUpdate(
    id: number,
    requestBody: ResearchArea | PatchedResearchArea
  ): CancelablePromise<ResearchArea> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/research-areas/{id}/",
      path: { id },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static areasDelete(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/research-areas/{id}/",
      path: { id },
    });
  }

  // ==========================================
  // Research Publications
  // ==========================================
  public static publicationsList(query?: {
    search?: string;
    area?: number | string;
    center?: number | string;
    faculty?: number;
    year?: number | string;
    featured?: boolean | string;
  }): CancelablePromise<Array<ResearchPublication>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/research-publications/",
      query: {
        search: query?.search,
        area: query?.area,
        center: query?.center,
        faculty: query?.faculty,
        year: query?.year,
        featured: query?.featured,
      },
    });
  }

  public static publicationsRetrieve(id: number): CancelablePromise<ResearchPublication> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/research-publications/{id}/",
      path: { id },
    });
  }

  public static publicationsCreate(
    requestBody: ResearchPublication
  ): CancelablePromise<ResearchPublication> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/research-publications/",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static publicationsUpdate(
    id: number,
    requestBody: ResearchPublication | PatchedResearchPublication
  ): CancelablePromise<ResearchPublication> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/research-publications/{id}/",
      path: { id },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  public static publicationsDelete(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/research-publications/{id}/",
      path: { id },
    });
  }

  public static statsGet(): CancelablePromise<ResearchStats> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/research-publications/stats/",
    });
  }

  public static recordView(id: number): CancelablePromise<{ status: string; viewsCount: number }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/research-publications/{id}/record_view/",
      path: { id },
    });
  }

  public static recordDownload(
    id: number
  ): CancelablePromise<{ status: string; downloadsCount: number }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/research-publications/{id}/record_download/",
      path: { id },
    });
  }

  /**
   * Upload research paper PDF securely.
   */
  public static async uploadPaperPdf(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("file", file);

    return __request(OpenAPI, {
      method: "POST",
      url: "/api/research/upload-pdf/",
      body: formData,
    });
  }
}
