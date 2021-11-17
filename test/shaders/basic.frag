#version 330

void main() {

  gl_FragColor = vec4 (gl_PointCoord.x, 1.0, gl_PointCoord.y, 1.0 );

}
