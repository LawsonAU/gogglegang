import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { memberData } from '../../home/members.data';

@Component({
    selector: 'app-poll-options',
    templateUrl: './poll-options.component.html',
    styleUrls: ['./poll-options.component.scss']
})
export class PollOptionsComponent implements OnInit {
    memberNames = memberData.members.map(member => member.name).sort();

    @Input() choices: any = [];
    @Input() index: number = 0;
    @Input() optionName: string = '';
    @Output() updatePollOption: EventEmitter<{ optionName: string, choices: any[] }> = new EventEmitter<{ optionName: string, choices: any[] }>();

    useMemberName: boolean = false;

    optionForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.optionForm = this.formBuilder.group({
            optionName: [this.optionName, [Validators.required, Validators.minLength(3)]],
            memberName: this.optionName,
        });

        if (this.choices.length === 0) {
            this.addChoice();
        }
    }

    onNameChange() {
        const nameValue = this.optionForm.get('optionName').value;
        this.updatePollOption.emit({ optionName: nameValue, choices: this.choices });
    }

    onMemberNameSelect() {
        const selectedMemberName = this.optionForm.value.memberName;
        console.log('selectedMemberName', selectedMemberName)

        this.choices.map((x) => {
            if (x.imageName && x.imageName.includes(selectedMemberName)) {
                // If the selected member name is already in x.imageName, do nothing
            } else if (this.memberNames.includes(selectedMemberName) && !x.imageName.includes(selectedMemberName)) {
                // If the selected member name is in memberNames but not in x.imageName, update
                x.imageName = selectedMemberName;
            }
            // If neither condition is met, do nothing
        });
    }


    addChoice() {
        let nameValue = `${this.optionForm.get('optionName').value} -`;
        let choiceTemp = JSON.parse(JSON.stringify(exampleChoice));
        choiceTemp.imageName = nameValue;
        this.choices.push(choiceTemp);

        console.log('Adding Choice: ', choiceTemp)
    }

    copyChoice(choice) {
        let choiceCopy = JSON.parse(JSON.stringify(choice));
        choiceCopy.id = '';
        choiceCopy.imageURL = '';
        this.choices.push(choiceCopy);
    }

    removeChoice(choice: any, index: number): void {
        this.choices.splice(index, 1);
    }

    onChoiceChange(evt, choice) {
        console.log('child Event name field', evt);
        choice.imageName = evt.imageName;
        choice.description = evt.description;
        choice.tags = evt.tags;
        choice.imageURL = evt.imageURL;
        choice.option = evt.option;
        choice.id = evt.id;

        const nameValue = this.optionForm.get('optionName').value;
        this.updatePollOption.emit({ optionName: nameValue, choices: this.choices });
    }
}

const exampleChoice: any = {
    imageName: "",
    description: "",
    id: "",
    voteCount: 0,
    imageURL: "",
    option: 0,
    tags: "",
}
