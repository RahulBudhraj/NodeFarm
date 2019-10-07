var http = require("http");
var fs = require("fs");
var json = fs.readFileSync("./data.json");
var url = require("url")

var template = fs.readFileSync("./templates/product.html")
var template = fs.readFileSync("./templates/product.html")
var cardsTemplate = fs.readFileSync("./templates/card.html") + "";
var overviewTemplate = fs.readFileSync("./templates/overview.html") + "";

template = template + "";
json = JSON.parse(json);

function replace(template,product){
    template = template.replace(/#image#/g,product["image"]);
    template = template.replace(/#ProductName#/g, product["productName"]);
    template = template.replace(/#From#/g, product["from"]);
    template = template.replace(/#Nutrients#/g, product["nutrients"]);
    template = template.replace(/#Quantity#/g, product["quantity"]);
    template = template.replace(/#Description#/g, product["description"]);
    template = template.replace(/#Price#/g, product["price"]);
    template = template.replace(/#idLnk#/g, "/product?id="+product["id"]);

    if(!product["organic"]){
        template = template.replace(/#not-organic#/g,"not-organic")
    }
    return template;
    
}




var server = http.createServer(function(req,res){

    console.log(req.url);
   var parseUrl  =url.parse(req.url,true); 
   var id = parseUrl.query.id;
   var pathname = parseUrl.pathname;

    // res.writeHead(200,{"Content-type":"text/plain"});

    if (req.url == "/home" || req.url == "/" || req.url == ""){
       // res.write("HomePage")
        var cards = "";
        for (var i = 0; i < json.length; i++) {
            cards = cards + replace(cardsTemplate, json[i]);
        }

        overviewTemplate = overviewTemplate.replace(/{%cardsarea%}/g, cards);
        res.write(overviewTemplate);
    }
    else if(pathname == "/product"){
        var productPage = replace(template,json[id]);
        res.write(productPage);

        res.write("ProductPage");
    }
    else if (req.url == "/api") {
        res.write(json);
    }
    else{
        res.write("Error 404 not found");

    }


});

var port = process.env.PORT || 3000;

server.listen(port,function(){
    console.log("Server has started on port 3000");
});
