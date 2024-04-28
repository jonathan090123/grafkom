function generateVerticalCylinderVertices(baseX, baseY, baseZ, xAxisRadius, zAxisRadius, cylinderHeight, red, green, blue) {
    const vertices = [];
  
    vertices.push(baseX);
    vertices.push(baseY);
    vertices.push(baseZ);
    vertices.push(red);
    vertices.push(green);
    vertices.push(blue);
  
    for (let degrees = 0; degrees <= 360; degrees++) {
      const radians = (degrees * Math.PI) / 180;
      const newX = baseX + Math.cos(radians) * xAxisRadius;
      const newY = baseY; // Tetap di alas
      const newZ = baseZ + Math.sin(radians) * zAxisRadius;
      vertices.push(newX);
      vertices.push(newY);
      vertices.push(newZ);
      vertices.push(red);
      vertices.push(green);
      vertices.push(blue);
    }
  
    vertices.push(baseX);
    vertices.push(baseY + cylinderHeight);
    vertices.push(baseZ);
    vertices.push(red);
    vertices.push(green);
    vertices.push(blue);
  
    for (let degrees = 0; degrees <= 360; degrees++) {
      const radians = (degrees * Math.PI) / 180;
      const newX = baseX + Math.cos(radians) * xAxisRadius;
      const newY = baseY + cylinderHeight;
      const newZ = baseZ + Math.sin(radians) * zAxisRadius;
      vertices.push(newX);
      vertices.push(newY);
      vertices.push(newZ);
      vertices.push(red);
      vertices.push(green);
      vertices.push(blue);
    }
  
    return vertices;
  }
  function generateZAxisCylinderVertices(
    startX, startY, startZ,
    xRadius, yRadius, height,
    red, green, blue
  ) {
    const vertices = [];
  
    vertices.push(startX, startY, startZ, red, green, blue);
  
    for (let degrees = 0; degrees <= 360; degrees++) {
      const radians = (degrees * Math.PI) / 180;
      const baseX = startX + Math.cos(radians) * xRadius;
      const baseY = startY + Math.sin(radians) * yRadius;
      const baseZ = startZ;
      
      vertices.push(baseX, baseY, baseZ, red, green, blue);
    }
  
    vertices.push(startX, startY, startZ + height, red, green, blue);
  
    for (let degrees = 0; degrees <= 360; degrees++) {
      const radians = (degrees * Math.PI) / 180;
      const topX = startX + Math.cos(radians) * xRadius;
      const topY = startY + Math.sin(radians) * yRadius;
      const topZ = startZ + height;
  
      vertices.push(topX, topY, topZ, red, green, blue);
    }
  
    return vertices;
  }
  function generateCylinderTriangleIndices() {
    const triangleIndices = [];
  
    for (let step = 0; step <= 360; step++) {
      triangleIndices.push(0);
      triangleIndices.push(step + 1);
      triangleIndices.push(step + 2);
    }
  
    for (let step = 362; step < 722; step++) {
      triangleIndices.push(362); 
      triangleIndices.push(step + 1);
      triangleIndices.push(step + 2);
    }
  
    for (let step = 1; step <= 361; step++) {
      triangleIndices.push(step);
      triangleIndices.push(360 + step);
      triangleIndices.push(361 + step);
  
      triangleIndices.push(361 + step); 
      triangleIndices.push(step);
      triangleIndices.push(step + 1);
    }
  
    return triangleIndices;
  }
  
  function sphere(x_awal, y_awal, z_awal, radius_x, radius_y, radius_z, latitudeBands, longitudeBands, r, g, b) {
    const vertex = [];
    const indices = [];
  
    for (let lat = 0; lat <= latitudeBands; lat++) {
      const theta = lat * Math.PI / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
  
      for (let long = 0; long <= longitudeBands; long++) {
        const phi = long * 2 * Math.PI / longitudeBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
  
        const xPosition = x_awal + radius_x * cosPhi * sinTheta;
        const yPosition = y_awal + radius_y * sinPhi * sinTheta;
        const zPosition = z_awal + radius_z * cosTheta;
  
        vertex.push(xPosition, yPosition, zPosition, r, g, b);
      }
    }
  
    for (let lat = 0; lat < latitudeBands; lat++) {
      for (let long = 0; long < longitudeBands; long++) {
        const first = (lat * (longitudeBands + 1)) + long;
        const second = first + longitudeBands + 1;
  
        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }
  
    return { vertex, indices };
  }
  
  function generateBSpline(controlPoint, m, degree) {
    var curves = [];
    var knotVector = [];
  
    var n = controlPoint.length / 6;
  
  
    // Calculate the knot values based on the degree and number of control points
    for (var i = 0; i < n + degree + 1; i++) {
      if (i < degree + 1) {
        knotVector.push(0);
      } else if (i >= n) {
        knotVector.push(n - degree);
      } else {
        knotVector.push(i - degree);
      }
    }
  
  
  
    var basisFunc = function (i, j, t) {
      if (j == 0) {
        if (knotVector[i] <= t && t < (knotVector[(i + 1)])) {
          return 1;
        } else {
          return 0;
        }
      }
  
      var den1 = knotVector[i + j] - knotVector[i];
      var den2 = knotVector[i + j + 1] - knotVector[i + 1];
  
      var term1 = 0;
      var term2 = 0;
  
  
      if (den1 != 0 && !isNaN(den1)) {
        term1 = ((t - knotVector[i]) / den1) * basisFunc(i, j - 1, t);
      }
  
      if (den2 != 0 && !isNaN(den2)) {
        term2 = ((knotVector[i + j + 1] - t) / den2) * basisFunc(i + 1, j - 1, t);
      }
  
      return term1 + term2;
    }
  
  
    for (var t = 0; t < m; t++) {
      var x = 0;
      var y = 0;
      var z = 0;
      var r = 0;
      var g = 0;
      var b = 0;
  
      var u = (t / m * (knotVector[controlPoint.length / 6] - knotVector[degree])) + knotVector[degree];
  
      //C(t)
      for (var key = 0; key < n; key++) {
  
        var C = basisFunc(key, degree, u);
        x += (controlPoint[key * 6] * C);
        y += (controlPoint[key * 6 + 1] * C);
        z += (controlPoint[key * 6 + 2] * C);
        r += (controlPoint[key * 6 + 3] * C);
        g += (controlPoint[key * 6 + 4] * C);
        b += (controlPoint[key * 6 + 5] * C);
      }
      curves.push(x);
      curves.push(y);
      curves.push(z);
      curves.push(r);
      curves.push(g);
      curves.push(b);
  
    }
    return curves;
  }
  function curve(titik_kontrol, jari_jari) {
    var totalPoints = 100
  
    var vertices = [];
    var indices = [];
    var points = generateBSpline(titik_kontrol, totalPoints, (titik_kontrol.length / 6) - 1);
  
    for (let i = 0; i < totalPoints * 2; i++) {
      for (let j = 0; j < 360; j++) {
        var angleInRadians = (j * Math.PI) / 180;
        var x_baru = points[i * 6] + Math.cos(angleInRadians) * jari_jari;
        var y_baru = points[i * 6 + 1] + Math.sin(angleInRadians) * jari_jari;
        var z_baru = points[i * 6 + 2];
        var r = points[i * 6 + 3]
        var g = points[i * 6 + 4]
        var b = points[i * 6 + 5]
        vertices.push(x_baru);
        vertices.push(y_baru);
        vertices.push(z_baru);
        vertices.push(r);
        vertices.push(g);
        vertices.push(b);
      }
    }
    for (let i = 0; i < totalPoints * 2; i++) {
      for (let j = 0; j < 360; j++) {
        indices.push(j + (i * 360));
        indices.push(j + 360 + (i * 360));
        indices.push(j + 361 + (i * 360));
  
        indices.push(j + (i * 360));
        indices.push(j + 1 + (i * 360));
        indices.push(j + 361 + (i * 360));
      }
    }
  
    return { vertices, indices };
  }
  function createCuboidVertices(
    startX, startY, startZ, 
    width, depth, height, 
    red, green, blue
  ) {
    const vertices = [];
  
    // Alas depan balok
    vertices.push(startX, startY, startZ, red, green, blue);
    vertices.push(startX + width, startY, startZ, red, green, blue);
    vertices.push(startX + width, startY + height, startZ, red, green, blue);
    vertices.push(startX, startY + height, startZ, red, green, blue);
  
    // Alas belakang balok
    vertices.push(startX, startY, startZ - depth, red, green, blue);
    vertices.push(startX + width, startY, startZ - depth, red, green, blue);
    vertices.push(startX + width, startY + height, startZ - depth, red, green, blue);
    vertices.push(startX, startY + height, startZ - depth, red, green, blue);
  
    return vertices;
  }
  
  //Balok
  function createCuboidIndices() {
    const indices = [];
  
    //  depan
    indices.push(3, 2, 7); 
    indices.push(2, 6, 7); 
    //  belakang
    indices.push(0, 1, 4); 
    indices.push(1, 4, 5); 
    //  kanan
    indices.push(1, 2, 5); 
    indices.push(2, 5, 6); 
    //  kiri
    indices.push(4, 5, 6); 
    indices.push(4, 6, 7); 
    //  atas
    indices.push(3, 0, 4); 
    indices.push(3, 4, 7); 
    //  bawah
    indices.push(0, 1, 2); 
    indices.push(2, 0, 3); 
    return indices;
  }
  
  
  
  function ElipticParaboloid(radius, segments, capSegments, xoff, yoff, zoff,r,g,b) {
    const vertices = [];
    const indices = [];
  
    for (let i = 0; i <= segments; i++) {
      //v
      const lat = Math.PI * i / segments;
      const sinLat = Math.sin(lat);
      const cosLat = Math.cos(lat);
  
      for (let j = 0; j <= segments; j++) {
        //u
        const lng = 2 * Math.PI * j / segments;
        const sinLng = Math.sin(lng);
        const cosLng = Math.cos(lng);
        const tanLng = Math.tan(lng);
        const secLng = 1 / Math.cos(lng);
  
  
        const x = lat * cosLng;
        const y = -(lat * lat);
        const z = lat * sinLng;
  
        vertices.push(radius * x + xoff, radius * y + yoff, radius * z + zoff,r,g,b);
  
        if (i < segments && j < segments) {
          let first = i * (segments + 1) + j;
          let second = first + segments + 1;
  
          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
        }
      }
    }
  
    const start = vertices.length / 3;
    for (let i = 0; i <= capSegments; i++) {
      const lat = Math.PI * i / segments;
      const sinLat = Math.sin(lat);
      const cosLat = Math.cos(lat);
  
      for (let j = 0; j <= segments; j++) {
        const lng = 2 * Math.PI * j / segments;
        const sinLng = Math.sin(lng);
        const cosLng = Math.cos(lng);
        const tanLng = Math.tan(lng);
        const secLng = 1 / Math.cos(lng);
  
        const x = lat * cosLng;
        const y = lat * sinLng;
        const z = lat * lat;
        vertices.push(radius * x + xoff, radius * y + yoff, radius * z + zoff, r,g,b);
  
        if (i < capSegments && j < segments) {
          let first = start + i * (segments + 1) + j;
          let second = first + segments + 1;
  
          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
        }
      }
    }
  
    return { vertices, indices };
  }
  
  
  function ElipticCone(radius, segments, capSegments, xoff, yoff, zoff, r, g, b) {
    const vertices = [];
    const indices = [];
  
    for (let i = 0; i <= segments; i++) {
        //v
        const lat = Math.PI * i / segments;
        const sinLat = Math.sin(lat);
        const cosLat = Math.cos(lat);
  
        for (let j = 0; j <= segments; j++) {
            //u
            const lng = 2 * Math.PI * j / segments;
            const sinLng = Math.sin(lng);
            const cosLng = Math.cos(lng);
            const tanLng = Math.tan(lng);
            const secLng = 1/Math.cos(lng);
  
  
            const x = lat * cosLng;
            const y = lat*sinLng;
            const z = -lat;
  
            vertices.push(radius * x+xoff, radius * y+yoff, radius * z+zoff, r, g, b);
  
            if (i < segments && j < segments) {
                let first = i * (segments + 1) + j;
                let second = first + segments + 1;
  
                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }
    }
  
    const start = vertices.length / 3;
    for (let i = 0; i <= capSegments; i++) {
        const lat = Math.PI * i / segments;
        const sinLat = Math.sin(lat);
        const cosLat = Math.cos(lat);
  
        for (let j = 0; j <= segments; j++) {
            const lng = 2 * Math.PI * j / segments;
            const sinLng = Math.sin(lng);
            const cosLng = Math.cos(lng);
            const tanLng = Math.tan(lng);
            const secLng = 1/Math.cos(lng);
  
  
            const x = lat * cosLng;
            const y = lat*sinLng;
            const z = lat;
  
            vertices.push(radius * x+xoff, radius * y+yoff, radius * z+zoff, r, g, b);
  
            if (i < capSegments && j < segments) {
                let first = start + i * (segments + 1) + j;
                let second = first + segments + 1;
  
                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }
    }
  
    return { vertices, indices };
  }
  
  function buatConeVertices(tipX, tipY, tipZ, baseX, baseY, baseZ, radius, r, g, b) {
    const vertices = [];
  
    // Add the tip vertex
    vertices.push(tipX, tipY, tipZ, r, g, b);
  
    // Create vertices around the base
    for (let i = 0; i < 360; i++) {
      const angleInRadians = (i * Math.PI) / 180;
      const baseVertexX = baseX + Math.cos(angleInRadians) * radius;
      const baseVertexY = baseY + Math.sin(angleInRadians) * radius;
      vertices.push(baseVertexX, baseVertexY, baseZ, r, g, b);
    }
  
    // Add the center of the base
    vertices.push(baseX, baseY, baseZ, r, g, b);
  
    return vertices;
  }
  
  function buatConeIndices() {
    const indices = [];
    for (let i = 0; i < 360; i++) {
      indices.push(0, i + 1, i + 2);
    }
    for (let i = 1; i <= 360; i++) {
      indices.push(i, i + 1, 361);
    }
    return indices;
  }
  
  function vertical3DCurve(titik_kontrol, jari_jari) {
    var totalPoints = 100
  
    var vertices = [];
    var indices = [];
    var points = generateBSpline(titik_kontrol, totalPoints, (titik_kontrol.length / 6) - 1);
  
    for (let i = 0; i < totalPoints * 2; i++) {
      for (let j = 0; j < 360; j++) {
        var angleInRadians = (j * Math.PI) / 180;
        var x_baru = points[i * 6] + Math.cos(angleInRadians) * jari_jari;
        var y_baru = points[i * 6 + 1];
        var z_baru = points[i * 6 + 2] + Math.sin(angleInRadians) * jari_jari;
        var r = points[i * 6 + 3]
        var g = points[i * 6 + 4]
        var b = points[i * 6 + 5]
        vertices.push(x_baru);
        vertices.push(y_baru);
        vertices.push(z_baru);
        vertices.push(r);
        vertices.push(g);
        vertices.push(b);
      }
    }
    for (let i = 0; i < totalPoints * 2; i++) {
      for (let j = 0; j < 360; j++) {
        indices.push(j + (i * 360));
        indices.push(j + 360 + (i * 360));
        indices.push(j + 361 + (i * 360));
  
        indices.push(j + (i * 360));
        indices.push(j + 1 + (i * 360));
        indices.push(j + 361 + (i * 360));
      }
    }
  
    return { vertices, indices };
  }
