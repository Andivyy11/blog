import express from "express"
import ejs from "ejs"
import bodyParser from "body-parser" 
import mongoose from "mongoose"

mongoose.connect("mongodb://localhost:27017/blogDB" , { useNewUrlParser:true })

const BlogSchema=mongoose.Schema({
    title: String,
    para: String
})

const blog=mongoose.model("blog" ,BlogSchema)
const blog1=new blog({
    title:"The Puzzle of the Galaxy",
    para: "In the current standard model cosmology massive galaxies contain substantial quantities of dark matter, a type of matter which does not interact in the same way as normal matter; the only evidence for its existence is the strong gravitational pull which it exerts on the stars and the gas nearby, and this interacton is observable. NGC 1277 is considered a prototype - relic galaxy which means a galaxy which has had no interactions with its neighbours. Galaxies of this type are very rare, and they are considered the remnants of giant galaxies which formed in the early days of the universe.The importance of relic galaxies in helping us to understand how the first galaxies formed was the reason we decided to observe NGC 1277 with an integral field spectrograph explains Comerón. From the spectra we made kinematic maps which enabled us to work out the distribution of mass within the galaxy out to a radius of some 20,000 light years he adds."
    })
const blog2=new blog({
    title : "New planetary formation findings",
    para: "The combination of VLT and ALMA imaging have yielded detections of dusty clumps close to the young star V960 Mon that could collapse to create giant planets. The work is based on an infrared image obtained with the Spectro-Polarimetric High-contrast Exoplanet Research (SPHERE) instrument on ESO's VLT and a radio-wavelength image with ALMA that together reveal, in fascinating detail, the material around the star.This young star attracted astronomers attention when it suddenly increased its brightness more than 20 times in 2014. SPHERE observations taken shortly after the onset of this brightness outburst revealed that the material orbiting V960 Mon is assembling together in a series of intricate spiral arms extending over distances bigger than the entire solar system."
    })

var defaultBlogs=[ blog1 , blog2 ]
// blog.insertMany(defaultBlogs).then(function(err){
    // if(err)
    //     console.log("try more")
    // else 
    //     console.log("inserted")
// })

const app=express()
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static("public"))


app.get('/', (req,res)=>{
        blog.find({}).then(function(dbContent){
        if(dbContent.length==0)
            blog.insertMany(defaultBlogs)
        else 
        {
            res.render("home.ejs" , { myblogs : dbContent})
        }
       }).catch(function(err){
            if(err)
                console.log("error while rendering")
        })
})

app.get('/about' ,(req,res)=>{
    res.render("about.ejs")
})
app.get('/contact' , (req,res)=>{
    res.render("contact.ejs")
})
app.get('/page/:titlename' , (req,res)=>{
    const requestedpost=(req.params.titlename).toLowerCase();
    console.log(requestedpost)
    blog.find({}).then(function(dbContent){
        if(dbContent)
        {
            dbContent.forEach(post=>{
                if(post.title.toLowerCase()==requestedpost)
                {
                    res.render("page.ejs" ,{
                        title: post.title,
                        para : post.para
                    })
                }
            })
        }
        else 
            res.redirect('/')

    })
   
 })

 app.get('/compose', (req,res)=>{
    res.render('type.ejs')
 })

 app.post('/compose' ,(req,res)=>{
    var result=req.body
    if(result.title.length!=0 && result.para.length!=0)
    {
        const b=new blog({
            title:result.title,
            para:result.para
        })
        blog.insertMany([b]);
    }
    res.redirect('/')
 })

app.post('/delete' , (req,res)=>{
    const t=req.body.btn;
    blog.deleteOne({title:t}).then(function(err){
        if(err)
          console.log("an erreo")
        else 
          console.log("deleted")
    })
    res.redirect('/')
})

app.listen(3000, ()=>{
   console.log("server is running...")
})