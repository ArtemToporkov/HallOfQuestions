import axios from 'axios';
import type { QuestionData } from '../types/question-data.ts';
import { generatePath } from 'react-router-dom';
import { ApiRoute } from '../enums/api-route.ts';
import type { ReportData } from '../types/report-data.ts';
import type { SpeakerData } from '../types/speaker-data.ts';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getReports = async (): Promise<ReportData[]> => {
    const reports = await api.get<ReportData[]>(ApiRoute.Reports);
    return reports.data;
}

type AddReportRequest = {
    reportTitle: string,
    reportStartDate: Date,
    reportEndDate: Date,
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

type AddQuestionRequest = {
    theme: string;
    text: string;
}

export const addQuestion = async (reportId: string, request: AddQuestionRequest): Promise<void> => {
    const path = generatePath(ApiRoute.Questions, { id: reportId });
    await api.post(path, request);
}

export const likeQuestion = async (reportId: string, questionId: string): Promise<void> => {
    const path = generatePath(ApiRoute.LikeQuestion, { reportId, questionId });
    await api.post(path);
}

export const unlikeQuestion = async (reportId: string, questionId: string): Promise<void> => {
    const path = generatePath(ApiRoute.UnlikeQuestion, { reportId, questionId });
    await api.post(path);
}
