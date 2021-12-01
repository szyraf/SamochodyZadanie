var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;

var path = require("path")
var hbs = require('express-handlebars');

const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');  

//const context = require("./data/data.json")
//console.log(context)


app.get("/", function (req, res) {
    //res.render('view2.hbs', context); 
    //res.render('view2.hbs'); 

    let context4 = {}
    coll1.find({ }, function (err, docs) {
        context4.baza = docs
        console.log("docs:", context4);
        res.render('view2.hbs', context4);
    });
    

})


app.engine('hbs', hbs({
    defaultLayout: 'main.hbs' ,
    helpers: {         
        shortTitle: function (title) {
            return title.substring(0,10) + "...";
        },
        selectTAKNIE: function (title) {
            let string = ""
            string += "<td>"

            //if (title == )

            //string += '<form action="/update" method="get" id="form1">'

            string += "<select form='form1' name='" + 1 + "' id='" + 1 + "' class='select'>"

            console.log("title--------------------------", title);
            
            if(title == "TAK") {
                string += "<option value='TAK' selected>TAK</option>"
                string += "<option value='NIE'>NIE</option>"
                string += "<option value='BRAKDANYCH'>BRAKDANYCH</option>"

            }
            else if (title == "NIE") {
                string += "<option value='TAK'>TAK</option>"
                string += "<option value='NIE' selected>NIE</option>"
                string += "<option value='BRAKDANYCH'>BRAKDANYCH</option>"
            }
            else {
                string += "<option value='TAK'>TAK</option>"
                string += "<option value='NIE'>NIE</option>"
                string += "<option value='BRAKDANYCH' selected>BRAKDANYCH</option>"
            }
            

            

            string += "</select>"

            //string += '</form>'

            string += "</td>"

            return string;
            
        }
    }    
}));


app.get('/handle', function (req, res) {

    let context2 = req.query;
    console.log("query:", context2);
    console.log("1:", context2.a);

    let obj = {
        a: context2.a=='on' ? "TAK" : "NIE",
        b: context2.b=='on' ? "TAK" : "NIE",
        c: context2.c=='on' ? "TAK" : "NIE",
        d: context2.d=='on' ? "TAK" : "NIE",
    }


    console.log('obj', obj);
    console.log(obj.a);

    coll1.insert(obj, function (err, newDoc) {
        console.log("id dokumentu: " + newDoc._id)
        let context4 = {}
        coll1.find({ }, function (err, docs) {
            context4.baza = docs
            console.log("docs:", context4);
            res.render('view2.hbs', context4);
        });
    });
    
});


app.get('/delete', function (req, res) {
    let context2 = req.query;
    console.log("query:", context2);
    let id = Object.keys(req.query)
    console.log("id:", id[0]);


    coll1.remove({ _id: id[0] }, {}, function (err, numRemoved) {
        console.log("usunięto dokumentów: ",numRemoved)

        let context4 = {}

        coll1.find({ }, function (err, docs) {
            context4.baza = docs
            console.log("docs:", context4);
            res.render('view2.hbs', context4);
        });
    }); 
});


app.get('/edit', function (req, res) {
    let context2 = req.query;
    console.log("query:", context2);
    let id = Object.keys(req.query)
    console.log("id:", id[0]);
    
    let context4 = {}
    coll1.find({ }, function (err, docs) {
        context4.baza = docs
        for (let i = 0; i < context4.baza.length; i++) {
            if(context4.baza[i]._id == id) {
                context4.baza[i]["edit"] = "tak";
                break;
            }
        }
        //console.log("docs:", context4);
        res.render('view2.hbs', context4);
    });
});

app.get('/update', function (req, res) {

    console.log("--------------------------------------");

    let context2 = req.query;
    console.log("query:", context2);
    let id = Object.keys(req.query);
    let wiersze = Object.values(req.query);
    console.log("id:", id[1]);
    console.log("wiersze:", wiersze);
    
    let context5 = {}
    coll1.find({ _id: id[1] }, function (err, docs) {    
        context5.wiersz = docs
        console.log("docs:", context5);
        context5.wiersz.a = wiersze[0][0]
        context5.wiersz.b = wiersze[0][1]
        context5.wiersz.c = wiersze[0][2]
        context5.wiersz.d = wiersze[0][3]

        console.log("wiersz", context5.wiersz);
        let anyObj = context5.wiersz
        
        coll1.update({ _id: id[1] }, { $set: anyObj }, {}, function (err, numUpdated) {
            console.log("zaktualizowano " + numUpdated)


            let context4 = {}
            coll1.find({ }, function (err, docs) {
                context4.baza = docs
                console.log("docs:", context4);
                res.render('view2.hbs', context4);
            });
        });
    });

    
    
    
    
    
    
});



app.use(express.static('static'))


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT )
})
