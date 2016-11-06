//*
/*   Script définissant permettant l'animation d'objets 'Chenille' à l'intérieur d'un canvas
 *
 * @param {type} xInit
 * @param {type} yInit
 * @param {type} rInit
 * @returns {Anneau}
 */
/**
 * crée un Anneau en fixant sa position initiale et son rayon
 * @param {integer} xInit abscisse du centre de l'anneau
 * @param {integer} yInit ordonnée du centre de l'anneau
 * @param {integer} rInit rayon initial de l'anneau
 * @returns {Anneau}
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function Anneau(xInit, yInit, rInit) {
    this.xInit = xInit;
    this.yInit = yInit;
    this.rInit = rInit;
}
;
/**
 * positionne le centre de l'anneau en un point donné
 * @param {integer} px abscisse du point
 * @param {integer} py ordonnée du point
 */
Anneau.prototype.placerA = function (px, py) {
    this.xInit = px;
    this.yInit = py;
};

/**
 * affiche l'anneau
 * @param {object} ctxt le contexte graphique associé au canvas dans lequel l'anneau
 *           se dessine
 */

Anneau.prototype.dessiner = function (ctxt) {
    ctxt.beginPath();
    ctxt.arc(this.xInit, this.yInit, this.rInit, 0, 2 * Math.PI);
    ctxt.stroke();
};

function Tete(x, y, r, cap) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.cap = cap;
}
;

Tete.prototype.placerA = function (px, py) {
    this.x = px;
    this.y = py;
};

Tete.prototype.dessiner = function (ctxt) {
    ctxt.beginPath();
    ctxt.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctxt.fillstyle = "purple";
    ctxt.fill();
};

Tete.prototype.devierCap = function (deltaC) {
    this.cap = this.cap + deltaC;
};

Tete.prototype.deplacerSelonCap = function () {
    this.x = this.x + (this.r * Math.cos(this.cap));
    this.y = this.y + (this.r * Math.sin(this.cap));
};

// qui retourne un booléen dont la valeur est vraie (true) si le cap actuel
// de la tête est tel que le prochain déplacement maintiendra la tête entièrement
// dans le canvas et faux (false) sinon. Plus précisément, cette méthode vérifie
// que le point (x',y') défini par x' = x + R * cos(cap) et y' = y + R * sin(cap)
// est à une distance >= R de chacun des bords du canvas.

Tete.prototype.capOK = function (canvas) {
    var xmin=0+this.r;
    var xmax=canvas.width-this.r;
    var ymin=0+this.r;
    var ymax=canvas.height-this.r;
    var newx=this.x + (this.r * Math.cos(this.cap));
    var newy=this.y + (this.r * Math.sin(this.cap));
    if (newx>=xmin && newx<=xmax && newy>=ymin && newy<=ymax){
        return true;
    }else{
        return false;
    };
};

function Chenille(canvas, nbAnneaux, r) {
    this.canvas = canvas;
    this.nbAnneaux = nbAnneaux;
    this.r = r;
    this.head = null;
    this.corps = null;
};
Chenille.prototype.init = function() {
    var ctxt = this.canvas.getContext("2d");
    this.head = new Tete(this.canvas.width / 2, this.canvas.height/2, this.r, 0);
    this.corps=[];
    for (var i = 0; i < this.nbAnneaux; i++) {
        this.corps.push(new Anneau((this.canvas.width/2)-(i+1)*this.r, this.canvas.height/2, this.r));
    };
}

Chenille.prototype.dessiner = function () {
    var ctxt = this.canvas.getContext("2d");
    this.head.dessiner(ctxt);
    for (var i=0; i<this.nbAnneaux;i++){
        this.corps[i].dessiner(ctxt);
    };
};
Chenille.prototype.deplacer = function () {
    // move body first starting from the tail end
    for (var i=this.nbAnneaux-1; i>0; i--){
        var cetAnneau=this.corps[i];
        var nextAnneau=this.corps[i-1];
        var newx=nextAnneau.xInit;
        var newy=nextAnneau.yInit;
        cetAnneau.placerA(newx,newy);
    }
    // move first anneau to head position
    var newx=this.head.x;
    var newy=this.head.y;
    this.corps[0].placerA(newx,newy);
    //move head
    var deltaC=getRandomIntInclusive(-30, 30);
    this.head.devierCap(deltaC);
    while (!this.head.capOK(this.canvas)) {
        this.head.devierCap(10);
    };
    this.head.deplacerSelonCap();
};

function init() {
    var timerId = 0;
    var canvas = document.getElementById("myCanvas");
    var ctxt = canvas.getContext("2d");

    // create the worms

    var bug1 = new Chenille(canvas, 10,10);
    bug1.init();
    bug1.dessiner();


    // association au bouton Start d'un traitement qui lance l'animation
    document.getElementById("startBtn").onclick = function() {
        // change l'état des boutons Start et Stop
        document.getElementById("stopBtn").disabled = false;
        document.getElementById("startBtn").disabled = true;
        // création d'un timer qui toutes les 20 milisecondes déplace et
        // réaffiche les chenilles
        timerId = setInterval( function() {
            // la fonction invoquée périodiquement (toutes les 20 ms) par le timer
            ctxt.clearRect(0, 0, canvas.width, canvas.height);
            bug1.deplacer();
            bug1.dessiner();
        }, 20);
    };

     // association au bouton Stop d'un traitement qui interrompt l'animation
    document.getElementById("stopBtn").onclick = function() {
        // change l'état des boutons Start et Stop
        document.getElementById("stopBtn").disabled = true;
        document.getElementById("startBtn").disabled = false;
        // interruption du timer
        clearInterval(timerId);
    };
};
