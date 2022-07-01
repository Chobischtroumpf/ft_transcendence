import axios from "axios";

export class MessageI
{
    constructor(
        public id: number,
        public content: string,
        public author: any,
    ) {}
}