precision mediump float;

uniform float vpw; // Width, in pixels
uniform float vph; // Height, in pixels

uniform vec2 pitch;  // e.g. [50 50]

uniform vec4 line_color;

uniform float width;
uniform float height;

uniform vec2 pos;

void main() {

  float offX = gl_FragCoord.x;
  float offY = (pos.y) - (gl_FragCoord.y - vph);

  //float minusOffY = vph*(20.0/600.0);

  if ((int(mod(offX, pitch[0])) == 0 ||
      int(mod(offY, pitch[1])) == 0)) {
    gl_FragColor = line_color;
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
  
}