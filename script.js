html,
body {
    filter: brightness(0.82);
    height: 100%;
    padding: 0;
    margin: 0;
    background: 
        url("media/image/15.png") right top no-repeat,
        linear-gradient(to top left, #012745, #0582e2, #22e629, #f321c6);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
}


body::before {
    content: "";
    position: fixed;
    top: 10%;
    left: 10%;
    width: 100%;
    height: 100%;
    background: url("media/image/16.png") left top no-repeat;
    background-size: auto; /* Adjust as needed */
    opacity: 1; /* Set the desired opacity */
    pointer-events: none; /* Ensures the pseudo-element doesn't interfere with other content */
}

#animatedImageContainer {
    position: relative;
    width: 100vw;
    height: 100vh;
}

.animated-image {
    position: absolute;
    transition: opacity 2s ease-in-out;
}

.box {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
}

canvas {
    position: absolute;
    width: 100%;
    height: 100%;
}

#pinkboard {
    position: relative;
    margin: auto;
    height: 500px;
    width: 100%;
    animation: animate 1.3s infinite;
}

#pinkboard:before,
#pinkboard:after {
    content: '';
    position: absolute;
    background: #FF5CA4;
    width: 100px;
    height: 160px;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
}

#pinkboard:before {
    left: 100px;
    transform: rotate(-45deg);
    transform-origin: 0 100%;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
        0 10px 10px rgba(0, 0, 0, 0.22);
}

#pinkboard:after {
    left: 0;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
}

@keyframes animate {
    0% {
        transform: scale(1);
    }

    30% {
        transform: scale(.8);
    }

    60% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}

.audio-control {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.8);
    padding: 5px;
    border-radius: 5px;
}

.center-text {
    width: 100%;
    color: rgb(6, 163, 19);
    height: 100%;
    font-size: 31px;
    font-style: italic;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 100px;
    text-align: center;
}


.center-text {
    text-align: center;
    font-family: 'Arial', sans-serif;
    margin-top: 20px;
}

.big-text {
    font-size: 36px;
    font-weight: bold;
    color: #ff0a78;
}

.small-text {
    font-size: 28px;
    font-weight: bold;
    color: rgb(211, 63, 159);
}

.tiny-text {
    font-size: 16px;
    font-weight: bold;
    color: rgb(7, 219, 159);
}

.modal {
    display: flex;
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-text {
    font-size: 18px;
    line-height: 1.5;
    color: #333;
    margin-bottom: 20px;
}

.modal-button {
    padding: 10px 20px;
    background-color: #FF5CA4;
    border: none;
    color: white;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
}

.modal-button:hover {
    background-color: #e14c94;
}

.scrolling-text-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    /* Adjust height as needed */
}

.scrolling-text {
    white-space: nowrap;
    font-family: 'Arial', sans-serif;
    font-size: 18px;
    color: #ff00ff;
    text-shadow: 2px 2px 4px rgba(255, 0, 255, 0.5);
    position: relative;
    animation: scroll 15s linear infinite;
}

@keyframes scroll {
    0% {
        transform: translateX(0%);
    }

    50% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-10%);
    }
}
