import axios, { type AxiosError } from 'axios';
import type { QuestionData } from '../types/question-data.ts';
import { generatePath } from 'react-router-dom';
import { ApiRoute } from '../enums/api-route.ts';
import type { ReportData } from '../types/report-data.ts';
import type { SpeakerData } from '../types/speaker-data.ts';
import { toast } from 'react-toastify';

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
    toast.error(problem.title ?? problem.detail ?? 'Произошла ошибка');
}

api.interceptors.response.use(
    response => response,
    (error: AxiosError<ProblemDetails>) => {
        const problem = error.response?.data;
        if (!problem) {
            toast.error('Сетевая ошибка или сервер недоступен');
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
    reportStartDate: string,
    reportEndDate: string,
    speaker: SpeakerData
}

export const addReport = async (request: AddReportRequest): Promise<void> => {
    await api.post(ApiRoute.Reports, request);
}

export const startReport = async (reportId: string): Promise<void> => {
    const path = generatePath(ApiRoute.StartReport, { id: reportId });
    await api.post(path);
}

export const endReport = async (reportId: string): Promise<void> => {
    const path = generatePath(ApiRoute.EndReport, { id: reportId });
    await api.post(path);
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

export const addQuestion = async (reportId: string, request: AddQuestionRequest): Promise<void> => {
    const path = generatePath(ApiRoute.Questions, { id: reportId });
    await api.post(path, request);
}

export const likeQuestion = async (reportId: string, questionId: string): Promise<void> => {
    const path = generatePath(ApiRoute.LikeQuestion, { reportId, questionId });
    await api.post(path);
}