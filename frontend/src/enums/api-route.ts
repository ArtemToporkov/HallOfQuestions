export enum ApiRoute {
    Conferences = '/conferences',
    Questions = '/conferences/:id/questions',
    StartConference = '/conferences/:id/start',
    EndConference = '/conferences/:id/end',
    LikeQuestion = '/conferences/:conferenceId/questions/:questionId/like',
    UnlikeQuestion = '/conferences/:conferenceId/questions/:questionId/unlike'
}