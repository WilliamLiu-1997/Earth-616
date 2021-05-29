
  import { MTLLoader } from './three.js/examples/jsm/loaders/MTLLoader.js';
  import { OBJLoader } from './three.js/examples/jsm/loaders/OBJLoader.js';
  import { GUI } from './lib/dat.gui.js';
  var scene;
  var camera;
  var renderer;
  var controls;

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var jump = false;
  var obj3d = new THREE.Object3D();

  var startTime = performance.now();
  var direction = new THREE.Vector3();
  var velocity = new THREE.Vector3();

  var color = new THREE.Color();
  var spotLight;
  var controlsEnabled = true;

  var torusKnotMesh;
  var cameraPosition = new THREE.Vector3(0, 30, -20);
  var cameraDirection = new THREE.Vector3(100, 100, 1);

  var SEPARATION = 50,
    AMOUNTX = 50,
    AMOUNTY = 50;
  var particles,
    particle,
    count = 0;
  var container;




  

  export function init(JSON_obj) {
    scene = new THREE.Scene();
    // var backgroundLoader = new THREE.CubeTextureLoader();
    // var bgTexure = backgroundLoader.load("assets/night.jpg");
    scene.background = new THREE.Color(0xa000000);
    scene.fog = new THREE.Fog(0xa0a0a0, 100, 300);
    // scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);
    camera = new THREE.PerspectiveCamera(
      45, // fov 75 degree
      window.innerWidth / window.innerHeight, //aspect (width/height ratio)
      0.1, //near
      2000 // far
    );

    particles = new Array();
    const map = new THREE.TextureLoader().load('assets/ball.png');
    var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
    var i = 0;
    for (var ix = 0; ix < AMOUNTX; ix++) {
      for (var iy = 0; iy < AMOUNTY; iy++) {
        if (ix <= 30 && ix >= 20 && iy <= 30 && iy >= 20) {
          continue;
        }
        //create balls
        particle = particles[i++] = new THREE.Sprite(material);
        particle.position.x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        particle.position.z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        scene.add(particle);
      }
    }

    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    camera.lookAt(cameraDirection.x, cameraDirection.y, cameraDirection.z);

    scene.add(camera);

    var onKeyDown = function (e) {
      switch (e.keyCode) {
        case 87:
        case 38:
          moveForward = true;
          break;

        case 83:
        case 40:
          moveBackward = true;
          break;

        case 65:
        case 37:
          moveLeft = true;
          break;

        case 68:
        case 39:
          moveRight = true;
          break;

        case 32:
          jump = true;
          break;
      }
    };

    var onKeyUp = function (e) {
      switch (e.keyCode) {
        case 87:
        case 38:
          moveForward = false;
          break;

        case 83:
        case 40:
          moveBackward = false;
          break;

        case 65:
        case 37:
          moveLeft = false;
          break;

        case 68:
        case 39:
          moveRight = false;
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);

    var geometryGround = new THREE.PlaneBufferGeometry(575, 575);
    // var geometryPlane = new THREE.PlaneGeometry(60,50);
    geometryGround.rotateX(Math.PI / 2);
    geometryGround.translate(0, 0, 0);
    var texture = THREE.ImageUtils.loadTexture("assets/stone.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    var materialGround = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    // materialGround.color = new THREE.Color(0.2, 0.2, 0.2);

    var MeshGround = new THREE.Mesh(geometryGround, materialGround);
    MeshGround.position.y = 5;
    scene.add(MeshGround);

    var geometryTorus = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    // geometryTorus.position.z = 2;
    var materialTorus = new THREE.MeshPhongMaterial({ color: 0xf3f3f3 });
    torusKnotMesh = new THREE.Mesh(geometryTorus, materialTorus);
    torusKnotMesh.position.y = 25;
    torusKnotMesh.position.x = 2;
    torusKnotMesh.position.z = -75;
    console.log(torusKnotMesh.position);
    scene.add(torusKnotMesh);

    let video = document.createElement("video");
    video.src = "./assets/video.mp4"; // 设置视频地址
    video.autoplay = "autoplay";
    video.loop = true;
    video.muted = true;
    // var video = document.querySelector("#video");

    var videoTexture = new THREE.VideoTexture(video);
    videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture.minFilter = THREE.LinearFilter;
    var exhibitionMaterial = new THREE.MeshPhongMaterial({
      map: videoTexture,
      side: THREE.DoubleSide,
    });

    var exhibitionGeometry = new THREE.PlaneGeometry(40, 20);
    var exibitionMesh = new THREE.Mesh(
      exhibitionGeometry,
      exhibitionMaterial
    );
    exibitionMesh.position.y = 17;
    exibitionMesh.position.z = -20;
    scene.add(exibitionMesh);

    var exhibitionGeometry2 = new THREE.PlaneGeometry(20, 40);
    var exibitionMesh2 = new THREE.Mesh(
      exhibitionGeometry2,
      exhibitionMaterial
    );
    exibitionMesh2.position.y = 27;
    exibitionMesh2.position.x = 35;
    exibitionMesh2.position.z = -35;
    // exibitionMesh2.rotateX(Math.PI/3);
    scene.add(exibitionMesh2);

    var exhibitionGeometry3 = new THREE.PlaneGeometry(30, 70);
    var exibitionMesh3 = new THREE.Mesh(
      exhibitionGeometry3,
      exhibitionMaterial
    );
    exibitionMesh3.position.y = 42;
    exibitionMesh3.position.x = -35;
    exibitionMesh3.position.z = -45;
    // exibitionMesh2.rotateX(Math.PI/3);
    scene.add(exibitionMesh3);

    //  video 2

    // var spriteMapTitle = new THREE.TextureLoader().load("assets/title.png");
    // var spriteMaterialTitle = new THREE.SpriteMaterial({
    //   map: spriteMapTitle,
    //   depthWrite: false,
    // });

    // var spriteTitle = new THREE.Sprite(spriteMaterialTitle);
    // spriteTitle.scale.set(20, 5, 1);
    // spriteTitle.position.y = 10;
    // spriteTitle.position.x = 50;
    // spriteTitle.position.z = -20;
    // spriteTitle.rotateY(Math.PI / 2);
    // scene.add(spriteTitle);

    // var videoTitle = document.getElementById("videoTitle");
    // // videoTitle.src = "./assets/title.mp4"; //
    // // videoTitle.autoplay = "autoplay";
    // videoTitle.loop = true;
    // videoTitle.muted = true;

    // var videoTitleTexture = new THREE.VideoTexture(videoTitle);
    // videoTitleTexture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    // videoTitleTexture.minFilter = THREE.LinearFilter;
    // var titleMaterial = new THREE.MeshPhongMaterial({
    //   map: videoTitleTexture,
    //   side: THREE.DoubleSide,
    // });
    // var titleGrometry = new THREE.PlaneGeometry(100, 20);
    // var titleMesh = new THREE.Mesh(titleGrometry, titleMaterial);
    // titleMesh.position.y = 40;
    // titleMesh.position.z = -150;
    // scene.add(titleMesh);

    // // video 3
    // var videoMot = document.createElement("video");
    // videoMot.src = "./assets/Mountain.mp4"; //
    // videoMot.autoplay = "autoplay";
    // videoMot.loop = true;
    // videoMot.muted = true;

    // var videoMotTexture = new THREE.VideoTexture(videoMot);
    // videoMotTexture.wrapS = videoMotTexture.wrapT = THREE.ClampToEdgeWrapping;
    // videoMotTexture.minFilter = THREE.LinearFilter;
    // var motMaterial = new THREE.MeshPhongMaterial({
    //   map: videoMotTexture,
    //   side: THREE.DoubleSide,
    // });
    // var motGrometry = new THREE.PlaneGeometry(100, 20);
    // var motMesh = new THREE.Mesh(motGrometry, motMaterial);
    // motMesh.position.y = 20;
    // motMesh.position.z = -150;
    // scene.add(motMesh);

    // // video4
    // var videoVirus = document.createElement("video");
    // videoVirus.src = "./assets/Covid.mp4"; //
    // videoVirus.autoplay = "autoplay";
    // videoVirus.loop = true;
    // videoVirus.muted = true;

    // var videoVirTexture = new THREE.VideoTexture(videoVirus);
    // videoVirTexture.wrapS = videoVirTexture.wrapT = THREE.ClampToEdgeWrapping;
    // videoVirTexture.minFilter = THREE.LinearFilter;
    // var virMaterial = new THREE.MeshPhongMaterial({
    //   map: videoVirTexture,
    //   side: THREE.DoubleSide,
    // });
    // var virGrometry = new THREE.PlaneGeometry(80, 20);
    // var virMesh = new THREE.Mesh(virGrometry, virMaterial);
    // virMesh.position.y = 20;
    // virMesh.position.x = -50;
    // virMesh.position.z = -220;
    // virMesh.rotateY((Math.PI / 2) * 3);
    // scene.add(virMesh);

    // // video5
    // var videoWave = document.createElement("video");
    // videoWave.src = "./assets/wave.mp4"; //
    // videoWave.autoplay = "autoplay";
    // videoWave.loop = true;
    // videoWave.muted = true;

    // var videoWaveTexture = new THREE.VideoTexture(videoWave);
    // videoWaveTexture.wrapS = videoWaveTexture.wrapT =
    //   THREE.ClampToEdgeWrapping;
    // videoWaveTexture.minFilter = THREE.LinearFilter;
    // var waveMaterial = new THREE.MeshPhongMaterial({
    //   map: videoWaveTexture,
    //   side: THREE.DoubleSide,
    // });
    // var waveGrometry = new THREE.PlaneGeometry(100, 80);
    // var waveMesh = new THREE.Mesh(waveGrometry, waveMaterial);
    // waveMesh.position.y = 47;
    // waveMesh.position.x = 0;
    // waveMesh.position.z = -330;
    // // waveMesh.rotateY(Math.PI *1.5);
    // scene.add(waveMesh);

    // var spriteWav = new THREE.TextureLoader().load("assets/end.png");
    // var spriteWavMaterial = new THREE.SpriteMaterial({
    //   map: spriteWav,
    //   depthWrite: false,
    // });

    // var spriteWav = new THREE.Sprite(spriteWavMaterial);
    // spriteWav.scale.set(10, 10, 1);
    // spriteWav.position.y = 10;
    // spriteWav.position.x = 0;
    // spriteWav.position.z = -310;
    // spriteWav.rotateY(Math.PI / 2);
    // scene.add(spriteWav);

    // // video6
    // var videoRain = document.createElement("video");
    // videoRain.src = "./assets/rain.mp4"; //
    // videoRain.autoplay = "autoplay";
    // videoRain.loop = true;
    // videoRain.muted = true;

    // var videoRainTexture = new THREE.VideoTexture(videoRain);
    // videoRainTexture.wrapS = videoRainTexture.wrapT =
    //   THREE.ClampToEdgeWrapping;
    // videoRainTexture.minFilter = THREE.LinearFilter;
    // var rainMaterial = new THREE.MeshPhongMaterial({
    //   map: videoRainTexture,
    //   side: THREE.DoubleSide,
    // });
    // var rainGrometry = new THREE.PlaneGeometry(40, 60);
    // var rainMesh = new THREE.Mesh(rainGrometry, rainMaterial);
    // rainMesh.position.y = 35;
    // rainMesh.position.x = -25;
    // rainMesh.position.z = -220;
    // console.log(rainMesh.rotation);
    // // rainMesh.rotateX(Math.PI / 2);
    // // waveMesh.rotateY(Math.PI *1.5);
    // scene.add(rainMesh);

    // addExhibition("drop.mp4", 10, 25, -200, 50, 30);
    // addExhibition("Touch.mp4", -10, 20, -280, 80, 20);
    for (let i = 0; i < JSON_obj.objects.length; i++) {
      const element = JSON_obj.objects[i];
      console.log(JSON_obj.objects[i])
      var returnObj = obj_loader(element.objUrl,element.mtlUrl,element.objScale,element.objDouble,element.position.x,element.position.y,element.position.z);
      scene.add(returnObj);
    }

    const listener = new THREE.AudioListener();
    camera.add(listener);

    // create the PositionalAudio object (passing in the listener)
    const sound = new THREE.PositionalAudio(listener);

    // load a sound and set it as the PositionalAudio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("assets/grok.mp3", function (buffer) {
      sound.setBuffer(buffer);
      sound.setRefDistance(20);
      sound.play();
    });

    // var secListener = new THREE.AudioListener();
    // camera.add(secListener);
    // var secSound = new THREE.PositionalAudio(secListener);
    // var audioSecLoader = new THREE.AudioLoader();
    // audioSecLoader.load("assets/end.mp3", function (buffer) {
    //   secSound.setBuffer(buffer);
    //   secSound.setRefDistance(20);
    //   secSound.play();
    // });
    // waveMesh.add(secSound);
    // create an object for the sound to play from
    // const audioSphere = new THREE.SphereGeometry(20, 32, 16);
    // const audioMaterial = new THREE.MeshPhongMaterial({ color: 0xff2200 });
    // const meshAudio = new THREE.Mesh(audioSphere, audioMaterial);
    // scene.add(meshAudio);

    // finally add the sound to the mesh
    torusKnotMesh.add(sound);

    var lightColor = 0xffffff;
    var intensity = 1;
    var light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, 1, 1);
    scene.add(light);

    // scene.add(new THREE.AmbientLight(0x404040));

    spotLight = new THREE.PointLight(0x000000, 1, 100);
    spotLight.position.set(10, 10, 10);
    console.log(spotLight);
    // spotLight.target = exibitionMesh.position;
    scene.add(spotLight);

    var spriteMap = new THREE.TextureLoader().load("assets/messagebox.png");
    const spriteMaterial = new THREE.SpriteMaterial({
      map: spriteMap,
      depthWrite: false,
    });

    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(10, 10, 1);
    sprite.position.y = 10;
    sprite.position.x = 20;
    sprite.position.z = -75;
    sprite.rotateY(Math.PI / 2);
    scene.add(sprite);

    var spriteGir = new THREE.TextureLoader().load("assets/girrafe.png");
    var spriteGirMaterial = new THREE.SpriteMaterial({
      map: spriteGir,
      depthWrite: false,
    });

    var spriteGir = new THREE.Sprite(spriteGirMaterial);
    spriteGir.scale.set(10, 10, 1);
    spriteGir.position.y = 10;
    spriteGir.position.x = -45;
    spriteGir.position.z = -120;
    spriteGir.rotateY(Math.PI / 2);
    scene.add(spriteGir);
    obj();
    LoadObject();

    class ColorGUIHelper {
        constructor(object, prop) {
          this.object = object;
          this.prop = prop;
        }
        get value() {
          return `#${this.object[this.prop].getHexString()}`;
        }
        set value(hexString) {
          this.object[this.prop].set(hexString);
        }
      }
    {
        const Ambitcolor = parseInt(JSON_obj.configrations.enviroment.light.ambitientLight.Ambitcolor.replace(/^#/, ''), 16)
        const Ambitntensity = JSON_obj.configrations.enviroment.light.ambitientLight.Ambitntensity;
        const ambitLit = new THREE.AmbientLight(Ambitcolor, Ambitntensity);
        scene.add(ambitLit);
        const gui = new GUI();
        var lightFolder = gui.addFolder("Light");
        var envFolder = gui.addFolder("Enviroment");
    
        
        lightFolder.addColor(new ColorGUIHelper(ambitLit, 'color'), 'value').name('color');
        lightFolder.add(ambitLit, 'intensity', 0, 2, 0.01);
        lightFolder.open();

        // envFolder.add(scene.fog,'fog',0,2,0.02)
      }

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("container").appendChild(renderer.domElement);
    document.body.appendChild(renderer.domElement);
  }
  // init();

  function LoadObject() {
    // instantiate a loader
    var loader = new THREE.OBJLoader();

    var material = new THREE.MeshPhongMaterial({ color: 0xf3f3f3 });
    // load a resource
    loader.load("obj/giraffe.obj", function (group) {
      geometry = group.children[0].geometry;
      geometry.attributes.uv2 = geometry.attributes.uv;
      geometry.center();
      mesh = new THREE.Mesh(geometry, material);
      mesh.scale.multiplyScalar(10);
      mesh;
      mesh.position.y = 15;
      mesh.position.x = -40;
      mesh.position.z = -130;
      scene.add(mesh);
    });
  }

  function obj() {
    // instantiate a loader
    var loader = new THREE.OBJLoader();

    var material = new THREE.MeshPhongMaterial({ color: 0xf3f3f3 });
    // load a resource
    loader.load("obj/stickman.OBJ", function (group) {
      geometry = group.children[0].geometry;
      geometry.attributes.uv2 = geometry.attributes.uv;
      geometry.center();
      mesh = new THREE.Mesh(geometry, material);
      mesh.scale.multiplyScalar(1 / 8.25);
      mesh;
      mesh.position.y = 10.5;
      mesh.position.x = 40;
      mesh.position.z = 0;
      scene.add(mesh);
    });
  }

  function addExhibition(url, x, y, z, width, height) {
    var videoRain = document.createElement("video");
    videoRain.src = "./assets/" + url; //
    videoRain.autoplay = "autoplay";
    videoRain.loop = true;
    videoRain.muted = true;

    var videoRainTexture = new THREE.VideoTexture(videoRain);
    videoRainTexture.wrapS = videoRainTexture.wrapT =
      THREE.ClampToEdgeWrapping;
    videoRainTexture.minFilter = THREE.LinearFilter;
    var rainMaterial = new THREE.MeshPhongMaterial({
      map: videoRainTexture,
      side: THREE.DoubleSide,
    });
    var rainGrometry = new THREE.PlaneGeometry(width, height);
    var rainMesh = new THREE.Mesh(rainGrometry, rainMaterial);
    rainMesh.position.y = y;
    rainMesh.position.x = x;
    rainMesh.position.z = z;
    // console.log(rainMesh.rotation);
    // rainMesh.rotateX(Math.PI / 2);
    // waveMesh.rotateY(Math.PI *1.5);
    scene.add(rainMesh);
  }

  // Mouse Move
  document.addEventListener("mousemove", mouseMove, false);
  var delta = 0;
  var mouseP = { x: 0, y: 0 };
  var up = 0;
  var down = 0;
  var left = 0;
  var right = 0;
  function getMousePosition(e) {
    var x = e.clientX;
    var y = e.clientY;
    return { x: x, y: y };
  }
  function mouseMove(e) {
    var mouseP = getMousePosition(e);
    if (mouseP["y"] / window.innerHeight < 0.42) {
      up = 0.42 - mouseP["y"] / window.innerHeight;
    } else {
      up = 0;
    }
    if (mouseP["y"] / window.innerHeight > 0.58) {
      down = mouseP["y"] / window.innerHeight - 0.58;
    } else {
      down = 0;
    }
    if (mouseP["x"] / window.innerWidth < 0.45) {
      left = 0.45 - mouseP["x"] / window.innerWidth;
    } else {
      left = 0;
    }
    if (mouseP["x"] / window.innerWidth > 0.55) {
      right = mouseP["x"] / window.innerWidth - 0.55;
    } else {
      right = 0;
    }
  }

  var maxSpeed = 0.5;
  var acc = 2.5;
  var currentSpeedForward = 0;
  var currentSpeedRight = 0;
  var Forward = true;
  var Right = true;
  const clock = new THREE.Clock();
  var angleX = 0;
  var angleY = 0;
  var angleZX = 0;
  var angleZY = 0;

  var uping = true;
  var jumpSpeed = 0.2;
  var jumping = false;

  export function animate() {
    var delta = clock.getDelta();

    //Ball Maving
    var i = 0;
    for (var ix = 0; ix < AMOUNTX; ix++) {
      for (var iy = 0; iy < AMOUNTY; iy++) {
        if (ix <= 30 && ix >= 20 && iy <= 30 && iy >= 20) {
          continue;
        }
        var x = 0;
        var y = 0;
        var z = 0;
        if (ix <= 20) x = -275;
        else if (ix >= 30) x = 275;
        else x = particle.position.x;
        if (iy <= 20) z = -275;
        else if (iy >= 30) z = 275;
        else z = particle.position.z;
        particle = particles[i++];

        var sin_ix_3 = Math.sin((ix + count) * 0.25);
        var sin_iy_5 = Math.sin((iy + count) * 0.5);
        var sin_ix_1 = Math.sin((ix + count * 0.5) * 0.1);
        var sin_iy_2 = Math.sin((iy + count * 0.5) * 0.2);
        var dis = Math.sqrt(
          Math.pow(x - particle.position.x, 2) +
          Math.pow(z - particle.position.z, 2)
        );

        particle.position.y = ((sin_ix_3 + sin_iy_5) * dis) / 50 + 2.5;

        //particle.position.x += ((sin_ix_1 + sin_iy_2) * dis) / 20000;

        //particle.position.z += ((sin_ix_1 + sin_iy_2) * dis) / 20000;

        particle.scale.x = particle.scale.y = particle.scale.z = Math.max(
          (sin_ix_3 + 1) * 1.5 + (sin_iy_5 + 1) * 1.5,
          1
        );
      }
    }
    count += 0.025;

    if (jump || jumping) {
      if (uping) {
        jumping = true;
        jump = false;
        cameraPosition.y += jumpSpeed;
        jumpSpeed = Math.max(0, jumpSpeed - delta * acc * 0.25);
        if (jumpSpeed == 0) {
          uping = false;
        }
      } else {
        jump = false;
        cameraPosition.y = Math.max(cameraPosition.y - jumpSpeed, 15);
        jumpSpeed = Math.min(jumpSpeed + delta * acc * 0.25, 0.2);
        if (cameraPosition.y == 15) {
          uping = true;
          jumping = false;
        }
      }
    }

    if (moveForward && !moveBackward) {
      if (!Forward && currentSpeedForward != 0) {
        cameraPosition.z -= cameraDirection.z * currentSpeedForward;
        cameraPosition.x -= cameraDirection.x * currentSpeedForward;
        currentSpeedForward = Math.max(0, currentSpeedForward - delta * acc);
      } else {
        cameraPosition.z += cameraDirection.z * currentSpeedForward;
        cameraPosition.x += cameraDirection.x * currentSpeedForward;
        currentSpeedForward = Math.min(
          maxSpeed,
          currentSpeedForward + delta * acc
        );
        Forward = true;
      }
    } else if (moveBackward && !moveForward) {
      if (Forward && currentSpeedForward != 0) {
        cameraPosition.z += cameraDirection.z * currentSpeedForward;
        cameraPosition.x += cameraDirection.x * currentSpeedForward;
        currentSpeedForward = Math.max(0, currentSpeedForward - delta * acc);
      } else {
        cameraPosition.z -= cameraDirection.z * currentSpeedForward;
        cameraPosition.x -= cameraDirection.x * currentSpeedForward;
        currentSpeedForward = Math.min(
          maxSpeed,
          currentSpeedForward + delta * acc
        );
        Forward = false;
      }
    }

    if (moveRight && !moveLeft) {
      if (!Right && currentSpeedRight != 0) {
        cameraPosition.x += cameraDirection.z * currentSpeedRight;
        cameraPosition.z -= cameraDirection.x * currentSpeedRight;
        currentSpeedRight = Math.max(0, currentSpeedRight - delta * acc);
      } else {
        cameraPosition.x -= cameraDirection.z * currentSpeedRight;
        cameraPosition.z += cameraDirection.x * currentSpeedRight;
        currentSpeedRight = Math.min(
          maxSpeed,
          currentSpeedRight + delta * acc
        );
        Right = true;
      }
    } else if (moveLeft && !moveRight) {
      if (Right && currentSpeedRight != 0) {
        cameraPosition.x -= cameraDirection.z * currentSpeedRight;
        cameraPosition.z += cameraDirection.x * currentSpeedRight;
        currentSpeedRight = Math.max(0, currentSpeedRight - delta * acc);
      } else {
        cameraPosition.x += cameraDirection.z * currentSpeedRight;
        cameraPosition.z -= cameraDirection.x * currentSpeedRight;
        currentSpeedRight = Math.min(
          maxSpeed,
          currentSpeedRight + delta * acc
        );
        Right = false;
      }
    }
    if ((!moveBackward && !moveForward) || (moveBackward && moveForward)) {
      if (Forward) {
        cameraPosition.z += cameraDirection.z * currentSpeedForward;
        cameraPosition.x += cameraDirection.x * currentSpeedForward;
        currentSpeedForward = Math.max(0, currentSpeedForward - delta * acc);
      } else {
        cameraPosition.z -= cameraDirection.z * currentSpeedForward;
        cameraPosition.x -= cameraDirection.x * currentSpeedForward;
        currentSpeedForward = Math.max(0, currentSpeedForward - delta * acc);
      }
    }
    if ((!moveRight && !moveLeft) || (moveRight && moveLeft)) {
      if (Right) {
        cameraPosition.x -= cameraDirection.z * currentSpeedRight;
        cameraPosition.z += cameraDirection.x * currentSpeedRight;
        currentSpeedRight = Math.max(0, currentSpeedRight - delta * acc);
      } else {
        cameraPosition.x += cameraDirection.z * currentSpeedRight;
        cameraPosition.z -= cameraDirection.x * currentSpeedRight;
        currentSpeedRight = Math.max(0, currentSpeedRight - delta * acc);
      }
    }

    angleX += +left / 20 / Math.PI - right / 20 / Math.PI;
    angleZX += +left / 20 / Math.PI - right / 20 / Math.PI;
    cameraDirection.x += Math.sin(angleX);
    cameraDirection.z += Math.cos(angleZX);

    if (cameraDirection.y < 0.4) {
      angleZY += up / 60 / Math.PI;
      angleY += up / 60 / Math.PI;
    }
    if (cameraDirection.y > -0.35) {
      angleZY -= down / 60 / Math.PI;
      angleY -= down / 60 / Math.PI;
    }
    cameraDirection.y += Math.sin(angleY) + Math.sin(angleZY);
    cameraDirection.normalize();

    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    camera.lookAt(
      cameraPosition.x + cameraDirection.x,
      cameraPosition.y + cameraDirection.y,
      cameraPosition.z + cameraDirection.z
    );

    camera.updateProjectionMatrix();
    torusKnotMesh.rotation.y += 0.004;
    // spotLight.rotation.x+=0.01;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

 
  var MyResize = function () {
    //get the new sizes
    var width = window.innerWidth;
    var height = window.innerHeight;
    //then update the renderer
    renderer.setSize(width, height);
    //and update the aspect ratio of the camera
    camera.aspect = width / height;

    //update the projection matrix given the new values
    camera.updateProjectionMatrix();

    //and finally render the scene again
    renderer.render(scene, camera);
  };
  window.addEventListener("resize", MyResize);


  function obj_loader(url, url1, scale, double = false,x,y,z) {
    var newobj = obj3d.clone();
    var newmtl = new MTLLoader();
    if (double) { newmtl.setMaterialOptions({ side: THREE.DoubleSide }) }
    newmtl.load(url1 + '.mtl', (mtl) => {
      mtl.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load(url + '.obj', (root) => {
        for (var k = 0; k < root.children.length; k++) {
          root.children[k].castShadow = true;
          root.children[k].receiveShadow = true;
        }
        root.position.set(x, y, z);
        root.rotateZ(Math.PI * 3/ 2);
        root.rotateX(Math.PI / 2);
        root.rotateY(Math.PI *3 / 2);
        root.scale.set(scale, scale, scale);
        newobj.add(root);
      });
    });
    return newobj;
  }




