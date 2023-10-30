import {Player} from "./player.model";

export interface MatchKey {
    tournament: number,
    round: number,
    order: number
}

export interface Match extends MatchKey {
    player1: Player,
    player2: Player,
    winner: string
}

export interface MatchDTO {
    round: number,
    order: number,
    player1: number,
    player2: number
}