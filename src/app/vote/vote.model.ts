// vote.model.ts

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
    name: string;
    description?: string;
    id: number;
    voteCount: number;
    imageURL: string;
    tags: string[];
}
