import {MatchDTO} from "../models/match.model";

const kirkman = (players: number[], round: number): MatchDTO[] => {
    let n = players.length;
    let byeExists = false;

    if (n % 2 != 0) {
        byeExists = true;
        ++n;
    }

    let index = [round, round];
    const matches: MatchDTO[] = [];

    for (let i = 0; i < Math.floor(n / 2); ++i) {
        let first = players[index[0] - 1];
        let second;

        if (index[0] == index[1]) {
            second = byeExists ? 'bye' : players[n - 1];
        } else {
            second = players[index[1] - 1]
        }

        if (second != 'bye') {
            const match = {
                round: round,
                order: byeExists ? i : i + 1,
                player1: first,
                player2: second
            } as MatchDTO

            matches.push(match);
        }

        index = [index[0] - 1, index[1] + 1];

        if (index[0] < 1) {
            index[0] = n - 1;
        }
        if (index[1] > n - 1) {
            index[1] = 1;
        }
    }

    return matches;
}

export function generateSchedule(players: number[]): MatchDTO[] {
    const n = players.length % 2 == 0 ? players.length - 1 : players.length;
    let matches: MatchDTO[] = [];

    for (let i = 1; i <= n; i++) {
        const round = kirkman(players, i);
        matches = matches.concat(round);
    }

    return matches;
}