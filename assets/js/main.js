const SPEED = 1;

//Object class declarations
class floatingObject{
    constructor(container, floatingObjects){
        this.floatingObjects = floatingObjects;
        this.container = container;
        let containerBB = container.getBoundingClientRect();
        this.startWidth = containerBB.width;
        this.startHeight = containerBB.height;

        this.x = containerBB.x;
        this.y = containerBB.y;
        this.currentWidth = this.startWidth;
        this.currentHeight = this.startHeight;

        this.canvas = document.getElementById("animationCanvas");

        this.xSpeed = Math.random() * SPEED;
        this.ySpeed = Math.random() * SPEED;
    }

    getBB(){ return this.container.getBoundingClientRect(); }
    getContainer(){ return this.container; }

    startMove(){
        // Update the position of the image
        this.container.style.left = `${this.x}px`;
        this.container.style.top = `${this.y}px`;
        this.container.style.width = `${this.startWidth}px`;
        this.container.style.height = `${this.startHeight}px`;

        this.container.style.position = "absolute";
        this.container.style.margin = "0px";
        this.move();
    }

    checkCollision(thisBB, otherImage) {
        const otherBB = otherImage.getBB();

        // Check if the bounding boxes overlap horizontally and vertically
        const overlapX = thisBB.x < otherBB.x + otherBB.width && thisBB.x + thisBB.width > otherBB.x;
        const overlapY = thisBB.y < otherBB.y + otherBB.height && thisBB.y + thisBB.height > otherBB.y;

        return overlapX && overlapY;
    }

    setNewDirection(thisBB, otherImage) {
        const otherBB = otherImage.getBB();

        // Calculate the center points of both objects
        const thisCenterX = thisBB.x + thisBB.width / 2;
        const thisCenterY = thisBB.y + thisBB.height / 2;
        const otherCenterX = otherBB.x + otherBB.width / 2;
        const otherCenterY = otherBB.y + otherBB.height / 2;

        // Calculate the direction vector from the other object to this object
        let directionX = thisCenterX - otherCenterX;
        let directionY = thisCenterY - otherCenterY;

        // Normalize the direction vector to get a unit vector
        const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);
        if (magnitude !== 0) {
            directionX /= magnitude;
            directionY /= magnitude;
        }

        // Set the new speed to move away from the other object
        const speedMultiplier = SPEED; // Use the global SPEED constant
        this.xSpeed = directionX * speedMultiplier;
        this.ySpeed = directionY * speedMultiplier;
    }

    move(){
        // Update the position of the image
        this.container.style.left = `${this.x}px`;
        this.container.style.top = `${this.y}px`;

        let canvasBB = this.canvas.getBoundingClientRect();
        let containerBB = this.container.getBoundingClientRect();

        if (containerBB.x <= canvasBB.x) {
            //Hit left edge of canvas this.x = 0;
            this.xSpeed = Math.abs(this.xSpeed)
        } else if (containerBB.x + containerBB.width >= canvasBB.right) {
            //Hit right edge of canvas this.x = canvasBB.right - containerBB.width - canvasBB.x;
            this.xSpeed = -Math.abs(this.xSpeed);
        }
        this.x += this.xSpeed;


        if (containerBB.y <= canvasBB.y) {
            //hit top of canvas this.y = 0;
            this.ySpeed = Math.abs(this.ySpeed);
        } else if (containerBB.y + containerBB.height >= canvasBB.bottom) {
            //hit bottom of canvas                  this.y = canvasBB.bottom - containerBB.height - canvasBB.y;
            this.ySpeed = -Math.abs(this.ySpeed);
        }
        this.y += this.ySpeed;
        
        this.floatingObjects.forEach(otherImage => {
            if(this.container !== otherImage.getContainer()){
                if(this.checkCollision(containerBB, otherImage)){
                    this.setNewDirection(containerBB, otherImage);
                }
            }
        });

        window.requestAnimationFrame(this.move.bind(this));
    }
}

/*
class floatingBio extends floatingObject{
    constructor(startX, startY, startWidth, startHeight){
        super(startX, startY, startWidth, startHeight)
    }
}*/

class floatingPost extends floatingObject{
    constructor(container, floatingObjects){
        super(container, floatingObjects)
    }
}

//Function that sets up the page
function pageSetUp(){
    //Set up animations for the page

    const floatingObjects = [];

    //const bioContainer = document.getElementById("bioBox");
    //let bioObject = new floatingObject(bioContainer, floatingObjects);
    //floatingObjects.push(bioObject);

    const postContainers = document.getElementsByClassName("postContainer")
    for (let i = 0; i < postContainers.length; i++){
        let postObject = new floatingPost(postContainers[i], floatingObjects)
        floatingObjects.push(postObject);
    }

    //Start all the movement
    for(let i = 0; i<floatingObjects.length; i++){
        floatingObjects[i].startMove();
    }

}

window.addEventListener("load", pageSetUp);