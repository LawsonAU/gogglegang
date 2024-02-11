// vote.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoteRoutingModule } from './vote-routing.module';
import { VoteComponent } from './vote.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { EditpollComponent } from './editpoll/editpoll.component';
import { PollOptionsComponent } from './poll-options/poll-options.component';
import { OptionChoicesComponent } from './poll-options/option-choices/option-choices.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompletePollComponent } from './complete-poll/complete-poll.component';

@NgModule({
    declarations: [
        VoteComponent,
        EditpollComponent,
        PollOptionsComponent,
        OptionChoicesComponent,
        CompletePollComponent
    ],
    imports: [
        CommonModule,
        VoteRoutingModule,
        SharedModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})

export class VoteModule { }
