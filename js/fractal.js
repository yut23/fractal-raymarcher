"use strict";

var gl;
var c;
//var lookDir = vec3(0.0, 0.0, -1.0);
var rightDir = vec3(1.0, 0.0, 0.0);
var upDir = vec3(0.0, 1.0, 0.0);
var movements = [0, 0, 0];
var resolutionLoc;
//var mousePos;
var forceDraw = false;
var stats = new Stats();
var gui;
var moveSpeedCont;
var orbitCont;
var controls;

var saveData = {
  "preset": "Mandelbulb",
  "closed": false,
  "remembered": {
    "Default": {
      "0": {}
    },
    "Mandelbulb": {
      "0": {
        "fractal": 1,
        "precision": 1,
        "marchIters": 300,
        "fov": 70,
        "cameraPos": {
          "0": 1.1396403312683105,
          "1": 0.21330860257148743,
          "2": 1.9681909084320068,
          "type": "vec3"
        },
        "cameraAngle": {
          "0": -0.5074064135551453,
          "1": 0.11481479555368423,
          "type": "vec2"
        },
        "bulbPower": 8,
        "bulbIters": 100,
        "bulbBailout": 30,
        "boxScale": 2,
        "boxIters": 20,
        "boxMinRadius": 0.5,
        "stepMult": 0.8,
        "maxDist": 10,
        "renderMode": "6",
        "aoScale": 17.400000000000002,
        "aoStep": 1.43,
        "lookDir": {
          "0": -0.48271283329553555,
          "1": -0.11456270529576859,
          "2": -0.8682532505710021,
          "type": "vec3"
        }
      }
    },
    "Broccoli Trees": {
      "0": {
        "fractal": 1,
        "precision": 1,
        "stepMult": 0.8200000000000001,
        "marchIters": 300,
        "cameraPos": {
          "0": 0.6432256698608398,
          "1": 0.8203186988830566,
          "2": 0.23823928833007812,
          "type": "vec3"
        },
        "cameraAngle": [
          -1.8814487268741507,
          -1.5057913728945245
        ],
        "lookDir": {
          "0": -0.061849869787693024,
          "1": 0.997887909412384,
          "2": 0.019856715574860573,
          "type": "vec3"
        },
        "bulbPower": 8,
        "bulbIters": 100,
        "bulbBailout": 30,
        "boxScale": 2,
        "boxIters": 20,
        "boxMinRadius": 0.5,
        "fov": 70,
        "maxDist": 10,
        "renderMode": "1",
        "iterOverride": 230,
        "iterColor": {
          "0": 89.97769927978516,
          "1": 252.5,
          "2": 68.30805969238281,
          "type": "vec3"
        },
        "aoScale": 17.4,
        "aoStep": 1.43
      }
    },
    "Mandelbox": {
      "0": {
        "fractal": 2,
        "precision": 2,
        "marchIters": 700,
        "fov": 75,
        "cameraPos": {
          "0": -1.72,
          "1": 0.363,
          "2": -1.72,
          "type": "vec3"
        },
        "cameraAngle": {
          "0": Math.PI * 0.75,
          "1": 0.19,
          "type": "vec2"
        },
        "bulbPower": 8,
        "bulbIters": 7,
        "bulbBailout": 30,
        "boxScale": 2.5,
        "boxIters": 16,
        "boxMinRadius": 0.5,
        "stepMult": 0.9,
        "maxDist": 5,
        "renderMode": "1",
        "iterOverride": 250,
        "iterColor": {
          "0": 255,
          "1": 255,
          "2": 0,
          "type": "vec3"
        },
        "aoScale": 19.5,
        "aoStep": 1.5,
        "lookDir": {
          "0": 0.6943818538053307,
          "1": -0.18885889497650057,
          "2": 0.6943818538053306,
          "type": "vec3"
        }
      }
    },
    "Recursive Orb": {
      "0": {
        "fractal": 2,
        "precision": 2,
        "marchIters": 500,
        "fov": 70,
        "cameraPos": {
          "0": 0.834981381893158,
          "1": 0.11610998958349228,
          "2": -0.10833419859409332,
          "type": "vec3"
        },
        "cameraAngle": {
          "0": 5.0270256996154785,
          "1": -0.1662042737007141,
          "type": "vec2"
        },
        "bulbPower": 8,
        "bulbIters": 7,
        "bulbBailout": 30,
        "boxScale": 2.5,
        "boxIters": 16,
        "boxMinRadius": 0.5,
        "stepMult": 0.9,
        "maxDist": 5,
        "renderMode": "1",
        "iterOverride": 150,
        "aoScale": 19.5,
        "aoStep": 1.5,
        "iterColor": {
          "0": 79.08777618408203,
          "1": 178.15379333496094,
          "2": 247.5,
          "type": "vec3"
        },
      }
    },
    "Negative Mandelbox": {
      "0": {
        "fractal": "2",
        "precision": 2,
        "stepMult": 0.33,
        "marchIters": 525,
        "cameraPos": {
          "0": -0.7528167366981506,
          "1": 0.5897570252418518,
          "2": 0.00878516398370266,
          "type": "vec3"
        },
        "cameraAngle": [
          -4.764561910659565,
          0.282496538381444
        ],
        "lookDir": {
          "0": 0.9590557217597961,
          "1": -0.2787540853023529,
          "2": -0.05008219927549362,
          "type": "vec3"
        },
        "bulbPower": 8,
        "bulbIters": 100,
        "bulbBailout": 30,
        "boxScale": -2,
        "boxIters": 12,
        "boxMinRadius": 0.5,
        "fov": 70,
        "maxDist": 10,
        "renderMode": 6,
        "aoScale": 17.400000000000002,
        "aoStep": 1.43
      }
    },
    "Sparse Mandelbox Trees": {
      "0": {
        "fractal": "2",
        "precision": 0.5,
        "stepMult": 0.6,
        "marchIters": 525,
        "cameraPos": {
          "0": 0.16175101697444916,
          "1": 0.4208332598209381,
          "2": -0.41581499576568604,
          "type": "vec3"
        },
        "cameraAngle": [
          -16.65071099012535,
          -1.1573289950051227
        ],
        "lookDir": {
          "0": 0.3251161575317383,
          "1": 0.9157332181930542,
          "2": 0.23607665300369263,
          "type": "vec3"
        },
        "bulbPower": 8,
        "bulbIters": 100,
        "bulbBailout": 30,
        "boxScale": -2.88,
        "boxIters": 12,
        "boxMinRadius": 0.5,
        "fov": 70,
        "maxDist": 10,
        "renderMode": "1",
        "iterOverride": -1,
        "iterColor": {
          "0": 255,
          "1": 255,
          "2": 0,
          "type": "vec3"
        },
        "aoScale": 17.400000000000002,
        "aoStep": 1.43
      }
    },
    "Negative Mandelbox 2": {
      "0": {
        "fractal": "2",
        "precision": 0.5,
        "stepMult": 0.36,
        "marchIters": 255,
        "cameraPos": {
          "0": 2.513700008392334,
          "1": 0.00535131199285388,
          "2": -0.001291284803301096,
          "type": "vec3"
        },
        "cameraAngle": [
          -20.416623746132437,
          0.0015889214599622563
        ],
        "lookDir": {
          "0": -0.999991774559021,
          "1": -0.0015889208298176527,
          "2": -0.003728488925844431,
          "type": "vec3"
        },
        "bulbPower": 8,
        "bulbIters": 100,
        "bulbBailout": 30,
        "boxScale": -2.88,
        "boxIters": 14,
        "boxMinRadius": 0.5,
        "fov": 70,
        "maxDist": 10,
        "renderMode": "1",
        "iterOverride": -1,
        "iterColor": {
          "0": 136.39707946777344,
          "1": 128.984375,
          "2": 255,
          "type": "vec3"
        },
        "aoScale": 17.400000000000002,
        "aoStep": 1.43
      }
    },
    "foobar": {
      "0": {
        "fractal": "2",
        "precision": 1,
        "stepMult": 0.33,
        "marchIters": 525,
        "cameraPos": {
          "0": 0.36265313625335693,
          "1": 0.8792957663536072,
          "2": -0.7756012082099915,
          "type": "vec3"
        },
        "cameraAngle": [
          -10.760742911615527,
          0.001067423080283961
        ],
        "lookDir": {
          "0": 0.972553014755249,
          "1": -0.0010674229124560952,
          "2": 0.2326788604259491,
          "type": "vec3"
        },
        "bulbPower": 8,
        "bulbIters": 100,
        "bulbBailout": 30,
        "boxScale": -1.75,
        "boxIters": 30,
        "boxMinRadius": 0.29,
        "fov": 70,
        "maxDist": 12.71,
        "renderMode": "1",
        "iterOverride": -1,
        "iterColor": {
          "0": 255,
          "1": 255,
          "2": 0,
          "type": "vec3"
        },
        "aoScale": 17.400000000000002,
        "aoStep": 1.43
      }
    }
  },
  "folders": {
    "Mandelbulb": {
      "preset": "Default",
      "closed": false,
      "folders": {}
    },
    "Mandelbox": {
      "preset": "Default",
      "closed": true,
      "folders": {}
    },
    "Renderer": {
      "preset": "Default",
      "closed": true,
      "folders": {}
    },
    "Controls": {
      "preset": "Default",
      "closed": false,
      "folders": {}
    }
  }
};


class Uniform {
  constructor(program, name, initValue, type=undefined) {
    this.loc = gl.getUniformLocation(program, name);
    if (this.loc === null) {
      //throw new Error("Invalid uniform: " + name);
      console.log("Invalid uniform: " + name);
    }

    // determine type from initValue
    if (type === undefined) {
      if (typeof initValue === "number") {
        // assume float instead of int
        this.type = "float";
      } else {
        if (Array.isArray(initValue)) {
          // some type of vector or matrix, assume vec4 over mat2
          switch (initValue.length) {
            case 1:
              this.type = "float";
              break;
            case 2:
              this.type = vec2;
              break;
            case 3:
              this.type = vec3;
              break;
            case 4:
              this.type = vec4;
              break;
            case 9:
              this.type = mat3;
              break;
            case 16:
              this.type = mat4;
              break;
            default:
              throw new Error("type could not be deduced from initValue!");
          }
        } else if (initValue instanceof Float32Array && initValue.type !== "") {
          this.type = eval(initValue.type);
        } else {
          throw new Error("type could not be deduced from initValue!");
        }
      }
    } else {
      if (["float", "int", vec2, vec3, vec4, mat2, mat3, mat4].indexOf(type) > -1)
        this.type = type;
      else if (["vec2", "vec3", "vec4", "mat2", "mat3", "mat4"].indexOf(type) > -1)
        this.type = eval(type);
      else
        throw new Error("type (" + type + ") is invalid");
    }
    this.set(initValue);
    this.update();
  }

  get() {
    return this.value;
  }

  set(newVal) {
    if (["float", "int"].indexOf(this.type) > -1 || newVal instanceof Float32Array)
      this.value = newVal;
    else
      this.value = this.type(newVal);
    this.changed = true;
  }

  update() {
    if (this.changed) {
      switch (this.type) {
        case "float":
          gl.uniform1f(this.loc, this.value);
          break;
        case "int":
          gl.uniform1i(this.loc, this.value);
          break;
        case vec2:
          gl.uniform2fv(this.loc, this.value);
          break;
        case vec3:
          gl.uniform3fv(this.loc, this.value);
          break;
        case vec4:
          gl.uniform4fv(this.loc, this.value);
          break;
        case mat2:
          gl.uniformMatrix2fv(this.loc, false, flatten(this.value));
          break;
        case mat3:
          gl.uniformMatrix3fv(this.loc, false, flatten(this.value));
          break;
        case mat4:
          gl.uniformMatrix4fv(this.loc, false, flatten(this.value));
          break;
        default:
      }
      this.changed = false;
      return true;
    }
    return false;
  }
}


{
  // c.cameraPos = vec3(-0.34191474318504333, -0.5554137229919434, 1.0013433694839478);
  // c.lookDir = [Math.sin(0.058333370834589005)*Math.cos(-0.32833388447761536), -Math.sin(-0.32833388447761536), -Math.cos(0.058333370834589005)*Math.cos(-0.32833388447761536)];
  // c.cameraPos = vec3(-0.05507015809416771,0.8783641457557678,-0.48583877086639404);
  // c.lookDir = [Math.sin(-9.598332405090332)*Math.cos(0.04753673076629639), -Math.sin(0.04753673076629639), -Math.cos(-9.598332405090332)*Math.cos(0.04753673076629639)];
  // c.cameraPos = vec3(-0.30633267760276794, -0.5449843406677246, 0.8969881534576416);
  // c.lookDir = [Math.sin(0.1866665929555893)*Math.cos(-0.2516672611236572), -Math.sin(-0.2516672611236572), -Math.cos(0.1866665929555893)*Math.cos(-0.2516672611236572)];
  // c.cameraPos = vec3(0.6109107732772827, 0.8412468433380127, 1.0033535957336426);
  // c.lookDir = [Math.sin(0.008337008766829967)*Math.cos(0.05246345326304436), -Math.sin(0.05246345326304436), -Math.cos(0.008337008766829967)*Math.cos(0.05246345326304436)];

  // c.cameraPos = vec3(0.8416175842285156,0.14944130182266235,0.7952210903167725);
  // c.lookDir = [Math.sin(-0.3999999463558197)*Math.cos(-0.3383333086967468), -Math.sin(-0.3383333086967468), -Math.cos(-0.3999999463558197)*Math.cos(-0.3383333086967468)];

  // mandelbulb buggy surface
  // c.cameraPos = vec3(0.591464102268219,0.17048390209674835,0.45047011971473694);
  // c.lookDir = [Math.sin(-0.3450002670288086)*Math.cos(0.04833333194255829), -Math.sin(0.04833333194255829), -Math.cos(-0.3450002670288086)*Math.cos(0.04833333194255829)];

  // mandelbulb spires
  // c.cameraPos = vec3(0.717917263507843,0.3439493775367737,0.5563952922821045);
  // c.lookDir = [Math.sin(-2.8466637134552)*Math.cos(0.10166653990745544), -Math.sin(0.10166653990745544), -Math.cos(-2.8466637134552)*Math.cos(0.10166653990745544)];

  // box fps test
  // c.cameraPos = vec3(-0.14906544983386993, -0.4013102948665619, 1.0719603300094604);
  // c.lookDir = [Math.sin(-0.14722217619419098)*Math.cos(0.13148142397403717), -Math.sin(0.13148142397403717), -Math.cos(-0.14722217619419098)*Math.cos(0.13148142397403717)];

  // -1.75 box mystery
  // c.cameraPos.set([0.15333625674247742,-0.011659028939902782,1.0282313823699951]);
  // c.lookDir = [Math.sin(-1.7074089050292969)*Math.cos(0.3958703577518463), -Math.sin(0.3958703577518463), -Math.cos(-1.7074089050292969)*Math.cos(0.3958703577518463)];
  //
  // 2.5 box gallery
  // c.cameraPos.set([0.0280549805611372,-0.24253445863723755,0.9612696766853333]);
  // c.lookDir = [Math.sin(0.9546296000480652)*Math.cos(0.08055547624826431), -Math.sin(0.08055547624826431), -Math.cos(0.9546296000480652)*Math.cos(0.08055547624826431)];
}

window.onload = function init() {
  document.body.appendChild(stats.dom);
  let canvas = document.getElementById("gl-canvas");
  // pointer lock code from https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
  canvas.requestPointerLock = canvas.requestPointerLock ||
                              canvas.mozRequestPointerLock;

  document.exitPointerLock = document.exitPointerLock ||
                             document.mozExitPointerLock;

  gl = WebGLUtils.setupWebGL(canvas, {}, true);
  if (!gl)
    alert("WebGL 2 isn't available");

  // We just draw a rectangle over the canvas, then do most of the work in the fragment shader.
  const points = [
    vec2(-1.0, -1.0),
    vec2(-1.0, 1.0),
    vec2(1.0, 1.0),
    vec2(1.0, -1.0),
  ];

  //
  //  Configure WebGL
  //
  gl.viewport(0, 0, canvas.width, canvas.height);
  // Pure cyan, for visibility
  gl.clearColor(0.0, 1.0, 1.0, 1.0);

  // Load shaders and initialize attribute buffers
  let program = initShaders(gl, "shaders/vertex_shader.glsl", "shaders/fragment_shader.glsl");
  if (!program)
    return;
  gl.useProgram(program);

  // Load the data into the GPU
  let bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  // Associate our shader variables with our data buffer
  let vPos = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPos);

  // Find the location of the resolution uniform
  resolutionLoc = gl.getUniformLocation(program, "resolution");

  class Config {
    constructor(program) {
      Object.defineProperty(this, "uniforms", {
        value: Object.create(null),
        enumerable: false
      });
      this.uniforms.fractal = new Uniform(program, "FRACTAL_TYPE", 1, "int");
      this.uniforms.cameraPos = new Uniform(program, "cameraPos", vec3(0, 0, 2.5));
      this.uniforms.lookDir = new Uniform(program, "lookDir", vec3(0, 0, -1));
      this.uniforms.marchIters = new Uniform(program, "MARCH_ITERS", 300, "int");
      this.uniforms.precision = new Uniform(program, "EPS_MULT", 1.0);
      this.uniforms.fov = new Uniform(program, "fov", 70, "float");
      this.uniforms.bulbPower = new Uniform(program, "BULB_POWER", 8.0);
      this.uniforms.bulbIters = new Uniform(program, "BULB_ITERS", 100, "int");
      this.uniforms.bulbBailout = new Uniform(program, "BULB_BAILOUT", 30.0);
      this.uniforms.boxScale = new Uniform(program, "BOX_SCALE", 2.0);
      this.uniforms.boxIters = new Uniform(program, "BOX_ITERS", 20, "int");
      this.uniforms.boxMinRadius = new Uniform(program, "BOX_MIN_R", 0.5);
      this.uniforms.maxDist = new Uniform(program, "MAX_DIST", 10.0);
      this.uniforms.stepMult = new Uniform(program, "STEP_MULT", 0.8);
      this.uniforms.renderMode = new Uniform(program, "RENDER_MODE", 6, "int");
      this.uniforms.iterOverride = new Uniform(program, "ITER_OVERRIDE", -1, "int");
      this.uniforms.iterColor = new Uniform(program, "ITER_COLOR", [255, 255, 0], "vec3");
      this.uniforms.aoScale = new Uniform(program, "AO_SCALE", 17.4);
      this.uniforms.aoStep = new Uniform(program, "AO_STEP", 1.43);
      for (let key in this.uniforms) {
        Object.defineProperty(this, key, {
          get() { return this.uniforms[key].get(); },
          set(newValue) { this.uniforms[key].set(newValue); },
          enumerable: true,
          configurable: true
        });
      }
      this.cameraAngle = [0, 0];
    }
  }
  c = new Config(program);

  controls = {
    orbit: false,
    invertX: false,
    invertY: false,
    invertScroll: false,
    moveSpeed: 0,
  };

  dat.GUI.DEFAULT_WIDTH = 275;  // Firefox is weird on my machine
  dat.GUI.TEXT_OPEN = "Open Settings";
  dat.GUI.TEXT_CLOSED = "Close Settings";
  gui = new dat.GUI({load: saveData});
  var fractalController = gui.add(c, "fractal", {"Mandelbulb": 1, "Mandelbox": 2});
  gui.add(c, "precision", 0.1, 5, 0.05);
  gui.add(c, "stepMult", 0.1, 2.0, 0.01);
  gui.add(c, "marchIters", 10, 1000, 5);
  moveSpeedCont = gui.add(controls, "moveSpeed", -6.0, 1.0, 0.25);
  gui.addHidden(c, "cameraPos");
  gui.addHidden(c, "cameraAngle");
  gui.addHidden(c, "lookDir");

  let bulbFolder = gui.addFolder("Mandelbulb");
  bulbFolder.add(c, "bulbPower", 1, 10, 0.01);
  bulbFolder.add(c, "bulbIters", 1, 200, 1);
  bulbFolder.add(c, "bulbBailout", 0, 30, 0.1);
  let boxFolder = gui.addFolder("Mandelbox");
  boxFolder.add(c, "boxScale", -3.0, 5, 0.01);
  boxFolder.add(c, "boxIters", 0, 30, 1);
  boxFolder.add(c, "boxMinRadius", 0, 2.0, 0.01);

  let renderFolder = gui.addFolder("Renderer");
  renderFolder.add(c, "fov", 50, 120, 1);
  renderFolder.add(c, "maxDist", 1, 30, 0.01);
  renderFolder.add(c, "renderMode", {
    "Iter count": 1,
    "Lighting": 2,
    "AO only": 4,
    "Lighting+AO": 6
  });
  renderFolder.add(c, "iterOverride", -1, 1000, 1);
  renderFolder.addColor(c, "iterColor");
  renderFolder.add(c, "aoScale", 0, 50, 0.05);
  renderFolder.add(c, "aoStep", 1, 2, 0.01);

  let controlsFolder = gui.addFolder("Controls");
  orbitCont = controlsFolder.add(controls, "orbit");
  controlsFolder.add(controls, "invertX");
  controlsFolder.add(controls, "invertY");
  controlsFolder.add(controls, "invertScroll");

  fractalController.onChange(function(value) {
    if (value === 1) {
      bulbFolder.open();
      boxFolder.close();
    } else {
      bulbFolder.close();
      boxFolder.open();
    }
  });

  gui.remember(c);

  // add help button
  let helpLink = document.createElement("a");
  helpLink.className = "button";
  helpLink.style.textDecoration = "none";
  helpLink.href = "manual.html#user-guide";
  helpLink.target = "_blank";
  helpLink.title = "Open in new tab";
  helpLink.appendChild(document.createTextNode("Help"));
  console.log(helpLink);
  gui.__save_row.appendChild(helpLink);

  // setup user input
  ["pointerlockchange", "mozpointerlockchange"].forEach((ev_type) =>
    document.addEventListener(ev_type, function () {
      if (document.pointerLockElement === gl.canvas ||
          document.mozPointerLockElement === gl.canvas)
        document.addEventListener("mousemove", mousemove_handler, false);
      else
        document.removeEventListener("mousemove", mousemove_handler, false);
    }, false)
  );

  canvas.addEventListener("mousedown", function(event) {
    if (event.button === 0)
      canvas.requestPointerLock();
  }, false);

  canvas.addEventListener("mouseup", function(event) {
    if (event.button === 0)
      document.exitPointerLock();
  }, false);

  // listen to keyboard input
  canvas.addEventListener("keydown", key_handler, false);
  canvas.addEventListener("keyup", key_handler, false);
  canvas.addEventListener("keypress", button_handler, false);
  window.addEventListener("blur", () => movements = [0, 0, 0]);

  // listen to mouse wheel scrolling
  canvas.addEventListener("wheel", function(event) {
    // + = zoom out
    // - = zoom in
    let change = 0.25 * Math.sign(event.deltaY);
    if (controls.invertScroll) {
      change *= -1;
    }
    let newVal = controls.moveSpeed + change;
    if (newVal >= -6.0 && newVal <= 1) {
      controls.moveSpeed = newVal;
      moveSpeedCont.updateDisplay();
    }
  }, false);

  //c.boxScale.set(2.5);
  //c.cameraPos.set([0.027102351188659668,-0.22614750266075134,1.013134479522705]);
  //c.lookDir = [Math.sin(0.10277759283781052)*Math.cos(0.16759254038333893), -Math.sin(0.16759254038333893), -Math.cos(0.10277759283781052)*Math.cos(0.16759254038333893)];

  //c.cameraPos = [0.4627853333950043,0.025427989661693573,1.2098183631896973];
  //c.lookDir = [Math.sin(-1.389398217201233)*Math.cos(-0.02038739062845707), -Math.sin(-0.02038739062845707), -Math.cos(-1.389398217201233)*Math.cos(-0.02038739062845707)];

  //c.cameraPos = [0.4627853333950043,0.025427989661693573,1.2098183631896973];
  //c.lookDir = [Math.sin(-0.19367942214012146)*Math.cos(0.0682976245880127), -Math.sin(0.0682976245880127), -Math.cos(-0.19367942214012146)*Math.cos(0.0682976245880127)];

  //c.cameraPos = [0.2054499089717865,0.3795940577983856,1.1499569416046143];
  //c.lookDir = [Math.sin(-0.3200812041759491)*Math.cos(0.007135516032576561), -Math.sin(0.007135516032576561), -Math.cos(-0.3200812041759491)*Math.cos(0.007135516032576561)];

  draw();
  requestAnimFrame(loop);
};

function button_handler(event) {
  switch (event.key) {
    case "p":  // mostly for debugging
      console.log("c.cameraPos = [" + c.cameraPos.toString() + "];\nc.lookDir = [" + c.lookDir.toString() + "];\nc.cameraAngle = [" + c.cameraAngle.toString() + "];");
      break;
    case "+":
      if (controls.moveSpeed + 0.25 <= 1) {
        controls.moveSpeed += 0.25;
        moveSpeedCont.updateDisplay();
      }
      break;
    case "-":
      // 0.02*10^-5.5 ~= 2^-24
      if (controls.moveSpeed - 0.25 >= -6.0) {
        controls.moveSpeed -= 0.25;
        moveSpeedCont.updateDisplay();
      }
      break;
    case "0":
      controls.moveSpeed = 0;
      moveSpeedCont.updateDisplay();
      break;
    case "o":
      movements = [0, 0, 0];
      if (controls.orbit) {
        controls.orbit = false;
      } else {
        controls.orbit = true;
        mousemove_handler(null);
      }
      orbitCont.updateDisplay();
      break;
    default:
  }
}

const IN_DIR = 0;
const RIGHT_DIR = 1;
const UP_DIR = 2;
const key_dirs = {
  "w": [IN_DIR, +1],
  "s": [IN_DIR, -1],
  "d": [RIGHT_DIR, +1],
  "a": [RIGHT_DIR, -1],
  "q": [UP_DIR, +1],
  "e": [UP_DIR, -1],
};
const keys_down = {
  "w": false,
  "s": false,
  "d": false,
  "a": false,
  "e": false,
  "q": false
};

function key_handler(event) {
  if (event.repeat)
    return;
  //console.log(event);
  if (event.key in key_dirs) {
    let [dir, amount] = key_dirs[event.key];
    if (event.type === "keydown" && !keys_down[event.key]) {
      keys_down[event.key] = true;
      movements[dir] += amount;
    } else if (event.type === "keyup" && keys_down[event.key]) {
      keys_down[event.key] = false;
      movements[dir] -= amount;
    }
    if (Math.abs(movements[dir]) > 1) {
      console.log(event.key, event.type, dir, movements[dir]);
      movements[dir] = Math.sign(movements[dir]);
    }
  }
}

function moveCamera() {
  let moveIn = movements[IN_DIR] !== 0,
      moveRight = movements[RIGHT_DIR] !== 0,
      moveUp = movements[UP_DIR] !== 0;
  let factor = 1;
  if (!controls.orbit)
    factor = 1 / Math.sqrt(moveIn + moveRight + moveUp);
  if (moveIn)
    c.cameraPos = add(c.cameraPos, mult(movements[IN_DIR] * 0.02*Math.pow(10, controls.moveSpeed) * factor, c.lookDir));
  if (moveRight)
    c.cameraPos = add(c.cameraPos, mult(movements[RIGHT_DIR] * 0.02*Math.pow(10, controls.moveSpeed) * factor, rightDir));
  if (moveUp)
    c.cameraPos = add(c.cameraPos, mult(movements[UP_DIR] * 0.02*Math.pow(10, controls.moveSpeed) * factor, upDir));
  if (controls.orbit && (moveIn || moveRight || moveUp))
    mousemove_handler(null);
}

function mousemove_handler(e) {
  if (e !== null && e.buttons === 0)
    return;
  if (controls.orbit) {
    c.lookDir = normalize(negate(c.cameraPos));
    rightDir = normalize(cross(c.lookDir, vec3(0, 1, 0)));
    c.cameraAngle = [Math.atan2(rightDir[2], rightDir[0]), Math.asin(-c.lookDir[1])];
  } else {
    c.cameraAngle = [c.cameraAngle[0] + e.movementX / gl.canvas.height * (controls.invertX ? -1 : 1),
                     c.cameraAngle[1] + e.movementY / gl.canvas.height * (controls.invertY ? -1 : 1)];
  }

  if (Math.abs(c.cameraAngle[1]) >= Math.PI/2)
    c.cameraAngle[1] = Math.max(Math.min(c.cameraAngle[1], Math.PI/2), -Math.PI/2);

  if (c.cameraAngle[0] > 2*Math.PI)
    c.cameraAngle[0] %= 2*Math.PI;

  // update camera direction
  let sx = Math.sin(c.cameraAngle[0]),
      cx = Math.cos(c.cameraAngle[0]),
      sy = Math.sin(c.cameraAngle[1]),
      cy = Math.cos(c.cameraAngle[1]);
  // lookDir = Ry(θx) * Rx(θy) * (0, 0, -1) in left-handed basis
  c.lookDir = vec3(sx*cy, -sy, -cx*cy);
  rightDir = vec3(cx, 0, sx);
  upDir = vec3(sx*sy, cy, -cx*sy);
}

function loop() {
  stats.begin();

  resize(gl.canvas);
  let doDraw = forceDraw;
  moveCamera();
  for (let key in c.uniforms)
    doDraw = c.uniforms[key].update() || doDraw;

  if (doDraw)
    draw();
  stats.end();
  requestAnimFrame(loop);
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

// from <https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html>
function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width  !== displayWidth ||
      canvas.height !== displayHeight) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
    // update the viewport size
    gl.viewport(0, 0, canvas.width, canvas.height);
    // pass the dimensions of the canvas to the shaders
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    // mark a uniform as dirty, so the scene will be re-rendered on the next update
    c.uniforms.cameraPos.changed = true;
  }
}
