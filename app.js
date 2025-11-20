const express =require("express");
const path =require("path");
const userModel = require("./models/userModel")
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("index")
});

app.post("/create",async (req,res)=>{
    let {name , email , image} = req.body
    if((name.length > 0) && (email.length > 0) && (image.length > 0)){
        await userModel.create({
            name , email , image
        })
        res.redirect("/")
    } else {
        res.render("entryerror")
    }   
});

app.get("/read",async (req,res) => {
    const allusers =await userModel.find()
    res.render("showusers",{users: allusers})
});

app.get("/edit/:id",async (req,res) => {
    const userToEdit = await userModel.findOne({_id: req.params.id})
    res.render("update",{user: userToEdit})
})

app.get("/delete/:id", async (req,res) => {
    await userModel.findOneAndDelete({_id: req.params.id})
    res.redirect("/read")
});

app.post("/update/:id", async (req, res) => {
    let {name , email , image} = req.body
    await userModel.findOneAndUpdate({_id: req.params.id},{name , email, image},{new: true})
    res.redirect("/read")
})

app.listen(3000, console.log("Server is running at localhost:3000"))