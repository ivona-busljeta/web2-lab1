import {Tournament, TournamentDTO} from "../models/tournament.model";
import pool from "../db/pool";

export async function getTournamentById(id: number): Promise<Tournament> {
    const statement = 'select * from tournament where id = $1'
    const result = (await pool.query(statement, [id])).rows[0];

    return {
        id: result['id'],
        name: result['name'],
        creator: result['creator'],
        win: result['win_value'],
        tie: result['tie_value'],
        defeat: result['defeat_penalty'],
        created: result['created']
    } as Tournament;
}

export async function getAllUnfinishedTournamentsByCreator(creator: string): Promise<Tournament[]> {
    const statement = `select distinct t.*
                       from tournament t
                       join match m on m.tournament = t.id
                       where m.winner is null and t.creator = $1
                       order by t.created desc`;

    const results = await pool.query(statement, [creator]);

    return results.rows.map(r => {
        return {
            id: r['id'],
            name: r['name'],
            creator: r['creator'],
            win: r['win_value'],
            tie: r['tie_value'],
            defeat: r['defeat_penalty'],
            created: r['created']
        } as Tournament;
    });
}

export async function getAllFinishedTournamentsByCreator(creator: string): Promise<Tournament[]> {
    const statement = `select t.*
                       from tournament t
                       where t.creator = $1 and t.id in (
                            select distinct tournament
                            from match
                            where tournament = t.id and winner is not null
                            except
                            select distinct tournament
                            from match
                            where tournament = t.id and winner is null)
                       order by t.created desc`;

    const results = await pool.query(statement, [creator]);

    return results.rows.map(r => {
        return {
            id: r['id'],
            name: r['name'],
            creator: r['creator'],
            win: r['win_value'],
            tie: r['tie_value'],
            defeat: r['defeat_penalty'],
            created: r['created']
        } as Tournament;
    });
}

export async function saveTournamentByCreator(tournament: TournamentDTO, creator: string): Promise<number> {
    const statement = `insert into tournament (name, creator, win_value, tie_value, defeat_penalty) values ($1, $2, $3, $4, $5) returning id`;
    const result = await pool.query(statement, [tournament.name, creator, tournament.win, tournament.tie, tournament.defeat])

    return result.rows[0].id;
}