// Initialize Matter.js modules
const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Vector } = Matter;

const I18N = {
  ko: {
    app_title: "골드버그 노돈 빌더",
    btn_play: "실행", btn_reset: "초기화", btn_clear: "전체 삭제", btn_manual: "설명서",
    cat_phys: "물리 노돈", cat_logic: "논리 노돈",
    nodon_ball: "공", nodon_ramp: "경사로", nodon_box: "상자", nodon_floor: "바닥", nodon_goal: "골인 지점",
    nodon_spring: "스프링", nodon_treadmill: "컨베이어", nodon_breakable: "부서지는 상자", nodon_balloon: "풍선",
    nodon_sensor: "터치 센서", nodon_fan: "강풍기", nodon_timer: "타이머", nodon_warp_a: "워프 입구 (A)", nodon_warp_b: "워프 출구 (B)", nodon_magnet: "자석", nodon_counter: "카운터",
    settings_title: "환경 설정", label_language: "언어 선택", label_theme: "테마 설정",
    manual_title: "📖 노돈 가이드북",
    success_title: "성공!", success_msg: "정말 멋진 장치예요!",
    nav_editor: "빌더", nav_guide: "가이드", nav_encyclo: "백과사전", nav_physics: "물리 원리",
    guide_title: "🛠️ 골드버그 장치 제작 가이드",
    guide_intro_long: "골드버그 장치(Rube Goldberg Machine)는 아주 단순한 작업을 수행하기 위해 고안된 가장 복잡하고 비효율적인 기계입니다. 하지만 그 과정에는 물리 법칙의 정수와 창의적인 문제 해결 능력이 담겨 있습니다. 본 빌더를 통해 여러분은 엔지니어가 되어 자신만의 연쇄 반응을 설계할 수 있습니다.",
    guide_step1_desc_long: "모든 기계의 시작은 중력입니다. 왼쪽 팔레트에서 '공'과 '경사로'를 드래그하여 배치해보세요. 공이 중력에 의해 굴러내려가는 아주 기본적인 단계가 당신의 거대한 프로젝트의 첫 걸음이 됩니다.",
    guide_step2_desc_long: "단순한 물리 충돌을 넘어, '센서'와 '팬'을 연결해보세요. Shift 키를 누른 채 센서의 출력(빨간 점)에서 팬의 입력(노란 점)으로 드래그하면 논리적인 연결이 완성됩니다. 이제 공이 센서를 지날 때마다 팬이 돌아가 공을 더 멀리 날려 보낼 것입니다.",
    guide_step3_desc_long: "한 번에 성공하는 설계는 없습니다. 재생 버튼을 눌러 시뮬레이션을 실행하고, 어느 지점에서 공이 멈추는지 관찰하세요. 각도를 미세하게 조정하고 탄성 수치를 조절하며 완벽한 연쇄 반응을 완성해가는 과정 자체가 훌륭한 물리 실험입니다.",
    encyclo_title: "📚 노돈 백과사전: 모든 부품의 이해",
    encyclo_intro: "각 노돈은 고유한 물리적 특성과 논리적 역할을 가집니다. 이를 깊이 이해할수록 더욱 정교한 장치를 만들 수 있습니다.",
    ball_long_desc: "골드버그 장치의 가장 핵심적인 주인공입니다. 질량과 반지름을 가지며, 중력 가속도의 영향을 받아 포물선 운동을 합니다. 다른 물체와의 충돌 시 운동량을 전달하며 연쇄 반응의 도화선 역할을 합니다.",
    warp_long_desc: "공간의 제약을 뛰어넘는 장치입니다. A 입구로 들어온 물체는 그 즉시 B 출구로 전송됩니다. 복잡한 맵 디자인에서 경로를 단순화하거나, 예상치 못한 위치에서 공이 튀어나오게 하는 트릭을 설계할 때 필수적입니다.",
    sensor_long_desc: "눈에 보이지 않는 감시자입니다. 설정된 영역 내에 물체가 들어오면 즉시 논리 신호를 발생시킵니다. 이 신호는 타이머를 작동시키거나 팬을 돌리는 등 장치에 '지능'을 부여하는 핵심 부품입니다.",
    fan_long_desc: "공기의 흐름을 제어합니다. 논리 신호를 받으면 설정된 방향으로 강한 힘을 내뿜습니다. 공을 공중에 띄우거나, 멀리 있는 상자를 밀어뜨리는 등 물리적 거리를 극복하게 해주는 강력한 도구입니다.",
    physics_title: "🎓 STEM: 골드버그 장치 속 물리 원리",
    phys_gravity_desc_long: "높은 곳에 있는 공은 위치 에너지를 가집니다. 중력은 이 에너지를 운동 에너지로 변환시키며 공을 아래로 가속시킵니다. 본 빌더는 지구의 중력 가속도를 정밀하게 시뮬레이션하여 실제와 같은 낙하 운동을 구현합니다.",
    phys_momentum_desc_long: "굴러가는 공이 정지한 상자에 부딪히면, 공의 운동량 일부가 상자로 전달됩니다. 질량과 속도의 곱으로 정의되는 이 물리량은 연쇄 반응이 끊기지 않고 이어지게 만드는 가장 중요한 동력입니다.",
    phys_elasticity_desc_long: "물체가 충돌할 때 모든 에너지가 보존되지는 않습니다. '탄성 계수(Restitution)' 설정을 통해 얼마나 많은 에너지가 보존되어 튕겨 나갈지 조절할 수 있습니다. 이는 실제 공학 설계에서 마찰과 저항을 고려하는 과정과 유사합니다.",
    footer_tagline: "창의적인 엔지니어링과 재미있는 물리 시뮬레이션의 만남.",
    footer_nav_title: "탐색", footer_legal_title: "법적 고지", nav_privacy: "개인정보처리방침", nav_terms: "이용약관",
    privacy_title: "개인정보처리방침",
    terms_title: "이용약관"
  },
  en: {
    app_title: "Goldberg Nodon Builder",
    btn_play: "Play", btn_reset: "Reset", btn_clear: "Clear All", btn_manual: "Manual",
    cat_phys: "Physical Nodons", cat_logic: "Logical Nodons",
    nodon_ball: "Ball", nodon_ramp: "Ramp", nodon_box: "Box", nodon_floor: "Floor", nodon_goal: "Goal",
    nodon_spring: "Spring", nodon_treadmill: "Treadmill", nodon_breakable: "Breakable Box", nodon_balloon: "Balloon",
    nodon_sensor: "Sensor", nodon_fan: "Fan", nodon_timer: "Timer", nodon_warp_a: "Warp A", nodon_warp_b: "Warp B", nodon_magnet: "Magnet", nodon_counter: "Counter",
    settings_title: "Settings", label_language: "Language", label_theme: "Theme",
    manual_title: "📖 Nodon Guidebook",
    success_title: "Success!", success_msg: "Amazing Contraption!",
    nav_editor: "Builder", nav_guide: "Guide", nav_encyclo: "Encyclopedia", nav_physics: "Physics",
    guide_title: "🛠️ Goldberg Construction Guide",
    guide_intro_long: "A Rube Goldberg machine is a complex contraption designed to perform a simple task. It embodies physics principles and creative problem-solving. Use this builder to design your own chain reactions as an engineer.",
    guide_step1_desc_long: "Everything starts with gravity. Drag and drop 'Ball' and 'Ramp' from the palette. This basic step of a ball rolling down is the foundation of your grand project.",
    guide_step2_desc_long: "Go beyond collisions by connecting 'Sensors' and 'Fans'. Hold Shift and drag from the output (red) to input (yellow) to create logic. Now the fan will push the ball further whenever it passes the sensor.",
    guide_step3_desc_long: "No design succeeds on the first try. Press play, observe where the ball stops, and refine your angles and elasticity. This iterative process is a genuine physics experiment.",
    encyclo_title: "📚 Nodon Encyclopedia: Understanding Components",
    encyclo_intro: "Each Nodon has unique physical properties and logical roles. Understanding them deeply allows for more sophisticated contraptions.",
    ball_long_desc: "The core protagonist of any Goldberg machine. It has mass and radius, moving in a parabolic path under gravity. It transfers momentum upon collision, acting as the fuse for chain reactions.",
    warp_long_desc: "A device that transcends spatial limits. Objects entering Entrance A are instantly transmitted to Exit B. Essential for simplifying complex paths or creating surprising tricks.",
    sensor_long_desc: "An invisible observer that generates logic signals when objects enter its zone. It's the brain component that triggers timers or powers fans, giving 'intelligence' to your machine.",
    fan_long_desc: "Controls airflow to exert force in a set direction. It can lift balls into the air or push distant boxes, acting as a powerful tool to overcome physical distances.",
    physics_title: "🎓 STEM: Physics of Goldberg Machines",
    phys_gravity_desc_long: "Balls at a height possess potential energy. Gravity converts this into kinetic energy, accelerating the ball downwards. This builder precisely simulates Earth's gravity for realistic motion.",
    phys_momentum_desc_long: "When a rolling ball hits a static box, part of its momentum is transferred. This quantity, defined by mass times velocity, is the primary driver keeping the chain reaction alive.",
    phys_elasticity_desc_long: "Not all energy is conserved during collisions. The 'Restitution' setting controls how much energy is kept for bouncing, mimicking real-world friction and resistance in engineering.",
    footer_tagline: "Where creative engineering meets fun physics simulation.",
    footer_nav_title: "Explore", footer_legal_title: "Legal", nav_privacy: "Privacy Policy", nav_terms: "Terms",
    privacy_title: "Privacy Policy",
    terms_title: "Terms"
  }
};

class GoldbergApp {
  constructor() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.isPlaying = false;
    this.nodons = [];
    this.connections = [];
    this._selectedNodon = null;
    this.lang = 'ko';
    this.theme = 'default';
    this.hoveredNodon = null;
    this.isWiring = false;
    this.wireStartPort = null;
    this.goalReached = false;

    this.initCanvas();
    this.initControls();
    this.initDragAndDrop();
    this.initEvents();
    this.initSettings();
    this.initManual();
    this.initLegal();
    this.initSmoothScroll();
    this.initNavigation();
    this.applyLanguage();
    
    this.animate();
  }

  get selectedNodon() { return this._selectedNodon; }
  set selectedNodon(val) {
    this._selectedNodon = val;
    this.updateSettingsPanel();
  }

  initCanvas() {
    const container = document.getElementById('physics-canvas');
    if (!container) return;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    this.render = Render.create({
      element: container,
      engine: this.engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio || 1
      }
    });

    Render.run(this.render);
    this.runner = Runner.create();
    
    const mouse = Mouse.create(this.render.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(this.world, this.mouseConstraint);

    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      this.render.canvas.width = w;
      this.render.canvas.height = h;
      this.render.options.width = w;
      this.render.options.height = h;
      Mouse.setOffset(mouse, { x: 0, y: 0 });
    });
    resizeObserver.observe(container);
  }

  initNavigation() {
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    window.addEventListener('scroll', () => {
      let current = '';
      const sections = ['app', 'guide-section', 'nodon-encyclopedia', 'physics-section'];
      sections.forEach(s => {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) current = s;
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) link.classList.add('active');
      });
    });
  }

  initDragAndDrop() {
    const sidebarItems = document.querySelectorAll('.nodon-item');
    const dropZone = document.getElementById('canvas-container');
    const physicsCanvas = document.getElementById('physics-canvas');

    sidebarItems.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', item.dataset.type);
        e.dataTransfer.effectAllowed = 'copy';
      });
    });

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    };

    if (dropZone) dropZone.addEventListener('dragover', handleDragOver);
    if (physicsCanvas) physicsCanvas.addEventListener('dragover', handleDragOver);

    if (dropZone) {
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        if (!type) return;

        const rect = physicsCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.addNodon(type, x, y);
      });
    }
  }

  initControls() {
    const btnPlay = document.getElementById('btn-play');
    const btnReset = document.getElementById('btn-reset');
    const btnClear = document.getElementById('btn-clear');
    const nodeDelete = document.getElementById('node-delete');

    if (btnPlay) btnPlay.onclick = () => {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) Runner.run(this.runner, this.engine);
      else Runner.stop(this.runner);
      this.applyLanguage();
    };

    if (btnReset) btnReset.onclick = () => this.resetSimulation();
    if (btnClear) btnClear.onclick = () => this.clearAll();
    
    this.panel = document.getElementById('settings-panel');
    if (nodeDelete) nodeDelete.onclick = () => this.removeNodon(this.selectedNodon);
    
    this.inputs = {
      restitution: document.getElementById('input-restitution'),
      delay: document.getElementById('input-delay'),
      power: document.getElementById('input-power')
    };
    
    if (this.inputs.restitution) this.inputs.restitution.oninput = (e) => { if (this.selectedNodon) this.selectedNodon.body.restitution = parseFloat(e.target.value); };
    if (this.inputs.delay) this.inputs.delay.oninput = (e) => { if (this.selectedNodon) this.selectedNodon.delay = parseFloat(e.target.value) * 1000; };
    if (this.inputs.power) this.inputs.power.oninput = (e) => { if (this.selectedNodon) this.selectedNodon.power = parseFloat(e.target.value); };
  }

  addNodon(type, x, y) {
    const id = Date.now();
    const color = this.getNodonColor(type);
    let body;
    const common = { label: id.toString(), render: { fillStyle: color, strokeStyle: '#2F3542', lineWidth: 3 } };
    
    switch(type) {
      case 'ball': body = Bodies.circle(x, y, 15, { ...common, friction: 0.005, restitution: 0.6 }); break;
      case 'ramp': body = Bodies.rectangle(x, y, 180, 25, { ...common, angle: Math.PI / 8, isStatic: true }); break;
      case 'box': body = Bodies.rectangle(x, y, 55, 55, common); break;
      case 'floor': body = Bodies.rectangle(x, y, 350, 30, { ...common, isStatic: true }); break;
      case 'goal': body = Bodies.rectangle(x, y, 80, 50, { ...common, isStatic: true, isSensor: true }); break;
      case 'spring': body = Bodies.rectangle(x, y, 80, 25, { ...common, isStatic: true }); break;
      case 'treadmill': body = Bodies.rectangle(x, y, 160, 35, { ...common, isStatic: true }); break;
      case 'breakable': body = Bodies.rectangle(x, y, 50, 50, { ...common, friction: 0.3 }); break;
      case 'balloon': body = Bodies.circle(x, y, 30, { ...common, frictionAir: 0.1 }); break;
      case 'fan': body = Bodies.circle(x, y, 35, { ...common, isStatic: true }); break;
      case 'sensor': body = Bodies.rectangle(x, y, 70, 70, { ...common, isStatic: true, isSensor: true }); break;
      case 'timer': body = Bodies.circle(x, y, 35, { ...common, isStatic: true, isSensor: true }); break;
      case 'warp-a': case 'warp-b': body = Bodies.circle(x, y, 35, { ...common, isStatic: true, isSensor: true }); break;
      case 'magnet': body = Bodies.circle(x, y, 40, { ...common, isStatic: true, isSensor: true }); break;
      case 'counter': body = Bodies.rectangle(x, y, 65, 65, { ...common, isStatic: true }); break;
    }

    if (body) {
      Composite.add(this.world, body);
      const nodon = { id, type, body, initialPos: { x, y }, initialAngle: body.angle, power: 0.07, delay: 1000, count: 0, isActive: false };
      this.nodons.push(nodon);
      this.selectedNodon = nodon;
      if (!this.isPlaying) Engine.update(this.engine, 16);
    }
  }

  initEvents() {
    Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => this.handleCollisions(pair.bodyA, pair.bodyB));
    });

    const canvas = this.render.canvas;
    if (canvas) {
      canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const clickedBody = Matter.Query.point(Composite.allBodies(this.world), mousePos)[0];
        this.selectedNodon = clickedBody ? this.nodons.find(n => n.body === clickedBody) : null;
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!this.selectedNodon) return;
      if (e.key.toLowerCase() === 'r') {
        Matter.Body.setAngle(this.selectedNodon.body, this.selectedNodon.body.angle + Math.PI / 8);
        this.selectedNodon.initialAngle = this.selectedNodon.body.angle;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') this.removeNodon(this.selectedNodon);
    });

    Events.on(this.engine, 'beforeUpdate', () => {
      if (!this.isPlaying) return;
      this.nodons.forEach(n => {
        if (n.type === 'treadmill') {
          const bodies = Composite.allBodies(this.world);
          bodies.forEach(b => {
            if (b !== n.body && Matter.Bounds.overlaps(b.bounds, n.body.bounds)) {
              Matter.Body.translate(b, { x: Math.cos(n.body.angle) * n.power * 2, y: Math.sin(n.body.angle) * n.power * 2 });
            }
          });
        }
        if (n.type === 'balloon') Matter.Body.applyForce(n.body, n.body.position, { x: 0, y: -0.0015 });
      });
    });
  }

  handleCollisions(bodyA, bodyB) {
    const nA = this.nodons.find(n => n.body === bodyA);
    const nB = this.nodons.find(n => n.body === bodyB);
    if (!nA || !nB) return;

    if (nA.type === 'sensor' || nA.type === 'timer') this.triggerNodonLogic(nA, nB.body);
    if (nB.type === 'sensor' || nB.type === 'timer') this.triggerNodonLogic(nB, nA.body);
    if (nA.type === 'spring') this.applySpring(nA, nB.body);
    if (nB.type === 'spring') this.applySpring(nB, nA.body);
    if (nA.type === 'warp-a' && nB.type === 'ball') this.teleport(nB.body, 'warp-b');
    if (nB.type === 'warp-a' && nA.type === 'ball') this.teleport(nA.body, 'warp-b');
    if ((nA.type === 'goal' && nB.type === 'ball') || (nB.type === 'goal' && nA.type === 'ball')) this.reachGoal();
  }

  triggerNodonLogic(sensor, targetBody) {
    const run = () => {
      this.connections.filter(c => c.fromId === sensor.id).forEach(c => {
        const target = this.nodons.find(n => n.id === c.toId);
        if (target && target.type === 'fan') {
          Matter.Body.applyForce(targetBody, targetBody.position, { x: Math.cos(target.body.angle) * target.power, y: Math.sin(target.body.angle) * target.power });
          target.isActive = true; setTimeout(() => target.isActive = false, 300);
        }
      });
    };
    if (sensor.type === 'timer') setTimeout(run, sensor.delay);
    else run();
  }

  applySpring(spring, body) {
    const angle = spring.body.angle - Math.PI/2;
    Matter.Body.applyForce(body, body.position, { x: Math.cos(angle) * spring.power, y: Math.sin(angle) * spring.power });
    spring.isActive = true; setTimeout(() => spring.isActive = false, 250);
  }

  teleport(body, targetType) {
    const target = this.nodons.find(n => n.type === targetType);
    if (target) {
      Matter.Body.setPosition(body, { x: target.body.position.x, y: target.body.position.y });
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
    }
  }

  reachGoal() {
    if (this.goalReached) return;
    this.goalReached = true;
    const msg = document.getElementById('success-msg');
    if (msg) msg.classList.add('show');
    setTimeout(() => { if (msg) msg.classList.remove('show'); this.goalReached = false; }, 5000);
  }

  animate() {
    const svg = document.getElementById('wiring-layer');
    if (svg) {
      svg.innerHTML = '';
      this.drawWires();
      this.drawPorts();
      this.drawNodonSkins();
    }
    requestAnimationFrame(() => this.animate());
  }

  drawNodonSkins() {
    const time = Date.now();
    this.nodons.forEach(nodon => {
      const { x, y } = nodon.body.position;
      const angle = nodon.body.angle;
      const svg = document.getElementById('wiring-layer');
      if (!svg) return;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${x},${y}) rotate(${angle * 180 / Math.PI})`);
      const isLogic = ['sensor', 'timer', 'fan', 'warp-a', 'warp-b', 'magnet', 'counter'].includes(nodon.type);
      this.addFaceToGroup(g, isLogic ? 7 : 5, isLogic ? 12 : 8, time, this.selectedNodon === nodon, nodon.isActive);
      svg.appendChild(g);
    });
  }

  addFaceToGroup(g, size, offset, time, selected, active) {
    const isBlinking = (Math.floor(time / 100) % 60 === 0);
    [ -offset, offset ].forEach(ox => {
      if (isBlinking) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', ox - size); line.setAttribute('y1', -3); line.setAttribute('x2', ox + size); line.setAttribute('y2', -3);
        line.setAttribute('stroke', '#2F3542'); line.setAttribute('stroke-width', '3'); g.appendChild(line);
      } else {
        const w = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        w.setAttribute('cx', ox); w.setAttribute('cy', -3); w.setAttribute('r', size); w.setAttribute('fill', 'white');
        w.setAttribute('stroke', '#2F3542'); w.setAttribute('stroke-width', '1'); g.appendChild(w);
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        p.setAttribute('cx', ox); p.setAttribute('cy', -3); p.setAttribute('r', size / 2); p.setAttribute('fill', '#2F3542'); g.appendChild(p);
      }
    });
    const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const mh = active ? size * 2 : 2;
    mouth.setAttribute('d', `M ${-size*1.5} 8 Q 0 ${8+mh} ${size*1.5} 8`);
    mouth.setAttribute('stroke', '#2F3542'); mouth.setAttribute('fill', active ? '#2F3542' : 'none'); mouth.setAttribute('stroke-width', '2');
    g.appendChild(mouth);
  }

  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer');
    if (!svg) return;
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '10');
    c.style.fill = type === 'output' ? '#ff4757' : '#fed330';
    c.style.stroke = '#2f3542'; c.style.strokeWidth = '2'; c.style.pointerEvents = 'auto'; c.style.cursor = 'crosshair';
    c.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      if (type === 'output') { this.isWiring = true; this.wireStartPort = { nodon, x, y }; }
      else if (this.isWiring) { this.connections.push({ fromId: this.wireStartPort.nodon.id, toId: nodon.id }); this.isWiring = false; }
    });
    svg.appendChild(c);
  }

  drawPorts() {
    if (this.isPlaying) return;
    this.nodons.forEach(n => {
      if (['sensor', 'timer', 'counter'].includes(n.type)) this.createPort(n, n.body.position.x + 40, n.body.position.y, 'output');
      if (['fan', 'timer', 'counter'].includes(n.type)) this.createPort(n, n.body.position.x - 40, n.body.position.y, 'input');
    });
  }

  drawWires() {
    const svg = document.getElementById('wiring-layer');
    if (!svg) return;
    this.connections.forEach(conn => {
      const f = this.nodons.find(n => n.id === conn.fromId), t = this.nodons.find(n => n.id === conn.toId);
      if (f && t) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const p1 = { x: f.body.position.x + 40, y: f.body.position.y }, p2 = { x: t.body.position.x - 40, y: t.body.position.y };
        path.setAttribute('d', `M ${p1.x} ${p1.y} C ${p1.x+40} ${p1.y} ${p2.x-40} ${p2.y} ${p2.x} ${p2.y}`);
        path.setAttribute('stroke', '#4a90e2'); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '5');
        svg.appendChild(path);
      }
    });
    if (this.isWiring) {
      const p1 = this.wireStartPort, p2 = this.mouseConstraint.mouse.position;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`);
      path.setAttribute('stroke', '#ff4757'); path.setAttribute('stroke-dasharray', '5,5'); path.setAttribute('fill', 'none');
      svg.appendChild(path);
    }
  }

  applyLanguage() {
    document.querySelectorAll('[data-lang]').forEach(el => {
      const key = el.dataset.lang;
      if (I18N[this.lang][key]) el.textContent = I18N[this.lang][key];
    });
    this.updateSettingsPanel();
    lucide.createIcons();
  }

  updateSettingsPanel() {
    if (!this.selectedNodon || !this.panel) { if (this.panel) this.panel.classList.add('hidden'); return; }
    this.panel.classList.remove('hidden');
    const nameKey = `nodon_${this.selectedNodon.type.replace('-', '_')}`;
    const nodeName = document.getElementById('node-name');
    if (nodeName) nodeName.textContent = I18N[this.lang][nameKey] || this.selectedNodon.type.toUpperCase();
    
    const type = this.selectedNodon.type;
    const propRestitution = document.getElementById('prop-restitution');
    const propDelay = document.getElementById('prop-delay');
    const propPower = document.getElementById('prop-power');

    if (propRestitution) propRestitution.style.display = ['ball', 'box', 'spring', 'breakable', 'floor', 'ramp'].includes(type) ? 'block' : 'none';
    if (propDelay) propDelay.style.display = (type === 'timer') ? 'block' : 'none';
    if (propPower) propPower.style.display = ['fan', 'magnet', 'treadmill', 'spring'].includes(type) ? 'block' : 'none';
    
    if (this.inputs.restitution) this.inputs.restitution.value = this.selectedNodon.body.restitution;
    if (this.inputs.delay) this.inputs.delay.value = this.selectedNodon.delay / 1000;
    if (this.inputs.power) this.inputs.power.value = this.selectedNodon.power;
  }

  getNodonColor(type) {
    const palette = { ball: '#FF4757', ramp: '#1E90FF', box: '#FFA502', floor: '#747D8C', spring: '#FED330', treadmill: '#2F3542', breakable: '#CED6E0', balloon: '#FF6B81', fan: '#2ED573', sensor: '#70A1FF', timer: '#FF6348', 'warp-a': '#6C5CE7', 'warp-b': '#A29BFE', magnet: '#2F3542', goal: '#ECCC68', counter: '#535C68' };
    return palette[type] || '#CED6E0';
  }

  resetSimulation() {
    this.nodons.forEach(n => { Matter.Body.setPosition(n.body, n.initialPos); Matter.Body.setAngle(n.body, n.initialAngle); Matter.Body.setVelocity(n.body, { x: 0, y: 0 }); Matter.Body.setAngularVelocity(n.body, 0); n.isActive = false; });
    this.goalReached = false;
  }

  clearAll() { Composite.clear(this.world, false); Composite.add(this.world, this.mouseConstraint); this.nodons = []; this.connections = []; this.selectedNodon = null; }

  initManual() {
    const modal = document.getElementById('manual-modal');
    const btnManual = document.getElementById('btn-manual');
    const btnCloseManual = document.getElementById('btn-close-manual');
    const btnCloseManualIcon = document.getElementById('btn-close-manual-icon');

    if (btnManual) btnManual.onclick = () => modal.classList.remove('hidden');
    if (btnCloseManual) btnCloseManual.onclick = () => modal.classList.add('hidden');
    if (btnCloseManualIcon) btnCloseManualIcon.onclick = () => modal.classList.add('hidden');
  }

  initSettings() {
    const modal = document.getElementById('settings-modal');
    const btnSettings = document.getElementById('btn-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const selectLang = document.getElementById('select-lang');
    const selectLangInline = document.getElementById('select-lang-inline');
    const selectTheme = document.getElementById('select-theme');

    if (btnSettings) btnSettings.onclick = () => modal.classList.remove('hidden');
    if (btnCloseSettings) btnCloseSettings.onclick = () => modal.classList.add('hidden');
    
    if (selectLang) selectLang.onchange = (e) => { 
      this.lang = e.target.value; 
      if (selectLangInline) selectLangInline.value = this.lang; 
      this.applyLanguage(); 
    };
    if (selectLangInline) selectLangInline.onchange = (e) => { 
      this.lang = e.target.value; 
      if (selectLang) selectLang.value = this.lang; 
      this.applyLanguage(); 
    };
    if (selectTheme) selectTheme.onchange = (e) => {
      document.body.className = (e.target.value === 'dark') ? 'theme-dark' : 'theme-nintendo';
    };
  }

  initLegal() {
    const priv = document.getElementById('privacy-modal'), term = document.getElementById('terms-modal');
    const showPrivacy = document.getElementById('show-privacy'), showTerms = document.getElementById('show-terms');
    
    if (showPrivacy) showPrivacy.onclick = (e) => { e.preventDefault(); if (priv) priv.classList.remove('hidden'); };
    if (showTerms) showTerms.onclick = (e) => { e.preventDefault(); if (term) term.classList.remove('hidden'); };
    
    document.querySelectorAll('.btn-close-modal').forEach(btn => btn.onclick = () => { 
      if (priv) priv.classList.add('hidden'); 
      if (term) term.classList.add('hidden'); 
    });
  }

  initSmoothScroll() {
    document.querySelectorAll('.nav-link, .footer-links a').forEach(a => a.onclick = (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) { 
        e.preventDefault(); 
        const target = document.querySelector(href); 
        if (target) window.scrollTo({ top: target.offsetTop - 120, behavior: 'smooth' }); 
      }
    });
  }

  removeNodon(n) { if (!n) return; Composite.remove(this.world, n.body); this.nodons = this.nodons.filter(x => x.id !== n.id); this.connections = this.connections.filter(c => c.fromId !== n.id && c.toId !== n.id); this.selectedNodon = null; }
}

lucide.createIcons();
window.addEventListener('DOMContentLoaded', () => {
  new GoldbergApp();
});
