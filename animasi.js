var GL;
function generateCircle(x, y, rad) {
    var list = []
    for (var i = 0; i < 360; i++) {
        var a = rad * Math.cos((i / 180) * Math.PI) + x;
        var b = rad * Math.sin((i / 180) * Math.PI) + y;
        list.push(a);
        list.push(b);
    }
    return list;
}


class MyObject {
    canvas = null;
    vertex = [];
    faces = [];


    SHADER_PROGRAM = null;
    _color = null;
    _position = null;


    _MMatrix = LIBS.get_I4();
    _PMatrix = LIBS.get_I4();
    _VMatrix = LIBS.get_I4();
    _greyScality = 0;


    TRIANGLE_VERTEX = null;
    TRIANGLE_FACES = null;


    MODEL_MATRIX = LIBS.get_I4();

    child = [];

    constructor(vertex, faces, source_shader_vertex, source_shader_fragment) {
        this.vertex = vertex;
        this.faces = faces;


        var compile_shader = function (source, type, typeString) {
            var shader = GL.createShader(type);
            GL.shaderSource(shader, source);
            GL.compileShader(shader);
            if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
                alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
                return false;
            }
            return shader;
        };

        var shader_vertex = compile_shader(source_shader_vertex, GL.VERTEX_SHADER, "VERTEX");

        var shader_fragment = compile_shader(source_shader_fragment, GL.FRAGMENT_SHADER, "FRAGMENT");

        this.SHADER_PROGRAM = GL.createProgram();
        GL.attachShader(this.SHADER_PROGRAM, shader_vertex);
        GL.attachShader(this.SHADER_PROGRAM, shader_fragment);

        GL.linkProgram(this.SHADER_PROGRAM);


        //vao
        this._color = GL.getAttribLocation(this.SHADER_PROGRAM, "color");
        this._position = GL.getAttribLocation(this.SHADER_PROGRAM, "position");


        //uniform
        this._PMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "PMatrix"); //projection
        this._VMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "VMatrix"); //View
        this._MMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "MMatrix"); //Model
        this._greyScality = GL.getUniformLocation(this.SHADER_PROGRAM, "greyScality");//GreyScality


        GL.enableVertexAttribArray(this._color);
        GL.enableVertexAttribArray(this._position);
        GL.useProgram(this.SHADER_PROGRAM);




        this.TRIANGLE_VERTEX = GL.createBuffer();
        this.TRIANGLE_FACES = GL.createBuffer();
    }


    setup() {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
        GL.bufferData(GL.ARRAY_BUFFER,
            new Float32Array(this.vertex),
            GL.STATIC_DRAW);


        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.faces),
            GL.STATIC_DRAW);

        this.child.forEach(obj => {
            obj.render(VIEW_MATRIX, PROJECTION_MATRIX);
        });
    }


    render(VIEW_MATRIX, PROJECTION_MATRIX) {
        GL.useProgram(this.SHADER_PROGRAM);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);
        GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false, 4 * (3 + 3), 0);
        GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false, 4 * (3 + 3), 3 * 4);

        GL.uniformMatrix4fv(this._PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(this._VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(this._MMatrix, false, this.MODEL_MATRIX);
        GL.uniform1f(this._greyScality, 1);

        GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0);

        this.child.forEach(obj => {
            obj.render(VIEW_MATRIX, PROJECTION_MATRIX);
        });

        GL.flush();
    }
    model(MODEL_MATRIXX){
        for (let i = 0; i < this.child.length; i++) {
            this.child[i].MODEL_MATRIX = MODEL_MATRIXX;
        }
    }
}




function main() {
    var CANVAS = document.getElementById("myCanvas");


    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    function normalizeX(x) {
        return ((x / CANVAS.width) * 2) - 1;
    }
    function normalizeY(y) {
        return -1 * (((y / CANVAS.height) * 2) - 1);
    }

    function detect(e) {
        console.log("X : " + e.pageX + ", Y: " + e.pageY);
    }


    var drag = false;
    var dX = 0;
    var dY = 0;


    var X_prev = 0;
    var Y_prev = 0;


    var babiScaleX = 1;
    var babiScaleY = 1;
    var babiScaleZ = 0;
    var babiRotateX = 0;
    var babiRotateY = 0;
    var babiRotateZ = 0;
    var babiTranslateX = 0;
    var babiTranslateY = 0;
    var babiTranslateZ = 0;

    var kuningScaleX = 1;
    var kuningScaleY = 1;
    var kuningScaleZ = 1;
    var kuningRotateX = 0;
    var kuningRotateY = 0;
    var kuningRotateZ = 0;
    var kuningTranslateX = 0;
    var kuningTranslateY = 0;
    var kuningTranslateZ = 0;

    var biruScaleX = 1;
    var biruScaleY = 1;
    var biruScaleZ = 1;
    var biruRotateX = 0;
    var biruRotateY = 0;
    var biruRotateZ = 0;
    var biruTranslateX = 0;
    var biruTranslateY = 0;
    var biruTranslateZ = 0;

    var FRICTION = 0.51;

    var keys = {};

    var handleKeyDown = function (e) {
        keys[e.key] = true;
    };

    var handleKeyUp = function (e) {
        keys[e.key] = false;
    };

    var handleKeys = function () {
        if (keys["q"]) {
            babiRotateX += 0.05;
        }
        if (keys["a"]) {
            babiRotateX -= 0.05;
        }
        if (keys["r"]) {
            babiRotateY += 0.05;
        }
        if (keys["f"]) {
            babiRotateY -= 0.05;
        }
        if (keys["u"]) {
            babiRotateZ += 0.05;
        }
        if (keys["h"]) {
            babiRotateZ -= 0.05;
        }
        if (keys["z"]) {
            babiTranslateX += 0.05;
        }
        if (keys["v"]) {
            babiTranslateX -= 0.05;
        }
        if (keys["1"]) {
            babiTranslateY += 0.05;
        }
        if (keys["4"]) {
            babiTranslateY -= 0.05;
        }
        if (keys["7"]) {
            babiTranslateZ += 0.05;
        }
        if (keys["["]) {
            babiTranslateZ -= 0.05;
        }
        if (keys[","]) {
            babiScaleX += 0.01;
            babiScaleY += 0.01;
            babiScaleZ += 0.01;
        }
        if (keys["p"]) {
            babiScaleX -= 0.01;
            babiScaleY -= 0.01;
            babiScaleZ -= 0.01;
        }
        if (keys["w"]) {
            kuningRotateX += 0.05;
        }
        if (keys["s"]) {
            kuningRotateX -= 0.05;
        }
        if (keys["t"]) {
            kuningRotateY += 0.05;
        }
        if (keys["g"]) {
            kuningRotateY -= 0.05;
        }
        if (keys["i"]) {
            kuningRotateZ += 0.05;
        }
        if (keys["j"]) {
            kuningRotateZ -= 0.05;
        }
        if (keys["x"]) {
            kuningTranslateX += 0.05;
        }
        if (keys["b"]) {
            kuningTranslateX -= 0.05;
        }
        if (keys["2"]) {
            kuningTranslateY += 0.05;
        }
        if (keys["5"]) {
            kuningTranslateY -= 0.05;
        }
        if (keys["8"]) {
            kuningTranslateZ += 0.05;
        }
        if (keys["]"]) {
            kuningTranslateZ -= 0.05;
        }
        if (keys["."]) {
            kuningScaleX += 0.01;
            kuningScaleY += 0.01;
            kuningScaleZ += 0.01;
        }
        if (keys["l"]) {
            kuningScaleX -= 0.01;
            kuningScaleY -= 0.01;
            kuningScaleZ -= 0.01;
        }
        if (keys["e"]) {
            biruRotateX += 0.05;
        }
        if (keys["d"]) {
            biruRotateX -= 0.05;
        }
        if (keys["y"]) {
            biruRotateY += 0.05;
        }
        if (keys["-"]) {
            biruRotateY -= 0.05;
        }
        if (keys["o"]) {
            biruRotateZ += 0.05;
        }
        if (keys["k"]) {
            biruRotateZ -= 0.05;
        }
        if (keys["c"]) {
            biruTranslateX += 0.05;
        }
        if (keys["n"]) {
            biruTranslateX -= 0.05;
        }
        if (keys["3"]) {
            biruTranslateY += 0.05;
        }
        if (keys["6"]) {
            biruTranslateY -= 0.05;
        }
        if (keys["="]) {
            biruTranslateZ += 0.05;
        }
        if (keys["\\"]) {
            biruTranslateZ -= 0.05;
        }
        if (keys["/"]) {
            biruScaleX += 0.01;
            biruScaleY += 0.01;
            biruScaleZ += 0.01;
        }
        if (keys["m"]) {
            biruScaleX -= 0.01;
            biruScaleY -= 0.01;
            biruScaleZ -= 0.01;
        }
    };

    document.addEventListener("keydown", handleKeyDown, false);
    document.addEventListener("keyup", handleKeyUp, false);


    var mouseDown = function (e) {
        drag = true;
        X_prev = e.pageX;
        Y_prev = e.pageY;
    }


    var mouseUp = function (e) {
        drag = false;
    }

    // var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    // var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    // var SHADER_PROGRAM = GL.createProgram();
    // GL.attachShader(SHADER_PROGRAM, shader_vertex);
    // GL.attachShader(SHADER_PROGRAM, shader_fragment);



    // GL.linkProgram(SHADER_PROGRAM);


    // var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    // var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");


    // //uniform
    // var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, "PMatrix"); //projection
    // var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, "VMatrix"); //View
    // var _MMatrix = GL.getUniformLocation(SHADER_PROGRAM, "MMatrix"); //Model


    // GL.enableVertexAttribArray(_color);
    // GL.enableVertexAttribArray(_position);

    // GL.useProgram(SHADER_PROGRAM);



    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }
    //shaders
    var shader_vertex_source = `
      attribute vec3 position;
      attribute vec3 color;


      uniform mat4 PMatrix;
      uniform mat4 VMatrix;
      uniform mat4 MMatrix;
     
      varying vec3 vColor;
      void main(void) {
      gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
      vColor = color;


      gl_PointSize=60.0;
      }`;
    var shader_fragment_source = `
      precision mediump float;
      varying vec3 vColor;
      // uniform vec3 color;


      uniform float greyScality;


      void main(void) {
      float greyScaleValue = (vColor.r + vColor.g + vColor.b)/3.;
      vec3 greyScaleColor = vec3(greyScaleValue, greyScaleValue, greyScaleValue);
      vec3 color = mix(greyScaleColor, vColor, greyScality);
      gl_FragColor = vec4(color, 1.);
      }`;

    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();


    LIBS.translateZ(VIEW_MATRIX, -50);

    //-----------------------------------------------------Babi-----------------------------------------

    var babi = new MyObject(sphere(0, 0, 0, 5, 4, 5, 100, 100, 0.4392156862745098, 0.8941176470588236, 0.2980392156862745).vertex, sphere(0, 0, 0, 3, 3, 3, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    babi.setup();

    var mata_kiri = new MyObject(sphere(-2.8, 0.8, 4, 1.3, 1.3, 1.3, 100, 100, 1, 1, 1).vertex, sphere(0, 0, 0, 3, 3, 3, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    mata_kiri.setup();
    var mata_kanan = new MyObject(sphere(2.8, 0.8, 4, 1.3, 1.3, 1.3, 100, 100, 1, 1, 1).vertex, sphere(0, 0, 0, 3, 3, 3, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    mata_kanan.setup();

    var mataKiri = new MyObject(sphere(-3.5, 0.8, 5.2, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, sphere(0, 0, 0, 3, 3, 3, 100, 100, 0, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    mataKiri.setup();
    var mataKanan = new MyObject(sphere(3.5, 1, 5.2, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, sphere(0, 0, 0, 3, 3, 3, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    mataKanan.setup();

    var hidung_babi = new MyObject(createCuboidVertices(-1.5, -1, 5, 3, 1, 1.8, 0.6588235294117647, 0.9254901960784314, 0.01568627450980392), createCuboidIndices(), shader_vertex_source, shader_fragment_source);
    hidung_babi.setup();

    var lubang_hidung_kiri = new MyObject(generateZAxisCylinderVertices(-0.7, -0.1, 3.1, 0.5, 0.5, 2, 0.09411764705882353, 0.23529411764705882, 0.047058823529411764), generateCylinderTriangleIndices(), shader_vertex_source, shader_fragment_source);
    lubang_hidung_kiri.setup();
    var lubang_hidung_kanan = new MyObject(generateZAxisCylinderVertices(0.7, -0.1, 3.1, 0.6, 0.6, 2, 0.09411764705882353, 0.23529411764705882, 0.047058823529411764), generateCylinderTriangleIndices(), shader_vertex_source, shader_fragment_source);
    lubang_hidung_kanan.setup();

    var kuping_kiri = new MyObject(sphere(-3, 4, 0, 0.8, 1.2, 0.5, 100, 100, 0.4392156862745098, 0.8941176470588236, 0.2980392156862745).vertex, sphere(0, 0, 0, 3, 3, 3, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    kuping_kiri.setup();
    var kuping_kanan = new MyObject(sphere(2.8, 4, 0, 0.8, 1.2, 0.5, 100, 100, 0.4392156862745098, 0.8941176470588236, 0.2980392156862745).vertex, sphere(0, 0, 0, 3, 3, 3, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    kuping_kanan.setup();

    var telinga_kiri = new MyObject(sphere(-3, 4, 0.2, 0.6, 0.8, 0.5, 100, 100, 0.25098039215686274, 0.611764705882353, 0.10980392156862745).vertex, sphere(0, 0, 0, 3, 3, 3, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    telinga_kiri.setup();
    var telinga_kanan = new MyObject(sphere(2.8, 4, 0.2, 0.6, 0.8, 0.5, 100, 100, 0.25098039215686274, 0.611764705882353, 0.10980392156862745).vertex, sphere(0, 0, 0, 3, 3, 3, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    telinga_kanan.setup();

    var alisBabiKanan = new MyObject(createCuboidVertices(2, 2.3, 3.7, 1.2, 1, 0.4,     0, 0, 0), createCuboidIndices(), shader_vertex_source, shader_fragment_source);
    alisBabiKanan.setup();

    var alisBabiKiri = new MyObject(createCuboidVertices(-3.5, 2.3, 3.7,  1.2, 1, 0.4,    0, 0, 0), createCuboidIndices(), shader_vertex_source, shader_fragment_source);
    alisBabiKiri.setup();
  

    absis = [
        -2, -1.5, 4.4, 0.25098039215686274, 0.611764705882353, 0.10980392156862745,
        0, -3.5, 3.5, 0.25098039215686274, 0.611764705882353, 0.10980392156862745,
        2, -1.5, 4.4, 0.25098039215686274, 0.611764705882353, 0.10980392156862745
    ];
    var smile = new MyObject(curve(absis, 0.1).vertices, curve(absis, 0.1).indices, shader_vertex_source, shader_fragment_source);
    smile.setup();


    babi.child.push(mata_kiri);
    babi.child.push(mata_kanan);
    babi.child.push(hidung_babi);
    babi.child.push(mataKiri);
    babi.child.push(mataKanan);
    babi.child.push(mataKiri);
    babi.child.push(lubang_hidung_kiri);
    babi.child.push(lubang_hidung_kanan);
    babi.child.push(kuping_kiri);
    babi.child.push(kuping_kanan);
    babi.child.push(smile);
    babi.child.push(telinga_kiri);
    babi.child.push(telinga_kanan);
    babi.child.push(alisBabiKanan);
    babi.child.push(alisBabiKiri);

    //============KUNING=============
    var bodikuning = new MyObject(ElipticParaboloid(1, 64, 64, 0, 6, -4, 1, 1, 0).vertices, ElipticParaboloid(1, 64, 64, 0, 0, 0, 1, 1, 0).indices, shader_vertex_source, shader_fragment_source);
    bodikuning.setup();

    var paruhKuning = new MyObject(ElipticCone(0.3, 64, 64, 0, 0, -0.5, 0.7, 0.7, 0).vertices, ElipticCone(1, 64, 64, 0, 0, 0, 0.8, 0.8, 0).indices, shader_vertex_source, shader_fragment_source);
    paruhKuning.setup();
    paruhKuning.MODEL_MATRIX = LIBS.get_I4();

    var matakuningkiri = new MyObject(sphere(-1.25, 1.5, -2, 1, 1, 1, 32, 32, 1, 1, 1).vertex, sphere(0, 0, 0, 1, 1, 1, 32, 32, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    matakuningkiri.setup();
    var matakuningkanan = new MyObject(sphere(1.25, 1.5, -2, 1, 1, 1, 32, 32, 1, 1, 1).vertex, sphere(0, 0, 0, 1, 1, 1, 32, 32, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    matakuningkanan.setup();
    cpBrowkanan = [0.5, 2.5, -2, 0.4, 0.2, 0.2,
        1, 3, -2, 0.35, 0.2, 0.2,
        2, 3, -3, 0.35, 0.2, 0.2,];
    var aliskuningkanan = new MyObject(curve(cpBrowkanan, 0.1).vertices, curve(cpBrowkanan, 0.1).indices, shader_vertex_source, shader_fragment_source);
    aliskuningkanan.setup();
    cpBrowkiri = [-0.5, 2.5, -2, 0.4, 0.2, 0.2,
    -1, 3, -2, 0.35, 0.2, 0.2,
    -2, 3, -3, 0.35, 0.2, 0.2,];
    var aliskuningkiri = new MyObject(curve(cpBrowkiri, 0.1).vertices, curve(cpBrowkiri, 0.1).indices, shader_vertex_source, shader_fragment_source);
    aliskuningkiri.setup();
    var pupilkuningkanan = new MyObject(sphere(1.25, 1.6, -1, 0.3, 0.3, 0.3, 32, 32, 0, 0, 0.1).vertex, sphere(0, 0, 0, 1, 1, 1, 32, 32, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    pupilkuningkanan.setup();
    var pupilkuningkiri = new MyObject(sphere(-1.25, 1.6, -1, 0.3, 0.3, 0.3, 32, 32, 0, 0, 0.1).vertex, sphere(0, 0, 0, 1, 1, 1, 32, 32, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    pupilkuningkiri.setup();
    var cprambutkuning1 = [0, 5.75, -3.75, 0.2, 0.1, 0.1,
        -0.5, 8, -4, 0.2, 0.1, 0.1,
        -1, 7, -5, 0.2, 0.1, 0.1,];
    var rambutkuning1 = new MyObject(curve(cprambutkuning1, 0.3).vertices, curve(cprambutkuning1, 0.3).indices, shader_vertex_source, shader_fragment_source);
    rambutkuning1.setup();
    var cprambutkuning2 = [0, 5.75, -3.75, 0.2, 0.1, 0.1,
        0.5, 7, -4, 0.2, 0.1, 0.1,
        1.5, 6.5, -5, 0.2, 0.1, 0.1,];
    var rambutkuning2 = new MyObject(curve(cprambutkuning2, 0.3).vertices, curve(cprambutkuning2, 0.3).indices, shader_vertex_source, shader_fragment_source);
    rambutkuning2.setup();
    var cprambutkuning3 = [0, 5.75, -3.75, 0.2, 0.1, 0.1,
        0, 8, -4, 0.2, 0.1, 0.1,
        0, 7.75, -5, 0.2, 0.1, 0.1,];
    var rambutkuning3 = new MyObject(curve(cprambutkuning3, 0.3).vertices, curve(cprambutkuning3, 0.3).indices, shader_vertex_source, shader_fragment_source);
    rambutkuning3.setup();
    var bawahkuning = new MyObject(sphere(0, -3.7, -4, 3.05, 1.5, 3.05, 64, 64, 0.9, 0.9, 0.5).vertex, sphere(0, 0, 0, 2.5, 2.5, 2.5, 64, 64, 0.9, 0.9, 0.5).indices, shader_vertex_source, shader_fragment_source);
    bawahkuning.setup();
    var kakikuningkiri = new MyObject(generateVerticalCylinderVertices(-1.5, -6, -3.7, 0.6, 0.6, 2, 0.9, 0.9, 0.5), generateCylinderTriangleIndices(), shader_vertex_source, shader_fragment_source);
    kakikuningkiri.setup();
    var kakikuningkanan = new MyObject(generateVerticalCylinderVertices(1.5, -6, -3.7, 0.6, 0.6, 2, 0.9, 0.9, 0.5), generateCylinderTriangleIndices(), shader_vertex_source, shader_fragment_source);
    kakikuningkanan.setup();
    cekerkuningkanan = new MyObject(sphere(1.5, -6, -3.7, 1, 0.75, 1.5, 32, 32, 0.75, 0.5, 0.2).vertex, sphere(1.5, -4, -4, 1, 0.75, 1.5, 32, 32, 0.75, 0.75, 0.5).indices, shader_vertex_source, shader_fragment_source);
    cekerkuningkanan.setup();
    cekerkuningkiri = new MyObject(sphere(-1.5, -6, -3.7, 1, 0.75, 1.5, 32, 32, 0.75, 0.5, 0.2).vertex, sphere(1.5, -4, -4, 1, 0.75, 1.5, 32, 32, 0.75, 0.75, 0.5).indices, shader_vertex_source, shader_fragment_source);
    cekerkuningkiri.setup();
    cpLengankiri = [-2, 0, -3, 0.75, 0.75, 0,
    -4, 0, -3, 0.75, 0.75, 0,
    -5, 3, -3, 0.75, 0.75, 0,];
    var lengankuningkiri = new MyObject(curve(cpLengankiri, 0.3).vertices, curve(cpLengankiri, 0.2).indices, shader_vertex_source, shader_fragment_source);
    lengankuningkiri.setup();
    cpLengankanan = [2, 0, -3, 0.75, 0.75, 0,
        4, 3, -3, 0.75, 0.75, 0,
        6, 3, -3, 0.75, 0.75, 0,];
    var lengankuningkanan = new MyObject(curve(cpLengankanan, 0.3).vertices, curve(cpLengankanan, 0.2).indices, shader_vertex_source, shader_fragment_source);
    lengankuningkanan.setup();
    cpEkor1 = [0, -4, -6, 0.2, 0.1, 0.1,
        0, -4, -7, 0.2, 0.1, 0.1,
        0, -1, -9, 0.2, 0.1, 0.1,];
    var ekor1 = new MyObject(curve(cpEkor1, 0.3).vertices, curve(cpEkor1, 0.2).indices, shader_vertex_source, shader_fragment_source);
    ekor1.setup();
    cpEkor2 = [0, -3, -7, 0.2, 0.1, 0.1,
        1.5, -5, -8, 0.2, 0.1, 0.1,
        0, -1, -10, 0.2, 0.1, 0.1,];
    var ekor2 = new MyObject(curve(cpEkor2, 0.3).vertices, curve(cpEkor2, 0.2).indices, shader_vertex_source, shader_fragment_source);
    ekor2.setup();
    cpEkor3 = [0, -4, -6.5, 0.2, 0.1, 0.1,
        -1, -1, -8, 0.2, 0.1, 0.1,
        -1.5, -3, -8, 0.2, 0.1, 0.1,];
    var ekor3 = new MyObject(curve(cpEkor3, 0.3).vertices, curve(cpEkor3, 0.2).indices, shader_vertex_source, shader_fragment_source);
    ekor3.setup();






    bodikuning.child.push(paruhKuning);
    bodikuning.child.push(matakuningkiri);
    bodikuning.child.push(matakuningkanan);
    bodikuning.child.push(aliskuningkanan);
    bodikuning.child.push(aliskuningkiri);
    bodikuning.child.push(pupilkuningkanan);
    bodikuning.child.push(pupilkuningkiri);
    bodikuning.child.push(rambutkuning1);
    bodikuning.child.push(rambutkuning2);
    bodikuning.child.push(rambutkuning3);
    bodikuning.child.push(bawahkuning);
    bodikuning.child.push(kakikuningkiri);
    bodikuning.child.push(kakikuningkanan);
    bodikuning.child.push(cekerkuningkanan);
    bodikuning.child.push(cekerkuningkiri);
    bodikuning.child.push(lengankuningkiri);
    bodikuning.child.push(lengankuningkanan);
    bodikuning.child.push(ekor1);
    bodikuning.child.push(ekor2);
    bodikuning.child.push(ekor3);


    // --------------------------------------------------------------------------BIRU----------------------------------------------


    var burungBiruBody = new MyObject(sphere(0, 0, 0, 3.4, 3.25, 3.3, 32, 32, 0.337, 0.761, 0.871).vertex, sphere(0, 0, 0, 1, 1, 1, 32, 32, 0.298, 0.643, 0.839).indices, shader_vertex_source, shader_fragment_source);
    burungBiruBody.setup();
    var burungBiruMataKananBelakang = new MyObject(sphere(-0.97, 0.2, 2.61, 0.8 * 1.1, 0.9 * 1.1, 0.9 * 1.1, 32, 32, 0.831, 0.514, 0.251).vertex, sphere(0, 0, 0, 1, 1, 1, 32, 32, 0.298, 0.643, 0.839).indices, shader_vertex_source, shader_fragment_source);
    burungBiruMataKananBelakang.setup();
    burungBiruBody.child.push(burungBiruMataKananBelakang);

    var burungBiruMataKiriBelakang = new MyObject(sphere(0.97, 0.2, 2.61, 0.8 * 1.1, 0.9 * 1.1, 0.9 * 1.1, 32, 32, 0.831, 0.514, 0.251).vertex, sphere(0, 0, 0, 1, 1, 1, 32, 32, 0.298, 0.643, 0.839).indices, shader_vertex_source, shader_fragment_source);
    burungBiruMataKiriBelakang.setup();
    burungBiruBody.child.push(burungBiruMataKiriBelakang);

    var burungBiruMataKanan = new MyObject(sphere(-1, 0.2, 2.8, 0.8, 0.9, 0.9, 32, 32, 1, 1, 1).vertex, sphere(0, 0, 0, 1, 1, 1, 32, 32, 0.298, 0.643, 0.839).indices, shader_vertex_source, shader_fragment_source);
    burungBiruMataKanan.setup();
    burungBiruBody.child.push(burungBiruMataKanan);

    var burungBiruMataKiri = new MyObject(sphere(1, 0.2, 2.8, 0.8, 0.9, 0.9, 32, 32, 1, 1, 1).vertex, sphere(0, 0, 0, 1, 1, 1, 32, 32, 0.298, 0.643, 0.839).indices, shader_vertex_source, shader_fragment_source);
    burungBiruMataKiri.setup();
    burungBiruBody.child.push(burungBiruMataKiri);

    var burungBiruMataKananPupil = new MyObject(sphere(-1, 0.2, 3.5, 0.32, 0.32, 0.32, 32, 32, 0, 0, 0).vertex, sphere(0, 0, 0, 1, 1, 1, 32, 32, 0.298, 0.643, 0.839).indices, shader_vertex_source, shader_fragment_source);
    burungBiruMataKananPupil.setup();
    burungBiruBody.child.push(burungBiruMataKananPupil);

    var burungBiruMataKiriPupil = new MyObject(sphere(1, 0.2, 3.5, 0.32, 0.32, 0.32, 32, 32, 0, 0, 0).vertex, sphere(0, 0, 0, 1, 1, 1, 32, 32, 0.298, 0.643, 0.839).indices, shader_vertex_source, shader_fragment_source);
    burungBiruMataKiriPupil.setup();
    burungBiruBody.child.push(burungBiruMataKiriPupil);


    var alisBiruKanan = new MyObject(createCuboidVertices(0.5, 1.1, 3.7, 1.2, 1, 0.4,     0.075, 0.286, 0.659), createCuboidIndices(), shader_vertex_source, shader_fragment_source);
    alisBiruKanan.setup();
    burungBiruBody.child.push(alisBiruKanan);
 
    var alisBiruKiri = new MyObject(createCuboidVertices(-1.6, 1.1, 3.7,  1.2, 1, 0.4,    0.075, 0.286, 0.659), createCuboidIndices(), shader_vertex_source, shader_fragment_source);
    alisBiruKiri.setup();
    burungBiruBody.child.push(alisBiruKiri);

    // 0.15, 64, 64, 0, -1.2, 3.3, 0.7, 0.7, 0
    var burungBiruParuh = new MyObject(buatConeVertices(0, -2, 3.7, 0, -1.2, 2, 0.8, 0.902, 0.792, 0.376), buatConeIndices(), shader_vertex_source, shader_fragment_source);
    burungBiruParuh.setup();
    burungBiruBody.child.push(burungBiruParuh);

    var burungBiruKakikiri = new MyObject(generateVerticalCylinderVertices(-1, -3.6, 0, 0.4, 0.4, 2, 0.91, 0.659, 0.294), generateCylinderTriangleIndices(), shader_vertex_source, shader_fragment_source);
    burungBiruKakikiri.setup();
    burungBiruBody.child.push(burungBiruKakikiri);

    var burungBiruKakiKanan = new MyObject(generateVerticalCylinderVertices(1, -3.6, 0, 0.4, 0.4, 2, 0.91, 0.659, 0.294), generateCylinderTriangleIndices(), shader_vertex_source, shader_fragment_source);
    burungBiruKakiKanan.setup();
    burungBiruBody.child.push(burungBiruKakiKanan);

    var burungBiruTanganKanan = new MyObject(sphere(-3, 0.2, 0, 1, 0.7, 0.7, 32, 32, 0.271, 0.612, 0.796).vertex, sphere(0, 0, 0, 0.271, 0.612, 0.796, 32, 32, 0.298, 0.643, 0.839).indices, shader_vertex_source, shader_fragment_source);
    burungBiruTanganKanan.setup();
    burungBiruBody.child.push(burungBiruTanganKanan);

    var burungBiruTanganKiri = new MyObject(sphere(3, 0.2, 0, 1, 0.7, 0.7, 32, 32, 0.271, 0.612, 0.796).vertex, sphere(0, 0, 0, 0.271, 0.612, 0.796, 32, 32, 0.298, 0.643, 0.839).indices, shader_vertex_source, shader_fragment_source);
    burungBiruTanganKiri.setup();
    burungBiruBody.child.push(burungBiruTanganKiri);

    var burungBiruTelapakKiri = new MyObject(createCuboidVertices(-1.5, -4, 0.7, 1, 1, 0.4, 0.831, 0.514, 0.251), createCuboidIndices(), shader_vertex_source, shader_fragment_source);
    burungBiruTelapakKiri.setup();
    burungBiruBody.child.push(burungBiruTelapakKiri);

    var burungBiruTelapakKanan = new MyObject(createCuboidVertices(0.5, -4, 0.7, 1, 1, 0.4, 0.831, 0.514, 0.251), createCuboidIndices(), shader_vertex_source, shader_fragment_source);
    burungBiruTelapakKanan.setup();
    burungBiruBody.child.push(burungBiruTelapakKanan);

    titik_kontrol = [
        0, 1, -0.5, 0.271, 0.612, 0.796,
        0, 6, -0.3, 0.271, 0.612, 0.796,
        0, 4, -1.1, 0.271, 0.612, 0.796,
    ];
    var burungBiruJambul = new MyObject(vertical3DCurve(titik_kontrol, 0.25).vertices, vertical3DCurve(titik_kontrol, 0.5).indices, shader_vertex_source, shader_fragment_source);
    burungBiruJambul.setup();
    burungBiruBody.child.push(burungBiruJambul);

    titik_kontrol1 = [
        0, 1, -0.5, 0.271, 0.612, 0.796,
        0.5, 6, -0.3, 0.271, 0.612, 0.796,
        1, 4, -1.1, 0.271, 0.612, 0.796,
    ];
    var burungBiruJambul1 = new MyObject(vertical3DCurve(titik_kontrol1, 0.25).vertices, vertical3DCurve(titik_kontrol1, 0.5).indices, shader_vertex_source, shader_fragment_source);
    burungBiruJambul1.setup();
    burungBiruBody.child.push(burungBiruJambul1);

    titik_kontrol2 = [
        0, 1, -0.5, 0.271, 0.612, 0.796,
        -0.5, 6, -0.3, 0.271, 0.612, 0.796,
        -1, 4, -1.1, 0.271, 0.612, 0.796,
    ];
    var burungBiruJambul2 = new MyObject(vertical3DCurve(titik_kontrol2, 0.25).vertices, vertical3DCurve(titik_kontrol2, 0.5).indices, shader_vertex_source, shader_fragment_source);
    burungBiruJambul2.setup();
    burungBiruBody.child.push(burungBiruJambul2);

    var tanah = new MyObject(createCuboidVertices(-50, -110, 50, 100, 400, 100, 0.6, 0.5, 0.2), createCuboidIndices(), shader_vertex_source, shader_fragment_source);
    tanah.setup();

    var matahari = new MyObject(sphere(20, 20, -30, 5, 5, 5, 32, 32, 1, 1, 0.5).vertex, sphere(0, 0, 0, 5, 5, 5, 32, 32, 1, 1, 0).indices, shader_vertex_source, shader_fragment_source);
    matahari.setup();

    var awan1 = new MyObject(createCuboidVertices(-20, 13, -5, 5, 1, 5,1, 1, 1), createCuboidIndices(), shader_vertex_source, shader_fragment_source);
    awan1.setup();

    var awan2 = new MyObject(createCuboidVertices(25, 12, -5, 5, 1, 5,1, 1, 1), createCuboidIndices(), shader_vertex_source, shader_fragment_source);
    awan2.setup();




    //ANIMATE
    GL.clearColor(0, 1, 1, 0.5);


    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    var time_prev = 0;
    var moveSpeed = 0.01; // Kecepatan pergerakan

    var animate = function (time) {
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);
        var dt = time - time_prev;
        time_prev = time;

        BABI_MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(BABI_MODEL_MATRIX, babiRotateX);
        LIBS.rotateY(BABI_MODEL_MATRIX, babiRotateY);
        LIBS.rotateZ(BABI_MODEL_MATRIX, babiRotateZ);
        LIBS.translateX(BABI_MODEL_MATRIX, babiTranslateX - 15);
        LIBS.translateY(BABI_MODEL_MATRIX, babiTranslateY);
        LIBS.translateZ(BABI_MODEL_MATRIX, babiTranslateZ);
        LIBS.scale(BABI_MODEL_MATRIX, babiScaleX, babiScaleY, babiScaleZ);

        KUNING_MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(KUNING_MODEL_MATRIX, kuningRotateX);
        LIBS.rotateX(paruhKuning.MODEL_MATRIX, kuningRotateX);
        LIBS.rotateY(KUNING_MODEL_MATRIX, kuningRotateY);
        LIBS.rotateZ(KUNING_MODEL_MATRIX, kuningRotateZ);
        LIBS.translateX(KUNING_MODEL_MATRIX, kuningTranslateX);
        LIBS.translateY(KUNING_MODEL_MATRIX, kuningTranslateY);
        LIBS.translateZ(KUNING_MODEL_MATRIX, kuningTranslateZ);
        LIBS.scale(KUNING_MODEL_MATRIX, Math.abs(kuningScaleX), Math.abs(kuningScaleY), Math.abs(kuningScaleZ));
        LIBS.translateX(KUNING_MODEL_MATRIX, 15)

        BIRU_MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(BIRU_MODEL_MATRIX, biruRotateX);
        LIBS.rotateY(BIRU_MODEL_MATRIX, biruRotateY);
        LIBS.rotateZ(BIRU_MODEL_MATRIX, biruRotateZ);
        LIBS.translateX(BIRU_MODEL_MATRIX, biruTranslateX);
        LIBS.translateY(BIRU_MODEL_MATRIX, biruTranslateY);
        LIBS.translateZ(BIRU_MODEL_MATRIX, biruTranslateZ);
        LIBS.scale(BIRU_MODEL_MATRIX, biruScaleX, biruScaleY, biruScaleZ);

        babi.MODEL_MATRIX = BABI_MODEL_MATRIX;
        mata_kiri.MODEL_MATRIX = BABI_MODEL_MATRIX;
        mata_kanan.MODEL_MATRIX = BABI_MODEL_MATRIX;
        hidung_babi.MODEL_MATRIX = BABI_MODEL_MATRIX;
        mataKiri.MODEL_MATRIX = BABI_MODEL_MATRIX;
        mataKanan.MODEL_MATRIX = BABI_MODEL_MATRIX;
        lubang_hidung_kiri.MODEL_MATRIX = BABI_MODEL_MATRIX;
        lubang_hidung_kanan.MODEL_MATRIX = BABI_MODEL_MATRIX;
        kuping_kiri.MODEL_MATRIX = BABI_MODEL_MATRIX;
        kuping_kanan.MODEL_MATRIX = BABI_MODEL_MATRIX;
        smile.MODEL_MATRIX = BABI_MODEL_MATRIX;
        telinga_kiri.MODEL_MATRIX = BABI_MODEL_MATRIX;
        telinga_kanan.MODEL_MATRIX = BABI_MODEL_MATRIX;
        alisBabiKanan.MODEL_MATRIX = BABI_MODEL_MATRIX;
        alisBabiKiri.MODEL_MATRIX = BABI_MODEL_MATRIX;


        //KUNING
        bodikuning.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        paruhKuning.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        matakuningkiri.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        matakuningkanan.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        aliskuningkanan.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        aliskuningkiri.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        pupilkuningkanan.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        pupilkuningkiri.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        rambutkuning1.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        rambutkuning2.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        rambutkuning3.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        bawahkuning.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        kakikuningkiri.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        kakikuningkanan.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        cekerkuningkanan.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        cekerkuningkiri.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        lengankuningkiri.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        lengankuningkanan.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        ekor1.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        ekor2.MODEL_MATRIX = KUNING_MODEL_MATRIX;
        ekor3.MODEL_MATRIX = KUNING_MODEL_MATRIX;

        // BIRU
        burungBiruBody.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruMataKanan.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruMataKiri.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruMataKananPupil.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruMataKiriPupil.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruParuh.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruKakiKanan.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruKakikiri.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruTanganKanan.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruTanganKiri.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruTelapakKanan.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruTelapakKiri.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruMataKananBelakang.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruMataKiriBelakang.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruJambul.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruJambul1.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        burungBiruJambul2.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        alisBiruKiri.MODEL_MATRIX = BIRU_MODEL_MATRIX;
        alisBiruKanan.MODEL_MATRIX = BIRU_MODEL_MATRIX;

        //cameramove
        // Handle keyboard input
        if (keys["ArrowDown"]) {
            LIBS.translateZ(VIEW_MATRIX, -moveSpeed * dt); // Mundurkan kamera
            LIBS.translateY(tanah.MODEL_MATRIX, moveSpeed * dt / 15);
        }
        if (keys["ArrowUp"]) {
            LIBS.translateZ(VIEW_MATRIX, moveSpeed * dt); // Majukan kamera
            LIBS.translateY(tanah.MODEL_MATRIX, -moveSpeed * dt / 15);
        }





        babi.render(VIEW_MATRIX, PROJECTION_MATRIX);
        tanah.render(VIEW_MATRIX, PROJECTION_MATRIX);
        matahari.render(VIEW_MATRIX, PROJECTION_MATRIX);
        awan1.render(VIEW_MATRIX, PROJECTION_MATRIX);
        awan2.render(VIEW_MATRIX, PROJECTION_MATRIX);
        bodikuning.render(VIEW_MATRIX, PROJECTION_MATRIX);
        burungBiruBody.render(VIEW_MATRIX, PROJECTION_MATRIX);
        handleKeys();

        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener('load', main);
