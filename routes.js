var User = require('./models/user')

module.exports = function(app, passport) {

    app.get('/', function (req, res) {
        console.log(req.session.cookie)
        res.render('index.jade', {something: req.flash('errorMessage')})
    })
    
    app.get('/signup', function(req, res) {
        res.render('signup.jade', {message: req.flash('signupMessage')})
    })
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))
    
    app.get('/login', function(req, res) {
        res.render('login.jade', {message: req.flash('loginMessage')})
    })
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }))
    
    app.get('/u/:username', findUsername, function(req, res) {
        
        if (req.user === req.params.username) {
            res.render('profile.jade', {data: {isUser: true}})
        }                 //username : req.user.username, comments : req.user.comments, isUser : true
        else if (req.params.user) {
            res.render('profile.jade', {data : {isUser: false}})
        }
        else {
            req.flash('errorMessage', 'that profile page does not exist')
            res.redirect('/')
        }
    })
    
    app.get('/profile', isLoggedIn, function(req, res) {
         res.redirect('/u/' + req.user.username)
    })
    
    app.get('/signout', function(req, res) {
        
        if(req.user){
            req.logout()
            req.flash('errorMessage', 'you have signed out')
        }
        res.redirect('/')
    })
    
    ///////////////////////////////////////////////////
    
    app.post('/comment')
    
    app.get('*', function (req, res) {
        res.status(404).render('404.jade')
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next()
    else {
        req.flash('loginMessage', 'you need to be logged in for that')
        res.redirect('/login')
    }
}

function findUsername(req, res, next) {
    User.findOne({ 'username' : req.params.username }, function (err, user) {
        if (user) req.params.user = user
        next()
    })
}