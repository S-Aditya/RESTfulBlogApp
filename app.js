var     express         = require("express");
var     app             = express();
var     mongoose        = require("mongoose");
var     methodOverride  = require("method-override");
const { render } = require("ejs");

mongoose.connect("mongodb://localhost/restful_blog_app",{ useUnifiedTopology: true , useNewUrlParser: true }); // database connection 

bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended: true})); 

app.use(express.static("public"));

app.use(methodOverride("_method"));

app.set("view engine","ejs");

//TITLE
//IMAGE
//BODY
//CREATED

//SCHEMA SETUP
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create(
//     {
//         title: "Sachin Tendulkar", 
//         image: "https://i.pinimg.com/564x/15/3b/a8/153ba8ae7b4115f81cfa8b2296adafec.jpg",
//         body: "Inspiration to many, a many so talented and eqully humble"
//     },function (err,blog) {
    
//         if(err)
//         console.log("ERROR!");
//         else{
//             console.log("Succesfully Inserted!");
//             console.log(blog);
//         }
// })

app.get("/",function (req,res) {
    res.redirect("/blogs");
})

//INDEX route - Show all blog posts

app.get("/blogs",function (req,res) {
    
    //get all blogs from DB
    Blog.find({}, function(err,blogs) {
        if(err)
        console.log("dikkat");
        else
        res.render("index", {blogs:blogs});
    });
});

app.post("/blogs", function(req,res) {
    
    console.log(req.body.blog);

    //create a new campground and save to the DB 
    Blog.create(req.body.blog,function (err,newlyCreate) {
        if(err){
            console.log("Error!");
        }
        else{
            //console.log(newCampground);

            res.redirect("/blogs");
        }
    })
});

//NEW - shows form for inserting new route
app.get("/blogs/new",function (req,res) {
    res.render("new");
})

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res) {
    
    //res.send("delete hojaega")

    Blog.findByIdAndDelete(req.params.id,function(err,match) {
        if(err)
        console.log("Error in show route");
        else
        {
            //res.redirect("/blog/new")
            res.redirect("/blogs");
        }
    })

})

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    //find the blogpost with the required id
    //and show template with that id
    console.log(req.params.id);
    Blog.findById(req.params.id, function(err,match) {
        if(err)
        console.log("Error in show route");
        else
        {
            //res.redirect("/blog/new")
            res.render("show",{match: match});
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id", function(req,res) {
    
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,match) {
        if(err)
        console.log("Error in show route");
        else
        {
            //res.redirect("/blog/new")
            res.redirect("/blogs/"+req.params.id);
        }
    })

})

//EDIT route
app.get("/blogs/:id/edit", function(req, res) {
    
    Blog.findById(req.params.id, function(err,match) {
        if(err)
        console.log("Error in edit route");
        else
        {
            res.render("edit",{match: match});
        }
    })

})

app.listen("3000",function () {
    console.log("Server started at port 3000");
})
