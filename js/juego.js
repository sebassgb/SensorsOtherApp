dyvar app={

  inicio: function(){
    DIAMETRO_BOLA = 50;
    
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    fondoRed = false;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
    colour = '#00000';
  },

  colorDificultad: function(){
    var temp = (dificultad*5).toString(16);
    if(temp.length == 1){
      temp = '0' + '' + temp;
    } else if(dificultad*5 >= 255 ) {
      temp = 'FF';
    }
    colour = '#'+temp+''+temp+''+temp;
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      app.colorDificultad();
      game.stage.backgroundColor = colour;
      game.load.image('bola', 'assets/bola.png');

      game.load.image('objetivo', 'assets/objetivo.png');
      game.load.image('objetivo2', 'assets/objetivo2.png');
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
      
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      objetivo2 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo2');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      
      game.physics.arcade.enable(bola);
      
      game.physics.arcade.enable(objetivo);
      game.physics.arcade.enable(objetivo2);

      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(function(){
          fondoRed = true;
          app.decrementaPuntuacion();
        }, this);
    }

    function update(){
      if(fondoRed){
        game.stage.backgroundColor = '#990012';
        fondoRed = false;
      } else {
        game.stage.backgroundColor = colour;
      }
      var factorDificultad = (300 + (dificultad * 10));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      app.colorDificultad();
      
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
      game.physics.arcade.overlap(bola, objetivo2, app.incrementaPuntuacion, null, this);
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;
  },

  incrementaPuntuacion: function(bola, objeto) {
    var subirDificultad = 1;
    var subirPuntuacion = 1;

    if (objeto.key == 'objetivo') {
      objetivo.body.x = app.inicioX();
      objetivo.body.y = app.inicioY();
    } else if (objeto.key == 'objetivo2') {
      objetivo2.body.x = app.inicioX();
      objetivo2.body.y = app.inicioY();
      subirDificultad = 5;
      subirPuntuacion = 10;
    }
    
    puntuacion = puntuacion + subirPuntuacion;
    scoreText.text = puntuacion;
    
    if (puntuacion > 0) {
      dificultad = dificultad + subirDificultad;
    }
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function() {
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion) {
    var agitacionX = Math.abs(datosAceleracion.x) > 10;
    var agitacionY = Math.abs(datosAceleracion.y) > 10;

    if (agitacionX || agitacionY) {
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function() {
    //document.location.reload(true);
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    scoreText.text = puntuacion;
  },

  registraDireccion: function(datosAceleracion) {
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }
};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}
