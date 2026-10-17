/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NewsArticle } from '../models/NewsArticle';
import type { PatchedNewsArticle } from '../models/PatchedNewsArticle';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NewsArticlesService {
    /**
     * @param search A search term.
     * @returns NewsArticle
     * @throws ApiError
     */
    public static newsArticlesList(
        search?: string,
    ): CancelablePromise<Array<NewsArticle>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/news-articles/',
            query: {
                'search': search,
            },
        });
    }
    /**
     * @param requestBody
     * @returns NewsArticle
     * @throws ApiError
     */
    public static newsArticlesCreate(
        requestBody: NewsArticle,
    ): CancelablePromise<NewsArticle> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/news-articles/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this News Article.
     * @returns NewsArticle
     * @throws ApiError
     */
    public static newsArticlesRetrieve(
        id: number,
    ): CancelablePromise<NewsArticle> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/news-articles/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this News Article.
     * @param requestBody
     * @returns NewsArticle
     * @throws ApiError
     */
    public static newsArticlesUpdate(
        id: number,
        requestBody: NewsArticle,
    ): CancelablePromise<NewsArticle> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/news-articles/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this News Article.
     * @param requestBody
     * @returns NewsArticle
     * @throws ApiError
     */
    public static newsArticlesPartialUpdate(
        id: number,
        requestBody?: PatchedNewsArticle,
    ): CancelablePromise<NewsArticle> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/news-articles/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this News Article.
     * @returns void
     * @throws ApiError
     */
    public static newsArticlesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/news-articles/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
