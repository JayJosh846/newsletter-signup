const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res)
{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res)
{
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var email_ = req.body.email;

    const data = 
    {
        members: 
        [
            {
                email_address: email_,
                status: "subscribed",
                merge_fields: 
                {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/4607074d19";

    const options = 
    {
        method: "POST",
        auth: "jayjosh846:API_KEY"

    }

    const request = https.request(url, options, function(response) 
    {
        if (response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else
        {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data)
        {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res)
{
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function()
{
    console.log("Server running on port 3000")
})

// 4c82844132c72e003f7e51c031e574c9-us10
//4607074d19
