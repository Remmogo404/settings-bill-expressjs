let express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var SettingsBill = require('./settings')
let app = express();
const moment = require('moment');
const settingsBill = SettingsBill( )

//set up view engine
app.engine('handlebars', exphbs({ 
    defaultLayout: 'main',
    layoutsDir : './views/layouts'
}));
app.set('view engine', 'handlebars');

// parse application/x -www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'))

app.get("/", function (req, res) {
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        warningLevel: settingsBill.hasReachedWarningLevel()
    })
});

app.post('/settings', function (req, res) {

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })
    console.log(settingsBill.getSettings());
    res.redirect('/')
});

app.post('/action', function (req, res) {

    settingsBill.recordAction(req.body.actionType)
    res.redirect('/')
})

app.get('/actions', function (req, res) {
    res.render('actions', {actions: settingsBill.actions()})
})

app.get('/actions/:actionType', function (req, res) {
    const actionType = req.params.actionType
    res.render('actions', {actions: settingsBill.actionsFor(actionType)}) 
})

const PORT = process.env.PORT || 3018;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
})