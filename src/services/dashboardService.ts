import type { ApiResponse, DashboardSummary, ProjectReview, Review, Testimonial } from '../types';
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
export async function createReview(projectId: number, input: { rating: number; komentar: string; tampilPublik: boolean }) {
  const { data } = await api.post<ApiResponse<ProjectReview>>(`/projects/${projectId}/review`, input);
  return data.data;
}

/** Ulasan klien yang disetujui tampil di landing page (publik, tanpa login). */
export async function listTestimonials() {
  const { data } = await api.get<ApiResponse<Testimonial[]>>('/testimonials');
  return data.data;
}
