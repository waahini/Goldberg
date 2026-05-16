const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Vector, Constraint } = Matter;

const I18N = {
  ko: {
    app_title: "골드버그 노돈",
    btn_play: "시작하기", btn_reset: "되돌리기", btn_clear: "비우기",
    cat_phys: "물리 오브젝트", cat_logic: "논리 회로",
    nodon_ball: "탱탱공", nodon_ramp: "미끄럼틀", nodon_box: "튼튼상자", nodon_floor: "바닥",
    nodon_seesaw: "시소", nodon_pendulum: "흔들추", nodon_domino: "도미노", nodon_hammer: "뿅망치",
    nodon_sensor: "감지센서", nodon_accelerator: "부스터", nodon_gate_and: "AND 로봇", nodon_gate_not: "NOT 로봇",
    nodon_timer: "알람시계", nodon_counter: "숫자봇",
    success_title: "미션 클리어!", success_msg: "와우! 장치가 완벽하게 작동했어요!"
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
      constraint: { stiffness: 0.1, render: { visible: false } }
    });
    Composite.add(this.world, this.mouseConstraint);

    window.addEventListener('resize', () => {
      this.render.canvas.width = container.clientWidth;
      this.render.canvas.height = container.clientHeight;
    });
  }

  initSidebarToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    const container = document.querySelector('.editor-container');
    if (toggle && container) {
      toggle.onclick = () => container.classList.toggle('sidebar-hidden');
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
    document.getElementById('btn-play').onclick = () => {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) Runner.run(this.runner, this.engine);
      else Runner.stop(this.runner);
      document.getElementById('btn-play').textContent = this.isPlaying ? "정지하기" : "시작하기";
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
    const common = { label: id.toString(), render: { visible: false } }; // Use our custom SVG skins
    
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
    if (['sensor', 'timer', 'accelerator', 'gate-and', 'gate-not'].includes(nA.type)) this.triggerNodonLogic(nA, nB.body);
    if (['sensor', 'timer', 'accelerator', 'gate-and', 'gate-not'].includes(nB.type)) this.triggerNodonLogic(nB, nA.body);
  }

  triggerNodonLogic(source, targetBody) {
    const fire = () => {
      source.isActive = true; setTimeout(() => source.isActive = false, 400);
      this.connections.filter(c => c.fromId === source.id).forEach(c => {
        const target = this.nodons.find(n => n.id === c.toId);
        if (target && target.type === 'accelerator') {
          Matter.Body.applyForce(targetBody, targetBody.position, { x: Math.cos(target.body.angle) * 3, y: Math.sin(target.body.angle) * 3 });
          target.isActive = true; setTimeout(() => target.isActive = false, 400);
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
    g.setAttribute('opacity', '0.5');
    this.renderPremiumSkin(g, type, true);
    svg.appendChild(g);
  }

  drawNodonSkins() {
    const svg = document.getElementById('wiring-layer');
    this.nodons.forEach(nodon => {
      const { x, y } = nodon.body.position;
      const angle = nodon.body.angle;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${x},${y}) rotate(${angle * 180 / Math.PI})`);
      this.renderPremiumSkin(g, nodon.type, nodon.isActive);
      svg.appendChild(g);
    });
  }

  renderPremiumSkin(g, type, active) {
    const color = this.getNodonColor(type);
    
    // Detailed Illustration Engine
    const main = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let d = "";
    if (['ball', 'accelerator', 'gate-not', 'timer', 'pendulum'].includes(type)) {
      const r = type === 'ball' ? 30 : 50;
      d = `M ${-r},0 a ${r},${r} 0 1,0 ${r*2},0 a ${r},${r} 0 1,0 ${-r*2},0`;
    } else {
      let w = 80, h = 80;
      if (type === 'ramp') { w = 260; h = 30; }
      else if (type === 'floor') { w = 600; h = 40; }
      else if (type === 'seesaw') { w = 300; h = 20; }
      else if (type === 'domino') { w = 20; h = 70; }
      else if (type === 'hammer') { w = 180; h = 40; }
      else if (type === 'sensor' || type === 'counter') { w = 100; h = 100; }
      const r = 15;
      d = `M ${-w/2+r},${-h/2} h ${w-r*2} a ${r},${r} 0 0,1 ${r},${r} v ${h-r*2} a ${r},${r} 0 0,1 ${-r},${r} h ${-w+r*2} a ${r},${r} 0 0,1 ${-r},${-r} v ${-h+r*2} a ${r},${r} 0 0,1 ${r},${-r} z`;
    }
    
    main.setAttribute('d', d);
    main.setAttribute('fill', color);
    main.setAttribute('stroke', '#fff');
    main.setAttribute('stroke-width', '6');
    main.style.filter = 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))';
    g.appendChild(main);

    // Inner Glow/Shadow for 3D feel
    const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    highlight.setAttribute('d', d);
    highlight.setAttribute('fill', 'rgba(255,255,255,0.2)');
    highlight.setAttribute('transform', 'scale(0.9, 0.8) translate(0, -2)');
    g.appendChild(highlight);

    this.drawDetailedFace(g, type, active);
  }

  drawDetailedFace(g, type, active) {
    const time = Date.now();
    const config = {
      ball: { eyeSize: 10, eyeY: -8, spacing: 14, eyebrow: true, blush: true },
      ramp: { eyeSize: 4, eyeY: -5, spacing: 50, glass: true },
      sensor: { eyeSize: 12, eyeY: -10, spacing: 20, alert: true },
      accelerator: { eyeSize: 8, eyeY: -8, spacing: 18, wings: true },
      default: { eyeSize: 8, eyeY: -8, spacing: 16 }
    };
    const c = config[type] || config.default;

    // Blush
    if (c.blush) {
      [-20, 20].forEach(bx => {
        const b = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        b.setAttribute('cx', bx); b.setAttribute('cy', 5); b.setAttribute('r', 8);
        b.setAttribute('fill', 'rgba(255,100,100,0.3)');
        g.appendChild(b);
      });
    }

    // Eyes
    [-c.spacing, c.spacing].forEach(ox => {
      const e = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      e.setAttribute('cx', ox); e.setAttribute('cy', c.eyeY); e.setAttribute('r', c.eyeSize);
      e.setAttribute('fill', active ? '#fff' : '#1A1A1B');
      g.appendChild(e);

      if (!active) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const pX = ox + Math.sin(time/400)*3;
        const pY = c.eyeY + Math.cos(time/400)*2;
        p.setAttribute('cx', pX); p.setAttribute('cy', pY); p.setAttribute('r', c.eyeSize/2);
        p.setAttribute('fill', '#fff');
        g.appendChild(p);
        
        const shine = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        shine.setAttribute('cx', pX - 2); shine.setAttribute('cy', pY - 2); shine.setAttribute('r', 1.5);
        shine.setAttribute('fill', '#fff');
        g.appendChild(shine);
      }
    });

    // Mouth
    const m = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let mD = `M ${-c.spacing/2} 18 Q 0 ${active ? 35 : 25} ${c.spacing/2} 18`;
    if (type === 'sensor') mD = `M -8 20 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0`;
    m.setAttribute('d', mD);
    m.setAttribute('stroke', active ? '#fff' : '#1A1A1B');
    m.setAttribute('fill', active ? '#FF6B6B' : 'none');
    m.setAttribute('stroke-width', '5');
    m.setAttribute('stroke-linecap', 'round');
    g.appendChild(m);
  }

  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '18');
    c.style.fill = type === 'output' ? 'var(--accent)' : 'var(--secondary)';
    c.style.stroke = '#fff'; c.style.strokeWidth = '5'; c.style.pointerEvents = 'auto';
    c.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))';
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
      if (I18N['ko'][key]) el.textContent = I18N['ko'][key];
    });
  }

  updateSettingsPanel() {
    const panel = document.getElementById('settings-panel');
    if (!this.selectedNodon) { panel.classList.add('hidden'); return; }
    panel.classList.remove('hidden');
    document.getElementById('node-name').textContent = I18N['ko'][`nodon_${this.selectedNodon.type.replace('-', '_')}`] || "오브젝트";
  }

  resetSimulation() {
    this.nodons.forEach(n => { Matter.Body.setPosition(n.body, n.initialPos); Matter.Body.setAngle(n.body, n.initialAngle); Matter.Body.setVelocity(n.body, { x: 0, y: 0 }); Matter.Body.setAngularVelocity(n.body, 0); });
  }

  clearAll() { Composite.clear(this.world, false); Composite.add(this.world, this.mouseConstraint); this.nodons = []; this.connections = []; this.selectedNodon = null; }
  removeNodon(n) { if (!n) return; Composite.remove(this.world, n.body); if (n.constraint) Composite.remove(this.world, n.constraint); this.nodons = this.nodons.filter(x => x.id !== n.id); this.connections = this.connections.filter(c => c.fromId !== n.id && c.toId !== n.id); this.selectedNodon = null; }
}

window.addEventListener('DOMContentLoaded', () => { new GoldbergApp(); });
