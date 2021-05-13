window.onload = function() {
  var canvas = document.createElement('canvas');
  var affichage = document.createElement('div');
  var tige = document.createElement('div');
  var pied = document.createElement('div');
  canvas.width = 900;
  canvas.height = 600;
  affichage.height= 80;
  affichage.id = "affichage";
  tige.id = "tige";
  pied.id = "pied";
  pied.innerHTML = "GAME TV";
  document.body.appendChild(affichage);
  document.body.appendChild(canvas);
  document.body.appendChild(tige);
  document.body.appendChild(pied);
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  var ctx = canvas.getContext("2d");
  var collision = false;
  var score = 0;
  var vie = 3;
  var niveau = 0;
  var codeTouche = 0;
  var pause = false;

  document.addEventListener('keydown', interaction);

  /* Propriétés Serpent */
  var  colorSerp = "blue";
  var tailleSerp = 15; // taille d'un bloc du serpent
  var nombreBlockParWidth = canvasWidth/tailleSerp;
  var nombreBlockParHeight = canvasHeight/tailleSerp;
  var xSerp = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
  var ySerp = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
  var deplX = 0;
  var deplY = 0;
  var tailleBody = 5; // taille du coprs du serpent
  var bodySerp = []; // coprs du serpent sous forme de tableau de coordonnées


  /* Propriétés de la pomme */
  var colorPomme = "red" ;
  var xPomme = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
  var yPomme = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
  var rayonPomme = tailleSerp/2;
  var tempsPomme = 0;
  var tempsMaxPomme = 100;

  /* Propriétés du Bonus */
  var colorBonus = "green";
  var xBonus = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
  var yBonus = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
  var tempsBonus = 0;
  var afficheBonus = false;

  var intervalID = setInterval(game, 100); //executer fonction dessinerSerpent toutes les secondes.
  afficheScore();

  /* fonction qui lance le jeu */
  function game() {
    dessinerSerpent();
    dessinerPomme();
    detectionCollision();
    verifMangerPomme();
    gestionVieSerpent();
    gestionBonus();
  }

  /* Fonction qui gère la position du serpent */
  function gestionPositionSerpent() {
    xSerp += deplX*tailleSerp;
    ySerp += deplY*tailleSerp;
    bodySerp.push({x:xSerp,y:ySerp});
    while (bodySerp.length > tailleBody) {
      bodySerp.shift();
    }
  }

  /* Fonction qui dessine le serpent */
  function dessinerSerpent() {
    ctx.clearRect(0,0,canvasWidth, canvasHeight);
    gestionPositionSerpent();
    ctx.fillStyle = colorSerp;
    for (var i = 0; i < bodySerp.length; i++) {
      ctx.fillRect(bodySerp[i].x, bodySerp[i].y, tailleSerp-1, tailleSerp-1);
    }
  }

  /* fonction qui dessine la pomme */
  function dessinerPomme() {
    ctx.font = "13px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("🍎", xPomme+rayonPomme-8, yPomme+rayonPomme+4);
  }

  /* fonction qui dessine le Bonus*/
  function dessinerBonus() {
    ctx.font = "12px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("💚", xBonus-1, yBonus+10);
  }


  /* fonction qui intialise la position du Serpent */
  function initPositionSerpent() {
    xSerp = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
    ySerp = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
  }

  /* fonction qui intialise la position de la pomme */
  function initPositionPomme() {
    xPomme = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
    yPomme = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;

    // Verification que la pomme soit en-dehors du Serpent
    for (var i = 0; i < bodySerp.length; i++) {
      if (xPomme == xSerp && yPomme == xSerp) {
        initPositionPomme();
      }
    }
  }

  /* fonction qui intialise la position du Bonus */
  function initPositionBonus() {
    xBonus = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
    yBonus = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;

    // Verification que le Bonus soit en-dehors du Serpent
    for (var i = 0; i < bodySerp.length; i++) {
      if (xBonus == xSerp && yBonus == xSerp) {
        initPositionBonus();
      }
    }
  }

  /* Fonction détecton de collision */
  function detectionCollision() {
    // cas ou le serpent se mord
    if (bodySerp.length>5) {
      for (var i = 0; i < bodySerp.length-1; i++) {
        if (bodySerp[i].x == bodySerp[bodySerp.length-1].x &&
            bodySerp[i].y == bodySerp[bodySerp.length-1].y) {
          collision = true;
          break;
        }
      }
    }

    // cas ou le serpent sort du canvas
    if (xSerp < 0 || ySerp < 0 || xSerp+tailleSerp > canvasWidth || ySerp+tailleSerp > canvasHeight) {
      collision = true;
    }
  }

  /* fonction qui verifie si collision avc pomme = mange pomme */
  function verifMangerPomme() {
    if (xPomme == xSerp && yPomme == ySerp) {
      initPositionPomme();
      tempsPomme = 0;
      score += 10 + 3*bodySerp.length;
      niveau += Math.trunc(score/300);
      tailleBody +=5;
      afficheScore();
    }else if (tempsPomme++ > tempsMaxPomme) {
      initPositionPomme();
      tempsPomme = 0;
    }
  }

  /* fonction pour afficher score*/
  function afficheScore() {
    var message = "Score : " + score + " | Vie : " + vie + " | Niveau : " + niveau;
    document.getElementById("affichage").innerHTML = message;
  }

  /* fonction qui gère la vie du serpent */
  function gestionVieSerpent() {
    if (pause) {
      collision = false;
      return;
    }
    if (collision) {
      vie--;
      collision = false;
      tailleBody = 5;
      bodySerp = [bodySerp[bodySerp.length-1]];
      initPositionPomme();
      initPositionSerpent();
      afficheScore();
      if (vie == 0) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER !", canvasWidth/3, canvasHeight/2);
        ctx.font = "15px Arial";
        ctx.fillText("Score :" + score, canvasWidth/3, canvasHeight*2/3);
        ctx.fillText("Appuyez sur la touche ENTRER pour recommencer une partie.", canvasWidth/3, canvasHeight*3/4);
        clearTimeout(intervalID);

      }
    }
  }

  /* fonction qui gère l'affichage du Bonus */
  function gestionBonus() {
    if (tempsBonus++ > 50) {
      tempsBonus = 0;
      // on peut afficher le Bonus
      //on lance un dé aléatoire qui donne un résultat entre 0 et 1 et si supérieur à 0.7 on affiche le bonus.
      if (Math.random() > 0.7 ) {
        initPositionBonus();
        afficheBonus = true;
      }else {
      // On n'affiche pas le bonus;
      afficheBonus = false;
      xBonus = canvasWidth + 100;
      yBonus = canvasHeight + 100;
      }
    }

    if (afficheBonus) {
      dessinerBonus();
    }

    // Verification si bonus mangé
    if (xSerp == xBonus && ySerp == yBonus) {
      vie++;
      afficheScore();
      afficheBonus = false;
      xBonus = canvasWidth + 100;
      yBonus = canvasHeight + 100;
    }
  }


  /* Fonction pour controler le déplacement du Serpent */
  function interaction(event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
      case 37:
        // touche gauche
        pause = false;
        if (codeTouche == 39) {
            break;
        }
        deplX = -1;
        deplY = 0;
        codeTouche = event.keyCode;
        break;
      case 38:
        // touche haut
        pause = false;
        if (codeTouche == 40) {
            break;
        }
        deplX = 0;
        deplY = -1;
        codeTouche = event.keyCode;
        break;
      case 39:
        // touche droite
        pause = false;
        if (codeTouche == 37) {
            break;
        }
        deplX = 1;
        deplY = 0;
        codeTouche = event.keyCode;
        break;
      case 40:
      // touche bas
        pause = false;
        if (codeTouche == 38) {
            break;
        }
        deplX = 0;
        deplY = 1;
        codeTouche = event.keyCode;
        break;
      case 32:
      // touche espace PAUSE
        pause = true;
        deplX = 0;
        deplY = 0;
        codeTouche = event.keyCode;
        break;
      case 13:
      // touche ENTRER => Rejouer après défaite
        document.location.reload(true);
      default:
    }
  }

}
