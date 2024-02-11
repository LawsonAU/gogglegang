import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoteComponent } from './vote.component';
import { EditpollComponent } from './editpoll/editpoll.component';
import { CompletePollComponent } from './complete-poll/complete-poll.component';

const routes: Routes = [
    { path: '', component: VoteComponent },
    { path: 'editpoll', component: EditpollComponent },
    { path: 'editpoll/:id', component: EditpollComponent },
    { path: 'poll/:id', component: CompletePollComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VoteRoutingModule { }
