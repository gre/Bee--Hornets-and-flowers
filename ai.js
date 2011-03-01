
var log = function(obj) {
    postMessage(["debug", obj])
}

onmessage = function(message) {
    switch(message.data[0]) {
        case "tick" :
        tick(message.data[1], message.data[2])
        break;
    }
}

var move = function(angle, speed) {
    postMessage(["move", {angle: angle, speed: speed}])
}

var distance = function(pos1, pos2) {
    var dx = pos1.x - pos2.x, dy = pos1.y - pos2.y;
    return Math.sqrt(dx*dx+dy*dy);
}

var lastAngle = null;

tick = function(bee, flowers) {
    var angle = null;
    var speed = 0;
    
    var closestFlower = null;
    var closestDistance = null;
    
    for(var f in flowers) {
        var flower = flowers[f];
        if(flower.pollen) {
            if(!closestFlower) {
                closestFlower = flower;
                closestDistance = distance(flower, bee);
            }
            else {
                var newDistance = distance(flower, bee);
                if(closestDistance > newDistance) {
                    closestFlower = flower;
                    closestDistance = newDistance;
                }
            }
        }
    }
    
    if(closestFlower && closestDistance>5) {
        speed = 0;
        var dx = closestFlower.x - bee.x;
        var dy = closestFlower.y - bee.y;
        
        if(dx==0) {
            if(dy>0) {
                speed = 1;
                angle = Math.PI / 2;
            }
            else if(dy<0){
                speed = 1;
                angle = -Math.PI / 2;
            }
        }
        else if(dx<0) {
            if(dy>=0) {
              speed = 1;
                angle = Math.atan(dy/dx) + Math.PI;
            }
            else {
              speed = 1;
              angle = Math.atan(dy/dx) - Math.PI;
            }
        }
        else {
            speed = 1;
            angle = Math.atan(dy/dx);
        }
    }
    
    move(angle, speed);
}