import {getAllFinishedTournamentsByCreator, getAllUnfinishedTournamentsByCreator, saveTournamentByCreator} from "../services/tournament.service";
import {TournamentDTO} from "../models/tournament.model";
import {getAllPlayersByTournamentWithStats, saveAllPlayersByTournament} from "../services/player.service";
import {generateSchedule} from "../helpers/schedule-generator";
import {getAllMatchesByTournament, saveAllMatchesByTournament, updateWinnerByKey} from "../services/match.service";
import {MatchKey} from "../models/match.model";

const cache = require('memory-cache');
const {v4: uuidv4} = require('uuid');

export async function getUserTournaments(req, res) {
    const user = req.oidc.user.name;
    const finishedTournaments = await getAllFinishedTournamentsByCreator(user);
    const unfinishedTournaments = await getAllUnfinishedTournamentsByCreator(user);

    res.render('user_tournaments', {user, finishedTournaments, unfinishedTournaments});
}

export async function saveTournament(req, res) {
    const user = req.oidc.user.name;
    const {name, scoring_system, players} = req.body;

    const scores = scoring_system.split('/');
    const tournament = {
        name: name,
        win: scores[0],
        tie: scores[1],
        defeat: scores[2]
    } as TournamentDTO;
    const tournament_id = await saveTournamentByCreator(tournament, user);

    const names = players.split(';');
    const player_ids = await saveAllPlayersByTournament(names, tournament_id);

    const matches = generateSchedule(player_ids);
    await saveAllMatchesByTournament(matches, tournament_id);

    const code = uuidv4();
    cache.put(code, {creator: user, tournament_id: tournament_id});


    res.redirect(`/tournaments/${code}`);
}

export async function getTournamentMatches(req, res) {
    let user : string | undefined;
    if (req.oidc.isAuthenticated()) {
        user = req.oidc.user?.name;
    }
    const code = req.params.code;

    const {creator, tournament_id} = cache.get(code);
    const isCreator = user == creator;
    const share_link = `${req.protocol}://${req.get('host')}/share/${code}`;

    const stats = (await getAllPlayersByTournamentWithStats(tournament_id))
        .sort((a, b) => b.score - a.score);

    const matches = await getAllMatchesByTournament(tournament_id);
    const tournament_name = matches[0].tournament_name;

    res.render('tournament_matches', {user, code, tournament_name, share_link, stats, matches, isCreator})
}

export async function updateTournamentStats(req, res) {
    const code = req.params.code;
    const {tournament_id} = cache.get(code);
    const {round, order, winner} = req.body;
    const key = {
        tournament: tournament_id,
        round: round,
        order: order
    } as MatchKey;

    await updateWinnerByKey(key, winner);

    res.redirect(`/tournaments/${code}`);
}