const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Vector, Constraint } = Matter;

const I18N = {
  ko: {
    app_title: "골드버그 노돈",
    btn_play: "실행하기", btn_reset: "되돌리기", btn_clear: "전체 삭제",
    cat_phys: "물리 노돈", cat_logic: "논리 노돈",
    nodon_ball: "탱탱공", nodon_ramp: "미끄럼틀", nodon_box: "상자", nodon_floor: "바닥",
    nodon_seesaw: "시소", nodon_pendulum: "흔들추", nodon_domino: "도미노", nodon_hammer: "뿅망치",
    nodon_sensor: "감지센서", nodon_accelerator: "부스터", nodon_gate_and: "AND 로봇", nodon_gate_not: "NOT 로봇", nodon_gate_or: "OR 로봇",
    nodon_timer: "알람시계", nodon_counter: "숫자봇",
    nav_builder: "빌더", nav_history: "탄생일기", nav_manual: "설명서", nav_comment: "댓글",
    prop_bounce: "탄성 (Bounce)", prop_angle: "기울기 (Angle)",
    success_title: "미션 클리어!", success_msg: "장치가 완벽하게 작동했습니다!"
  },
  en: {
    app_title: "GOLDBERG NODON",
    btn_play: "RUN", btn_reset: "RESET", btn_clear: "CLEAR ALL",
    cat_phys: "PHYSICAL", cat_logic: "LOGIC",
    nodon_ball: "Ball", nodon_ramp: "Ramp", nodon_box: "Box", nodon_floor: "Floor",
    nodon_seesaw: "Seesaw", nodon_pendulum: "Pendulum", nodon_domino: "Domino", nodon_hammer: "Hammer",
    nodon_sensor: "Sensor", nodon_accelerator: "Booster", nodon_gate_and: "AND Gate", nodon_gate_not: "NOT Gate", nodon_gate_or: "OR Gate",
    nodon_timer: "Timer", nodon_counter: "Counter",
    nav_builder: "BUILDER", nav_history: "HISTORY", nav_manual: "DOCS", nav_comment: "FORUM",
    prop_bounce: "Elasticity", prop_angle: "Rotation",
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
    this.sidebarColumns = 2;
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
      options: { width: container.clientWidth, height: container.clientHeight, wireframes: false, background: 'transparent', pixelRatio: window.devicePixelRatio || 1 }
    });
    Render.run(this.render);
    this.runner = Runner.create();
    const mouse = Mouse.create(this.render.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine, { mouse: mouse, constraint: { stiffness: 0.1, render: { visible: false } } });
    Composite.add(this.world, this.mouseConstraint);
  }

  initSidebar() {
    const toggle = document.getElementById('sidebar-col-toggle');
    const container = document.querySelector('.editor-container');
    if (toggle) {
      toggle.onclick = () => {
        this.sidebarColumns = this.sidebarColumns === 1 ? 2 : 1;
        container.classList.toggle('slim-sidebar', this.sidebarColumns === 1);
        setTimeout(() => { if (this.render.canvas) this.render.canvas.width = document.getElementById('physics-canvas').clientWidth; }, 450);
      };
    }
  }

  initDragAndDrop() {
    const items = document.querySelectorAll('.nodon-item');
    const container = document.getElementById('physics-canvas');
    items.forEach(item => {
      item.ondragstart = (e) => { e.dataTransfer.setData('nodon-type', item.dataset.type); this.dragPreview = { type: item.dataset.type, x: 0, y: 0 }; };
      item.ondragend = () => this.dragPreview = null;
    });
    container.ondragover = (e) => { e.preventDefault(); const rect = container.getBoundingClientRect(); if (this.dragPreview) { this.dragPreview.x = e.clientX - rect.left; this.dragPreview.y = e.clientY - rect.top; } };
    container.ondrop = (e) => { e.preventDefault(); const type = e.dataTransfer.getData('nodon-type'); const rect = container.getBoundingClientRect(); const x = e.clientX - rect.left, y = e.clientY - rect.top; if (type) this.addNodon(type, x, y); this.dragPreview = null; };
  }

  initControls() {
    document.getElementById('btn-lang-toggle').onclick = () => { this.lang = this.lang === 'ko' ? 'en' : 'ko'; document.getElementById('btn-lang-toggle').textContent = this.lang === 'ko' ? 'EN' : 'KO'; this.applyLanguage(); };
    document.getElementById('btn-play').onclick = () => { this.isPlaying = !this.isPlaying; if (this.isPlaying) Runner.run(this.runner, this.engine); else Runner.stop(this.runner); document.getElementById('btn-play').querySelector('span').textContent = this.isPlaying ? (this.lang === 'ko' ? "정지" : "STOP") : (this.lang === 'ko' ? "실행하기" : "RUN"); };
    document.getElementById('btn-reset').onclick = () => this.resetSimulation();
    document.getElementById('btn-clear').onclick = () => this.clearAll();
    document.getElementById('node-delete').onclick = () => this.removeNodon(this.selectedNodon);
    this.inputs = { restitution: document.getElementById('input-restitution'), angle: document.getElementById('input-angle') };
    this.inputs.restitution.oninput = (e) => { if (this.selectedNodon) this.selectedNodon.body.restitution = parseFloat(e.target.value); };
    this.inputs.angle.oninput = (e) => { if (this.selectedNodon) { const a = parseFloat(e.target.value) * (Math.PI / 180); Matter.Body.setAngle(this.selectedNodon.body, a); this.selectedNodon.initialAngle = a; } };
  }

  addNodon(type, x, y) {
    const id = Date.now();
    let body, constraint;
    const common = { label: id.toString(), render: { visible: false } };
    switch(type) {
      case 'ball': body = Bodies.circle(x, y, 28, { ...common, friction: 0.01, restitution: 0.8 }); break;
      case 'ramp': body = Bodies.rectangle(x, y, 260, 22, { ...common, angle: Math.PI / 12, isStatic: true }); break;
      case 'box': body = Bodies.rectangle(x, y, 80, 80, { ...common, chamfer: { radius: 15 } }); break;
      case 'floor': body = Bodies.rectangle(x, y, 600, 30, { ...common, isStatic: true }); break;
      case 'seesaw': body = Bodies.rectangle(x, y, 300, 18, common); constraint = Constraint.create({ pointA: { x, y }, bodyB: body, stiffness: 1, length: 0 }); break;
      case 'pendulum': body = Bodies.circle(x, y + 160, 35, { ...common, frictionAir: 0, restitution: 1 }); constraint = Constraint.create({ pointA: { x, y }, bodyB: body, stiffness: 0.9, length: 160 }); break;
      case 'domino': body = Bodies.rectangle(x, y, 18, 70, { ...common, friction: 0.5, density: 0.05 }); break;
      case 'hammer': body = Bodies.rectangle(x + 90, y, 180, 35, { ...common, density: 0.1 }); constraint = Constraint.create({ pointA: { x, y }, bodyB: body, pointB: { x: -90, y: 0 }, stiffness: 1, length: 0 }); break;
      case 'sensor': body = Bodies.rectangle(x, y, 100, 100, { ...common, isStatic: true, isSensor: true }); break;
      case 'accelerator': body = Bodies.circle(x, y, 50, { ...common, isStatic: true, isSensor: true }); break;
      case 'gate-and': case 'gate-or': body = Bodies.rectangle(x, y, 120, 80, { ...common, isStatic: true, isSensor: true }); break;
      case 'gate-not': body = Bodies.circle(x, y, 50, { ...common, isStatic: true, isSensor: true }); break;
      case 'timer': body = Bodies.circle(x, y, 50, { ...common, isStatic: true, isSensor: true }); break;
      case 'counter': body = Bodies.rectangle(x, y, 100, 100, { ...common, isStatic: true }); break;
    }
    if (body) {
      Composite.add(this.world, body);
      if (constraint) Composite.add(this.world, constraint);
      this.nodons.push({ id, type, body, constraint, initialPos: { x: body.position.x, y: body.position.y }, initialAngle: body.angle, isActive: false, signals: new Map() });
      this.selectedNodon = this.nodons[this.nodons.length - 1];
    }
  }

  initEvents() {
    Events.on(this.engine, 'collisionStart', (event) => { event.pairs.forEach(pair => this.handleCollisions(pair.bodyA, pair.bodyB)); });
    const canvas = this.render.canvas;
    canvas.onmousedown = (e) => { const rect = canvas.getBoundingClientRect(); const mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top }; const clickedBody = Matter.Query.point(Composite.allBodies(this.world), mousePos)[0]; this.selectedNodon = clickedBody ? this.nodons.find(n => n.body === clickedBody) : null; };
  }

  handleCollisions(bodyA, bodyB) {
    const nA = this.nodons.find(n => n.body === bodyA), nB = this.nodons.find(n => n.body === bodyB);
    if (!nA || !nB) return;
    if (['sensor', 'timer', 'accelerator', 'gate-and', 'gate-or', 'gate-not'].includes(nA.type)) this.triggerLogic(nA, nB.body);
    if (['sensor', 'timer', 'accelerator', 'gate-and', 'gate-or', 'gate-not'].includes(nB.type)) this.triggerLogic(nB, nA.body);
  }

  triggerLogic(source, targetBody) {
    const fire = () => {
      source.isActive = true; setTimeout(() => source.isActive = false, 350);
      this.connections.filter(c => c.fromId === source.id).forEach(c => {
        const target = this.nodons.find(n => n.id === c.toId);
        if (target && target.type === 'accelerator') { Matter.Body.applyForce(targetBody, targetBody.position, { x: Math.cos(target.body.angle) * 3, y: Math.sin(target.body.angle) * 3 }); target.isActive = true; setTimeout(() => target.isActive = false, 350); }
      });
    };
    if (source.type === 'timer') setTimeout(fire, 1000); else fire();
  }

  animate() {
    const svg = document.getElementById('wiring-layer');
    if (svg) { svg.innerHTML = ''; this.drawWires(); this.drawPorts(); this.drawDragPreview(); this.drawNodonSkins(); }
    requestAnimationFrame(() => this.animate());
  }

  drawDragPreview() { if (!this.dragPreview) return; const { type, x, y } = this.dragPreview; const svg = document.getElementById('wiring-layer'); const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('transform', `translate(${x},${y})`); g.setAttribute('opacity', '0.5'); this.renderUniqueSkin(g, type, true); svg.appendChild(g); }

  drawNodonSkins() {
    const svg = document.getElementById('wiring-layer');
    this.nodons.forEach(nodon => {
      const { x, y } = nodon.body.position; const angle = nodon.body.angle;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('transform', `translate(${x},${y}) rotate(${angle * 180 / Math.PI})`);
      this.renderUniqueSkin(g, nodon.type, nodon.isActive);
      svg.appendChild(g);
    });
  }

  renderUniqueSkin(g, type, active) {
    const color = this.getNodonColor(type);
    const main = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let d = "";
    if (['ball', 'accelerator', 'timer', 'pendulum', 'gate-not'].includes(type)) {
      const r = type === 'ball' ? 28 : 45; d = `M ${-r},0 a ${r},${r} 0 1,0 ${r*2},0 a ${r},${r} 0 1,0 ${-r*2},0`;
    } else {
      let w = 80, h = 80;
      if (type === 'ramp') { w = 260; h = 22; } else if (type === 'floor') { w = 600; h = 30; } else if (type === 'seesaw') { w = 300; h = 18; } else if (type === 'domino') { w = 18; h = 70; } else if (type === 'hammer') { w = 180; h = 35; }
      const r = 12; d = `M ${-w/2+r},${-h/2} h ${w-r*2} a ${r},${r} 0 0,1 ${r},${r} v ${h-r*2} a ${r},${r} 0 0,1 ${-r},${r} h ${-w+r*2} a ${r},${r} 0 0,1 ${-r},${-r} v ${-h+r*2} a ${r},${r} 0 0,1 ${r},${-r} z`;
    }
    main.setAttribute('d', d); main.setAttribute('fill', color); main.setAttribute('stroke', '#fff'); main.setAttribute('stroke-width', '4');
    g.appendChild(main);

    // Decorative Features per Type
    if (type === 'sensor') {
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('r', '35'); ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', 'rgba(255,255,255,0.5)'); ring.setAttribute('stroke-width', '4'); ring.setAttribute('stroke-dasharray', '8,4'); g.appendChild(ring);
    } else if (type === 'accelerator') {
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arrow.setAttribute('d', 'M -20 0 L 10 0 M 0 -15 L 20 0 L 0 15'); arrow.setAttribute('stroke', '#fff'); arrow.setAttribute('stroke-width', '8'); arrow.setAttribute('fill', 'none'); g.appendChild(arrow);
    } else if (type === 'gate-and') {
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text'); txt.textContent = "&"; txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('y', '15'); txt.setAttribute('fill', '#fff'); txt.setAttribute('font-size', '40'); txt.setAttribute('font-weight', '900'); g.appendChild(txt);
    }

    this.addFace(g, type, active);
  }

  addFace(g, type, active) {
    const time = Date.now();
    const c = { ball: { ox: 12, s: 8, y: -8 }, ramp: { ox: 40, s: 3, y: -5 }, default: { ox: 15, s: 6, y: -8 } }[type] || { ox: 15, s: 6, y: -8 };
    [-c.ox, c.ox].forEach(x => {
      const e = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); e.setAttribute('cx', x); e.setAttribute('cy', c.y); e.setAttribute('r', c.s); e.setAttribute('fill', active ? '#fff' : '#1A1A1B'); g.appendChild(e);
      if (!active) { const iris = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); iris.setAttribute('cx', x + Math.sin(time/400)*2); iris.setAttribute('cy', c.y); iris.setAttribute('r', c.s/2); iris.setAttribute('fill', '#fff'); g.appendChild(iris); }
    });
    const m = document.createElementNS('http://www.w3.org/2000/svg', 'path'); m.setAttribute('d', `M -8 18 Q 0 ${active ? 30 : 25} 8 18`); m.setAttribute('stroke', active ? '#fff' : '#1A1A1B'); m.setAttribute('fill', 'none'); m.setAttribute('stroke-width', '4'); g.appendChild(m);
  }

  getNodonColor(type) { return { ball: '#FFD43B', ramp: '#4dabf7', box: '#ff922b', floor: '#495057', seesaw: '#51cf66', pendulum: '#f06595', domino: '#cc5de8', hammer: '#343a40', sensor: '#ffffff', accelerator: '#20c997', 'gate-and': '#6741d9', 'gate-or': '#fd7e14', 'gate-not': '#ff6b6b', timer: '#4dabf7', counter: '#212529' }[type] || '#FFD43B'; }
  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer'); const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '16'); c.style.fill = type === 'output' ? 'var(--accent)' : 'var(--primary-dark)'; c.style.stroke = '#fff'; c.style.strokeWidth = '4'; c.style.pointerEvents = 'auto';
    c.onmousedown = (e) => { e.stopPropagation(); if (type === 'output') { this.isWiring = true; this.wireStartPort = { nodon, x, y }; } else if (this.isWiring) { this.connections.push({ fromId: this.wireStartPort.nodon.id, toId: nodon.id }); this.isWiring = false; } }; svg.appendChild(c);
  }
  drawPorts() { if (this.isPlaying) return; this.nodons.forEach(n => { if (['sensor', 'timer', 'counter', 'accelerator', 'gate-and', 'gate-or', 'gate-not'].includes(n.type)) { this.createPort(n, n.body.position.x + 70, n.body.position.y, 'output'); this.createPort(n, n.body.position.x - 70, n.body.position.y, 'input'); } }); }
  drawWires() {
    const svg = document.getElementById('wiring-layer');
    this.connections.forEach(conn => {
      const f = this.nodons.find(n => n.id === conn.fromId), t = this.nodons.find(n => n.id === conn.toId);
      if (f && t) { const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); const p1 = { x: f.body.position.x + 70, y: f.body.position.y }, p2 = { x: t.body.position.x - 70, y: t.body.position.y }; path.setAttribute('d', `M ${p1.x} ${p1.y} C ${p1.x+100} ${p1.y} ${p2.x-100} ${p2.y} ${p2.x} ${p2.y}`); path.setAttribute('stroke', 'var(--accent)'); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '8'); svg.appendChild(path); }
    });
    if (this.isWiring) { const p1 = this.wireStartPort, p2 = this.mouseConstraint.mouse.position; const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`); path.setAttribute('stroke', 'var(--accent)'); path.setAttribute('stroke-dasharray', '10,10'); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '4'); svg.appendChild(path); }
  }
  applyLanguage() { document.querySelectorAll('[data-lang]').forEach(el => { const key = el.dataset.lang; if (I18N[this.lang][key]) el.textContent = I18N[this.lang][key]; }); lucide.createIcons(); }
  updateSettingsPanel() { const panel = document.getElementById('settings-panel'); if (!this.selectedNodon) { panel.classList.add('hidden'); return; } panel.classList.remove('hidden'); document.getElementById('node-name').textContent = I18N[this.lang][`nodon_${this.selectedNodon.type.replace('-', '_')}`] || "오브젝트"; this.inputs.restitution.value = this.selectedNodon.body.restitution; this.inputs.angle.value = (this.selectedNodon.body.angle * 180 / Math.PI) % 360; }
  resetSimulation() { this.nodons.forEach(n => { Matter.Body.setPosition(n.body, n.initialPos); Matter.Body.setAngle(n.body, n.initialAngle); Matter.Body.setVelocity(n.body, { x: 0, y: 0 }); Matter.Body.setAngularVelocity(n.body, 0); }); }
  clearAll() { Composite.clear(this.world, false); Composite.add(this.world, this.mouseConstraint); this.nodons = []; this.connections = []; this.selectedNodon = null; }
  removeNodon(n) { if (!n) return; Composite.remove(this.world, n.body); if (n.constraint) Composite.remove(this.world, n.constraint); this.nodons = this.nodons.filter(x => x.id !== n.id); this.connections = this.connections.filter(c => c.fromId !== n.id && c.toId !== n.id); this.selectedNodon = null; }
}
window.addEventListener('DOMContentLoaded', () => { new GoldbergApp(); });
