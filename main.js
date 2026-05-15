const I18N = {
  ko: {
    app_title: "골드버그 노돈 빌더",
    btn_play: "실행", btn_reset: "초기화", btn_clear: "전체 삭제", btn_manual: "설명서",
    cat_phys: "물리 노돈", cat_logic: "논리 노돈",
    nodon_ball: "공", nodon_ramp: "경사로", nodon_box: "상자", nodon_floor: "바닥", nodon_goal: "골인 지점",
    nodon_seesaw: "시소", nodon_pendulum: "진공추", nodon_domino: "도미노", nodon_hammer: "망치",
    nodon_spring: "스프링", nodon_balloon: "풍선",
    nodon_sensor: "터치 센서", nodon_fan: "강풍기", nodon_accelerator: "가속기", nodon_timer: "타이머", nodon_warp_a: "워프 입구 (A)", nodon_warp_b: "워프 출구 (B)", nodon_counter: "카운터",
    nodon_gate_and: "AND 게이트", nodon_gate_not: "NOT 게이트",
    history_title: "📜 골드버그 장치의 역사: 복잡함의 미학",
    guide_title: "🛠️ 골드버그 장치 마스터 클래스",
    encyclo_title: "📚 노돈 백과사전: 심층 분석",
    physics_title: "🎓 STEM: 골드버그 장치 속 물리 원리",
    nav_editor: "빌더", nav_history: "역사", nav_guide: "가이드", nav_encyclo: "백과사전", nav_physics: "물리 원리",
    settings_title: "환경 설정", label_language: "언어 선택", label_theme: "테마 설정",
    manual_title: "📖 노돈 가이드북",
    success_title: "성공!", success_msg: "정말 멋진 장치예요!",
    privacy_title: "개인정보처리방침", terms_title: "이용약관"
  },
  en: {
    app_title: "Goldberg Nodon Builder",
    btn_play: "Play", btn_reset: "Reset", btn_clear: "Clear All", btn_manual: "Manual",
    cat_phys: "Physical Nodons", cat_logic: "Logical Nodons",
    nodon_ball: "Ball", nodon_ramp: "Ramp", nodon_box: "Box", nodon_floor: "Floor", nodon_goal: "Goal",
    nodon_seesaw: "Seesaw", nodon_pendulum: "Pendulum", nodon_domino: "Domino", nodon_hammer: "Hammer",
    nodon_spring: "Spring", nodon_balloon: "Balloon",
    nodon_sensor: "Sensor", nodon_fan: "Fan", nodon_accelerator: "Accelerator", nodon_timer: "Timer", nodon_warp_a: "Warp A", nodon_warp_b: "Warp B", nodon_counter: "Counter",
    nodon_gate_and: "AND Gate", nodon_gate_not: "NOT Gate",
    history_title: "📜 History of Goldberg Machines",
    guide_title: "🛠️ Goldberg Masterclass",
    encyclo_title: "📚 Nodon Encyclopedia: Deep Dive",
    physics_title: "🎓 STEM: Physics of Goldberg Machines",
    nav_editor: "Builder", nav_history: "History", nav_guide: "Guide", nav_encyclo: "Encyclopedia", nav_physics: "Physics",
    settings_title: "Settings", label_language: "Language", label_theme: "Theme",
    manual_title: "📖 Nodon Guidebook",
    success_title: "Success!", success_msg: "Amazing Contraption!",
    privacy_title: "Privacy Policy", terms_title: "Terms"
  }
};

const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Vector, Constraint } = Matter;

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
    this.isWiring = false;
    this.wireStartPort = null;
    this.goalReached = false;
    this.isSidebarHidden = false;

    this.initCanvas();
    this.initControls();
    this.initSidebarToggle();
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
      constraint: { stiffness: 0.2, render: { visible: false } }
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

  initSidebarToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    const container = document.querySelector('.editor-container');
    if (toggle && container) {
      toggle.onclick = () => {
        this.isSidebarHidden = !this.isSidebarHidden;
        container.classList.toggle('sidebar-hidden', this.isSidebarHidden);
        const icon = toggle.querySelector('i');
        if (icon) icon.setAttribute('data-lucide', this.isSidebarHidden ? 'chevron-right' : 'chevron-left');
        lucide.createIcons();
        window.dispatchEvent(new Event('resize'));
      };
    }
  }

  initNavigation() {
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    window.addEventListener('scroll', () => {
      let current = '';
      const sections = ['app', 'history-section', 'guide-section', 'nodon-encyclopedia', 'physics-section'];
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
    let body, constraint;
    const common = { label: id.toString(), render: { fillStyle: color, strokeStyle: '#2F3542', lineWidth: 3 } };
    
    switch(type) {
      case 'ball': body = Bodies.circle(x, y, 18, { ...common, friction: 0.005, restitution: 0.7 }); break;
      case 'ramp': body = Bodies.rectangle(x, y, 200, 25, { ...common, angle: Math.PI / 10, isStatic: true }); break;
      case 'box': body = Bodies.rectangle(x, y, 60, 60, common); break;
      case 'floor': body = Bodies.rectangle(x, y, 400, 30, { ...common, isStatic: true }); break;
      case 'seesaw': 
        body = Bodies.rectangle(x, y, 220, 15, common);
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, stiffness: 1, length: 0 });
        break;
      case 'pendulum':
        body = Bodies.circle(x, y + 120, 25, { ...common, frictionAir: 0, restitution: 1 });
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, stiffness: 0.9, length: 120 });
        break;
      case 'domino': body = Bodies.rectangle(x, y, 12, 50, { ...common, friction: 0.5, density: 0.01 }); break;
      case 'hammer':
        body = Bodies.rectangle(x + 60, y, 120, 30, { ...common, density: 0.05 });
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, pointB: { x: -60, y: 0 }, stiffness: 1, length: 0 });
        break;
      case 'spring': body = Bodies.rectangle(x, y, 90, 25, { ...common, isStatic: true }); break;
      case 'balloon': body = Bodies.circle(x, y, 35, { ...common, frictionAir: 0.12, density: 0.0001 }); break;
      case 'fan': body = Bodies.circle(x, y, 40, { ...common, isStatic: true }); break;
      case 'accelerator': body = Bodies.circle(x, y, 40, { ...common, isStatic: true, isSensor: true }); break;
      case 'sensor': body = Bodies.rectangle(x, y, 80, 80, { ...common, isStatic: true, isSensor: true }); break;
      case 'timer': body = Bodies.circle(x, y, 40, { ...common, isStatic: true, isSensor: true }); break;
      case 'warp-a': case 'warp-b': body = Bodies.circle(x, y, 40, { ...common, isStatic: true, isSensor: true }); break;
      case 'counter': body = Bodies.rectangle(x, y, 70, 70, { ...common, isStatic: true }); break;
      case 'gate-and': body = Bodies.rectangle(x, y, 80, 50, { ...common, isStatic: true, isSensor: true }); break;
      case 'gate-not': body = Bodies.circle(x, y, 35, { ...common, isStatic: true, isSensor: true }); break;
      case 'goal': body = Bodies.rectangle(x, y, 90, 60, { ...common, isStatic: true, isSensor: true }); break;
    }

    if (body) {
      Composite.add(this.world, body);
      if (constraint) Composite.add(this.world, constraint);
      const nodon = { id, type, body, constraint, initialPos: { x: body.position.x, y: body.position.y }, initialAngle: body.angle, power: 0.1, delay: 1000, isActive: false };
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
        if (n.type === 'balloon') Matter.Body.applyForce(n.body, n.body.position, { x: 0, y: -0.0015 });
      });
    });
  }

  handleCollisions(bodyA, bodyB) {
    const nA = this.nodons.find(n => n.body === bodyA);
    const nB = this.nodons.find(n => n.body === bodyB);
    if (!nA || !nB) return;
    if (['sensor', 'timer', 'accelerator'].includes(nA.type)) this.triggerNodonLogic(nA, nB.body);
    if (['sensor', 'timer', 'accelerator'].includes(nB.type)) this.triggerNodonLogic(nB, nA.body);
    if (nA.type === 'spring') this.applySpring(nA, nB.body);
    if (nB.type === 'spring') this.applySpring(nB, nA.body);
    if (nA.type === 'warp-a' && nB.type === 'ball') this.teleport(nB.body, 'warp-b');
    if (nB.type === 'warp-a' && nA.type === 'ball') this.teleport(nA.body, 'warp-b');
    if ((nA.type === 'goal' && nB.type === 'ball') || (nB.type === 'goal' && nA.type === 'ball')) this.reachGoal();
  }

  triggerNodonLogic(sensor, targetBody) {
    const run = () => {
      if (sensor.type === 'accelerator') {
        const angle = sensor.body.angle;
        Matter.Body.applyForce(targetBody, targetBody.position, { x: Math.cos(angle) * 0.5, y: Math.sin(angle) * 0.5 });
        sensor.isActive = true; setTimeout(() => sensor.isActive = false, 200);
      }
      this.connections.filter(c => c.fromId === sensor.id).forEach(c => {
        const target = this.nodons.find(n => n.id === c.toId);
        if (target && (target.type === 'fan' || target.type === 'accelerator')) {
          const power = target.type === 'fan' ? target.power : 0.8;
          Matter.Body.applyForce(targetBody, targetBody.position, { x: Math.cos(target.body.angle) * power, y: Math.sin(target.body.angle) * power });
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
      const isLogic = ['sensor', 'timer', 'fan', 'warp-a', 'warp-b', 'accelerator', 'counter', 'gate-and', 'gate-not'].includes(nodon.type);
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
      if (['sensor', 'timer', 'counter', 'accelerator', 'gate-and', 'gate-not'].includes(n.type)) this.createPort(n, n.body.position.x + 40, n.body.position.y, 'output');
      if (['fan', 'timer', 'counter', 'accelerator', 'gate-and', 'gate-not'].includes(n.type)) this.createPort(n, n.body.position.x - 40, n.body.position.y, 'input');
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

    if (propRestitution) propRestitution.style.display = ['ball', 'box', 'spring', 'seesaw', 'pendulum', 'domino', 'hammer', 'floor', 'ramp'].includes(type) ? 'block' : 'none';
    if (propDelay) propDelay.style.display = (type === 'timer') ? 'block' : 'none';
    if (propPower) propPower.style.display = ['fan', 'accelerator', 'spring'].includes(type) ? 'block' : 'none';
    
    if (this.inputs.restitution) this.inputs.restitution.value = this.selectedNodon.body.restitution;
    if (this.inputs.delay) this.inputs.delay.value = this.selectedNodon.delay / 1000;
    if (this.inputs.power) this.inputs.power.value = this.selectedNodon.power;
  }

  getNodonColor(type) {
    const palette = { 
      ball: 'oklch(0.65 0.25 20)', ramp: 'oklch(0.65 0.2 260)', box: 'oklch(0.75 0.2 80)', 
      floor: 'oklch(0.45 0.05 260)', seesaw: 'oklch(0.7 0.15 200)', pendulum: 'oklch(0.4 0.1 260)', 
      domino: 'oklch(0.65 0.25 20)', hammer: 'oklch(0.5 0.05 260)', spring: 'oklch(0.85 0.2 90)', 
      balloon: 'oklch(0.8 0.15 350)', fan: 'oklch(0.7 0.2 150)', sensor: 'oklch(0.75 0.15 220)', 
      accelerator: 'oklch(0.75 0.2 60)', timer: 'oklch(0.7 0.2 30)', 'warp-a': 'oklch(0.6 0.2 280)', 
      'warp-b': 'oklch(0.8 0.15 280)', goal: 'oklch(0.85 0.15 70)', counter: 'oklch(0.4 0.1 260)',
      'gate-and': 'oklch(0.5 0.2 160)', 'gate-not': 'oklch(0.5 0.2 0)' 
    };
    return palette[type] || '#ced6e0';
  }

  resetSimulation() {
    this.nodons.forEach(n => { 
      Matter.Body.setPosition(n.body, n.initialPos); 
      Matter.Body.setAngle(n.body, n.initialAngle); 
      Matter.Body.setVelocity(n.body, { x: 0, y: 0 }); 
      Matter.Body.setAngularVelocity(n.body, 0); 
      n.isActive = false; 
    });
    this.goalReached = false;
  }

  clearAll() { 
    Composite.clear(this.world, false); 
    Composite.add(this.world, this.mouseConstraint); 
    this.nodons = []; 
    this.connections = []; 
    this.selectedNodon = null; 
  }

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
    if (selectLang) selectLang.onchange = (e) => { this.lang = e.target.value; if (selectLangInline) selectLangInline.value = this.lang; this.applyLanguage(); };
    if (selectLangInline) selectLangInline.onchange = (e) => { this.lang = e.target.value; if (selectLang) selectLang.value = this.lang; this.applyLanguage(); };
    if (selectTheme) selectTheme.onchange = (e) => { document.body.className = (e.target.value === 'dark') ? 'theme-dark' : 'theme-nintendo'; };
  }

  initLegal() {
    const priv = document.getElementById('privacy-modal'), term = document.getElementById('terms-modal');
    const showPrivacy = document.getElementById('show-privacy'), showTerms = document.getElementById('show-terms');
    if (showPrivacy) showPrivacy.onclick = (e) => { e.preventDefault(); if (priv) priv.classList.remove('hidden'); };
    if (showTerms) showTerms.onclick = (e) => { e.preventDefault(); if (term) term.classList.remove('hidden'); };
    document.querySelectorAll('.btn-close-modal').forEach(btn => btn.onclick = () => { if (priv) priv.classList.add('hidden'); if (term) term.classList.add('hidden'); });
  }

  initSmoothScroll() {
    document.querySelectorAll('.nav-link, .footer-links a').forEach(a => a.onclick = (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) { e.preventDefault(); const target = document.querySelector(href); if (target) window.scrollTo({ top: target.offsetTop - 120, behavior: 'smooth' }); }
    });
  }

  removeNodon(n) { if (!n) return; Composite.remove(this.world, n.body); if (n.constraint) Composite.remove(this.world, n.constraint); this.nodons = this.nodons.filter(x => x.id !== n.id); this.connections = this.connections.filter(c => c.fromId !== n.id && c.toId !== n.id); this.selectedNodon = null; }
}

lucide.createIcons();
window.addEventListener('DOMContentLoaded', () => { new GoldbergApp(); });
