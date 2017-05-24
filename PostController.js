/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
"use strict";
module.exports = {
	


  /**
   * `PostController.create()`
   */
  create: function (req,res) {
      
      //extract categoryname from request object
      let categoryName =req.param('category_name'),
          
      //extratct Post params
          title = req.param('title'),
          content=req.param('content'),
          userId = req.param('user_id');
      
      //validate categoryname
      if(!categoryName){
          return res.badRequest({err:'invalid category_name'});
      }
      
      if(!title){
          return res.badRequest({err:'invalid title'});
      }
      
      if(!content){
          return res.badRequest({err:'invalid content'});
      }
      
      //create async method makeRequest
      const makeRequest = async () => {
          
          try{
          //create new category
          const category = await Category.create({name:categoryName});
      
          //create new post
          const post = await Post.create({
              title,content,
              _user :req.token.id,
              _category:category.id
          });
      
          //return
        return {post,category};
      }catch(err){
    throw err;
       }
      }
      
      makeRequest()
      .then(result => res.ok(result))
      .catch(err => res.serverError(err));
},

  /**
   * `PostController.findOne()`
   */
  findOne: function (req, res) {
      
      //extract postId
      let postId= req.params.id;
      
      //validate postId
      if(!postId){
          return res.badRequest({err: 'invalid post_id'});
      }
      
      //find single post with category
      Post.findOne({
          id:postId
      })
      .populate('_category')
      .then(post => {
          res.ok(post);
      })
      .catch(err => res.notFound(err));

  },


  /**
   * `PostController.findAll()`
   */
  findAll: function (req, res) {
     Post.find()
      .populate('_category')
      .then(posts => {
         if (!posts || posts.lenght ===0){
             throw new Error('No post found');
         }
         return res.ok(posts);
     })
      .catch(err => res.notFound(err));
  },


  /**
   * `PostController.update()`
   */
  update: function (req, res) {
      //Extract PostId
      let postId = req.params.id;
      
      let post ={};
      //extract title
      
      let title = req.param('title'),
          content = req.param('content'),
          userId = req.param('user_id'),
          categoryId = req.param('category_id');
      //add title to post object
      if(title){
          post.title = title;
      }
      //add content to Post object
      if (content){
          post.content = content;
      }
      if (userId){
          post._user= userId;
      }
      //add categoryId to post object
      if (categoryId){
          post._category=categoryId;
      }
      
      //update the post by id
      
      Post.update({id : postId},post)
      .then(post => {
          return res.ok(post[0]);
      })
      .catch (err=> res.serverError(err));
      //send updated post in response
  },


  /**
   * `PostController.delete()`
   */
  delete: function (req, res) {
      //extract postId
      let postId = req.params.id;
      
      //validate postId
      if(!postId){
          return res.badRequest({err: 'invalid post_id'});
      }
      
      //delete the post
      Post.destroy({
          id : postId
      })
      .then(post => {
          res.ok(`Post has been deleted with ID ${postId}`);
      })
      .catch(err => res.serverError(err));
  }
};

