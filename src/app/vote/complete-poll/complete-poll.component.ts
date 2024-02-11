import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoteService } from '../vote.service';
import { CustomSnackBarService } from '../../shared/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewImageComponent } from '../../shared/view-image/view-image.component';
import { ScrollService } from '../../scroll.service';

@Component({
    selector: 'app-complete-poll',
    templateUrl: './complete-poll.component.html',
    styleUrl: './complete-poll.component.scss'
})

export class CompletePollComponent implements OnInit {
    missingImage: string = "../../../assets/images/missing-image.webp";

    constructor(
        private route: ActivatedRoute,
        private voteService: VoteService,
        private snackBar: CustomSnackBarService,
        private router: Router,
        public dialog: MatDialog,
        private scrollService: ScrollService
    ) { }

    pollId: string;
    pollData: any;
    isLoading: boolean = false;
    isVoting: boolean = false;
    localVoteData: any = [];
    expired: boolean = false;
    showLeaders: boolean = false;
    nowDate: any = Date.now()
    testing: boolean = false;

    winnerData: any = [];

    ngOnInit(): void {
        this.getData();
    }

    checkExpiry() {
        const expirationDate = new Date(this.pollData.expires);
        const today = new Date();

        if (expirationDate < today) {
            this.expired = true;
        } else {
            this.expired = false;
        }
    }

    getLocalData() {
        let local = JSON.parse(localStorage.getItem(`${this.pollId}-info`));
        console.log(local)
        if (local) {
            this.localVoteData = local;
            this.updateLocalArray();
        }
    }

    getData() {
        this.route.params.subscribe(params => {
            this.pollId = params['id'];

            if (this.pollId) {
                this.isLoading = true;
                this.voteService.getPollById(this.pollId).subscribe({
                    next: (poll: any) => { // Change any to Poll
                        this.pollData = poll;
                        this.checkExpiry()
                        this.getLocalData();
                        this.calcResults();
                        this.isLoading = false;
                    },
                    error: (error) => {
                        console.error('Error fetching poll:', error);
                        this.isLoading = false;
                    }
                });
            } else {

            }
        });
    }

    calcResults() {
        this.winnerData = [];

        this.pollData.pollOptions.forEach((option) => {
            let highestVoteCount = -1; // Initialize with a value lower than any possible vote count
            let winningChoices = [];
            let draw = false;

            option.optionChoices.forEach((choice, i) => {
                if (choice.voteCount > highestVoteCount) {
                    highestVoteCount = choice.voteCount;
                    winningChoices = [{ ...choice }]; // Copy the winning choice data
                    draw = false; // Reset draw flag
                } else if (choice.voteCount === highestVoteCount) {
                    draw = true; // Set draw flag if vote count is the same
                    winningChoices.push({ ...choice }); // Copy the choice data for a draw
                }
            });

            // Add to winnerData only if there is a winning choice or a draw
            if ((winningChoices.length > 0 || draw) && highestVoteCount > 0) {
                this.winnerData.push({
                    optionName: option.optionName,
                    choices: winningChoices,
                    draw: draw
                });
            }
        });

        this.winnerData.map((x) => {
            console.log(x)
            x.choices.map((y, i) => {
                if (i === 0) { y['show'] = true } else { y['show'] = false };
            });
        })
        console.log('winnerData', this.winnerData);
        this.updateLocalArray();
    }


    updateLocalArray() {
        this.localVoteData.map((x) => {
            this.pollData.pollOptions.map((y, i) => {
                if (x.name === y.optionName) {
                    y['voted'] = true;
                    y.optionChoices.find(z => z.id === x.selected)['voteLoad'] = false;
                    y.optionChoices.find(z => z.id === x.selected)['voted'] = true;
                }
            })
        })
    }

    async voteForMe(option, choice, bol) {
        // Check if Voting is in Progress
        if (this.isVoting) {
            this.snackBar.showSnackBar('Waiting for vote to go through. Please wait.', 'warning');
            return;
        }

        // Lookup Local Data
        let lookupLocal: any = null;
        let currentPick: any = null;
        if (this.localVoteData) {
            lookupLocal = this.localVoteData.find(x => x.name === option.optionName);
            currentPick = option.optionChoices.find(x => x.id === (lookupLocal ? lookupLocal.selected : null));
        }

        // Check Previous Vote and Current Pick
        if (lookupLocal && !currentPick) {
            this.snackBar.showSnackBar('You already voted for this option. Updating your pick.', 'warning');

            // Handle Previous Vote
            if (!currentPick) {
                this.isVoting = true;
                option['voteLoad'] = true;
                choice['voteLoad'] = true;

                // Remove the previous vote
                await this.removeVoteAsync(option, currentPick);
                // Add the new vote
                await this.addVoteAsync(option, choice);

                // Reset voting indicators
                this.isVoting = false;
                option['voteLoad'] = false;
                choice['voteLoad'] = false;

                return;
            }
        }

        // Handle Current Vote
        if (bol) {
            this.addVote(option, choice);
        } else {
            this.removeVote(option, choice);
        }
    }


    addVote(option, choice) {
        if (!this.expired) {
            this.isVoting = true;
            option['voteLoad'] = true;
            choice['voteLoad'] = true;

            this.voteService.voteForOptionChoice(this.pollId, option.optionName, choice.id).subscribe({
                next: (response) => {
                    console.log('voted: ', response);
                    this.pollData = response;
                    this.snackBar.showSnackBar('Vote submitted', 'success');
                    this.isVoting = false;

                    option['voteLoad'] = false;
                    choice['voteLoad'] = false;
                    choice['voted'] = true;

                    this.updateLocalVote(option.optionName, choice.id, true);
                    this.calcResults();
                },
                error: (error) => {
                    console.error('Error voting:', error);
                    this.snackBar.showSnackBar('Error submitting vote. Please try again.', 'error');
                    this.isVoting = false;
                    option['voteLoad'] = false;
                    choice['voteLoad'] = false;
                }
            });
        } else {
            // Handle case where poll is expired
            this.snackBar.showSnackBar('This poll has expired. You cannot vote in an inavtive genius.', 'warning');
        }
    }

    removeVote(option, choice) {
        if (!this.expired) {
            this.isVoting = true;
            option['voteLoad'] = true;
            choice['voteLoad'] = true;

            this.voteService.unvoteForOptionChoice(this.pollId, option.optionName, choice.id).subscribe({
                next: (response) => {
                    console.log(response);
                    this.pollData = response;
                    this.snackBar.showSnackBar('Vote removed', 'success');
                    this.isVoting = false;

                    option['voteLoad'] = false;
                    choice['voteLoad'] = false;
                    choice['voted'] = false;

                    this.updateLocalVote(option.optionName, choice.id, false);

                    this.calcResults();
                },
                error: (error) => {
                    console.error('Error voting:', error);
                    this.snackBar.showSnackBar('Error removing vote. Please try again.', 'error');
                    this.isVoting = false;

                    option['voteLoad'] = false;
                    choice['voteLoad'] = false;
                    choice['voted'] = false;
                }
            });
        } else {
            // Handle case where poll is expired
            this.snackBar.showSnackBar('This poll has expired. You cannot change votes.', 'warning');
        }
    }

    async addVoteAsync(option, choice) {
        try {
            if (!this.expired) {

                const response = await this.voteService.voteForOptionChoice(this.pollId, option.optionName, choice.id).toPromise();
                console.log('voted: ', response);

                this.pollData = response;
                this.snackBar.showSnackBar('Vote submitted', 'success');

                choice['voted'] = true;

                this.updateLocalVote(option.optionName, choice.id, true);
                this.calcResults();
            } else {
                // Handle case where poll is expired
                this.snackBar.showSnackBar('This poll has expired. You cannot vote in an inactive poll.', 'warning');
            }
        } catch (error) {
            console.error('Error voting:', error);
            this.snackBar.showSnackBar('Error submitting vote. Please try again.', 'error');
            this.isVoting = false;
            option['voteLoad'] = false;
            choice['voteLoad'] = false;
        }
    }

    async removeVoteAsync(option, choice) {
        try {
            if (!this.expired) {

                const response = await this.voteService.unvoteForOptionChoice(this.pollId, option.optionName, choice.id).toPromise();
                console.log(response);

                this.pollData = response;
                this.snackBar.showSnackBar('Vote removed', 'success');

                choice['voted'] = false;

                this.updateLocalVote(option.optionName, choice.id, false);
                this.calcResults();
            } else {
                // Handle case where poll is expired
                this.snackBar.showSnackBar('This poll has expired. You cannot change votes.', 'warning');
            }
        } catch (error) {
            console.error('Error voting:', error);
            this.snackBar.showSnackBar('Error removing vote. Please try again.', 'error');
            this.isVoting = false;
            option['voteLoad'] = false;
            choice['voteLoad'] = false;
            choice['voted'] = false;
        }
    }

    updateLocalVote(optionName, choiceId, bol) {
        let localLookup = this.localVoteData.find(x => x.name === optionName) || null;

        if (bol) {
            if (localLookup) {
                localLookup.selected = choiceId;
            } else {
                this.localVoteData.push({ name: optionName, selected: choiceId });
            }
        } else {
            // Remove localLookup from this.localVoteData
            this.localVoteData = this.localVoteData.filter(x => x.name !== optionName);
        }

        localStorage.setItem(`${this.pollId}-info`, JSON.stringify(this.localVoteData));
        this.updateLocalArray();
    }

    expandImage(imageUrl: string): void {
        this.dialog.open(ViewImageComponent, {
            data: { imageUrl },
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'full-screen-dialog'
        });
    }

    clearLocal() {
        localStorage.clear();
        localStorage.removeItem(`${this.pollId}-info`);
        console.log('CLeared local storage')
    }

    scrollToElement(elementId: string) {
        this.showLeaders = true;
        setTimeout(() => {
            this.scrollService.scrollTo(elementId);
        }, 500);
    }
}
