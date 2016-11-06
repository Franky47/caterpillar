/*
 * Script définissant permettant l'animation d'objets 'Visage' à l'intérieur
 * d'un canvas.
 * 
 *  Philippe Genoud - UFRIM2AG - nov. 2015 
 */

/**
 * Constructeur pour des objets Visage
 * @param {type} canvas le canvas dans lequel le visage se déplace
 * @param {type} x abscisse du centre du visage
 * @param {type} y ordonnée du centre du visage
 * @param {type} r rayon du visage
 * @param {type} dx déplacement horizontal élémentaire du visage 
 * @param {type} dy déplacement vertical élémentaire du visage
 * @returns {Visage}
 */
function Visage(canvas, x, y, r, dx, dy) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = dx;
    this.dy = dy;
}

/**
 * dessine le visage.
 * d'après http://www.alsacreations.com/tuto/lire/1512-introduction-canvas.html
 */
Visage.prototype.dessiner = function() {
    var ctx = this.canvas.getContext("2d");
    var yYeux = this.y - this.r * 0.20;
    var dxYeux = this.r * 0.3;
    // le cercle délimitant le Visage
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    ctx.strokeStyle = "coral";
    ctx.fillStyle = "bisque";
    ctx.fill();
    ctx.stroke();

    // la bouche
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * 0.6, 0, Math.PI, false);
    ctx.strokeStyle = "red";
    ctx.stroke();

    // les yeux
    ctx.beginPath();
    ctx.strokeStyle = "#369";
    ctx.fillStyle = "#c00";
    ctx.arc(this.x + dxYeux, yYeux, this.r * 0.1, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x - dxYeux, yYeux, this.r * 0.1, 0, Math.PI * 2, false);
    ctx.stroke();
};

/**
 * place le visage à une position donnée
 * @param {type} x abscisse du nouveu centre du visage
 * @param {type} y ordonnée du nouveu centre du visage
 * @returns {undefined}
 */
Visage.prototype.placerA = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * fait effectuer au visage un deplacement élémentaire. Lorsque le visage
 * atteint l'un des côtés du canvas où il se situe, il rebondit en inversant
 * son déplacement horizontal si le bord gauche ou droit du canvas est touché
 * et en inversant son déplacement vertical si le bord haut ou le bord
 * bas du canvas est touché.
 */
Visage.prototype.deplacer = function() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < this.r || this.x > (this.canvas.width - this.r)) {
        this.dx = -this.dx;
    }
    if (this.y < this.r || this.y > (this.canvas.height - this.r)) {
        this.dy = -this.dy;
    }
};

/**
 * function invoquée lorsque le document est chargé. Voir attribut
 * onload dans la balise <body> du fichier HTML.
 * 
 * Crée deux visages dans le canvas "myCanvas" et associe 
 * - au bouton "Start" une action qui a intervalles réguliers déplace
 *   les visages et les rédessine.
 * - au bouton "Stop" une action qui interrompt l'animation.
 * 
 * Pour réaliser l'animation on utilsier un 'timer'. Pour en savoir
 * plus à ce sujet : http://www.w3schools.com/js/js_timing.asp
 * 
 */
function init() {
    
    var timerId = 0;
    var canvas = document.getElementById("myCanvas");
    var ctxt = canvas.getContext("2d");
    
    // crée les deux visages et les affiche
    var visage1 = new Visage(canvas, 250, 250, 50, 4, 2);
    var visage2 = new Visage(canvas, 120, 350, 30, -3, -2);
    visage1.dessiner();
    visage2.dessiner();

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
            visage1.deplacer();
            visage1.dessiner();
            visage2.deplacer();
            visage2.dessiner();
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

}









