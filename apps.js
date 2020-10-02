var exp= require("express"),
    app=exp(),
    bodyParse=require("body-parser"),
    mongoose=require("mongoose"),
    methodOverride=require("method-override"),
    expressSanitizer=require("express-sanitizer");
    
//app config
app.set("view engine","ejs");
app.use(exp.static("public"));
app.use(bodyParse.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
    
//mongooese config
mongoose.connect("mongodb://localhost/blogPost",{useNewUrlParser:true});
var newBolg = new mongoose.Schema({
    title:String,
    body:String,
    image:String,
    created:{type:Date , default:Date.now }
});

var newPost= mongoose.model("newPost" , newBolg);

// newPost.create({
//     title:"!st blog",
//     image:"https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
//     body:"This has no body",
// },function(err,newPost){
//     if(err){
//       console.log(err); 
//     }
// });

//routes
app.get("/", function(req,res){
   res.redirect("/blog"); 
});

//INDEX route
app.get("/blog" , function(req,res){
  newPost.find({} , function(err,newPosts){
      if(!err){
          res.render("index" , {blog: newPosts});  
      }else{
          console.log(err);
      }
  });
});

//NEW route
app.get("/blog/new" ,function(req, res) {
    res.render("new");
});

//CREATE route
app.post("/blog" ,function(req,res){
    var newBlog={
        title: req.body.title,
        image: req.body.image,
        body: req.body.body
    }
    
   req.body.body=req.sanitize(req.body.body);
   newPost.create(newBlog ,function(err , newBlog){
       if(err){
           console.log(err);
       }else{
           res.redirect("/blog");
       }
   }) 
});

//SHOW route
app.get("/blog/:id" ,function(req, res) {
   newPost.findById(req.params.id, function(err, foundBlog){
       if(!err){
           res.render("show", {blog:foundBlog});
       }else{
           console.log(err);
       }
   })
});

//EDIT route
app.get("/blog/:id/edit" ,function(req, res) {
    newPost.findById(req.params.id , function(err ,foundBlog){
       if(!err){
           res.render("edit" , {blog:foundBlog});
       }else{
           res.redirect("/blog");
       }
    });
});

//UPDATE route
app.put("/blog/:id" ,function(req,res){
   req.body.body=req.sanitize(req.body.body);
   var obj={
       title:req.body.title,
       image:req.body.image,
       body:req.body.body
   }
   newPost.findByIdAndUpdate(req.params.id ,obj ,function(err, updateBlog){
      if(err){
          res.redirect("/blog");
      }else{
          res.redirect("/blog/"+req.params.id); 
          }
   });
});

//DESTTROY route
app.delete("/blog/:id" ,function(req,res){
    newPost.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blog");
        }
    }); 
});
 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog Post Server!!!!!!");
});
    