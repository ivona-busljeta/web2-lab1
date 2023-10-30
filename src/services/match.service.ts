import {Match, MatchDTO, MatchKey} from "../models/match.model";
import pool from "../db/pool";
import {Player} from "../models/player.model";

export async function getAllMatchesByTournament(tournament: number): Promise<(Match & {tournament_name: string})[]> {
    const statement = `select m.*, t.name as tournament_name, p1.name as name1, p2.name as name2
                       from match m
                       join player p1 on m.player1 = p1.id
                       join player p2 on m.player2 = p2.id
                       join tournament t on m.tournament = t.id
                       where m.tournament = $1
                       order by round, "order"`;

    const results = await pool.query(statement, [tournament]);

    return results.rows.map(r => {
        return {
            tournament: r['tournament'],
            tournament_name: r['tournament_name'],
            round: r['round'],
            order: r['order'],
            player1: {
                id: r['player1'],
                name: r['name1']
            } as Player,
            player2: {
                id: r['player2'],
                name: r['name2']
            } as Player,
            winner: r['winner']
        } as Match & {tournament_name: string};
    });
}

export async function saveAllMatchesByTournament(matches: MatchDTO[], tournament: number) {
    let statement = 'insert into match (tournament, round, "order", player1, player2) values ';
    for (let i = 0; i < matches.length; i++) {
        statement += `(${tournament}, ${matches[i].round}, ${matches[i].order}, ${matches[i].player1}, ${matches[i].player2})`;
        if (i + 1 < matches.length) {
            statement += ', '
        }
    }

    await pool.query(statement)
}

export async function updateWinnerByKey(key: MatchKey, winner: '1' | '2' | 'TIE') {
    const statement = `update match set winner = $1 where tournament = $2 and round = $3 and "order" = $4`;
    await pool.query(statement, [winner, key.tournament, key.round, key.order]);
}

