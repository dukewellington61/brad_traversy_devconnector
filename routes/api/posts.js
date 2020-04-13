const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/',
 [
     auth,
     [
        check('text', 'Text is required')
        .not()
        .isEmpty()
     ]   
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();   
        
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }    
});


// @route   GET api/posts/user/:user_id
// @desc    Get all post from a user
// @access  Public    
router.get('/user/:user_id', async (req, res) => {
    try {
        user = await User.findById(req.params.user_id);

        if (!user) {
            return res.status(401).json({ msg: 'User not found'});
        };
        
        posts = await Post.find();

        const userPosts = posts.filter(post => post.user.toString() === req.params.user_id)
        res.send(userPosts);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found'})
        };
        res.status(500).send('Server Error');
    }
})    


// @route   GET api/posts
// @desc    Get all post
// @access  Private    
router.get('/', auth, async (req, res) => {
    try {
        posts = await Post.find().sort({ date: -1 });        
        res.send(posts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});   


// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private    
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);   
        
        if (!post) {
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.send(post);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'})
        };
        res.status(500).send('Server Error');
    }
});    


// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private    
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post not found'});
        }
        
        if (post.user.toString() !== req.user.id) {
           return res.status(401).json({ msg: 'You are not authorized to remove this post' });
        };

        await post.remove();

        return res.json({ msg: 'Post removed'});      
       
    } catch (err) {
        console.error(err);   
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'})
        };     
        res.status(500).send('Server Error');
    }
});    


// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private    
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        // If length of array that is beeing created containing likes with id of logged in user is
        // greater than 0 the post has already been liked by that user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked'});
        };

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
        
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'})
        };
        res.status(500).send('Server Error');
    };
});


// @route   PUT api/posts/like/:id
// @desc    Unlike a post
// @access  Private    
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);     
        
        // Check if the post has already been liked
        // If length of array that is beeing created containing likes with id of logged in user is
        // 0 the post has not yet been liked by that user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post not yet been liked by logged in user'});
        };

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);        

        post.likes.splice(removeIndex, 1);

        await post.save();        

        res.send(post.likes);
        
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'})
        };
        res.status(500).send('Server Error');
    };
});


// @route   POST api/posts/comment/:id
// @desc    Create a comment on a post
// @access  Private
router.post('/comment/:id',
 [
     auth,
     [
        check('text', 'Text is required')
        .not()
        .isEmpty()
     ]   
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id);

        const post = await Post.findById(req.params.id);  

        if (!post) {
            return res.status(404).json({ msg: 'Post not found'});
        };

        const newComment = {
            user: req.user.id,
            text: req.body.text,
            name: user.name,
            avatar: user.avatar           
        };

        post.comments.unshift(newComment);

        await post.save();   
        
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'})
        };
        res.status(500).send('Server Error');
    }    
});


// @route   UPDATE api/posts/comment/:post_id/:comment_id
// @desc    Update comment
// @access  Private  
router.put('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post does not exist' });
        };
        
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);        

        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        };        

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        };        
        
        comment.text = req.body.text;      

        await post.save();        

        res.send(post.comments);        
       
    } catch (err) {
        console.error(err);   
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        };     
        res.status(500).send('Server Error');
    }
});    


// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete comment
// @access  Private    
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post does not exist' });
        };
        
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);        

        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        };        

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        };        
        
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);  

        post.comments.splice(removeIndex, 1);

        await post.save();        

        res.send(post.comments);        
       
    } catch (err) {
        console.error(err);   
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        };     
        res.status(500).send('Server Error');
    }
});    


// @route   PUT api/posts/like/:post_id/:comment_id
// @desc    Like a comment
// @access  Private    
router.put('/comment/like/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            return res.status(404).json({ msg: 'Post does not exist' });
        };
        
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);        

        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        };        

        // Check if the post has already been liked
        // If length of array that is beeing created containing likes with id of logged in user is
        // greater than 0 the comment has already been liked by that user
        if (comment.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked'});
        };

        comment.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(comment.likes);
        
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'})
        };
        res.status(500).send('Server Error');
    };
});


// @route   PUT api/posts/comment/unlike/:post_id/:comment_id
// @desc    Unlike a comment
// @access  Private    
router.put('/comment/unlike/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            return res.status(404).json({ msg: 'Post does not exist' });
        };
        
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);        

        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        };        
        
        // Check if the post has already been liked
        // If length of array that is beeing created containing likes with id of logged in user is
        // 0 the post has not yet been liked by that user
        if (comment.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Comment has not yet been liked by logged in user' });
        };

        const removeIndex = comment.likes.map(like => like.user.toString()).indexOf(req.user.id);        

        comment.likes.splice(removeIndex, 1);

        await post.save();        

        res.send(comment.likes);
        
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'})
        };
        res.status(500).send('Server Error');
    };
});


    

module.exports = router;