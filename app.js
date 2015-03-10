var
    passport = require('passport'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    request = require('request'),
    qs = require('querystring'),
    express = require('express'),
    session = require('express-session'),
    app = express(),
    base_url = 'https://api.moves-app.com',
    oauth_url = [base_url, 'oauth', 'v1'].join('/'),
    api_url = [base_url, 'api', '1.1'].join('/')

app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(tokens, done) {
    done(null, tokens)
})

passport.deserializeUser(function(tokens, done) {
    done(null, tokens)
})

passport.use('moves', new OAuth2Strategy({
        authorizationURL: [oauth_url, 'authorize'].join('/'),
        tokenURL: [oauth_url, 'access_token'].join('/'),
        clientID: 'Zvb76sIp8zRnYMI8VCt7vvpDK0n1w_4v',
        clientSecret: 'cb75Hm04REgcDYk3V2OnH237D5Et7kNgp9Df7IzaNTnDraEqBHU112z6vZl25GuO',
        callbackURL: 'http://localhost:3000/auth/moves/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        var tokens = {
            access_token: accessToken,
            refresh_token: refreshToken
        }
        done(null, tokens)
    }
))

app.get('/auth/moves', passport.authenticate('moves', {
    scope: 'activity'
}))

app.get('/auth/moves/callback',
    passport.authenticate('moves', {
        successRedirect: '/profile',
        failureRedirect: '/auth/moves'
    })
)

app.get('/profile', function(req, res) {
    var
        url = [api_url, 'user', 'profile'].join('/'),
        query_str = qs.stringify({access_token: req.user.access_token})
    url = [url, query_str].join('?')
    request.get(url, function(err, resp, body) {
        res.send(body)
    })
})

app.listen(3000)
