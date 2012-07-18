var querystring = require("querystring"),fs = require("fs"),formidable = require("formidable");
function upload_html(response,request,db) {
	if(!request.session.user_id ||request.session.user_id.length==0)
		{
			var form='<!DOCTYPE html>'+
							'<html>'+
							'<head>'+
							'</head>'+
							'<script>'+
							'alert("You are not logged in!")'+
							'</script>'+
							'<body>'+
							'<script>'+
							'location.replace("http://localhost:8888/start");'+
							'</script>'+
							'</body>'+
							'</html>';						
							response.writeHead(200,{"Content Type":"text/html"});
							response.write(form);
							response.end();
		}
	else 
		{

	request.session.valid=1;
  console.log("Request handler 'upload_html' was called.");

  fs.readFile("./upload.html", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/html"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(file);
      response.end();
    }
  });
}
}
function upload(response,request,db) {
	if(!request.session.user_id ||request.session.user_id.length==0)
		{
			var form='<!DOCTYPE html>'+
							'<html>'+
							'<head>'+
							'</head>'+
							'<script>'+
							'alert("You are not logged in!")'+
							'</script>'+
							'<body>'+
							'<script>'+
							'location.replace("http://localhost:8888/start");'+
							'</script>'+
							'</body>'+
							'</html>';						
							response.writeHead(200,{"Content Type":"text/html"});
							response.write(form);
							response.end();
		}
	else 
		{
			if(!request.session.valid)
			{
				var form='<!DOCTYPE html>'+
							'<html>'+
							'<script>'+
							'alert("You cannot post blank data!")'+
							'</script>'+
							'</html>';						
							response.writeHead(302, {'Location':"http://localhost:8888/home"});
							response.end();
			}
			else if(request.session.valid==1) {
			uname=request.session.user_id;
			console.log(uname);
			
			console.log("Request handler 'upload' was called.");
			var form = new formidable.IncomingForm();
 			console.log("about to parse");
  			form.parse(request, function(error, fields, files) {
    				console.log("parsing done");
				if((files.upload.type=="image/jpeg")||(files.upload.type=="image/png"))
				{
				fs.rename(files.upload.path, "/tmp/"+uname+".jpg", function(err,file) {
      					if (err) {
        						fs.unlink("/tmp/"+uname+".jpg");
        						fs.rename(files.upload.path,"/tmp/"+uname+".jpg");
							fs.readFile("/tmp/"+uname+".jpg", "base64", function(error, file) {
								db.tweets1.update({email:uname},{$set:{image:file}},{multi:true});
							
							});
      						 }
					else {
						 fs.readFile("/tmp/"+uname+".jpg", "base64", function(error, file) {
							db.tweets1.update({email:uname},{$set:{image:file}},{multi:true});
						});
   				 	     }
				delete request.session.valid;
				response.writeHead(302, {'Location':"http://localhost:8888/home"});
				response.end();
				});
				}
				else
				{
					var form='<!DOCTYPE html>'+
							'<html>'+
							'<head>'+
							'</head>'+
							'<script>'+
							'alert("Only image type files may be uploaded!")'+
							'</script>'+
							'<body background="bg.jpg">'+
							'<script>'+
							'location.replace("http://localhost:8888/home");'+
							'</script>'+
							'</body>'+
							'</html>';
							response.writeHead(200,{"Content Type":"text/html"});
							response.write(form);
							response.end();
				}
			
			});
			}
		}	
}
function uploadform(response,request,db)
{
	if(!request.session.user_id ||request.session.user_id.length==0)
		{
			var form='<!DOCTYPE html>'+
							'<html>'+
							'<head>'+
							'</head>'+
							'<script>'+
							'alert("You are not logged in!")'+
							'</script>'+
							'<body>'+
							'<script>'+
							'location.replace("http://localhost:8888/start");'+
							'</script>'+
							'</body>'+
							'</html>';						
							response.writeHead(200,{"Content Type":"text/html"});
							response.write(form);
							response.end();
		}
	else 
		{
			request.session.valid=1;
			var str='<form action="/upload" enctype="multipart/form-data" method="post"><input type="file" name="upload" multiple="multiple"><input type="submit" value="Upload file" /></form>';
			response.writeHead(200, {"Content-Type": "text/html"});
    			response.write(str);
    			response.end();	
		}
}

function changeform(response,request,db)
{
	if(!request.session.user_id ||request.session.user_id.length==0)
		{
			var form='<!DOCTYPE html>'+
							'<html>'+
							'<head>'+
							'</head>'+
							'<script>'+
							'alert("You are not logged in!")'+
							'</script>'+
							'<body>'+
							'<script>'+
							'location.replace("http://localhost:8888/start");'+
							'</script>'+
							'</body>'+
							'</html>';						
							response.writeHead(200,{"Content Type":"text/html"});
							response.write(form);
							response.end();
		}
	else 
		{
			request.session.valid=1;
			var str='<form action="/change" method="POST" onsubmit="return check()" >Current Password: <input type="password" id="curr1" ><br>New Password: <input type="password" id="new" ><br>Confirm Password: <input type="password" id="new1" ><br><input type="submit" value="Change" /></form>';
			response.writeHead(200, {"Content-Type": "text/html"});
    			response.write(str);
    			response.end();	
		}
}


function profile(response,request,db)
{
	if(!request.session.user_id ||request.session.user_id.length==0)
		{
			response.writeHead(302, {'Location':"http://localhost:8888/start"});
			response.end();
		}

	else 
		{	
	delete request.session.insearch;
	response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0,post-check=0, pre-check=0", proxy-revalidate');
	response.setHeader('expires','-1');
	response.setHeader('pragma','no-cache');
			request.session.valid=1;		
				var uname=request.session.user_id;
				var filename="";
			fs.readFile("/tmp/"+uname+".jpg", "base64", function(error, file) {
    			if(error){
      					db.tweets1.find({"email": uname},function(err,tw1){
					if(tw1==null)
					{
					}
					else if(tw1.length>0 && !tw1[0].image);
					else if(tw1.length>0 && tw1[0].image)
					{
						filename=tw1[0].image;
					}
				}).limit(1);
    				} else {
      					filename=file;
    				}

				db.users1.find({email:uname},function(err,usr){
			var fname=usr[0].firstname;
			var lname=usr[0].lastname;
db.followers.find({uemail:uname},function(err,users1){	
db.tweets1.find({email:uname},function(err,users){
y=users.length;
if(users1.length>0)
x=users1[0].femail.length;
else x=0;		
var file='<!DOCTYPE html>'+
'<html>'+
'<head>'+

'<link rel="stylesheet" type="text/css" href="newHome.css" />'+
'<script type="text/javascript" src="jQuery.js"></script>'+
'<script type="text/javascript">'+
'function check12(){'+
	'if(document.getElementById("12").value=="")'+
	'{alert("Select the file first"); return false; }'+
	'return true; }'+	
'function check1(){'+
	'if((document.getElementById("new1").value=="")||(document.getElementById("new2").value=="")||(document.getElementById("curr1").value=="")){'+
		'alert("You can not leave fields blank");'+
		'return false; }'+
	'if(document.getElementById("new2").value!=document.getElementById("new1").value)'+
		'{ alert("Passwords do not match");'+
		'return false; }'+
	'return true;'+
'}'+
'function check()'+
	'{'+
		'if(document.getElementById("pattern").value=="")'+
		'{'+
			'alert("text field is empty");'+
			'return false;'+
		'}'+
		'if((document.getElementById("1").checked)||(document.getElementById("2").checked)||(document.getElementById("3").checked))'+
			'return true;'+
		'else'+
		'{'+
			'alert("no search type selected");'+
			'return false;'+
		'}'+
	'}'+
'$(document).ready(function(){'+
  			'$("#upload").click(function(){'+
			'$("#form2").hide();'+
			'$("#form1").show();'+
			'});'+
			'$("#chng").click(function(){'+
			'$("#form1").hide();'+
			'$("#form2").show();'+
  			'});'+
			
'});'+
'</script>'+
'</head>'+
'<body>'+
	'<div class="header">'+
		'<ul>	<li>ShakeHands'+
			'<li><a href="home.html">Home</a>'+
			'<li><a href="following.html">Following</a>'+
			'<li><a href="profile.html">Profile</a>'+
			'<li><form method="POST" action="/search1" onSubmit="return check()" id="inline">'+
								'<input type="hidden" name="uname" value='+uname+' id="hid1">'+
								'<input type="text" id="pattern" name="pattern"  value="search">'+
								'<input type="submit" value="Search" id="submit1"></form>'+
			'<li><img src="sh.jpg" height="45" width="70"/>'+
			'<li><a href="logout.html">Logout</a>'+
		'</ul>'+
	'</div>'+
'<div class="container">'+
	'<div class="left">'+
		'<img src="data:image/gif;base64,'+filename+'" width="190" height="200" onerror=this.src="default.jpg" >'+
		'<p id ="uname">'+uname+'</p>'+
		'<button id="upload">Upload/change photo.</button>'+
		'<button id="chng">....Change Password....</button>'+
		'<p>Following: '+x+'</p>'+
		'<p>Tweets: '+y+'</p>'+
	'</div>'+
	'<div class="content">'+
	'<p>First Name: '+fname+'</p>'+
	'<p>Last Name: '+lname+'</p>'+
	'<p>Id: '+uname+'</p><hr>'+
	'<div id="myDiv1">'+
	'<div id="form1"><form action="/upload" enctype="multipart/form-data" method="post" onSubmit="return check12()" ><input id="12" type="file" name="upload" multiple="multiple"><input type="submit" value="Upload file" /></form></div>'+
	'<div id="form2"><form action="/change" method="POST" onSubmit="return check1()">Current Password: <input type="password" id="curr1" name="curr1" ><br>New Password: <input type="password" id="new1" name="new1"><br>Confirm Password: <input type="password" id="new2" name="new2"><br><input type="submit" value="Change" /></form></div>'+
	'</div>'+
	'<div id="res"></div>'+	
	'</div>'+
	
'</div>'+
'<div class="footer">Welcome to ShakeHands...</div>'+
'<script>'+
'$("#form1").hide();'+
'$("#form2").hide();'+
'</script>'+
'</body>'+
'</html>';
		response.writeHead(200, {"Content-Type": "text/html"});
      		response.write(file);
      		response.end();
});
});
	});

			});
			
			
			
	}
}
function direct(response,request,db)
{
	if(!request.session.user_id ||request.session.user_id.length==0)
		{
			var form='<!DOCTYPE html>'+
							'<html>'+
							'<head>'+
							'</head>'+
							'<script>'+
							'alert("You are not logged in!")'+
							'</script>'+
							'<body>'+
							'<script>'+
							'location.replace("http://localhost:8888/start");'+
							'</script>'+
							'</body>'+
							'</html>';						
							response.writeHead(200,{"Content Type":"text/html"});
							response.write(form);
							response.end();
		}
	else 
		{
	if(!request.session.logged)
		{
			response.writeHead(302, {'Location':"http://localhost:8888/start"});
			response.end();
		}	
	var str="";
	var str1="<p>";
	request.on('data', function(chunk)
	{
      		console.log("Received body data:");
		str=chunk.toString();
		str=querystring.parse(str);
		console.log(str);
		var n=str.data.indexOf("uname=");
		var tw=str.data.substring(0,n);
		
		tw=tw.replace(/</g,"<.");
		var uname=str.data.substring(n+6);
		console.log(tw+'    '+uname);
		fs.readFile("/tmp/"+uname+".jpg", "base64", function(error, file) {
		
			if(file)
			{
				db.tweets1.save({email: uname, tweet: tw ,date:new Date(),image:file});
			}
			else
			{
				db.tweets1.find({"email": uname},function(err,tw1){
				if(tw1.length==0)
				{
					db.tweets1.save({email: uname, tweet: tw ,date:new Date()});
				}
				else
				{
				db.tweets1.save({email: uname, tweet: tw ,date:new Date(),image:tw1[0].image});
				}
				}).limit(1);			
			}
			db.users1.find({email: uname}, function(err, users1) {	
			users1.forEach(function(users1){ 		 
			if(users1.email==uname)
			{
			console.log("1");
			db.followers.find({uemail: uname}, function(err, followers) {
			if( err || !followers) console.log("No followers found");
			else
			{
					var fmail=[];
					var query = {};
					query["$or"]=[];
					query["$or"].push({"email":uname});

						followers.forEach(function(follower){
							//console.log(cursor);
							fmail=follower.femail;
							fmail.forEach(function(f){
								console.log(f.email);
								query["$or"].push({"email":f.email});
								//console.log(cursor);
							});
						});
				db.tweets1.find(query,function(err, tweets) {				
  					if( err || !tweets) console.log("No male users found");
  					else tweets.forEach( function(maleUser)
						{
    						//console.log(maleUser);
						str1+='<div class="twdiv"><button 											id="twrem">Remove</button><button 											id="hide">Hide</button><p><img src="data:image/gif;base64,'+maleUser.image+'" width="75" height="70" onerror=this.src="default.jpg" align="left"> '+maleUser.date+"<br/>E-mail: "+maleUser.email+"<br/>Tweet: "+maleUser.tweet+"</p></div>";
						
						});
						str+="</p>";
								
						response.writeHead(200, {"Content-Type": "text/html"});
    						response.write(str1);
    						response.end();

				}).sort({date:-1}).limit(5);
			}
			});
			}
			});
			});
			
    		});
		
});
}
}

function change(response,request,db)
{
	console.log("in change!");
	if(!request.session.user_id ||request.session.user_id.length==0)
		{
			response.writeHead(302, {'Location':"http://localhost:8888/start"});
			response.end();
		}
	else 
		{
					request.on('data',function(chunk)
					{	
					console.log("Received body data:");
					str=chunk.toString();
      					str=querystring.parse(str);
					newpass=str.new1;
					oldpass=str.curr1;
					console.log(oldpass);
					uname=request.session.user_id;
					db.users1.find({email:uname},function(err,users){
						if(users.length>0)
							{	console.log(users[0].password);
								if(users[0].password==oldpass){
								db.users1.update({email:uname},{$set:{password:newpass}});
								var form='<!DOCTYPE html>'+
								'<html>'+
								'<head>'+
								'</head>'+
								'<script>'+
								'alert("Password changed!")'+
								'</script>'+
								'<body background="bg.jpg">'+
								'<script>'+
								'location.replace("http://localhost:8888/profile");'+
								'</script>'+
								'</body>'+
								'</html>';
								response.writeHead(200, {"Content-Type": "text/html"});
    								response.write(form);
    								response.end();}
								else {
										var form='<!DOCTYPE html>'+
								'<html>'+
								'<head>'+
								'</head>'+
								'<script>'+
								'alert("Wrong Password!")'+
								'</script>'+
								'<body background="bg.jpg">'+
								'<script>'+
								'location.replace("http://localhost:8888/profile");'+
								'</script>'+
								'</body>'+
								'</html>';
								response.writeHead(200, {"Content-Type": "text/html"});
    								response.write(form);

    								response.end();
								     }
							}
						else
							{
								var form='<!DOCTYPE html>'+
								'<html>'+
								'<head>'+
								'</head>'+
								'<script>'+
								'alert("Error while changing!")'+
								'</script>'+
								'<body background="bg.jpg">'+
								'<script>'+
								'location.replace("http://localhost:8888/profile");'+
								'</script>'+
								'</body>'+
								'</html>';
								response.writeHead(200, {"Content-Type": "text/html"});
    								response.write(form);
    								response.end()
							}
					}).limit(1);	
				});
		}
}

function Home(response,request,db)
{
	response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0,post-check=0, pre-check=0", proxy-revalidate');
	response.setHeader('expires','-1');
	response.setHeader('pragma','no-cache');
	console.log("Home");
	if(request.session.user_id && request.session.pwd)
		{
			/*(var form='<!DOCTYPE html>'+
							'<html>'+
							'<script>'+
							'location.replace("http://localhost:8888/home");'+
							'</script>'+
							'</body>'+
							'</html>';
							response.writeHead(200,{"Content Type":"text/html"});
							response.write(form);
							response.end();*/
			response.writeHead(302, {'Location':"http://localhost:8888/home"});
			response.end();
		}

	else   
		{
	request.on('data',function(chunk)
		{	
			if(!chunk || chunk.length==0)
			{
				var form='<!DOCTYPE html>'+
							'<html>'+
							'<head>'+
							'</head>'+
							'<script>'+
							'alert("You are not logged in!")'+
							'</script>'+
							'<body>'+
							'<script>'+
							'location.replace("http://localhost:8888/start");'+
							'</script>'+
							'</body>'+
							'</html>';
							response.writeHead(200,{"Content Type":"text/html"});
							response.write(form);
							response.end();
			}
      			console.log("Received body data:");
			str=chunk.toString();
			str=querystring.parse(str);
			console.log(str);
			uname=str.uname.replace(/</g,"<.");
			pwd=str.pwd.replace(/</g,"<.");
                	console.log(uname+' '+pwd);
			db.users1.find({email: uname}, function(err, users1) {
				if(users1.length==0)
					{
						var form='<!DOCTYPE html>'+
							'<html>'+
							'<head>'+
							'</head>'+
							'<script>'+
							'alert("Wrong USERNAME/PASSWORD!")'+
							'</script>'+
							'<body>'+
							'<script>'+
							'location.replace("http://localhost:8888/start");'+
							'</script>'+
							'</body>'+
							'</html>';
							response.writeHead(200,{"Content Type":"text/html"});
							response.write(form);
							response.end();
					}	
		
				else users1.forEach(function(users1){ 
  					if(( err || !users1)||(users1.password!=pwd))
						{
							var form='<!DOCTYPE html>'+
							'<html>'+
							'<head>'+
							'</head>'+
							'<script>'+
							'alert("Wrong USERNAME/PASSWORD!")'+
							'</script>'+
							'<body>'+
							'<script>'+
							'location.replace("http://localhost:8888/start");'+
							'</script>'+
							'</body>'+
							'</html>';
							response.writeHead(200,{"Content Type":"text/html"});
							response.write(form);
							response.end();
						}
  					else if((users1.email==uname)&&(users1.password==pwd))
						{
							request.session.user_id=uname;
							request.session.pwd=pwd;
							request.session.logged=1;
							response.writeHead(302, {'Location':"http://localhost:8888/home"});
			response.end();
						}
							
				});
			});
	});
}
}

function home(response,request,db)
{
	if(request.session.vialogout)
{
	delete request.session.vialogout;
	response.writeHead(302, {'Location':"http://localhost:8888/start"});
			response.end();
}
else	if(!request.session.user_id ||request.session.user_id.length==0)
		{
			response.writeHead(302, {'Location':"http://localhost:8888/start"});
			response.end();
		}
	else 
		{
	delete request.session.insearch;
response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0,post-check=0, pre-check=0", proxy-revalidate');
	response.setHeader('expires','-1');
	response.setHeader('pragma','no-cache');
console.log("Request handler 'home' was called.");
	var str="";
	var str1="";
	var fname="";
	if(request.session.user_id)
		{
			if(request.session.user_id.length>0)
			{
				response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0,post-check=0, pre-check=0", proxy-revalidate');
				response.setHeader('expires','-1');
				response.setHeader('pragma','no-cache');
				uname=request.session.user_id;
				delete request.session.pattern;
				pwd=request.session.pwd;
				console.log(uname+' '+pwd);
				fs.readFile("/tmp/"+uname+".jpg", "base64", function(error, file) {
    				if(error){
      					db.tweets1.find({"email": uname},function(err,tw1){
					if(tw1==null)
					{
					}
					else if(tw1.length>0 && !tw1[0].image);
					else if(tw1.length>0 && tw1[0].image)
					{
						fname=tw1[0].image;
					}
				}).limit(1);
    				} else {
      					fname=file;
    				}
				});
				db.followers.find({uemail: uname}, function(err, followers) {
					if( err || !followers) console.log("No followers found");
					else
						{
							var fmail=[];
							var query = {};
							query["$or"]=[];
							query["$or"].push({"email":uname});
							followers.forEach(function(follower){
								fmail=follower.femail;
								fmail.forEach(function(f){
									console.log(f.email);
									query["$or"].push({"email":f.email});
									//console.log(cursor);
								});
							});
							db.tweets1.find(query,function(err, tweets) {				
  								if( err || !tweets) console.log("No male users found");
  								else tweets.forEach( function(maleUser)
									{
    										str1+='<div class="twdiv"><button 											id="twrem">Remove</button><button 											id="hide">Hide</button><p><img src="data:image/gif;base64,'+maleUser.image+'" width="75" height="70" onerror=this.src="default.jpg" align="left"> '+maleUser.date+"<br/>E-mail: "+maleUser.email+"<br/>Tweet: "+maleUser.tweet+"</p></div>";
						
									});
								var page=1;
var form='<!DOCTYPE html>'+
'<html>'+
'<head>'+
'<META HTTP-EQUIV="Pragma" CONTENT="no-cache">'+
'<link rel="stylesheet" type="text/css" href="newHome.css" />'+
'<script type="text/javascript" src="jQuery.js"></script>'+
'<script type="text/javascript">'+
'var a="";'+
	'$(document).ready(function(){'+
		'$(".twdiv #twrem").live("click",function(){'+
			'var v=$(this).parents(".twdiv").text()+"uname="+document.getElementById("uname").textContent;'+
			'$(this).parents(".twdiv").load("/delete1",{data: v});'+
		'});'+
		'$(".twdiv #hide").live("click",function(){'+
			'$(this).parents(".twdiv").hide("slow");'+
		'});'+
	'});'+
	'function check()'+
	'{'+
		'if(document.getElementById("pattern").value=="")'+
		'{'+
			'alert("text field is empty");'+
			'return false;'+
		'}'+
		'if((document.getElementById("1").checked)||(document.getElementById("2").checked)||(document.getElementById("3").checked))'+
			'return true;'+
		'else'+
		'{'+
			'alert("no search type selected");'+
			'return false;'+
		'}'+
	'}'+
	'function func()'+
	'{'+
		'if(document.getElementById("tweet").value=="")'+
		'{'+
			'alert("you can not post blank tweet");'+
			'return false;'+
		'}'+
		'else'+
		'{'+
			'var str =document.getElementById("uname").textContent;'+
			'document.getElementById("tweet").value+="uname="+str;'+
			'return true;'+
		'}'+
	'}'+  							
	'$(document).ready(function(){'+
		'$(window).scroll(function(){'+
		'if(a==document.getElementById("myDiv").textContent) return;'+
		'if ($(window).scrollTop() == $(document).height() - $(window).height()){'+
		'var str="uname="+document.getElementById("uname").textContent+"page="+document.getElementById("page").textContent;'+
		'$("#myDiv").append($("<div>").load("/provideData",{data: "next"+str}));'+
		'a=document.getElementById("myDiv").textContent;'+
		'func1("next");}'+
		'});'+
		'$("#pst").click(function(){'+
		'if(document.getElementById("tweet").value=="")'+
		'{'+
		'alert("you can not post blank tweet");'+
		'}'+
		'else{'+
		'$("#counter").text(160);'+
		'document.getElementById("page").textContent="Page: 1";'+
		'var str =document.getElementById("uname").textContent;'+
		'var str1=document.getElementById("tweet").value+"uname="+str;'+
		'document.getElementById("tweet").value="";'+
		'$("#myDiv").load("/direct",{data: str1});'+
		'}'+
		'});'+
	'});'+
	'function func1(str){'+
	'$("#page").load("/provideData1",{data: document.getElementById("page").textContent+"task="+str});}'+
						'var x=160;'+
						'$(document).ready(function(){'+
  						'$("#tweet").keypress(function(){'+
    						'x=160-$("#tweet").val().length;'+
    						'$("#counter").text(x);'+
  						'});'+
						'});'+
	'</script>'+
'</head>'+
'<body>'+

'<div class="header">'+
		'<ul>	<li>ShakeHands'+
			'<li><a href="home.html">Home</a>'+
			'<li><a href="following.html">Following</a>'+
			'<li><a href="profile.html">Profile</a>'+
			'<li><form method="POST" action="/search1" onSubmit="return check()" id="inline">'+
						'<input type="hidden" name="uname" value='+uname+' id="hid1">'+
						'<input type="text" id="pattern" name="pattern"  value="search">'+
						'<input type="submit" value="Search" id="submit1"></form>'+
			'<li><img src="sh.jpg" height="45" width="70"/>'+
			'<li><a href="logout.html">Logout</a>'+
		'</ul>'+
'</div>'+
'<div class="container">'+
	'<div class="left">'+
		'<img src="data:image/gif;base64,'+fname+'" width="190" height="200" onerror=this.src="default.jpg" >'+
		'<p id ="uname">'+uname+'</p>'+
		'<div class="post">'+
			'<input type="text area" id="tweet" name="tweet" maxlength="160">'+
			'<button id="pst">tw@@t</button>'+
			'<p>Limit: <span id="counter">160</span></p>'+
		'</div>'+
	'</div>'+
	
	'<div class="content">'+
	'<div id="page">Page: '+page+'</div>'+
	'<div id="myDiv"><p>'+str1+'</p></div>'+
	'</div>'+
	'<div class="footer">Welcome to ShakeHands...</div>'+
	
'</div>'+
'</body>'+
'<head>'+
'<META HTTP-EQUIV="Pragma" CONTENT="no-cache"></head>'+
'</html>';
						response.writeHead(200, {"Content-Type": "text/html"});
    						response.write(form);
    						response.end();

				}).sort({date:-1}).limit(5);
		}

	});
				
			}
}
}
}
exports.change=change;
exports.profile=profile;
exports.upload_html=upload_html;
exports.upload=upload;
exports.uploadform=uploadform;
exports.changeform=changeform;
exports.Home=Home;
exports.home = home;
exports.direct=direct;
