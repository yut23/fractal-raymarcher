function initShaders(gl, vShaderName, fShaderName) {
  // Get a file as a string using  AJAX
  function loadFileAJAX(name) {
    var xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open("GET", name, false);
    xhr.setRequestHeader("Pragma", "no-cache");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
  }
  function getShader(gl, shaderName, type) {
    var shader = gl.createShader(type),
        shaderScript = loadFileAJAX(shaderName);
    if (!shaderScript) {
      alert("Could not find shader source: "+shaderName);
    }
    gl.shaderSource(shader, shaderScript);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }
  var vertexShader = getShader(gl, vShaderName, gl.VERTEX_SHADER),
      fragmentShader = getShader(gl, fShaderName, gl.FRAGMENT_SHADER),
      program = gl.createProgram();

  if (vertexShader === null) {
    alert("Could not compile vertex shader. Error log in console.");
    return null;
  }
  if (fragmentShader === null) {
    alert("Could not compile fragment shader. Error log in console.");
    return null;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getProgramInfoLog(program));
    alert("Shader program failed to link. Error log in console.");
    return null;
  }


  return program;
}
