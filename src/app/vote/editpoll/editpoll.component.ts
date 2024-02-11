import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoteService } from '../vote.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { memberData } from '../../home/members.data';

@Component({
    selector: 'app-editpoll',
    templateUrl: './editpoll.component.html',
    styleUrls: ['./editpoll.component.scss'],
    providers: [DatePipe]
})

export class EditpollComponent implements OnInit {
    memberNames = memberData.members.map(member => member.name).sort();

    pollId: string;
    pollData: Poll = examplePoll; // Change any to Poll
    isLoading: boolean = false;
    isSaving: boolean = false;
    pollForm: FormGroup;
    nowDate: any = Date.now()
    missingImage: string = "../../../assets/images/missing-image.webp";

    constructor(
        private route: ActivatedRoute,
        private voteService: VoteService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit() {
        console.log(this.pollData)
        this.getData();
    }

    getData() {
        this.route.params.subscribe(params => {
            this.pollId = params['id'];

            if (this.pollId) {
                this.isLoading = true;
                this.voteService.getPollById(this.pollId).subscribe({
                    next: (poll: Poll) => { // Change any to Poll
                        console.log('poll Data: ', poll);
                        this.pollData = poll;
                        this.formInit();
                        this.isLoading = false;
                    },
                    error: (error) => {
                        console.error('Error fetching poll:', error);
                        this.isLoading = false;
                    }
                });
            } else {
                this.formInit();
            }
        });
    }

    formInit() {
        this.pollForm = this.formBuilder.group({
            pollName: [this.pollData?.pollName || '', [Validators.required, Validators.minLength(3)]],
            expires: [new Date(this.pollData?.expires) || null, [Validators.required, dateValidator()]],
        });

        this.pollForm.get('expires').valueChanges.subscribe(() => {
            this.onFormChange();
        });
    }

    handleNameUpdate(updatedName: string) {
        console.log('Updated Name in Parent:', updatedName);
    }

    onFormChange() {
        this.pollData.pollName = this.pollForm.get('pollName').value;
        this.pollData.expires = this.pollForm.get('expires').value.toUTCString();

        console.log('this.pollData:', this.pollData);
    }

    onOptionChange(evt, option) {
        console.log('child Event name field', evt);
        option.optionName = evt.optionName;
        option.optionChoices = evt.choices;

        console.log('pollData: ', this.pollData)
    }

    addOptions(place) {
        let exampleTemp = JSON.parse(JSON.stringify(exampleOption));

        let index = this.pollData.pollOptions.length;
        exampleTemp.optionName =  this.memberNames[index];

        exampleTemp.optionChoices.map((x) => {
            x.imageName = `${exampleTemp.optionName} -`;
        })

        console.log('exampleTemp', exampleTemp)

        if (place === 'after') {
            this.pollData.pollOptions.push(exampleTemp);
        } else if (place === 'before') {
            this.pollData.pollOptions.unshift(exampleTemp);
        } else {
            // Handle other cases or provide a default behavior
            this.pollData.pollOptions.push(exampleTemp);
        }
    }

    removeOption(option: any, index: number): void {
        // Assuming pollData is a property in your component
        if (this.pollData && this.pollData.pollOptions) {
            // Remove the option from the array
            this.pollData.pollOptions.splice(index, 1);
        }
    }

    updatePreview() {

    }

    createPoll() {
        console.log('pollData', this.pollData);
        console.log('pollForm', this.pollForm);
        if (this.pollForm.status === "INVALID" || this.pollData.pollOptions.length < 1) {
            this.showSnackBar(`Check your form details`, 'warning');
            return;
        }

        this.isSaving = true;
        this.voteService.createPoll(this.pollData).subscribe({
            next: (response) => {
                console.log('Poll created successfully:', response);
                this.pollData = response;
                this.router.navigate(['/vote/editpoll', response.id]);
                this.showSnackBar(`Poll is created`, 'success');
                this.isSaving = false;
            },
            error: (error) => {
                console.error('Error creating poll:', error);
                this.showSnackBar(`File is uploaded`, 'warning');
                this.isSaving = false;
            }
        });
    }

    updatePoll() {
        if (this.pollForm.status === "INVALID" && this.pollData.pollOptions.length < 1) {
            this.showSnackBar(`Check your form details`, 'warning');
            return;
        }

        this.isSaving = true;
        this.voteService.updatePoll(this.pollData).subscribe({
            next: (response) => {
                console.log('Poll updated successfully:', response);
                this.showSnackBar(`Poll is updated`, 'success');
                this.isSaving = false;
            },
            error: (error) => {
                console.error('Error updating poll:', error);
                this.isSaving = false;
            }
        });
    }

    showSnackBar(message: string, messageType: 'success' | 'warning' | 'error'): void {
        const config = new MatSnackBarConfig();
        config.duration = 5000;

        const panelClass = `custom-${messageType}-snackbar`;
        config.panelClass = [panelClass];

        this.snackBar.open(message, 'close', config);
    }
}

const examplePoll: Poll = {
    id: "",
    pollName: "",
    expires: "",
    pollOptions: [
        {
            optionName: "",
            optionChoices: [],
        }
    ],
};

const exampleOption: PollOption = {
    optionName: "",
    optionChoices: [],
}

export function dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const currentDate = new Date();
        const selectedDate = new Date(control.value);

        if (selectedDate < currentDate) {
            return { 'dateInPast': true };
        }

        return null;
    };
}

export interface Poll {
    id: string;
    pollName: string;
    expires: string;
    pollOptions: PollOption[];
}

export interface PollOption {
    optionName: string;
    optionChoices: OptionChoice[];
}

export interface OptionChoice {
    imageName: string;
    description?: string;
    id: string;
    voteCount: number;
    imageURL: string;
    tags: string;
    option: number;
}
