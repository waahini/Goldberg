const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Vector, Constraint } = Matter;

const I18N = {
  ko: {
    app_title: "골드버그 노돈",
    btn_play: "실행하기", btn_reset: "되돌리기", btn_clear: "전체 삭제",
    cat_phys: "물리 노돈", cat_logic: "논리 노돈",
    nodon_ball: "탱탱공", nodon_ramp: "미끄럼틀", nodon_box: "상자", nodon_floor: "바닥",
    nodon_seesaw: "시소", nodon_pendulum: "진공추", nodon_domino: "도미노", nodon_hammer: "뿅망치",
    nodon_sensor: "감지센서", nodon_accelerator: "부스터", nodon_gate_and: "AND 로봇", nodon_gate_not: "NOT 로봇",
    nodon_timer: "알람시계", nodon_counter: "숫자봇",
    nav_builder: "빌더", nav_history: "탄생일기", nav_manual: "설명서", nav_comment: "댓글",
    success_title: "미션 클리어!", success_msg: "장치가 완벽하게 작동했습니다!"
  },
  en: {
    app_title: "GOLDBERG NODON",
    btn_play: "RUN", btn_reset: "RESET", btn_clear: "CLEAR ALL",
    cat_phys: "PHYSICAL", cat_logic: "LOGIC",
    nodon_ball: "Ball", nodon_ramp: "Ramp", nodon_box: "Box", nodon_floor: "Floor",
    nodon_seesaw: "Seesaw", nodon_pendulum: "Pendulum", nodon_domino: "Domino", nodon_hammer: "Hammer",
    nodon_sensor: "Sensor", nodon_accelerator: "Booster", nodon_gate_and: "AND Gate", nodon_gate_not: "NOT Gate",
    nodon_timer: "Timer", nodon_counter: "Counter",
    nav_builder: "BUILDER", nav_history: "HISTORY", nav_manual: "DOCS", nav_comment: "FORUM",
    success_title: "MISSION CLEAR!", success_msg: "The contraption worked perfectly!"
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
    this.dragPreview = null;
    this.sidebarColumns = 2; // Default to 2 columns as requested
    this.lang = 'ko';

    this.initCanvas();
    this.initControls();
    this.initSidebar();
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
      constraint: { stiffness: 0.1, render: { visible: false } }
    });
    Composite.add(this.world, this.mouseConstraint);
  }

  initSidebar() {
    const toggle = document.getElementById('sidebar-col-toggle');
    const container = document.querySelector('.editor-container');
    if (toggle) {
      toggle.onclick = () => {
        this.sidebarColumns = this.sidebarColumns === 1 ? 2 : 1;
        container.classList.toggle('slim-sidebar', this.sidebarColumns === 1);
        setTimeout(() => {
          this.render.canvas.width = document.getElementById('physics-canvas').clientWidth;
        }, 450);
      };
    }
  }

  initDragAndDrop() {
    const items = document.querySelectorAll('.nodon-item');
    const container = document.getElementById('physics-canvas');

    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('nodon-type', item.dataset.type);
        this.dragPreview = { type: item.dataset.type, x: 0, y: 0 };
      });
      item.addEventListener('dragend', () => this.dragPreview = null);
    });

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      if (this.dragPreview) {
        this.dragPreview.x = e.clientX - rect.left;
        this.dragPreview.y = e.clientY - rect.top;
      }
    });
    
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('nodon-type');
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (type) this.addNodon(type, x, y);
      this.dragPreview = null;
    });
  }

  initControls() {
    document.getElementById('btn-lang-toggle').onclick = () => {
      this.lang = this.lang === 'ko' ? 'en' : 'ko';
      document.getElementById('btn-lang-toggle').textContent = this.lang === 'ko' ? 'EN' : 'KO';
      this.applyLanguage();
    };

    document.getElementById('btn-play').onclick = () => {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) Runner.run(this.runner, this.engine);
      else Runner.stop(this.runner);
      document.getElementById('btn-play').querySelector('span').textContent = this.isPlaying ? (this.lang === 'ko' ? "정지" : "STOP") : (this.lang === 'ko' ? "실행하기" : "RUN");
    };
    
    document.getElementById('btn-reset').onclick = () => this.resetSimulation();
    document.getElementById('btn-clear').onclick = () => this.clearAll();
    document.getElementById('node-delete').onclick = () => this.removeNodon(this.selectedNodon);
    
    this.inputs = {
      restitution: document.getElementById('input-restitution')
    };
    this.inputs.restitution.oninput = (e) => { if (this.selectedNodon) this.selectedNodon.body.restitution = parseFloat(e.target.value); };
  }

  addNodon(type, x, y) {
    const id = Date.now();
    const color = this.getNodonColor(type);
    let body, constraint;
    const common = { label: id.toString(), render: { visible: false } };
    
    switch(type) {
      case 'ball': body = Bodies.circle(x, y, 30, { ...common, friction: 0.01, restitution: 0.8 }); break;
      case 'ramp': body = Bodies.rectangle(x, y, 260, 30, { ...common, angle: Math.PI / 12, isStatic: true }); break;
      case 'box': body = Bodies.rectangle(x, y, 80, 80, { ...common, chamfer: { radius: 15 } }); break;
      case 'floor': body = Bodies.rectangle(x, y, 600, 40, { ...common, isStatic: true, chamfer: { radius: 10 } }); break;
      case 'seesaw': 
        body = Bodies.rectangle(x, y, 300, 20, { ...common, chamfer: { radius: 10 } });
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, stiffness: 1, length: 0 });
        break;
      case 'pendulum':
        body = Bodies.circle(x, y + 160, 35, { ...common, frictionAir: 0, restitution: 1 });
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, stiffness: 0.9, length: 160 });
        break;
      case 'domino': body = Bodies.rectangle(x, y, 20, 70, { ...common, friction: 0.5, density: 0.05, chamfer: { radius: 4 } }); break;
      case 'hammer':
        body = Bodies.rectangle(x + 90, y, 180, 40, { ...common, density: 0.1, chamfer: { radius: 10 } });
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, pointB: { x: -90, y: 0 }, stiffness: 1, length: 0 });
        break;
      case 'sensor': body = Bodies.rectangle(x, y, 100, 100, { ...common, isStatic: true, isSensor: true }); break;
      case 'accelerator': body = Bodies.circle(x, y, 50, { ...common, isStatic: true, isSensor: true }); break;
      case 'gate-and': body = Bodies.rectangle(x, y, 120, 80, { ...common, isStatic: true, isSensor: true, chamfer: { radius: 15 } }); break;
      case 'gate-not': body = Bodies.circle(x, y, 50, { ...common, isStatic: true, isSensor: true }); break;
      case 'timer': body = Bodies.circle(x, y, 50, { ...common, isStatic: true, isSensor: true }); break;
      case 'counter': body = Bodies.rectangle(x, y, 100, 100, { ...common, isStatic: true, chamfer: { radius: 15 } }); break;
    }

    if (body) {
      Composite.add(this.world, body);
      if (constraint) Composite.add(this.world, constraint);
      this.nodons.push({ id, type, body, constraint, initialPos: { x: body.position.x, y: body.position.y }, initialAngle: body.angle, power: 0.2, delay: 1000, isActive: false });
      this.selectedNodon = this.nodons[this.nodons.length - 1];
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
  }

  handleCollisions(bodyA, bodyB) {
    const nA = this.nodons.find(n => n.body === bodyA), nB = this.nodons.find(n => n.body === bodyB);
    if (!nA || !nB) return;
    if (['sensor', 'timer', 'accelerator'].includes(nA.type)) this.triggerNodonLogic(nA, nB.body);
    if (['sensor', 'timer', 'accelerator'].includes(nB.type)) this.triggerNodonLogic(nB, nA.body);
  }

  triggerNodonLogic(source, targetBody) {
    const fire = () => {
      source.isActive = true; setTimeout(() => source.isActive = false, 350);
      this.connections.filter(c => c.fromId === source.id).forEach(c => {
        const target = this.nodons.find(n => n.id === c.toId);
        if (target && target.type === 'accelerator') {
          Matter.Body.applyForce(targetBody, targetBody.position, { x: Math.cos(target.body.angle) * 3, y: Math.sin(target.body.angle) * 3 });
          target.isActive = true; setTimeout(() => target.isActive = false, 350);
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
      this.drawDragPreview();
      this.drawNodonSkins();
    }
    requestAnimationFrame(() => this.animate());
  }

  drawDragPreview() {
    if (!this.dragPreview) return;
    const { type, x, y } = this.dragPreview;
    const svg = document.getElementById('wiring-layer');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${x},${y})`);
    g.setAttribute('opacity', '0.4');
    this.renderSkin(g, type, true);
    svg.appendChild(g);
  }

  drawNodonSkins() {
    const svg = document.getElementById('wiring-layer');
    this.nodons.forEach(nodon => {
      const { x, y } = nodon.body.position;
      const angle = nodon.body.angle;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${x},${y}) rotate(${angle * 180 / Math.PI})`);
      this.renderSkin(g, nodon.type, nodon.isActive);
      svg.appendChild(g);
    });
  }

  renderSkin(g, type, active) {
    const color = this.getNodonColor(type);
    let shape;
    if (['ball', 'accelerator', 'timer', 'pendulum'].includes(type)) {
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shape.setAttribute('r', type === 'ball' ? '30' : '50');
    } else {
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      let w = 80, h = 80;
      if (type === 'ramp') { w = 260; h = 30; }
      else if (type === 'floor') { w = 600; h = 40; }
      else if (type === 'seesaw') { w = 300; h = 20; }
      else if (type === 'domino') { w = 20; h = 70; }
      else if (type === 'hammer') { w = 180; h = 40; }
      shape.setAttribute('x', -w/2); shape.setAttribute('y', -h/2);
      shape.setAttribute('width', w); shape.setAttribute('height', h);
      shape.setAttribute('rx', '15');
    }
    shape.setAttribute('fill', color);
    shape.setAttribute('stroke', '#fff');
    shape.setAttribute('stroke-width', '6');
    g.appendChild(shape);

    this.addFace(g, type, active);
  }

  addFace(g, type, active) {
    const time = Date.now();
    const eyeConfigs = {
      ball: { ox: 14, size: 10, y: -8 },
      ramp: { ox: 50, size: 4, y: -5 },
      sensor: { ox: 20, size: 12, y: -10 },
      default: { ox: 16, size: 8, y: -8 }
    };
    const c = eyeConfigs[type] || eyeConfigs.default;

    [-c.ox, c.ox].forEach(x => {
      const e = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      e.setAttribute('cx', x); e.setAttribute('cy', c.y); e.setAttribute('r', c.size);
      e.setAttribute('fill', active ? '#fff' : '#1A1A1B');
      g.appendChild(e);

      if (!active) {
        const iris = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        iris.setAttribute('cx', x + Math.sin(time/400)*3); iris.setAttribute('cy', c.y); iris.setAttribute('r', c.size/2);
        iris.setAttribute('fill', '#fff');
        g.appendChild(iris);
      }
    });
    const m = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    m.setAttribute('d', `M -10 18 Q 0 ${active ? 35 : 25} 10 18`);
    m.setAttribute('stroke', active ? '#fff' : '#1A1A1B');
    m.setAttribute('fill', 'none'); m.setAttribute('stroke-width', '5');
    m.setAttribute('stroke-linecap', 'round');
    g.appendChild(m);
  }

  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '18');
    c.style.fill = type === 'output' ? 'var(--accent)' : 'var(--primary-dark)';
    c.style.stroke = '#fff'; c.style.strokeWidth = '5'; c.style.pointerEvents = 'auto';
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
        this.createPort(n, n.body.position.x + 70, n.body.position.y, 'output');
        this.createPort(n, n.body.position.x - 70, n.body.position.y, 'input');
      }
    });
  }

  drawWires() {
    const svg = document.getElementById('wiring-layer');
    this.connections.forEach(conn => {
      const f = this.nodons.find(n => n.id === conn.fromId), t = this.nodons.find(n => n.id === conn.toId);
      if (f && t) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const p1 = { x: f.body.position.x + 70, y: f.body.position.y }, p2 = { x: t.body.position.x - 70, y: t.body.position.y };
        path.setAttribute('d', `M ${p1.x} ${p1.y} C ${p1.x+100} ${p1.y} ${p2.x-100} ${p2.y} ${p2.x} ${p2.y}`);
        path.setAttribute('stroke', 'var(--accent)'); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '10');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
      }
    });
    if (this.isWiring) {
      const p1 = this.wireStartPort, p2 = this.mouseConstraint.mouse.position;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`);
      path.setAttribute('stroke', 'var(--accent)'); path.setAttribute('stroke-dasharray', '12,12'); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '5');
      svg.appendChild(path);
    }
  }

  getNodonColor(type) {
    const p = { ball: '#FFD43B', ramp: '#495057', box: '#FF922B', floor: '#212529', seesaw: '#FFD43B', pendulum: '#343A40', domino: '#FF922B', hammer: '#495057', sensor: '#FFFFFF', accelerator: '#51CF66', 'gate-and': '#4DABF7', 'gate-not': '#FF6B6B', timer: '#4DABF7', counter: '#212529' };
    return p[type] || '#FFD43B';
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
    document.getElementById('node-name').textContent = I18N[this.lang][`nodon_${this.selectedNodon.type.replace('-', '_')}`] || "오브젝트";
  }

  resetSimulation() {
    this.nodons.forEach(n => { Matter.Body.setPosition(n.body, n.initialPos); Matter.Body.setAngle(n.body, n.initialAngle); Matter.Body.setVelocity(n.body, { x: 0, y: 0 }); Matter.Body.setAngularVelocity(n.body, 0); });
  }

  clearAll() { Composite.clear(this.world, false); Composite.add(this.world, this.mouseConstraint); this.nodons = []; this.connections = []; this.selectedNodon = null; }
  removeNodon(n) { if (!n) return; Composite.remove(this.world, n.body); if (n.constraint) Composite.remove(this.world, n.constraint); this.nodons = this.nodons.filter(x => x.id !== n.id); this.connections = this.connections.filter(c => c.fromId !== n.id && c.toId !== n.id); this.selectedNodon = null; }
}

window.addEventListener('DOMContentLoaded', () => { new GoldbergApp(); });
