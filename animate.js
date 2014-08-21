(function ( mythree , $, undefined) {

mythree.init = function(hook) {
		var scene = new THREE.Scene();
			THREE.ImageUtils.crossOrigin = "anonymous";
			// To set up the camera
			var VIEW_ANGLE = 100 //65 FOV is most 'natural' FOV
			var WIDTH = 1200, HEIGHT = 1000;
			ASPECT = WIDTH / HEIGHT,
			NEAR = 0.1,		
			FAR = 1000;		
			var camera =new THREE.PerspectiveCamera(
			VIEW_ANGLE,
			ASPECT,
			NEAR,
			FAR);
			camera.position.z = 20;
			camera.position.x = 2;
			camera.position.y = 2;
			
			// To setup the trackball controls
			var controls = new THREE.TrackballControls( camera );
			controls.target.set( 0, 0, 0 );
			
			// To setup the renderer
			var renderer = new THREE.WebGLRenderer();
			renderer.setSize( WIDTH, HEIGHT );
			hook.append( renderer.domElement );
			
			
			// Array to hold the objects of the board and the pieces
			var whitepieces = new Array();
			var blackpieces = new Array();
			var checkers = new Array();
			
			// defining geometry of different entities on the board
			var geometry1 = new THREE.CubeGeometry(.1,.1,.1);
			var geometry2 = new THREE.CubeGeometry(.1,.1,.1);
			var geometry3 = new THREE.CubeGeometry(.1,.1,.2);
			var geometry4 = new THREE.CylinderGeometry(.03, .03, .05, 100);
			
			
			// material to apply to the board
			var material1 = new THREE.LineBasicMaterial( { color: 0xffffff } );
			var material2 = new THREE.LineBasicMaterial( { color: 0x000000 } );
			
			// material to apply to the board borders
			var material3 = new THREE.LineBasicMaterial( { color: 0x0000ff } );
			
			//material applied to black and white pieces
			var materialb = new THREE.LineBasicMaterial( { color: 0xf5ede3 } );
			var materialw = new THREE.LineBasicMaterial( { color: 0x303030 } );
			scene.add(camera);
			var material,geometry;
			var randompositionsw = new Array();
			var randompositionsb = new Array();
			var k=0,l=0,countereven=0,counterodd=0;
			
			function pawnposition(x,y,z)
			{
				this.x = x;
				this.y = y
				this.z = z;
			}
			// core logic to create the board and place the pieces on them
			for (var i=0;i<=9;i++)
			{ 
				for (var j=0;j<=9;j++)
				{
					if ((j==0) || (j==9) || (i==0) || (i==9)){
						var texture = THREE.ImageUtils.loadTexture( 'download.jpg' );
						var material = new THREE.MeshBasicMaterial( { map: texture } );
						geometry = geometry3;
					}
					else if ((i+j) % 2 == 0){
						material = material1;
						geometry = geometry1;
						
					}
					else{
						material = material2;
						geometry = geometry2;
					}
					
					if ((i>0) && (i<9) && (j>0) && (j<9)) {
					
						if (((i + j) % 2 ==0) && (i>3))
						{
							randompositionsw[countereven] = new pawnposition(i/10,j/10,.1);
							countereven += 1;
						}
						if ((i + j) % 2 !=0)
						{
							randompositionsb[counterodd] = new pawnposition(i/10,j/10,.1);
							counterodd += 1;
						}
						if ((i<=3) || (i>=6)){
							if ((i<=3) && ((i + j) % 2 != 0))
							{
								cylinder = new THREE.Mesh(geometry4,materialw);
								cylinder.position = new THREE.Vector3(i/10, j/10,.1);
								cylinder.rotation.x = Math.PI / 2;
								cylinder.rotation.y = Math.PI / 2;
								whitepieces[k] = cylinder;
								k = k + 1;
								scene.add(cylinder);
							}
							if ((i>=6) && (i + j) % 2 != 0)
							{
								cylinder = new THREE.Mesh(geometry4,materialb);
								cylinder.position = new THREE.Vector3(i/10, j/10,.1);
								cylinder.rotation.x = Math.PI / 2;
								cylinder.rotation.y = Math.PI / 2;
								blackpieces[l] = cylinder;
								l = l + 1;
								scene.add(cylinder);
							}					
						}
					}
					cube = new THREE.Mesh(geometry,material);
					cube.position = new THREE.Vector3(i/10, j/10, 0); 					
					checkers[i*10+j] = cube;
					scene.add(cube);
				}
			}
			camera.position.z = 1;
			camera.position.x = 1;
			camera.position.y = 1;
			var pointLight = new THREE.PointLight(0xFFFFF);
			pointLight.position = new THREE.Vector3(-10, 60, 100);

			scene.add(pointLight);
			
			// logic to handle when swap button is clicked
			var swapc = 0;
			$("#swapcolours").click(function()
			{
				if (swapc == 1)
					swapc=0;
				else
					swapc=1;
				swapcols();
			});
			
			// code given by professor jason for smooth movement
			var pawn,movex,movey,movez
			function updatePosition(coin,x,y,z)
			{
			   pawn = coin;
			   movex = x;
			   movey = y;
			   movez = z;
			}
			function positionUpdate()
			{
				var smoothingValue = 0.1;
				pawn.position.x = (movex)*smoothingValue + pawn.position.x * (1-smoothingValue); 
				pawn.position.y = (movey)*smoothingValue + pawn.position.y * (1-smoothingValue); 
				pawn.position.z = (movez)*smoothingValue + pawn.position.z * (1-smoothingValue);
			}
			
			// To randomize the array containing positions
			function shuffle(array) {
				  var currentIndex = array.length
					, temporaryValue
					, randomIndex
					;
				  // While there remain elements to shuffle...
				  while (0 !== currentIndex) {

					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					// And swap it with the current element.
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
					}

				return array;
			}
			
			function getRandomPosition(colour,i){
				if (colour == "white"){
					return randompositionsb[i];
				}
				else
				{
					return randompositionsw[i];
				}
			}
			// function to handle random button click
			var random_pieces=0;
			$("#randomize").click(function(){
					
				random_pieces=1;	
				randompositionsb = shuffle(randompositionsb);
				randompositionsw = shuffle(randompositionsw);
				window.setTimeout(function(){random_pieces=0;},3000);
				});
				
			function swapcols(){
				
				if (swapc == 1)
				{
					checkers[12].material.color.r = 65;
					checkers[12].material.color.b = 65;
					checkers[12].material.color.g = 65;
					
					checkers[13].material.color.r = 0;
					checkers[13].material.color.b = 0;
					checkers[13].material.color.g = 255;
					
					
					blackpieces[1].material.color.r = 0;
					blackpieces[1].material.color.b = 102;
					blackpieces[1].material.color.g = 204;
					
					whitepieces[1].material.color.r = 204;
					whitepieces[1].material.color.b = 102;
					whitepieces[1].material.color.g = 0;
				}
				else
				{
					checkers[12].material.color.r = 0;
					checkers[12].material.color.b = 0;
					checkers[12].material.color.g = 0;
					
					checkers[15].material.color.r = 1;
					checkers[15].material.color.b = 1;
					checkers[15].material.color.g = 1;
					//var texture = THREE.ImageUtils.loadTexture( 'download.jpg' );
					//checkers[15].material = new THREE.MeshBasicMaterial( { map: texture } ); 
					
					blackpieces[1].material.color.r = 1;
					blackpieces[1].material.color.b = 1;
					blackpieces[1].material.color.g = 1;
					
					whitepieces[1].material.color.r = 0;
					whitepieces[1].material.color.b = 0;
					whitepieces[1].material.color.g = 0;
				}
			}			
				
			function render() {
				renderer.render(scene, camera);
				requestAnimationFrame(render);
				if (random_pieces==1){
				for (var i=0;i<whitepieces.length;i++)
				{	
					var position = getRandomPosition("black",i);
					updatePosition(whitepieces[i],position.x,position.y,position.z);
					positionUpdate();
				}
				
				for (var i=0;i<blackpieces.length;i++)
				{	
					var position = getRandomPosition("white",i);
					updatePosition(blackpieces[i],position.x,position.y,position.z);
					positionUpdate();
				
				}
				}
				controls.update();
			}
			render();
}
})(window.mythree = window.mythree || {} , jQuery)
	
			