export enum ApiRoute {
    Reports = '/reports',
    Questions = '/reports/:id/questions',
    StartReport = '/reports/:id/start',
    EndReport = '/reports/:id/end',
    LikeQuestion = '/reports/:reportId/questions/:questionId/like',
    UnlikeQuestion = '/reports/:reportId/questions/:questionId/unlike'
}