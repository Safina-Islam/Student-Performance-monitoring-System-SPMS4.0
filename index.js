var express = require('express')
var app = express();
var server = express();
var port = 2000;


const path = require('path');
const {
    unwatchFile,
    rmSync,
    readSync,
    appendFile,

} = require('fs');



var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: false
})); // support encoded bodies




var mysql = require('mysql');
const { query } = require('express');
var connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spms'
});



connection.connect(function (error) {

    if (!!error) {
        console.log('Error Connecting in database.');
    }
    else {
        console.log('Connected to Database.');
    }
});

app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
    res.render('employee-dashboard');
})

app.get('/ploAnalysis', function (req, res) {
    res.render('ploAnalysis');
})

app.get('/ploAchiveStats', function (req, res) {
    res.render('ploAchiveStats');
})

app.get('/spiderChart', function (req, res) {
    res.render('spiderChart');
})

app.get('/dataEntry', function (req, res) {
    res.render('dataEntry');
})
app.get("/addStudentData", function (req, res) {
    res.render('addStudentData',{
        message:''
    });
})
app.post("/addStudentData", urlencodedParser, function (req, res) {

    console.log(req.body)
    var studentID = req.body.studentID;
    var educationalYear = req.body.educationalYear;
    var educationalSemester = req.body.educationalSemester;
    var enrolledCourse = req.body.enrolledCourse;
    var enrolledSection = req.body.enrolledSection;
    var obtainedGrade = req.body.obtainedGrade;
    var csvFile= req.body.csvFile;
     
    if(req.body.csvFile!==""){
        
        var insertion="LOAD DATA INFILE '"+csvFile+"' INTO TABLE backlogstudent_t FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' IGNORE 1 ROWS;" 
        connection.query(insertion, function (error, datas, fileds) {
            if (!!error) {
                console.log("error occured",error)
                res.render('addStudentData',{
                    message:'Error Occured !'
                });
    
            } else {
                res.render('addStudentData',{
                    message: 'Stored Succesfully !'
                });
            }})
    }else { 
    var insertion= "INSERT INTO backlogstudent_t  (StudentID,Educational_Year,EducationalSemester,EnrolledCourse, EnrolledSection, ObtainGrade)  VALUES ('"+studentID+"','" +educationalYear+"','"+ educationalSemester+"','"+enrolledCourse+"','"+enrolledSection+"' ,'"+obtainedGrade+"');"
    
        connection.query(insertion, function (error, datas, fileds) {
        if (!!error) {
            console.log("error occured",error)
            res.render('addStudentData',{
                message:'Error Occured !'
            });

        } else {
            res.render('addStudentData',{
                message: 'Stored Succesfully !'
            });
        }
    })}

})

app.get('/viewCLOAnalysis',function(req,res){

    res.render('viewCLOAnalysis',
    {
        userData:''
    })
    
})
app.post('/viewCLOAnalysis',urlencodedParser,function(req,res){

    var courseID=req.body.courseID;
    var selection="SELECT * FROM `calculatedclo` WHERE EnrolledCourse='"+courseID +"' ORDER BY StudentID;"

    connection.query(selection, function (error, data, fileds) {
        if (!!error) {
            res.render('viewCLOAnalysis',{
                userData: data
            });

        } else {
            res.render('viewCLOAnalysis',{
                userData: data
            });
        }
    })
    
})



app.listen(port, function () {
    console.log('Server listenning to port ' + port);
});