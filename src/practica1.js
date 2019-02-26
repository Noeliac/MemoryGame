/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

//estados 
var CARD_STATUS = {
	BACK : 0, //boca abajo
	UP : 1,	// boca arriba
	FOUND : 2, //encontrada
};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {

	this.gs = gs;
	this.numCardsFound = 0;
	this.cards = new Array(16);
	this.msg = "Memory Game";
	this.timer;
	this.cardUp = -1;

	//inicializa el array de cartas, lo desordena y comienza el bucle principal
	this.initGame = function() {
		this.cards = [
			new MemoryGameCard("zeppelin"), new MemoryGameCard("zeppelin"),
			new MemoryGameCard("guy"), new MemoryGameCard("guy"),
			new MemoryGameCard("unicorn"), new MemoryGameCard("unicorn"),
			new MemoryGameCard("rocket"), new MemoryGameCard("rocket"),
			new MemoryGameCard("kronos"), new MemoryGameCard("kronos"),
			new MemoryGameCard("dinosaur"), new MemoryGameCard("dinosaur"),
			new MemoryGameCard("potato"), new MemoryGameCard("potato"),
			new MemoryGameCard("8-ball"), new MemoryGameCard("8-ball")];

			
			this.cards = this.cards.sort(function() {return Math.random() - 0.5});

			this.loop();
	}

	//dibuja el mensaje principal y las cartas
	this.draw = function() {
		gs.drawMessage(this.msg);

		for(var i = 0; i < 16; i++) {
			this.cards[i].draw(this.gs, i);
		}
	}

	//lama al método dibujar cada 16 ms
	this.loop = function() {
		this.timer = setInterval(this.draw.bind(this), 16);
	}

	//Si tocamos en una carta, que está boca abajo, le da la vuelta. Si levantamos la siguiente comprueba si son iguales o no.
	//Si hemos levantado todas las cartas detiene el setInterval del bucle principal y dibuja el estado final
	this.onClick = function(cardId) {
		if(this.cards[cardId].state != CARD_STATUS.FOUND && this.cards[cardId].state != CARD_STATUS.UP) {
			this.cards[cardId].flip();
		

			if(this.cardUp != -1) {

				if(this.cards[cardId].comparTo(this.cards[this.cardUp])) {
					this.msg = "Macth found";
					this.cards[cardId].found();
					this.cards[this.cardUp].found();
					this.numCardsFound +=2;
					this.cardUp =-1;

					if( this.numCardsFound == 16) {
						this.msg = "You win!";
						clearInterval(this.timer);
						this.draw();
					}
				}
				else {
					this.msg = "Try again";
					var that = this;
				
					setTimeout(function() {
						
						that.cards[cardId].flip();
						that.cards[that.cardUp].flip();
						that.cardUp = -1; }, 500)
					
				}

			}
			else {
				this.cardUp = cardId;
			}

		} 
	}

};




/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {
	//nombre del sprite
	this.name = id;
	//las cartas se crean boca abajo
	this.state = CARD_STATUS.BACK;

	//da la vuelta a la carta
	this.flip = function() {
		if(this.state == CARD_STATUS.UP) {
			this.state = CARD_STATUS.BACK;
		}
		else if( this.state == CARD_STATUS.BACK) {
			this.state = CARD_STATUS.UP;
		}
	}

	//Pone el estado de una carta a enncontrado
	this.found = function() {
		this.state = CARD_STATUS.FOUND;
	}

	//Devuelve true si las dos cartas son iguales
	this.comparTo = function(otherCard) {
		return (this.name == otherCard.name);
	}

	//dibuja la carta usando el servidor gráfico
	this.draw = function(gs, pos) {
		if(this.state == CARD_STATUS.BACK) {
			gs.draw('back', pos);
		}
		else {
			gs.draw(this.name, pos);
		}
	}
};
