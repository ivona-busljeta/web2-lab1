import {PlayerWithStats} from "../models/player.model";
import pool from "../db/pool";

export async function getAllPlayersByTournamentWithStats(tournament: number): Promise<PlayerWithStats[]> {
    const statement = `select p.*, t.win_value, t.tie_value, t.defeat_penalty,
                              (select count(*)
                               from match
                               where ((player1 = p.id and winner = '1') or (player2 = p.id and winner = '2'))
                                and tournament = $1) as wins,
                              (select count(*)
                               from match
                               where ((player1 = p.id and winner = '2') or (player2 = p.id and winner = '1'))
                                and tournament = $1) as defeats,
                              (select count(*)
                               from match
                               where (player1 = p.id or player2 = p.id) and winner = 'TIE'
                                and tournament = $1) as ties
                       from player p
                       join tournament t on t.id = p.tournament
                       where p.tournament = $1`;

    const results = await pool.query(statement, [tournament]);

    return results.rows.map(r => {
        return {
            id: r['id'],
            name: r['name'],
            tournament: r['tournament'],
            wins: r['wins'],
            defeats: r['defeats'],
            ties: r['ties'],
            score: r['wins'] * r['win_value'] + r['ties'] * r['tie_value'] - r['defeats'] * r['defeat_penalty']
        } as PlayerWithStats
    });
}

export async function saveAllPlayersByTournament(names: string[], tournament: number): Promise<number[]>{
    let statement = 'insert into player (name, tournament) values ';
    for (let i = 0; i < names.length; i++) {
        statement += `('${names[i]}', ${tournament})`;
        if (i + 1 < names.length) {
            statement += ', '
        }
    }
    statement += ' returning id'
    const results = await pool.query(statement);

    return results.rows.map(row => row.id);
}