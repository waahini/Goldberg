// Initialize Lucide icons
lucide.createIcons();

const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Vector } = Matter;

const I18N = {
  ko: {
    app_title: "골드버그 노돈",
    btn_play: "시작", btn_reset: "초기화", btn_clear: "모두 삭제",
    cat_phys: "물리 노돈", cat_logic: "논리 노돈",
    nodon_ball: "공", nodon_ramp: "경사로", nodon_box: "상자", nodon_floor: "바닥", nodon_goal: "골인",
    nodon_sensor: "센서", nodon_fan: "팬", nodon_timer: "타이머", nodon_warp_a: "포탈 A", nodon_warp_b: "포탈 B", nodon_magnet: "자석",
    settings_title: "환경 설정", label_language: "언어", label_theme: "테마",
    tip_ball: "물리 법칙을 따르는 기본 공입니다.",
    tip_ramp: "공이 굴러내려갈 수 있는 경사면입니다.",
    tip_sensor: "물체가 닿으면 연결된 노돈에 신호를 보냅니다.",
    tip_fan: "신호를 받으면 설정된 방향으로 바람을 일으킵니다.",
    tip_timer: "신호를 받으면 일정 시간 뒤에 다음 노돈으로 전달합니다.",
    tip_warp: "A로 들어온 물체를 B 지점으로 순간이동시킵니다.",
    tip_magnet: "주변의 구슬을 강력하게 끌어당기거나 밀어냅니다."
  },
  en: {
    app_title: "Goldberg Nodon",
    btn_play: "Play", btn_reset: "Reset", btn_clear: "Clear All",
    cat_phys: "Physical", cat_logic: "Logical",
    nodon_ball: "Ball", nodon_ramp: "Ramp", nodon_box: "Box", nodon_floor: "Floor", nodon_goal: "Goal",
    nodon_sensor: "Sensor", nodon_fan: "Fan", nodon_timer: "Timer", nodon_warp_a: "Warp A", nodon_warp_b: "Warp B", nodon_magnet: "Magnet",
    settings_title: "Settings", label_language: "Language", label_theme: "Theme",
    tip_ball: "A basic physics-enabled marble.",
    tip_ramp: "An inclined surface for objects to roll down.",
    tip_sensor: "Triggers a signal when an object touches it.",
    tip_fan: "Pushes objects when it receives a signal.",
    tip_timer: "Delays a signal for a specified duration.",
    tip_warp: "Teleports objects from A to B instantly.",
    tip_magnet: "Attracts or repels nearby marbles with force."
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

    this.initCanvas();
    this.initControls();
    this.initDragAndDrop();
    this.initEvents();
    this.initSuccessUI();
    this.initSettings();
    this.applyLanguage();
    
    this.animate();
  }

  get selectedNodon() { return this._selectedNodon; }
  set selectedNodon(val) {
    this._selectedNodon = val;
    this.updateSettingsPanel();
  }

  initSettings() {
    const modal = document.getElementById('settings-modal');
    const btnOpen = document.getElementById('btn-settings');
    const btnClose = document.getElementById('btn-close-settings');
    const selLang = document.getElementById('select-lang');
    const selTheme = document.getElementById('select-theme');

    btnOpen.onclick = () => modal.classList.remove('hidden');
    btnClose.onclick = () => modal.classList.add('hidden');
    
    selLang.onchange = (e) => {
      this.lang = e.target.value;
      this.applyLanguage();
    };

    selTheme.onchange = (e) => {
      this.theme = e.target.value;
      document.body.className = this.theme === 'dark' ? 'theme-dark' : 'theme-nintendo';
    };

    // Tooltip logic
    const tooltip = document.getElementById('hover-tooltip');
    document.querySelectorAll('.nodon-item').forEach(item => {
      item.onmouseenter = (e) => {
        const type = item.dataset.type.replace('-', '_');
        const tipKey = `tip_${type.split('_')[0]}`;
        tooltip.querySelector('.tooltip-title').textContent = I18N[this.lang][`nodon_${type}`];
        tooltip.querySelector('.tooltip-body').textContent = I18N[this.lang][tipKey] || "...";
        tooltip.classList.remove('hidden');
      };
      item.onmouseleave = () => tooltip.classList.add('hidden');
      item.onmousemove = (e) => {
        tooltip.style.left = e.clientX + 'px';
        tooltip.style.top = e.clientY + 'px';
      };
    });
  }

  applyLanguage() {
    document.querySelectorAll('[data-lang]').forEach(el => {
      const key = el.dataset.lang;
      if (I18N[this.lang][key]) el.textContent = I18N[this.lang][key];
    });
  }

  initCanvas() {
    const container = document.getElementById('physics-canvas');
    this.render = Render.create({
      element: container,
      engine: this.engine,
      options: {
        width: container.clientWidth,
        height: container.clientHeight,
        wireframes: false,
        background: 'transparent'
      }
    });
    Render.run(this.render);
    this.runner = Runner.create();
    const mouse = Mouse.create(this.render.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
    Composite.add(this.world, this.mouseConstraint);
    window.addEventListener('resize', () => {
      this.render.canvas.width = container.clientWidth;
      this.render.canvas.height = container.clientHeight;
    });
  }

  initControls() {
    document.getElementById('btn-play').onclick = () => {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) Runner.run(this.runner, this.engine);
      else Runner.stop(this.runner);
      this.applyLanguage();
    };
    document.getElementById('btn-reset').onclick = () => this.resetSimulation();
    document.getElementById('btn-clear').onclick = () => this.clearAll();
    
    // Settings Panel controls
    this.panel = document.getElementById('settings-panel');
    document.getElementById('node-delete').onclick = () => this.removeNodon(this.selectedNodon);
    
    this.inputs = {
      restitution: document.getElementById('input-restitution'),
      delay: document.getElementById('input-delay'),
      power: document.getElementById('input-power')
    };
    this.inputs.restitution.oninput = (e) => this.selectedNodon && (this.selectedNodon.body.restitution = parseFloat(e.target.value));
    this.inputs.delay.oninput = (e) => this.selectedNodon && (this.selectedNodon.delay = parseFloat(e.target.value) * 1000);
    this.inputs.power.oninput = (e) => this.selectedNodon && (this.selectedNodon.power = parseFloat(e.target.value));
  }

  updateSettingsPanel() {
    if (!this.selectedNodon) { this.panel.classList.add('hidden'); return; }
    this.panel.classList.remove('hidden');
    document.getElementById('node-name').textContent = this.selectedNodon.type.toUpperCase();
    const type = this.selectedNodon.type;
    document.getElementById('prop-restitution').style.display = ['ball', 'box'].includes(type) ? 'block' : 'none';
    document.getElementById('prop-delay').style.display = (type === 'timer') ? 'block' : 'none';
    document.getElementById('prop-power').style.display = ['fan', 'magnet'].includes(type) ? 'block' : 'none';
    this.inputs.restitution.value = this.selectedNodon.body.restitution || 0.5;
    this.inputs.delay.value = (this.selectedNodon.delay || 1000) / 1000;
    this.inputs.power.value = this.selectedNodon.power || 0.05;
  }

  initDragAndDrop() {
    document.querySelectorAll('.nodon-item').forEach(item => {
      item.ondragstart = (e) => e.dataTransfer.setData('type', item.dataset.type);
    });
    const container = document.getElementById('physics-canvas');
    container.ondragover = (e) => e.preventDefault();
    container.ondrop = (e) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      this.addNodon(e.dataTransfer.getData('type'), e.clientX - rect.left, e.clientY - rect.top);
    };
  }

  initEvents() {
    Events.on(this.engine, 'collisionStart', (event) => event.pairs.forEach(pair => this.handleCollisions(pair.bodyA, pair.bodyB)));
    const canvas = this.render.canvas;
    canvas.onmousedown = (e) => {
      if (this.isPlaying) return;
      const clickedBody = Matter.Query.point(Composite.allBodies(this.world), { x: e.offsetX, y: e.offsetY })[0];
      if (clickedBody) this.selectedNodon = this.nodons.find(n => n.body === clickedBody);
      else if (!e.target.classList.contains('port')) this.selectedNodon = null;
    };
  }

  handleCollisions(bodyA, bodyB) {
    const nA = this.nodons.find(n => n.body === bodyA);
    const nB = this.nodons.find(n => n.body === bodyB);
    if (!nA || !nB) return;

    if (nA.type === 'sensor' || nA.type === 'timer') this.triggerNodonLogic(nA, nB.body);
    if (nB.type === 'sensor' || nB.type === 'timer') this.triggerNodonLogic(nB, nA.body);
    
    if (nA.type === 'warp-a' && nB.type === 'ball') this.teleport(nB.body, 'warp-b');
    if (nB.type === 'warp-a' && nA.type === 'ball') this.teleport(nA.body, 'warp-b');
    
    if ((nA.type === 'goal' && nB.type === 'ball') || (nB.type === 'goal' && nA.type === 'ball')) this.reachGoal();
  }

  teleport(body, targetType) {
    const target = this.nodons.find(n => n.type === targetType);
    if (target) Matter.Body.setPosition(body, { x: target.body.position.x, y: target.body.position.y });
  }

  reachGoal() {
    if (this.goalReached) return;
    this.goalReached = true;
    document.getElementById('success-msg').classList.add('show');
    setTimeout(() => document.getElementById('success-msg').classList.remove('show'), 3000);
  }

  addNodon(type, x, y) {
    const id = Date.now();
    const color = this.getNodonColor(type);
    let body;
    const common = { label: id.toString(), render: { fillStyle: color } };
    
    switch(type) {
      case 'ball': body = Bodies.circle(x, y, 15, { ...common, friction: 0.005, restitution: 0.5 }); break;
      case 'ramp': body = Bodies.rectangle(x, y, 150, 20, { ...common, angle: Math.PI / 10, isStatic: true }); break;
      case 'box': body = Bodies.rectangle(x, y, 40, 40, common); break;
      case 'floor': body = Bodies.rectangle(x, y, 300, 20, { ...common, isStatic: true }); break;
      case 'goal': body = Bodies.rectangle(x, y, 60, 40, { ...common, isStatic: true }); break;
      case 'fan': body = Bodies.circle(x, y, 25, { ...common, isStatic: true }); break;
      case 'sensor': body = Bodies.rectangle(x, y, 60, 60, { ...common, isStatic: true, isSensor: true }); break;
      case 'timer': body = Bodies.circle(x, y, 25, { ...common, isStatic: true, isSensor: true }); break;
      case 'warp-a': case 'warp-b': body = Bodies.circle(x, y, 25, { ...common, isStatic: true, isSensor: true }); break;
      case 'magnet': body = Bodies.circle(x, y, 30, { ...common, isStatic: true, isSensor: true }); break;
    }

    if (body) {
      Composite.add(this.world, body);
      const nodon = { id, type, body, initialPos: { x, y }, initialAngle: body.angle, power: 0.05, delay: 1000 };
      this.nodons.push(nodon);
      this.selectedNodon = nodon;
    }
  }

  triggerNodonLogic(sensor, targetBody) {
    const run = () => this.connections.filter(c => c.fromId === sensor.id).forEach(c => this.applyAction(this.nodons.find(n => n.id === c.toId), targetBody));
    if (sensor.type === 'timer') setTimeout(run, sensor.delay);
    else run();
  }

  applyAction(target, source) {
    if (!target) return;
    if (target.type === 'fan') Matter.Body.applyForce(source, source.position, { x: Math.cos(target.body.angle) * target.power, y: Math.sin(target.body.angle) * target.power });
    const original = target.body.render.fillStyle;
    target.body.render.fillStyle = '#f7d716';
    setTimeout(() => target.body.render.fillStyle = original, 200);
  }

  getNodonColor(type) {
    return {
      ball: '#ff7675', ramp: '#74b9ff', box: '#fab1a0', floor: '#636e72',
      fan: '#81ecec', sensor: '#55efc4', timer: '#eb3b5a',
      'warp-a': '#8854d0', 'warp-b': '#3867d6', magnet: '#2f3542', goal: '#fd9644'
    }[type] || '#dfe6e9';
  }

  animate() {
    const svg = document.getElementById('wiring-layer');
    svg.innerHTML = '';
    this.drawWires();
    this.drawNodonEyes();
    this.handleMagnets();
    this.drawPorts();
    this.drawSelectionHighlight();
    requestAnimationFrame(() => this.animate());
  }

  drawNodonEyes() {
    const balls = this.nodons.filter(n => n.type === 'ball');
    const firstBall = balls[0]?.body.position;
    this.nodons.forEach(nodon => {
      const pos = nodon.body.position;
      const angle = nodon.body.angle;
      const eyeOffset = 8;
      const lookAt = firstBall ? Vector.mult(Vector.normalise(Vector.sub(firstBall, pos)), 4) : { x: 0, y: 0 };
      
      this.drawEye(pos.x - eyeOffset, pos.y - 5, lookAt);
      this.drawEye(pos.x + eyeOffset, pos.y - 5, lookAt);
    });
  }

  drawEye(x, y, look) {
    const svg = document.getElementById('wiring-layer');
    const white = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    white.setAttribute('cx', x); white.setAttribute('cy', y); white.setAttribute('r', '5'); white.setAttribute('fill', 'white');
    const pupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pupil.setAttribute('cx', x + look.x); pupil.setAttribute('cy', y + look.y); pupil.setAttribute('r', '2'); pupil.setAttribute('fill', 'black');
    svg.appendChild(white); svg.appendChild(pupil);
  }

  handleMagnets() {
    if (!this.isPlaying) return;
    this.nodons.filter(n => n.type === 'magnet').forEach(m => {
      this.nodons.filter(n => n.type === 'ball').forEach(b => {
        const d = Vector.magnitude(Vector.sub(m.body.position, b.body.position));
        if (d < 200) Matter.Body.applyForce(b.body, b.body.position, Vector.mult(Vector.normalise(Vector.sub(m.body.position, b.body.position)), m.power * (1 - d/200)));
      });
    });
  }

  drawPorts() {
    if (this.isPlaying) return;
    this.nodons.forEach(n => {
      if (['sensor', 'timer'].includes(n.type)) this.createPort(n, n.body.position.x + 35, n.body.position.y, 'output');
      if (['fan', 'timer'].includes(n.type)) this.createPort(n, n.body.position.x - 35, n.body.position.y, 'input');
    });
  }

  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '8'); c.classList.add('port', type);
    c.onmousedown = (e) => {
      e.stopPropagation();
      if (type === 'output') { this.isWiring = true; this.wireStartPort = { nodon, x, y }; }
      else if (this.isWiring) { 
        if (!this.connections.some(c => c.fromId === this.wireStartPort.nodon.id && c.toId === nodon.id)) {
          this.connections.push({ fromId: this.wireStartPort.nodon.id, toId: nodon.id });
        }
        this.isWiring = false; 
      }
    };
    svg.appendChild(c);
  }

  drawWires() {
    this.connections.forEach(conn => {
      const f = this.nodons.find(n => n.id === conn.fromId);
      const t = this.nodons.find(n => n.id === conn.toId);
      if (f && t) this.createWire({ x: f.body.position.x + 35, y: f.body.position.y }, { x: t.body.position.x - 35, y: t.body.position.y }, '#4a90e2');
    });
    if (this.isWiring) this.createWire(this.wireStartPort, this.mouseConstraint.mouse.position, '#ff5e5e', true);
  }

  createWire(p1, p2, color, isDashed = false) {
    const svg = document.getElementById('wiring-layer');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const dx = Math.abs(p2.x - p1.x) * 0.5;
    path.setAttribute('d', `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`);
    path.setAttribute('stroke', color); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '4'); path.setAttribute('stroke-linecap', 'round');
    if (isDashed) path.setAttribute('stroke-dasharray', '8,8');
    svg.appendChild(path);
  }

  drawSelectionHighlight() {
    if (!this.selectedNodon) return;
    const { x, y } = this.selectedNodon.body.position;
    const svg = document.getElementById('wiring-layer');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', '45');
    circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', '#ff5e5e'); circle.setAttribute('stroke-width', '2'); circle.setAttribute('stroke-dasharray', '4,4');
    svg.appendChild(circle);
  }

  resetSimulation() {
    this.nodons.forEach(n => { Matter.Body.setPosition(n.body, n.initialPos); Matter.Body.setAngle(n.body, n.initialAngle); Matter.Body.setVelocity(n.body, { x: 0, y: 0 }); Matter.Body.setAngularVelocity(n.body, 0); });
    this.goalReached = false; document.getElementById('success-msg').classList.remove('show');
  }

  clearAll() {
    Composite.clear(this.world, false); Composite.add(this.world, this.mouseConstraint);
    this.nodons = []; this.connections = []; this.selectedNodon = null;
  }

  initSuccessUI() {
    const msg = document.createElement('div'); msg.id = 'success-msg'; msg.innerHTML = '<h2>Success!</h2><p>Amazing Contraption!</p>';
    document.body.appendChild(msg);
  }

  removeNodon(n) {
    if (!n) return; Composite.remove(this.world, n.body);
    this.nodons = this.nodons.filter(x => x.id !== n.id);
    this.connections = this.connections.filter(c => c.fromId !== n.id && c.toId !== n.id);
    this.selectedNodon = null;
  }
}

const app = new GoldbergApp();
