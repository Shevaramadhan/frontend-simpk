import type { ApiResponse, Bidang, Member, ProjectDetail, ProjectStatus, ProjectSummary, Task, TeamUpdate } from '../types';
import api from './apiConfig';

export async function listProjects() {
  const { data } = await api.get<ApiResponse<ProjectSummary[]>>('/projects');
  return data.data;
}

export async function getProject(id: number) {
  const { data } = await api.get<ApiResponse<ProjectDetail>>(`/projects/${id}`);
  return data.data;
}

export type MemberInput = Pick<Member, 'userId' | 'posisi' | 'isPm'>;

/** Operasional membentuk proyek dari pengajuan yang disetujui; tim boleh menyusul. */
export async function createProject(input: { orderId: number; nama: string; members: MemberInput[] }) {
  const { data } = await api.post<ApiResponse<{ id: number }>>('/projects', input);
  return data.data;
}

export async function updateProject(projectId: number, input: { status?: ProjectStatus; targetSelesai?: string | null }) {
  await api.patch(`/projects/${projectId}`, input);
}

export async function replaceMembers(projectId: number, members: MemberInput[]) {
  await api.put(`/projects/${projectId}/members`, { members });
}

export async function listTasks(projectId: number) {
  const { data } = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`);
  return data.data;
}

export interface TaskInput {
  judul: string;
  deskripsi: string | null;
  bidang: Bidang;
  bobot: number;
  assigneeId: number | null;
  tenggat: string | null;
}

export async function createTask(projectId: number, input: TaskInput) {
  await api.post(`/projects/${projectId}/tasks`, input);
}

export async function addProgress(projectId: number, taskId: number, input: { persentase: number; catatanKlien?: string; catatanTeknis?: string }) {
  await api.post(`/projects/${projectId}/tasks/${taskId}/progress`, input);
}

export async function listTeamUpdates(projectId: number) {
  const { data } = await api.get<ApiResponse<TeamUpdate[]>>(`/projects/${projectId}/updates`);
  return data.data;
}

/** Ubah isi tugas (PM dan Operasional). Persentase tetap lewat addProgress agar tercatat di riwayat. */
export async function updateTask(projectId: number, taskId: number, input: TaskInput) {
  await api.patch(`/projects/${projectId}/tasks/${taskId}`, input);
}

export async function deleteTask(projectId: number, taskId: number) {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
}
