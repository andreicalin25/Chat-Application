const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const fs = require("fs");
let crypto = require('crypto');


const app = express();
app.use(cors());
app.use(bodyParser());

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use('/public', express.static('public'));  //fara linia asta de cod, nu imi vedea programul fisierele de css si js


//Functii de citire si scriere in baza de date

function readJSONFile() {
    return JSON.parse(fs.readFileSync("conturi.json"))["conturi"];
}

function writeJSONFile(continut) {
fs.writeFileSync(
    "conturi.json",
    JSON.stringify({ conturi: continut }), "utf8", err => {
    if (err) {
        console.log(err);
    }
    }
)
}


//Functie ravase
function ravasa() {

    var ravase = ["Live as if you were to die tomorrow. Learn as if you were to live forever.",
                "That which does not kill us makes us stronger.",
                "Be yourself; everyone else is already taken.",
                "If you cannot do great things, do small things in a great way.",
                "If opportunity doesn’t knock, build a door.",
                "Strive not to be a success, but rather to be of value.",
                "You must be the change you wish to see in the world.",
                "Believe and act as if it were impossible to fail.",
                "The best way to predict the future is to invent it.",
                "Everything has beauty, but not everyone can see.",
                "Believe you can and you’re halfway there.",
                "You only live once, but if you do it right, once is enough.",
                "The only thing we have to fear is fear itself.",
                "The only true wisdom is knowing that you know nothing."]

    nr = Math.floor(Math.random() * 14);

    return ravase[nr];
}


const users = [];

//Un user nou intra in chat
function userJoin(id, prenume) {

    const user = {
        id,
        prenume
    }
    users.push(user);

    return prenume;
}

// Un utilizator paraseste chatul
function userLeave(id) {

    var index = -1;

    for(let i=0; i < users.length; i++) {
        if(users[i].id == id) {
            index = i;
        }
    }
        
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}


//Functie de care ma folosesc pentru afisarea timpului
function formatMessage(prenume, text) {
    return {
        prenume,
        text,
        time: moment().format('h:mm')
    };
}


//Metodele de get, post, de care ma folosesc pentru logare
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/index', (req,res) => {
    
    res.sendFile('/public/index.html', { root: __dirname })
});

app.post('/index/:id', (req, res) => {

    //console.log(req.params.id);
    var userlog = req.body;
    //console.log(userlog.password);

    var users = readJSONFile();

    let cipher = crypto.createCipher('aes-128-cbc', 'HarleyDavidson');
    let encrPass= cipher.update(userlog.password, 'utf8', 'hex');

    encrPass+=cipher.final('hex');
    userlog.password = encrPass;

    console.log(userlog);

    for(let i = 0; i < users.length; i++){

        console.log(users[i].username + " " + users[i].password);

        if(users[i].username == userlog.username && users[i].password == userlog.password) {
            
            //console.log("Adevarat!!");
            res.send(users[i].prenume);

        }
    }

    res.send('0');  
});

app.get('/register', (req,res) => {
    res.sendFile('/public/register.html', { root: __dirname })
});

app.post('/register', (req, res) => {

    //console.log("ABCDE");
    var newUser = req.body;
    var users = readJSONFile();

    let cipher = crypto.createCipher('aes-128-cbc', 'HarleyDavidson');
    let encrPass= cipher.update(newUser.password, 'utf8', 'hex');

    encrPass+=cipher.final('hex');

    newUser.password = encrPass;
    
    users.push(newUser);
    writeJSONFile(users);

    res.send(newUser);
});


//Chat

app.get('/chat/:prenume', (req,res) => {
    first_name  = req.params.prenume;
    res.sendFile('/public/chat.html', { root: __dirname })
});

io.on('connection', (socket) => {

    socket.on('joinRoom', (prenume) => {

        const user = userJoin(socket.id,prenume);
    
        // Mesaj pentru utilizatorul care intra pe chat
        socket.emit('message', formatMessage('Happy BOT', 'Welcome to Happy Chat!!! Remeber: ' + ravasa()));    //socket.emit trimite mesajul doar utilizatorului curent

        // Notificare catre ceilalti utilizatori ca a intrat cineva in chat
        socket.broadcast.emit('message', formatMessage('Happy BOT', `${user} has joined the chat`));
    
        // trimit utilizatorii conectati (se actualizeaza deoarece a mai intrat cineva)
        io.emit('roomUsers', users);
    });
    
    // Astept un mesaj
    socket.on('chatMessage', ({prenume, msg}) => {
        const user = {prenume, msg};

        //console.log(msg);
        user.msg = user.msg.replace(/</g, '&lt');
        //user.msg = user.msg.replace(/>/g, '&rt');
        console.log(user.msg);

        io.emit('message', formatMessage(user.prenume, user.msg));
        formatMessage(user.prenume, user.msg);
    });

    // Astept culoarea
    socket.on('color', ({prenume, color}) => {
        const userChoice = {prenume, color};
        io.emit('color', userChoice);
    });
    
    // Atunci cand un utilizator se deconecteaza
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);
        //console.log(users);
        //console.log(user);
    
        if (user) {
            io.emit('message', formatMessage('Happy BOT', `${user.prenume} has left the chat`)
            );
        
            // trimit din nou lista actualizata a utilizatorii conectati
            io.emit('roomUsers', users);
        }
    });

});


server.listen(3000, () => {console.log('Listening on http://localhost:3000')})
