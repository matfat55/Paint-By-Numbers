grid = new Array(10)
for (i=0;i<10;i++) grid[i] = new Array(10).fill(0)

posX = 0
posY = 0
currentColour = 1
completion = 0

tiles = new Array(93750).fill(false)

if (localStorage.getItem("paintByNumbersSave")) tiles = JSON.parse(localStorage.getItem("paintByNumbersSave"))
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, 250, 375);
for (i=0;i<93750;i++) {
	canvasX = (i % 250)
	canvasY = Math.floor(i / 250)
	if (tiles[i]) {
		ctx.fillStyle = "rgb(" + colours[parseInt(textData[canvasX*4+canvasY*1000] + textData[canvasX*4+canvasY*1000+1] + textData[canvasX*4+canvasY*1000+2])-1] + ")"
		completion++
	}
	else {
		ctx.fillStyle = "white"
	}
	ctx.fillRect(i%250,Math.floor(i/250),1,1)
}
document.getElementById("completion").innerHTML = "Painting is " + (completion/937.5).toFixed(3) + "% complete"

function save() {
  localStorage.setItem("paintByNumbersSave", JSON.stringify(tiles));
}
setInterval(save, 5000)

for (i=0;i<52;i++) {
	document.getElementById("paletteDiv").innerHTML += "<div class='palette' onclick='changePalette(" + (i+1) + ")'>" + (i+1) + "</div>"
	document.getElementsByClassName("palette")[i].style.backgroundColor = "rgb(" + colours[i] + ")"
}

function displayGrid() {
	const gridResolution = parseInt(document.getElementById("gridResolution").value);
	document.getElementById("grid").style.setProperty('--grid-size', gridResolution);
	document.getElementById("grid").innerHTML = ""
	for (i=0;i<gridResolution*gridResolution;i++) {
		gridX = (i % gridResolution)+posX
		gridY = Math.floor(i / gridResolution)+posY
		tileDone = tiles[gridY*250+gridX]
		document.getElementById("grid").innerHTML += "<div class='tile' onmouseover='paintTile("+gridX+","+gridY+")'></div>"
		if (tileDone) {document.getElementsByClassName("tile")[i].innerHTML = "&nbsp;"}
		else {document.getElementsByClassName("tile")[i].innerHTML = parseInt(textData[gridX*4+gridY*1000] + textData[gridX*4+gridY*1000+1] + textData[gridX*4+gridY*1000+2])}
		if (tileDone) document.getElementsByClassName("tile")[i].style.backgroundColor = "rgb(" + colours[parseInt(textData[gridX*4+gridY*1000] + textData[gridX*4+gridY*1000+1] + textData[gridX*4+gridY*1000+2])-1] + ")"
	}
	const canvas = document.getElementById("canvasOverlay");
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, 250, 375);
	ctx.fillStyle = "red"
	ctx.fillRect(posX+1,posY+1, gridResolution, 1)
	ctx.fillRect(posX+1,posY+1, 1, gridResolution)
	ctx.fillRect(posX+1,posY+gridResolution, gridResolution, 1)
	ctx.fillRect(posX+gridResolution,posY+1, 1, gridResolution)
}
displayGrid()

function paintTile(x,y) {
	if (!tiles[y*250+x] && currentColour == parseInt(textData[x*4+y*1000] + textData[x*4+y*1000+1] + textData[x*4+y*1000+2])) {
		tiles[y*250+x] = true
		document.getElementsByClassName("tile")[(y-posY)*10+(x-posX)].style.backgroundColor = "rgb(" + colours[parseInt(textData[x*4+y*1000] + textData[x*4+y*1000+1] + textData[x*4+y*1000+2])-1] + ")"
		document.getElementsByClassName("tile")[(y-posY)*10+(x-posX)].innerHTML = "&nbsp;"
		completion++
		document.getElementById("completion").innerHTML = "Painting is " + (completion/937.5).toFixed(3) + "% complete"
		ctx.fillStyle = "rgb(" + colours[parseInt(textData[x*4+y*1000] + textData[x*4+y*1000+1] + textData[x*4+y*1000+2])-1] + ")"
		ctx.fillRect(x,y,1,1)
	}
}

function changePalette(x) {
	currentColour = x
	document.getElementById("currentColour").innerHTML = currentColour
}

function applyGridResolution() {
	displayGrid();
}

Mousetrap.bind('right', function() {
  posX = Math.min(posX+1, 240)
	displayGrid()
})
Mousetrap.bind('down', function() {
  posY = Math.min(posY+1, 365)
	displayGrid()
})
Mousetrap.bind('left', function() {
  posX = Math.max(posX-1, 0)
	displayGrid()
})
Mousetrap.bind('up', function() {
  posY = Math.max(posY-1, 0)
	displayGrid()
})
Mousetrap.bind('d', function() {
  posX = Math.min(posX+1, 240)
	displayGrid()
})
Mousetrap.bind('s', function() {
  posY = Math.min(posY+1, 365)
	displayGrid()
})
Mousetrap.bind('a', function() {
  posX = Math.max(posX-1, 0)
	displayGrid()
})
Mousetrap.bind('w', function() {
  posY = Math.max(posY-1, 0)
	displayGrid()
})

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const encodedImage = encodeImage(imageData);
        const processedImage = processImage(encodedImage);
        displayImage(processedImage);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function encodeImage(imageData) {
  const encodedImage = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    encodedImage.push({ r, g, b, a });
  }
  return encodedImage;
}

function processImage(encodedImage) {
  // Placeholder for image processing logic
  return encodedImage;
}

function displayImage(processedImage) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  for (let i = 0; i < processedImage.length; i++) {
    const pixel = processedImage[i];
    imageData.data[i * 4] = pixel.r;
    imageData.data[i * 4 + 1] = pixel.g;
    imageData.data[i * 4 + 2] = pixel.b;
    imageData.data[i * 4 + 3] = pixel.a;
  }
  ctx.putImageData(imageData, 0, 0);
}

document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
