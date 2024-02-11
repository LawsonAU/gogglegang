import { Component, OnInit } from '@angular/core';
import { VoteService } from './vote.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html',
    styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {

    constructor(
        private voteService: VoteService,
        private router: Router
    ) { }

    polls: any[];
    activePolls: any[] = [];
    expiredPolls: any[] = [];

    isLoading: boolean = false;

    randIndex: number = 0;

    ngOnInit(): void {
        this.loadVotes();
    }

    getRandomIndex(maxValue) {
        // Generate a random number between 0 (inclusive) and 1 (exclusive)
        const randomNumber = Math.random();
        // Scale the random number to the range [0, maxValue)
        const scaledNumber = randomNumber * maxValue;

        // Round down to the nearest integer to get a whole number
        const result = Math.floor(scaledNumber);

        return result;
    }

    private loadVotes(): void {
        this.isLoading = true;
        this.voteService.getAllPolls().subscribe({
            next: (polls) => {
                const currentDate = new Date();

                polls.forEach((poll) => {
                    const expiresDate = new Date(poll.expires);
                    poll['randIndex'] = this.getRandomIndex(poll.pollOptions.length-1);
                    poll.pollOptions.map((option) => {
                        option.optionChoices.map((y) => {
                            if (y.imageURL && y.imageURL.startsWith('http://')) {
                                y.imageURL = y.imageURL.replace('http://', 'https://');
                            }
                        });
                    });

                    if (expiresDate > currentDate) {
                        this.activePolls.push(poll);
                    } else {
                        this.expiredPolls.push(poll);
                    }
                });
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error fetching polls:', error);
                this.isLoading = false;
            }
        });
    }

    navigateToVote(id: string): void {
        this.router.navigate(['/vote/poll', id]);
    }
}
