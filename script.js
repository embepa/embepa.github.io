function start() {
    // Play the audio
    var audio = document.getElementById('audio');
    if(audio.paused) {
        audio.play();
    }

    // Start the animation
    document.getElementById('pinkboard').style.display = 'block';

    // Remove the modal
    document.getElementById('startModal').style.display = 'none';

    // Start the particle animation
    render();

    // Event listener to stop audio playback when user clicks anywhere
    document.addEventListener('click', stopAudio);
}

// Function to stop audio playback
function stopAudio() {
    var audio = document.getElementById('audio');
    if(!audio.paused) {
        audio.pause();
    }
    // Remove the click event listener to prevent further pausing of audio
    document.removeEventListener('click', stopAudio);
}

/*
 * Settings
 */
var settings = {
    particles: {
        length: 2000, // maximum amount of particles
        duration: 2, // particle duration in sec
        velocity: 100, // particle velocity in pixels/sec
        effect: -1.3, // play with this for a nice effect
        size: 13, // particle size in pixels
    },
};
/*
 * RequestAnimationFrame polyfill by Erik Möller
 */
(function() { var b = 0; var c = ["ms", "moz", "webkit", "o"]; for(var a = 0; a < c.length && !window.requestAnimationFrame; ++a) { window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"]; window.cancelAnimationFrame = window[c[a] + "CancelAnimationFrame"] || window[c[a] + "CancelRequestAnimationFrame"] } if(!window.requestAnimationFrame) { window.requestAnimationFrame = function(h, e) { var d = new Date().getTime(); var f = Math.max(0, 16 - (d - b)); var g = window.setTimeout(function() { h(d + f) }, f); b = d + f; return g } } if(!window.cancelAnimationFrame) { window.cancelAnimationFrame = function(d) { clearTimeout(d) } } }());
/*
 * Point class
 */
var Point = (function() {
    function Point(x, y) {
        this.x = (typeof x !== 'undefined') ? x : 0;
        this.y = (typeof y !== 'undefined') ? y : 0;
    }
    Point.prototype.clone = function() {
        return new Point(this.x, this.y);
    };
    Point.prototype.length = function(length) {
        if(typeof length == 'undefined')
            return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
    };
    Point.prototype.normalize = function() {
        var length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    };
    return Point;
})();
/*
 * Particle class
 */
var Particle = (function() {
    function Particle() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
    }
    Particle.prototype.initialize = function(x, y, dx, dy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
    };
    Particle.prototype.update = function(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
    };
    Particle.prototype.draw = function(context, image) {
        function ease(t) {
            return (--t) * t * t + 1;
        }
        var size = image.width * ease(this.age / settings.particles.duration);
        context.globalAlpha = 1 - this.age / settings.particles.duration;
        context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
    };
    return Particle;
})();
/*
 * ParticlePool class
 */
var ParticlePool = (function() {
    var particles,
        firstActive = 0,
        firstFree = 0,
        duration = settings.particles.duration;

    function ParticlePool(length) {
        // create and populate particle pool
        particles = new Array(length);
        for(var i = 0; i < particles.length; i++)
            particles[i] = new Particle();
    }
    ParticlePool.prototype.add = function(x, y, dx, dy) {
        particles[firstFree].initialize(x, y, dx, dy);

        // handle circular queue
        firstFree++;
        if(firstFree == particles.length) firstFree = 0;
        if(firstActive == firstFree)
            firstActive++;
        if(firstActive == particles.length) firstActive = 0;
    };
    ParticlePool.prototype.update = function(deltaTime) {
        var i;

        // update active particles
        if(firstActive < firstFree) {
            for(i = firstActive; i < firstFree; i++)
                particles[i].update(deltaTime);
        }
        if(firstFree < firstActive) {
            for(i = firstActive; i < particles.length; i++)
                particles[i].update(deltaTime);
            for(i = 0; i < firstFree; i++)
                particles[i].update(deltaTime);
        }

        // remove inactive particles
        while(particles[firstActive].age >= duration && firstActive != firstFree) {
            firstActive++;
            if(firstActive == particles.length) firstActive = 0;
        }
    };
    ParticlePool.prototype.draw = function(context, image) {
        // draw active particles
        if(firstActive < firstFree) {
            for(i = firstActive; i < firstFree; i++)
                particles[i].draw(context, image);
        }
        if(firstFree < firstActive) {
            for(i = firstActive; i < particles.length; i++)
                particles[i].draw(context, image);
            for(i = 0; i < firstFree; i++)
                particles[i].draw(context, image);
        }
    };
    return ParticlePool;
})();
/*
 * Putting it all together
 */
(function(canvas) {
    var context = canvas.getContext('2d'),
        particles = new ParticlePool(settings.particles.length),
        particleRate = settings.particles.length / settings.particles.duration, // particles/sec
        time;

    // get point on heart with -PI <= t <= PI
    function pointOnHeart(t) {
        return new Point(
            160 * Math.pow(Math.sin(t), 3),
            130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
        );
    }

    // creating the particle image using a dummy canvas
    var image = (function() {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
        canvas.width = settings.particles.size;
        canvas.height = settings.particles.size;
        // helper function to create the path
        function to(t) {
            var point = pointOnHeart(t);
            point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350;
            point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350;
            return point;
        }
        // create the path
        context.beginPath();
        var t = -Math.PI;
        var point = to(t);
        context.moveTo(point.x, point.y);
        while(t < Math.PI) {
            t += 0.01; // baby steps!
            point = to(t);
            context.lineTo(point.x, point.y);
        }
        context.closePath();
        // create the fill
        context.fillStyle = '#FF5CA4';
        context.fill();
        // create the image
        var image = new Image();
        image.src = canvas.toDataURL();
        return image;
    })();

    // render that thing!
    function render() {
        // next animation frame
        requestAnimationFrame(render);

        // update time
        var newTime = new Date().getTime() / 1000,
            deltaTime = newTime - (time || newTime);
        time = newTime;

        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // create new particles
        var amount = particleRate * deltaTime;
        for(var i = 0; i < amount; i++) {
            var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
            var dir = pos.clone().length(settings.particles.velocity);
            particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
        }

        // update and draw particles
        particles.update(deltaTime);
        particles.draw(context, image);
    }

    // handle (re-)sizing of the canvas
    function onResize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    window.onresize = onResize;

    // delay rendering bootstrap
    setTimeout(function() {
        onResize();
        render();
    }, 10);
})(document.getElementById('pinkboard'));


window.onload = function() {
    var container = document.getElementById('animatedImageContainer');
    var imageFolderPath = 'media/'; // Replace with the path to your image folder
    var imageCount = 14; // Replace with the total number of images in your folder

    function getRandomImage() {
        var randomIndex = Math.floor(Math.random() * imageCount) + 1; // Random index between 1 and imageCount
        return imageFolderPath + 'image/' + randomIndex + '.png'; // Assuming image filenames are like "image1.jpg", "image2.jpg", etc.
    }

    function createImage() {
        // Create a new image element
        var animatedImage = document.createElement('img');
        animatedImage.src = getRandomImage();
        animatedImage.classList.add('animated-image');

        // Randomly position the image within the container without exceeding boundaries
        var xPos = Math.random() * (container.offsetWidth - animatedImage.width);
        var yPos = Math.random() * (container.offsetHeight - animatedImage.height);
        xPos = Math.max(0, xPos);
        yPos = Math.max(0, yPos);

        animatedImage.style.left = xPos + 'px';
        animatedImage.style.top = yPos + 'px';

        // Randomly rotate the image
        var rotation = Math.random() * 360;
        animatedImage.style.transform = 'rotate(' + rotation + 'deg)';

        // Randomly scale the image
        var scale = Math.random() * 0.5 * Math.random() + Math.random() * 0.5;
        animatedImage.style.transform += ' scale(' + scale + ')';

        // Show the image with animation
        animatedImage.style.opacity = '1';

        // Append the image to the container
        container.appendChild(animatedImage);

        // Hide the image after a delay
        setTimeout(function() {
            container.removeChild(animatedImage);
        }, 1200); // Adjust the delay as needed
    }

    // Create a random number of images initially
    var numberOfImages = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
    for(var i = 0; i < numberOfImages; i++) {
        createImage();
    }

    // Create new images periodically
    setInterval(function() {
        var numberOfImages = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
        for(var i = 0; i < numberOfImages; i++) {
            createImage();
        }
    }, 1000); // Adjust the interval as needed
};

// List of text items
var textList = [
    "I love You",
    "I ♥ U",
    "anh iu bé",
    "anh iu mèo",
    "anh iu vợ",
    "anh iu em",
    "iu bé",
    "iu mèo",
    "iu em",
    "iu you",
    "iu vợ",
    "iu lắm",
    "em xinh",
    "bé xinh",
    "mèo xinh",
    "vợ xinh",
    "bé ơi",
    "mèo ơi",
    "em ơi",
    "vợ ơi",
    "em bé của anh",
    "hihi",
    "cho a sạc điii",
    "doggy",
    "truyền thống nhe",
    "bé múp",
];

// Function to select a random item from the text list
function getRandomText() {
    var randomIndex = Math.floor(Math.random() * textList.length);
    return textList[randomIndex];
}

// Function to update the moving text with a random item from the list
function updateMovingText() {
    var movingText = document.getElementById('heartMessage');
    movingText.textContent = getRandomText();
}

// Call the updateMovingText function initially to set the initial text
updateMovingText();
setInterval(updateMovingText, 1000);


function changeHeartPosition() {
    // Generate random x and y coordinates within the canvas dimensions
    var newX = Math.floor(Math.random() * window.innerWidth * 0.5);
    var newY = Math.floor(Math.random() * window.innerHeight * 0.5);

    var rand_h_direct = Math.random() > 0.5 ? 1 : -1;
    var rand_v_direct = Math.random() > 0.5 ? 1 : -1;

    // Update the position of the heart
    document.getElementById('pinkboard').style.left = (rand_h_direct * newX) + 'px';
    document.getElementById('pinkboard').style.top = (rand_v_direct * newY) + 'px';
}

// Call the function to change the heart position every 2 seconds
setInterval(changeHeartPosition, 5000);

