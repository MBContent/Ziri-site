// Homepage 3D ambient scene — brand colors, floating toy shapes
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  let W = canvas.clientWidth, H = canvas.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W/H, 0.1, 100);
  camera.position.set(0, 0, 12);

  const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);
  canvas.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const d = new THREE.DirectionalLight(0xffffff, 0.5);
  d.position.set(4, 6, 8); scene.add(d);

  // Brand colors: red, deep red, green, deep green
  const palette = [0xE42424, 0xEDB917, 0x7BB5CD, 0x48A83C];

  const geos = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(.7, 14, 14),
    new THREE.TorusGeometry(.6, .22, 10, 20),
    new THREE.CylinderGeometry(.5, .5, 1, 8)
  ];

  const shapes = [];
  for (let i = 0; i < 18; i++) {
    const geo = geos[i % geos.length];
    const mat = new THREE.MeshStandardMaterial({
      color: palette[i % palette.length],
      roughness: .45, metalness: .1
    });
    const m = new THREE.Mesh(geo, mat);
    const angle = Math.random() * Math.PI * 2;
    const r = 4 + Math.random() * 6;
    m.position.set(
      Math.cos(angle) * r,
      (Math.random() - .5) * 8,
      (Math.random() - .5) * 6 - 3
    );
    m.scale.setScalar(.35 + Math.random() * .55);
    m.userData = {
      sy: (Math.random()-.5)*.008,
      sx: (Math.random()-.5)*.006,
      fy: Math.random() * Math.PI * 2,
      fs: .3 + Math.random() * .4,
      by: m.position.y
    };
    scene.add(m); shapes.push(m);
  }

  let tx = 0, ty = 0;
  if (!reduce) {
    window.addEventListener('mousemove', e => {
      tx = (e.clientX/innerWidth - .5) * .3;
      ty = -(e.clientY/innerHeight - .5) * .2;
    });
  }

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    if (!reduce) {
      shapes.forEach(m => {
        m.rotation.x += m.userData.sx;
        m.rotation.y += m.userData.sy;
        m.position.y = m.userData.by + Math.sin(t * m.userData.fs + m.userData.fy) * .35;
      });
      camera.rotation.x += (ty - camera.rotation.x) * .04;
      camera.rotation.y += (tx - camera.rotation.y) * .04;
    }
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    W = canvas.clientWidth; H = canvas.clientHeight;
    if (!W||!H) return;
    camera.aspect = W/H; camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });
});
