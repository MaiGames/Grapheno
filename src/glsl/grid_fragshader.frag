precision mediump float;

uniform float vpw; // Width, in pixels
uniform float vph; // Height, in pixels

uniform vec2 pitch;  // e.g. [50 50]

uniform vec4 line_color;

uniform vec2 position;

uniform float width;
uniform float height;

uniform vec4 border_color;

uniform float border_size;

void main() {

  /*
  * Weird fixes, since the fragCoord position is global, not relative
  * to the rect, this causes the grid to move weirdly when we resize
  * the window, change the position and size of the rect and so on.
  * This seems like the definitive solution so far, finally...
  */
  float offX = position.x - gl_FragCoord.x;
  float offY = position.y - (vph - gl_FragCoord.y);

  if ((int(mod(offX, pitch[0])) == 0 ||
      int(mod(offY, pitch[1])) == 0))
    gl_FragColor = line_color;
  else
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);

  //border calculation part, also with the weird fixes :)
  float min_x = position.x + border_size;
  float max_x = position.x + (width - border_size);

  float min_y = position.y + border_size;
  float max_y = position.y + (height - border_size);

  if( gl_FragCoord.x <= min_x || gl_FragCoord.x >= max_x ||
    (vph - gl_FragCoord.y) <= min_y || (vph - gl_FragCoord.y) >= max_y )

    gl_FragColor = border_color;

}