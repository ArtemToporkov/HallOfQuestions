import axios, { type AxiosError } from 'axios';
import { generatePath } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ApiRoute } from '../enums/api-route.ts';

import { setReplicaId } from '../services/backend-replica-store.ts';
import type { ReportData } from '../types/report-data.ts';
import type { SpeakerData } from '../types/speaker-data.ts';
import type { QuestionData } from '../types/question-data.ts';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

type ProblemDetails = {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    errors?: Record<string, string[]>;
};

function showProblemToast(problem: ProblemDetails) {
    if (problem.errors) {
        Object.values(problem.errors)
            .flat()
            .forEach(message => toast.error(message));
        return;
    }
    toast.error(problem.detail ?? problem.title ?? 'An error occurred');
}

const replicaIdHeader = 'x-replica-id';

const setReplicaIdOrFailInfo = (id: string | string[] | undefined)=> {
    if (id && typeof id === 'string') {
        setReplicaId(id);
    } else {
        setReplicaId(`failed to determine`);
        console.error(`Failed to get replica id from server response header "${replicaIdHeader}"`)
    }
}

api.interceptors.response.use(
    response => {
        const replicaId = response.headers[replicaIdHeader];
        setReplicaIdOrFailInfo(replicaId);
        return response;
    },
    (error: AxiosError<ProblemDetails>) => {
        const replicaId = error.response?.headers[replicaIdHeader];
        setReplicaIdOrFailInfo(replicaId);
        const problem = error.response?.data;
        if (!problem) {
            toast.error('Network error or server is unavailable');
            return Promise.reject(error);
        }
        showProblemToast(problem);
        return Promise.reject(error);
    }
);

export const getReports = async (): Promise<ReportData[]> => {
    const reports = await api.get<ReportData[]>(ApiRoute.Reports);
    return reports.data;
}

export type AddReportRequest = {
    reportTitle: string,
    reportStartDateUtc: string,
    reportEndDateUtc: string,
    speaker: SpeakerData
}

export const addReport = async (request: AddReportRequest): Promise<ReportData> => {
    const response = await api.post<ReportData>(ApiRoute.Reports, request);
    return response.data;
}

export const startReport = async (reportId: string): Promise<ReportData> => {
    const path = generatePath(ApiRoute.StartReport, { id: reportId });
    const response = await api.post<ReportData>(path);
    return response.data;
}

export const endReport = async (reportId: string): Promise<ReportData> => {
    const path = generatePath(ApiRoute.EndReport, { id: reportId });
    const response = await api.post<ReportData>(path);
    return response.data;
}

export const getQuestions = async (reportId: string): Promise<QuestionData[]> => {
    const path = generatePath(ApiRoute.Questions, { id: reportId });
    const questions = await api.get<QuestionData[]>(path);
    return questions.data;
}

export type AddQuestionRequest = {
    questionTheme: string;
    questionText: string;
}

export const addQuestion = async (reportId: string, request: AddQuestionRequest): Promise<QuestionData> => {
    const path = generatePath(ApiRoute.Questions, { id: reportId });
    const response = await api.post<QuestionData>(path, request);
    return response.data;
}

export const likeQuestion = async (reportId: string, questionId: string): Promise<QuestionData> => {
    const path = generatePath(ApiRoute.LikeQuestion, { reportId, questionId });
    const response = await api.post<QuestionData>(path);
    return response.data;
}

export const unlikeQuestion = async (reportId: string, questionId: string): Promise<QuestionData> => {
    const path = generatePath(ApiRoute.UnlikeQuestion, { reportId, questionId });
    const response = await api.post<QuestionData>(path);
    return response.data;
}