var nodemailer = require("nodemailer");

var auth = {
    user: "details",
    pass: "details"
}

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail", auth: auth
});

module.exports = function(req, token, cb) {

    // setup e-mail data with unicode symbols
    var html = "<h2>Welcome to User Test<h2><br>";
    html += "<p>To confirm your account click the link below or copy&paste it into your browser<p><br>";
    html += "<a href='http://localhost:3000/verify?tok=" + token +"'>http://localhost:3000/verify?tok=" + token + "</a>";

    var mailOptions = {
        from: "User Test <" + auth.user + ">",
        to: req.body.email,
        subject: "Welcome to User Test!",
        html: html
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            cb(error);
        }else{
            cb(null, response.message);

        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
};