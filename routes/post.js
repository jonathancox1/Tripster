var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt');

// require Authentication
const checkAuth = require('../auth/checkAuthentication');

router.post('/comment/new', checkAuth, (req, res, next) => {
    contentId = req.body.blogid;
    console.log(req.body.blogid);
    db.Comments.create({
        UserId: req.session.user.id,
        ContentId: req.body.blogid,
        body: req.body.commentbody
    }
    )
    .then(() => {
        res.redirect(`/post/id/${contentId}`)
    })
})

// get blog post by id // this is a public routes
router.get('/id/:id', (req, res, next) => {
    db.Contents.findByPk(req.params.id)
        .then((blogPost) => {  // get the blog post 
            db.Comments.findAll(
                { where: { ContentId: req.params.id }, order: [["createdAt", "DESC"]] })
                .then((allComments) => {
                    res.render('../Views/fullpost.ejs', {
                        title: blogPost.dataValues.title,
                        user: 'Not Logged In',
                        body: blogPost.dataValues.body,
                        comments: allComments,
                        id: blogPost.id
                    })
                })
        })
})

// get the homepage route, private route authentication required
router.get('/', checkAuth, (req, res, next) => {
    res.render('../Views/post.ejs', {
        title: 'New Post',
        user: req.session.user.username,
        // user: req.session.user || null,
    });
});

// post a new blog entry, private route, to post you must have gone through above route and therefor have access to the private page
router.post('/new', (req, res, next) => {
    db.Contents.create({
        UserId: req.session.user.id,
        title: req.body.title,
        body: req.body.body,
    }).then(() => {
        res.redirect('/homepage');
    })
})



module.exports = router;