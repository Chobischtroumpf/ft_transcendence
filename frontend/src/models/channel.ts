import {User} from './user';

export enum ChannelStatus
{
    public = 'public',
    private = 'private',
    protected = 'protected',
    direct = 'direct',
}

export class Channel
{
    constructor(
        public id: number,
        public name: string,
        public status: ChannelStatus,
        public members: User[]
    ) {}
}