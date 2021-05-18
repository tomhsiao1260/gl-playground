export default `

uniform float uTime;        // normalized progress time 
uniform sampler2D uTexture; // texture for particles
varying vec2 vUv;           // UV coordinate
varying float vBright;      // brightness

void main() {
    vec3 color = vec3(vUv, 1.0) * vBright;

    gl_FragColor  = texture2D(uTexture, gl_PointCoord);
    gl_FragColor *= vec4(color, 1.0);
}
`;
