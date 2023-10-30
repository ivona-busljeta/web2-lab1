import express from 'express';
import {
    getTournamentMatches,
    getUserTournaments,
    saveTournament,
    updateTournamentStats
} from './controllers/tournament.controller';
import path from 'path';
import dotenv from 'dotenv';
import {auth, requiresAuth} from "express-openid-connect";
import https from "https";
import fs from "fs";

dotenv.config();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: externalUrl || `https://localhost:${port}`,
    clientID: process.env.AUTH_CLIENT_ID,
    issuerBaseURL: process.env.AUTH_DOMAIN
};

app.use(auth(config));
app.use(express.urlencoded());


app.get('/',  function (req, res) {
    let user : string | undefined;
    if (req.oidc.isAuthenticated()) {
        user = req.oidc.user?.name;
    }
    res.render('homepage', {user});
});

app.get('/share/:code', getTournamentMatches);

app.route('/tournaments')
    .get(requiresAuth(), getUserTournaments)
    .post(requiresAuth(), saveTournament);

app.route('/tournaments/:code')
    .get(requiresAuth(), getTournamentMatches);

app.route('/tournaments/:code/stats')
    .post(requiresAuth(), updateTournamentStats);


if (externalUrl) {
    const hostname = '0.0.0.0';
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`);
    });
} else {
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app)
        .listen(port, () => {
            console.log(`Server running at https://localhost:${port}/`);
        });
}