import type { ApiResponse, DashboardSummary, ProjectReview, Review } from '../types';
import api from './apiConfig';

export async function getDashboard() {
  const { data } = await api.get<ApiResponse<DashboardSummary>>('/dashboard');
  return data.data;
}

export async function listReviews() {
  const { data } = await api.get<ApiResponse<Review[]>>('/reviews');
  return data.data;
}

/** Klien mengulas proyek miliknya setelah berstatus Selesai. */
export async function createReview(projectId: number, input: { rating: number; komentar: string }) {
  const { data } = await api.post<ApiResponse<ProjectReview>>(`/projects/${projectId}/review`, input);
  return data.data;
}
