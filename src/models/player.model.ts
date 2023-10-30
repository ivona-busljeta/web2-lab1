export interface Player {
    id: number,
    name: string,
    tournament: number
}

export interface PlayerWithStats extends Player {
    wins: number,
    defeats: number,
    ties: number,
    score: number
}

export interface PlayerDTO {
    name: string
}