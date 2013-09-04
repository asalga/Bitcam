/*
  BitCam.me - Pixelate yourself
  Andor Salga
  Dec. 2012
*/

PImage finalImg;
int pixelSize = 2;
var imgData = null;
var isSetup = false;
var int32;

//
var greyScale = new Int32Array([0,0,0,  20,20,20,  40,40,40,  60,60,60,   80,80,80,   100,100,100,  120,120,120,  140,140,140,  160,160,160,  180,180,180,  200,200,200,  220,220,220,  240,240,240,  255,255,255]);

// From http://www.thealmightyguru.com/Games/Hacking/Wiki/index.php?title=NES_Palette
var nintendo = new Int32Array([124,124,124,  0,0,252,  0,0,188,  68,40,188,  148,0,132,  168,0,32,  168,16,0,  136,20,0,  80,48,0,  0,120,0,  0,104,0,  0,88,0,  0,64,88,    188,188,188,  0,120,248,  0,88,248,  104,68,252,  216,0,204,  228,0,88,  248,56,0,  228,92,16,  172,124,0,  0,184,0,  0,168,0,  0,168,68,  0,136,136,    248,248,248,  60,188,252,  104,136,252,  152,120,248,  248,120,248,  248,88,152,  248,120,88,  252,160,68,  248,184,0,  184,248,24,  88,216,84,  88,248,152,  0,232,216,  120,120,120,  252,252,252,  164,228,252,  184,184,248,  216,184,248,  248,184,248,  248,164,192,  240,208,176,  252,224,168,  248,216,120,  216,248,120,  184,248,184,  184,248,216,  0,252,252,  248,216,248,  0,0,0]);

// 
var palettes = [
	// No palette change, use camera colors
	null, 
	greyScale,

	// Gameboy from http://rpgmaker.net/games/4257/blog/7892/	
	//new Int32Array([  128,136,64,  184,192,88, 64,80,40,    248,248,200,]);
	nintendo,

	// Atari2600
	new Int32Array([0,0,0,  68,68,0,  112,40,0,  132,24,0,  136,0,0,  120,0,92,  72, 0, 120, 20, 0, 132, 0, 0, 136, 0, 24, 124, 0, 44, 92, 0, 64, 44, 0, 60, 0, 20, 56, 0, 44, 48, 0, 68, 40, 0, 64, 64, 64, 100, 100, 16, 132, 68, 20, 152, 52, 24, 156, 32, 32, 140, 32, 116, 96, 32, 144, 48, 32, 152, 28, 32, 156, 28, 56, 144, 28, 76, 120, 28, 92, 72, 32, 92, 32, 52, 92, 28, 76, 80, 28, 100, 72, 24, 108, 108, 108, 132, 132, 36, 152, 92, 40, 172, 80, 48, 176, 60, 60, 160, 60, 136, 120, 60, 164, 76, 60, 172, 56, 64, 176, 56, 84, 168, 56, 104, 144, 56, 124, 100, 64, 124, 64, 80, 124, 56, 104, 112, 52, 132, 104, 48, 144, 144, 144, 160, 160, 52, 172, 120, 60, 192, 104, 72, 192, 88, 88, 176, 88, 156, 140, 88, 184, 104, 88, 192, 80, 92, 192, 80, 112, 188, 80, 132, 172, 80, 156, 128, 92, 156, 92, 108, 152, 80, 132, 140, 76, 160, 132, 68, 176, 176, 176, 184, 184, 64, 188, 140, 76, 208, 128, 92, 208, 112, 112, 192, 112, 176, 160, 112, 204, 124, 112, 208, 104, 116, 208, 104, 136, 204, 104, 156, 192, 104, 180, 148, 116, 180, 116, 132, 180, 104, 156, 168, 100, 184, 156, 88, 200, 200, 200, 208, 208, 80, 204, 160, 92, 224, 148, 112, 224, 136, 136, 208, 132, 192, 180, 132, 220, 148, 136, 224, 124, 140, 224, 124, 156, 220, 124, 180, 212, 124, 208, 172, 140, 208, 140, 156, 204, 124, 180, 192, 120, 208, 180, 108, 220, 220, 220, 232, 232, 92, 220, 180, 104, 236, 168, 128, 236, 160, 160, 220, 156, 208, 196, 156, 236, 168, 160, 236, 144, 164, 236, 144, 180, 236, 144, 204, 232, 144, 228, 192, 164, 228, 164, 180, 228, 144, 204, 212, 136, 232, 204, 124, 236, 236, 236, 252, 252, 104, 232, 204, 124, 252, 188, 148, 252, 180, 180, 236, 176, 224, 212, 176, 252, 188, 180, 252, 164, 184, 252, 164, 200, 252, 164, 224, 252, 164, 252, 212, 184, 252, 184, 200, 252, 164, 224, 236, 156, 252, 224, 140]),
];
currPalette = 0;

// yuk
function onWindowResize(){
	var pCanvas = document.getElementById('__processing0');
	var excess;

	if(window.innerWidth >= window.innerHeight){
		excess = (window.innerWidth - window.innerHeight)/2;
		pCanvas.setAttribute('style', 'width: '  +  window.innerWidth + "px");
		pCanvas.setAttribute('style', 'height: ' +  window.innerWidth + "px;" +  'margin-top: ' +  -excess + "px");
	}
	else{
		excess = (window.innerHeight - window.innerWidth)/2;
		pCanvas.setAttribute('style', 'width: '  +  window.innerHeight + "px");
		pCanvas.setAttribute('style', 'height: ' +  window.innerHeight + "px;" + 'margin-left: ' +  -excess + "px");
	}
}

window.addEventListener('resize', onWindowResize, false);

class Rectangle{
	public int x, y, w, h;
	public Rectangle(int x, int y, int w,int h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}

void setup(){
	size(WIDTH, HEIGHT);
	background(0);
	onWindowResize();
	pixelate();
}

/*
*/
ArrayList getRectangleIntersection(Rectangle mask, Rectangle source){
	ArrayList arr = new ArrayList();

	for(int x = mask.x; x < mask.w + mask.x; x++){
		for(int y = mask.y; y < mask.h + mask.y; y++){
			if( x >= source.x && x < source.x + source.w &&
				y >= source.x && y < source.y + source.h){
				arr.add(y * source.w + x);
			}
		}
	}
	return arr; 
}



/*
*/
color Sample(ArrayList indices/*, PImage sourceImg*/){
	color col = color(0, 0, 0);

	int avgR = 0,
		avgG = 0,
		avgB = 0;

	int numPixels = indices.size();

	for(int i = 0; i < numPixels; i++){
		avgR += red(getColorAt(indices.get(i)));
		avgG += green(getColorAt(indices.get(i)));
		avgB += blue(getColorAt(indices.get(i)));
	}

	avgR /= numPixels;
	avgG /= numPixels;
	avgB /= numPixels;

	return color(avgR, avgG, avgB);
}

/*
*/
color getColorAt(i){
	var r,g,b;

	if(imgData){
		var currentPixel = int32[i];
        r = ( currentPixel & 0x000000FF);
        g = ((currentPixel & 0x0000FF00) >> 8);
        b = ((currentPixel & 0x00FF0000) >> 16);
   	}
	
	return color(r, g, b);
}

/*
*/
color getClosestColor(color c1){
	var minDelta = 255 * 3;
	color closestColor;

	// If "None" is selected, we can just return the color that
	// was passed in.
	if(currPalette === 0){
		return c1;
	}

	var palette = palettes[currPalette];

	var i;
	for(i = 0; i < palette.length / 3; i += 3) {
		var r2 = palette[(i*3)];
		var g2 = palette[(i*3) + 1];
		var b2 = palette[(i*3) + 2];
		var delta = diff(red(c1), green(c1), blue(c1), r2, g2, b2);
		if(delta < minDelta) {
			minDelta = delta;
			closestColor = color(r2, g2, b2)
		}
	}
	return closestColor;
}

/*
*/
color diff(r1, g1, b1, r2, g2, b2){
	float diffFound =  Math.pow(r1 - r2, 2);
		  diffFound += Math.pow(g1 - g2, 2);
		  diffFound += Math.pow(b1 - b2, 2);
	return Math.sqrt(diffFound);
}

/*
*/
void pixelate(){

	// define vars here due to js function scope.
	int w, h;
	int xStart, yStart;

	if(canvas){
		finalImg = createImage(WIDTH, HEIGHT, RGB);
		imgData = canvas.getContext('2d').getImageData(0, 0, WIDTH, HEIGHT);
		int32 = new Int32Array(imgData.data.buffer);

		// TODO: fix me
		if(controls && controls.pixelSize){
			pixelSize = controls.pixelSize;
		}

		w = WIDTH;
		h = HEIGHT;

		Rectangle src = new Rectangle(0, 0, w, h);

		xStart = Math.floor((w - (pixelSize * Math.ceil(w/pixelSize)))/2);
		yStart = Math.floor((h - (pixelSize * Math.ceil(h/pixelSize)))/2);
		
		// If the user does not want to increase the pixel size,
		// we can save on computation by not doing rect/rect intersections
		if(pixelSize == 1){
			for(int i = 0; i < w * h; i++){
				color converted = getClosestColor(getColorAt(i));
				finalImg.pixels[i] = converted;
			}
		}
		else{
			for(int x = xStart; x < w + xStart; x += pixelSize){
				for(int y = yStart; y < h; y += pixelSize){
					Rectangle m = new Rectangle(x, y, pixelSize, pixelSize);
					inter = getRectangleIntersection(m, src);
					color average = Sample(inter);
					
					color closest = getClosestColor(average);

					for(int i = 0; i < inter.size(); i++){
						finalImg.pixels[inter.get(i)] = closest;
					}			
				}
			}
		}
		image(finalImg, 0, 0);

		// We should only generate a screenshot AFTER the final
		// image has been processed in a frame.
		if(requestScreenShot){
			var screenShotCvs = createEl('canvas');
			screenShotCvs.width = WIDTH;
			screenShotCvs.height = HEIGHT;
			var screenShotCanvasCtx = screenShotCvs.getContext('2d');
			// TODO: flip canvas horizontally
			screenShotCanvasCtx.putImageData(finalImg.imageData, 0, 0);
			screenShot(screenShotCvs);
			requestScreenShot = false;
		}
	}
}

void draw(){
	translate(width, 0);
	scale(-1, 1);
	pixelate();
}
