import { Injectable } from '@angular/core';
import { ApiInterfaceService } from '../api-interface.service'; // Adjust the path accordingly
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VoteService {

    constructor(
        private apiService: ApiInterfaceService
    ) { }

    getAllPolls(): Observable<any> {
        return this.apiService.get('/poll');
    }

    getPollById(id: string): Observable<any> {
        return this.apiService.get(`/poll/${id}`);
    }

    createPoll(poll: any): Observable<any> {
        return this.apiService.post('/poll', poll);
    }

    updatePoll(poll: any): Observable<any> {
        return this.apiService.put(`/poll`, poll);
    }

    deletePoll(id: string): Observable<any> {
        return this.apiService.delete(`/poll/${id}`);
    }

    voteForOptionChoice(pollId: string, optionName: string, optionId: string): Observable<any> {
        const body = { optionName, optionId };
        return this.apiService.post(`/poll/${pollId}/vote`, body);
    }

    unvoteForOptionChoice(pollId: string, optionName: string, optionId: string): Observable<any> {
        const body = { optionName, optionId };
        return this.apiService.post(`/poll/${pollId}/unvote`, body);
    }
}
