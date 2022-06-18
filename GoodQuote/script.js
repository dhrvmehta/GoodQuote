const STAR_COLOR = '#fff';
const STAR_SIZE = 3;
const STAR_MIN_SCALE = 0.2;
const OVERFLOW_THRESHOLD = 50;
const STAR_COUNT = ( window.innerWidth + window.innerHeight ) / 8;

const canvas = document.querySelector( 'canvas' ),
      context = canvas.getContext( '2d' );

let scale = 1, // device pixel ratio
    width,
    height;

let stars = [];

let pointerX,
    pointerY;

let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

let touchInput = false;

generate();
resize();
step();

window.onresize = resize;
canvas.onmousemove = onMouseMove;
canvas.ontouchmove = onTouchMove;
canvas.ontouchend = onMouseLeave;
document.onmouseleave = onMouseLeave;

function generate() {

   for( let i = 0; i < STAR_COUNT; i++ ) {
    stars.push({
      x: 0,
      y: 0,
      z: STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE )
    });
   }

}

function placeStar( star ) {

  star.x = Math.random() * width;
  star.y = Math.random() * height;

}

function recycleStar( star ) {

  let direction = 'z';

  let vx = Math.abs( velocity.x ),
	    vy = Math.abs( velocity.y );

  if( vx > 1 || vy > 1 ) {
    let axis;

    if( vx > vy ) {
      axis = Math.random() < vx / ( vx + vy ) ? 'h' : 'v';
    }
    else {
      axis = Math.random() < vy / ( vx + vy ) ? 'v' : 'h';
    }

    if( axis === 'h' ) {
      direction = velocity.x > 0 ? 'l' : 'r';
    }
    else {
      direction = velocity.y > 0 ? 't' : 'b';
    }
  }
  
  star.z = STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE );

  if( direction === 'z' ) {
    star.z = 0.1;
    star.x = Math.random() * width;
    star.y = Math.random() * height;
  }
  else if( direction === 'l' ) {
    star.x = -OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  }
  else if( direction === 'r' ) {
    star.x = width + OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  }
  else if( direction === 't' ) {
    star.x = width * Math.random();
    star.y = -OVERFLOW_THRESHOLD;
  }
  else if( direction === 'b' ) {
    star.x = width * Math.random();
    star.y = height + OVERFLOW_THRESHOLD;
  }

}

function resize() {

  scale = window.devicePixelRatio || 1;

  width = window.innerWidth * scale;
  height = window.innerHeight * scale;

  canvas.width = width;
  canvas.height = height;

  stars.forEach( placeStar );

}

function step() {

  context.clearRect( 0, 0, width, height );

  update();
  render();

  requestAnimationFrame( step );

}

function update() {

  velocity.tx *= 0.96;
  velocity.ty *= 0.96;

  velocity.x += ( velocity.tx - velocity.x ) * 0.8;
  velocity.y += ( velocity.ty - velocity.y ) * 0.8;

  stars.forEach( ( star ) => {

    star.x += velocity.x * star.z;
    star.y += velocity.y * star.z;

    star.x += ( star.x - width/2 ) * velocity.z * star.z;
    star.y += ( star.y - height/2 ) * velocity.z * star.z;
    star.z += velocity.z;
  
    // recycle when out of bounds
    if( star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD ) {
      recycleStar( star );
    }

  } );

}

function render() {

  stars.forEach( ( star ) => {

    context.beginPath();
    context.lineCap = 'round';
    context.lineWidth = STAR_SIZE * star.z * scale;
    context.globalAlpha = 0.5 + 0.5*Math.random();
    context.strokeStyle = STAR_COLOR;

    context.beginPath();
    context.moveTo( star.x, star.y );

    var tailX = velocity.x * 2,
        tailY = velocity.y * 2;

    // stroke() wont work on an invisible line
    if( Math.abs( tailX ) < 0.1 ) tailX = 0.5;
    if( Math.abs( tailY ) < 0.1 ) tailY = 0.5;

    context.lineTo( star.x + tailX, star.y + tailY );

    context.stroke();

  } );

}

function movePointer( x, y ) {

  if( typeof pointerX === 'number' && typeof pointerY === 'number' ) {

    let ox = x - pointerX,
        oy = y - pointerY;

    velocity.tx = velocity.tx + ( ox / 8*scale ) * ( touchInput ? 1 : -1 );
    velocity.ty = velocity.ty + ( oy / 8*scale ) * ( touchInput ? 1 : -1 );

  }

  pointerX = x;
  pointerY = y;

}

function onMouseMove( event ) {

  touchInput = false;

  movePointer( event.clientX, event.clientY );

}

function onTouchMove( event ) {

  touchInput = true;

  movePointer( event.touches[0].clientX, event.touches[0].clientY, true );

  event.preventDefault();

}

function onMouseLeave() {

  pointerX = null;
  pointerY = null;

}
var quote = [
    "The only way to have a life is to commit to it like crazy    -Angelina Jolie",
    "Believe in yourself. Stay in your own lane. There\’s only one you    -Queen Latifa",
    "Experience is not what happens to you; it is what you do with what happens to you.    -Aldous Huxley ",
    "Each day comes bearing its gifts. Untie the ribbon.    -Ann Ruth Schabacker",
    "Living is the art of getting used to what we didn\’t expect.    -Eleanor C. Wood",
    "Being happy never goes out of style.    -Lilly Pulitzer" ,
    "Life is either a great adventure or nothing.   -Helen Keller" ,
    "All you need in this life is ignorance and confidence; then success is sure.    -Mark Twain" ,
    "I have very strong feelings about how you lead your life. You always look ahead, you never look back.    -Ann Richards" ,
    "All your life, you will be faced with a choice. You can choose love or hate…I choose love.   -Johnny Cash" ,
    "I don't go by the rule book…I lead from the heart, not the head.    -Princess Diana",
    "Never lose sight of the face that the most important yard stick to your success is how you treat other people.    -Barbara Bush" ,
    "The time is always right to do what is right.    -Martin Luther King Jr." ,
    "The best thing to hold onto in life is each other.    -Audrey Hepburn" ,
    "If you don't like the road you're walking, start paving another one.    -Dolly Parton" ,
    "Despite the forecast, live like it's spring.    -Lilly Pulitzer" ,
    "If I'd have done all the things I was supposed to have done, I'd be really tired.    -Willie Nelson" ,
    "To succeed in life, you need three things: a wishbone, a backbone and a funny bone.   -Reba McEntire" ,
    "Life is short, but it is wide. This too shall pass.    -Rebecca Wells" ,
    "You cannot swim for new horizons until you have courage to lose sight of the shore. -William Faulkner",
    "Failure is the condiment that gives success its flavor.  -Truman Capote" ,
    "The secret to getting ahead is getting started.  -Mark Twain" ,
    "Stand for something or you will fall for anything. Today's mighty oak is yesterday's nut that held its ground.  -Rosa Parks" ,
    "We should live our lives as though Christ was coming this afternoon.  -Jimmy Carter" ,
    "The greatest glory in living lies not in never falling, but in rising every time we fall. -Nelson Mandela",
    "The way to get started is to quit talking and begin doing. -Walt Disney",
    "If life were predictable it would cease to be life, and be without flavor. -Eleanor Roosevelt",
    "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success. -James Cameron",
    "Life is what happens when you're busy making other plans. -John Lennon",
    "Spread love everywhere you go. Let no one ever come to you without leaving happier. -Mother Teresa",
    "When you reach the end of your rope, tie a knot in it and hang on. -Franklin D. Roosevelt",
    "Always remember that you are absolutely unique. Just like everyone else. -Margaret Mead",
    "Don't judge each day by the harvest you reap but by the seeds that you plant. -Robert Louis Stevenson",
    "The future belongs to those who believe in the beauty of their dreams. -Eleanor Roosevelt",
    "Tell me and I forget. Teach me and I remember. Involve me and I learn. -Benjamin Franklin",
    "It is during our darkest moments that we must focus to see the light. -Aristotle",
    "Whoever is happy will make others happy too. -Anne Frank",
    "Do not go where the path may lead, go instead where there is no path and leave a trail. -Ralph Waldo Emerson",
    "You will face many defeats in life, but never let yourself be defeated. -Maya Angelou",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. -Nelson Mandela",
    "Never let the fear of striking out keep you from playing the game. -Babe Ruth",
    "Life is either a daring adventure or nothing at all. -Helen Keller",
    "Many of life's failures are people who did not realize how close they were to success when they gave up. -Thomas A. Edison",
    "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. -Dr. Seuss",
    "If life were predictable it would cease to be life and be without flavor.-Eleanor Roosevelt" ,
    "In the end, it's not the years in your life that count. It's the life in your years.-Abraham Lincoln" ,
    "Life is a succession of lessons which must be lived to be understood. -Ralph Waldo Emerson" ,
    "You will face many defeats in life, but never let yourself be defeated. -Maya Angelou" 

]

function newQuote(){
    var randomNumber =Math.floor(Math.random()*(quote.length));
    document.getElementById("quoteDisplay").innerHTML=quote[randomNumber];
}
window.onload = newQuote();
window.addEventListener("click", newQuote);