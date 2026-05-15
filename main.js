const I18N = {
  ko: {
    app_title: "ZEN RED",
    btn_play: "IGNITION", btn_reset: "RESET", btn_clear: "PURGE", btn_manual: "DOCS",
    cat_phys: "PHYSICAL DYNAMICS", cat_logic: "LOGIC CIRCUITS",
    nodon_ball: "BALL", nodon_ramp: "RAMP", nodon_box: "BOX", nodon_floor: "FLOOR",
    nodon_seesaw: "SEESAW", nodon_pendulum: "PENDULUM", nodon_domino: "DOMINO", nodon_hammer: "HAMMER",
    nodon_sensor: "SENSOR", nodon_accelerator: "ACCELERATOR", nodon_gate_and: "AND GATE", nodon_gate_not: "NOT GATE",
    nodon_timer: "TIMER", nodon_counter: "COUNTER",
    history_title: "ARCHIVES", guide_title: "MASTERCLASS",
    nav_editor: "ATELIER", nav_history: "ARCHIVES", nav_guide: "MASTERCLASS", nav_encyclo: "LIBRARY", nav_physics: "SCIENCE",
    success_title: "SYSTEM BREACH: SUCCESS", success_msg: "Your machine has reached its destiny."
  },
  en: {
    app_title: "ZEN RED",
    btn_play: "IGNITION", btn_reset: "RESET", btn_clear: "PURGE", btn_manual: "DOCS",
    cat_phys: "PHYSICAL DYNAMICS", cat_logic: "LOGIC CIRCUITS",
    nodon_ball: "BALL", nodon_ramp: "RAMP", nodon_box: "BOX", nodon_floor: "FLOOR",
    nodon_seesaw: "SEESAW", nodon_pendulum: "PENDULUM", nodon_domino: "DOMINO", nodon_hammer: "HAMMER",
    nodon_sensor: "SENSOR", nodon_accelerator: "ACCELERATOR", nodon_gate_and: "AND GATE", nodon_gate_not: "NOT GATE",
    nodon_timer: "TIMER", nodon_counter: "COUNTER",
    history_title: "ARCHIVES", guide_title: "MASTERCLASS",
    nav_editor: "ATELIER", nav_history: "ARCHIVES", nav_guide: "MASTERCLASS", nav_encyclo: "LIBRARY", nav_physics: "SCIENCE",
    success_title: "SYSTEM BREACH: SUCCESS", success_msg: "Your machine has reached its destiny."
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
    this.isWiring = false;
    this.wireStartPort = null;
    this.goalReached = false;
    this.isSidebarHidden = false;

    this.initCanvas();
    this.initControls();
    this.initSidebarToggle();
    this.initDragAndDrop();
    this.initEvents();
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
    this.render = Render.create({
      element: container,
      engine: this.engine,
      options: {
        width: container.clientWidth,
        height: container.clientHeight,
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

    window.addEventListener('resize', () => {
      this.render.canvas.width = container.clientWidth;
      this.render.canvas.height = container.clientHeight;
      this.render.options.width = container.clientWidth;
      this.render.options.height = container.clientHeight;
    });
  }

  initSidebarToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    const container = document.querySelector('.editor-container');
    if (toggle && container) {
      toggle.onclick = () => {
        this.isSidebarHidden = !this.isSidebarHidden;
        container.classList.toggle('sidebar-hidden', this.isSidebarHidden);
        toggle.querySelector('i').setAttribute('data-lucide', this.isSidebarHidden ? 'chevron-right' : 'chevron-left');
        lucide.createIcons();
        setTimeout(() => window.dispatchEvent(new Event('resize')), 600);
      };
    }
  }

  initControls() {
    document.getElementById('btn-play').onclick = () => {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) Runner.run(this.runner, this.engine);
      else Runner.stop(this.runner);
      document.getElementById('btn-play').querySelector('i').setAttribute('data-lucide', this.isPlaying ? 'pause' : 'play');
      lucide.createIcons();
    };
    document.getElementById('btn-reset').onclick = () => this.resetSimulation();
    document.getElementById('btn-clear').onclick = () => this.clearAll();
    document.getElementById('node-delete').onclick = () => this.removeNodon(this.selectedNodon);
    
    this.inputs = {
      restitution: document.getElementById('input-restitution'),
      delay: document.getElementById('input-delay'),
      power: document.getElementById('input-power')
    };
    this.inputs.restitution.oninput = (e) => { if (this.selectedNodon) this.selectedNodon.body.restitution = parseFloat(e.target.value); };
    this.inputs.delay.oninput = (e) => { if (this.selectedNodon) this.selectedNodon.delay = parseFloat(e.target.value) * 1000; };
    this.inputs.power.oninput = (e) => { if (this.selectedNodon) this.selectedNodon.power = parseFloat(e.target.value); };
  }

  addNodon(type, x, y) {
    const id = Date.now();
    const color = this.getNodonColor(type);
    let body, constraint;
    const common = { label: id.toString(), render: { fillStyle: color, strokeStyle: '#fff', lineWidth: 2 } };
    
    switch(type) {
      case 'ball': body = Bodies.circle(x, y, 20, { ...common, friction: 0.01, restitution: 0.75 }); break;
      case 'ramp': body = Bodies.rectangle(x, y, 220, 20, { ...common, angle: Math.PI / 10, isStatic: true }); break;
      case 'box': body = Bodies.rectangle(x, y, 64, 64, common); break;
      case 'floor': body = Bodies.rectangle(x, y, 440, 24, { ...common, isStatic: true }); break;
      case 'seesaw': 
        body = Bodies.rectangle(x, y, 240, 12, common);
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, stiffness: 1, length: 0 });
        break;
      case 'pendulum':
        body = Bodies.circle(x, y + 140, 28, { ...common, frictionAir: 0, restitution: 1 });
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, stiffness: 0.9, length: 140 });
        break;
      case 'domino': body = Bodies.rectangle(x, y, 14, 56, { ...common, friction: 0.5, density: 0.01 }); break;
      case 'hammer':
        body = Bodies.rectangle(x + 70, y, 140, 32, { ...common, density: 0.08 });
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, pointB: { x: -70, y: 0 }, stiffness: 1, length: 0 });
        break;
      case 'sensor': body = Bodies.rectangle(x, y, 80, 80, { ...common, isStatic: true, isSensor: true, render: { ...common.render, fillStyle: 'transparent', strokeStyle: color, dash: [10, 10] } }); break;
      case 'accelerator': body = Bodies.circle(x, y, 40, { ...common, isStatic: true, isSensor: true }); break;
      case 'gate-and': body = Bodies.rectangle(x, y, 100, 60, { ...common, isStatic: true, isSensor: true }); break;
      case 'gate-not': body = Bodies.circle(x, y, 40, { ...common, isStatic: true, isSensor: true }); break;
      case 'timer': body = Bodies.circle(x, y, 40, { ...common, isStatic: true, isSensor: true }); break;
      case 'counter': body = Bodies.rectangle(x, y, 80, 80, { ...common, isStatic: true }); break;
    }

    if (body) {
      Composite.add(this.world, body);
      if (constraint) Composite.add(this.world, constraint);
      const nodon = { id, type, body, constraint, initialPos: { x: body.position.x, y: body.position.y }, initialAngle: body.angle, power: 0.12, delay: 1000, isActive: false, signalInputs: new Set() };
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
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const clickedBody = Matter.Query.point(Composite.allBodies(this.world), mousePos)[0];
      this.selectedNodon = clickedBody ? this.nodons.find(n => n.body === clickedBody) : null;
    });
    window.addEventListener('keydown', (e) => {
      if (!this.selectedNodon) return;
      if (e.key.toLowerCase() === 'r') {
        Matter.Body.setAngle(this.selectedNodon.body, this.selectedNodon.body.angle + Math.PI / 12);
        this.selectedNodon.initialAngle = this.selectedNodon.body.angle;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') this.removeNodon(this.selectedNodon);
    });
  }

  handleCollisions(bodyA, bodyB) {
    const nA = this.nodons.find(n => n.body === bodyA), nB = this.nodons.find(n => n.body === bodyB);
    if (!nA || !nB) return;
    if (['sensor', 'timer', 'accelerator', 'gate-and', 'gate-not'].includes(nA.type)) this.triggerNodonLogic(nA, nB.body);
    if (['sensor', 'timer', 'accelerator', 'gate-and', 'gate-not'].includes(nB.type)) this.triggerNodonLogic(nB, nA.body);
  }

  triggerNodonLogic(source, targetBody) {
    const fire = () => {
      source.isActive = true; setTimeout(() => source.isActive = false, 300);
      this.connections.filter(c => c.fromId === source.id).forEach(c => {
        const target = this.nodons.find(n => n.id === c.toId);
        if (target) {
          if (target.type === 'accelerator') {
            Matter.Body.applyForce(targetBody, targetBody.position, { x: Math.cos(target.body.angle) * 1.5, y: Math.sin(target.body.angle) * 1.5 });
            target.isActive = true; setTimeout(() => target.isActive = false, 300);
          }
        }
      });
    };
    if (source.type === 'timer') setTimeout(fire, source.delay);
    else fire();
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
      const isLogic = ['sensor', 'timer', 'accelerator', 'counter', 'gate-and', 'gate-not'].includes(nodon.type);
      this.addFaceToGroup(g, isLogic ? 8 : 6, isLogic ? 14 : 10, time, nodon.isActive);
      svg.appendChild(g);
    });
  }

  addFaceToGroup(g, size, offset, time, active) {
    [-offset, offset].forEach(ox => {
      const eye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      eye.setAttribute('cx', ox); eye.setAttribute('cy', -5); eye.setAttribute('r', size);
      eye.setAttribute('fill', active ? '#fff' : '#111'); g.appendChild(eye);
    });
    const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mouth.setAttribute('d', `M ${-offset} 15 Q 0 ${15 + (active ? 15 : 5)} ${offset} 15`);
    mouth.setAttribute('stroke', active ? '#fff' : '#111'); mouth.setAttribute('fill', 'none'); mouth.setAttribute('stroke-width', '4');
    g.appendChild(mouth);
  }

  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '12');
    c.style.fill = type === 'output' ? 'oklch(0.6 0.3 25)' : 'oklch(0.8 0.2 80)';
    c.style.stroke = '#fff'; c.style.strokeWidth = '3'; c.style.pointerEvents = 'auto'; c.style.cursor = 'crosshair';
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
      if (['sensor', 'timer', 'counter', 'accelerator', 'gate-and', 'gate-not'].includes(n.type)) {
        this.createPort(n, n.body.position.x + 50, n.body.position.y, 'output');
        this.createPort(n, n.body.position.x - 50, n.body.position.y, 'input');
      }
    });
  }

  drawWires() {
    const svg = document.getElementById('wiring-layer');
    this.connections.forEach(conn => {
      const f = this.nodons.find(n => n.id === conn.fromId), t = this.nodons.find(n => n.id === conn.toId);
      if (f && t) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const p1 = { x: f.body.position.x + 50, y: f.body.position.y }, p2 = { x: t.body.position.x - 50, y: t.body.position.y };
        path.setAttribute('d', `M ${p1.x} ${p1.y} C ${p1.x+60} ${p1.y} ${p2.x-60} ${p2.y} ${p2.x} ${p2.y}`);
        path.setAttribute('stroke', 'oklch(0.6 0.3 25)'); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '6');
        svg.appendChild(path);
      }
    });
    if (this.isWiring) {
      const p1 = this.wireStartPort, p2 = this.mouseConstraint.mouse.position;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`);
      path.setAttribute('stroke', 'oklch(0.6 0.3 25)'); path.setAttribute('stroke-dasharray', '8,8'); path.setAttribute('fill', 'none');
      svg.appendChild(path);
    }
  }

  getNodonColor(type) {
    const palette = { 
      ball: 'oklch(0.6 0.3 25)', ramp: 'oklch(0.3 0.1 260)', box: 'oklch(0.8 0.2 80)', 
      floor: 'oklch(0.5 0.05 260)', seesaw: 'oklch(0.6 0.3 25)', pendulum: 'oklch(0.2 0.05 25)', 
      domino: 'oklch(0.6 0.3 25)', hammer: 'oklch(0.2 0.05 25)', sensor: 'oklch(0.6 0.3 25 / 0.2)',
      accelerator: 'oklch(0.7 0.25 40)', 'gate-and': 'oklch(0.6 0.25 150)', 'gate-not': 'oklch(0.6 0.3 25)'
    };
    return palette[type] || 'oklch(0.6 0.3 25)';
  }

  applyLanguage() {
    document.querySelectorAll('[data-lang]').forEach(el => {
      const key = el.dataset.lang;
      if (I18N[this.lang][key]) el.textContent = I18N[this.lang][key];
    });
    lucide.createIcons();
  }

  updateSettingsPanel() {
    const panel = document.getElementById('settings-panel');
    if (!this.selectedNodon) { panel.classList.add('hidden'); return; }
    panel.classList.remove('hidden');
    document.getElementById('node-name').textContent = I18N[this.lang][`nodon_${this.selectedNodon.type.replace('-', '_')}`] || "NODON";
    const type = this.selectedNodon.type;
    document.getElementById('prop-restitution').style.display = ['ball', 'box', 'seesaw', 'pendulum', 'domino'].includes(type) ? 'block' : 'none';
    document.getElementById('prop-delay').style.display = (type === 'timer') ? 'block' : 'none';
    document.getElementById('prop-power').style.display = ['accelerator'].includes(type) ? 'block' : 'none';
    this.inputs.restitution.value = this.selectedNodon.body.restitution;
    this.inputs.delay.value = this.selectedNodon.delay / 1000;
    this.inputs.power.value = this.selectedNodon.power;
  }

  resetSimulation() {
    this.nodons.forEach(n => { 
      Matter.Body.setPosition(n.body, n.initialPos); 
      Matter.Body.setAngle(n.body, n.initialAngle); 
      Matter.Body.setVelocity(n.body, { x: 0, y: 0 }); 
      Matter.Body.setAngularVelocity(n.body, 0); 
    });
    this.goalReached = false;
  }

  clearAll() { Composite.clear(this.world, false); Composite.add(this.world, this.mouseConstraint); this.nodons = []; this.connections = []; this.selectedNodon = null; }
  removeNodon(n) { if (!n) return; Composite.remove(this.world, n.body); if (n.constraint) Composite.remove(this.world, n.constraint); this.nodons = this.nodons.filter(x => x.id !== n.id); this.connections = this.connections.filter(c => c.fromId !== n.id && c.toId !== n.id); this.selectedNodon = null; }
}

lucide.createIcons();
window.addEventListener('DOMContentLoaded', () => { new GoldbergApp(); });
