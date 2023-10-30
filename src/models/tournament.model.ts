export interface Tournament {
    id: number,
    name: string,
    creator: string,
    win: number,
    tie: number,
    defeat: number,
    created: Date
}

export interface TournamentDTO {
    name: string,
    win: number,
    tie: number,
    defeat: number
}