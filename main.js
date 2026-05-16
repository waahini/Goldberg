const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Vector, Constraint } = Matter;

const I18N = {
  ko: {
    app_title: "GOLDBERG NODON",
    btn_play: "RUN", btn_reset: "RESET", btn_clear: "CLEAR",
    cat_phys: "PHYSICS", cat_logic: "LOGIC",
    nodon_ball: "탱탱공", nodon_ramp: "미끄럼틀", nodon_box: "상자", nodon_floor: "바닥",
    nodon_sensor: "센서", nodon_accelerator: "부스터", nodon_timer: "타이머",
    success_title: "COMPLETE", success_msg: "장치가 완벽하게 작동했습니다!"
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
    this.sidebarColumns = 1;

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
        container.classList.toggle('wide-sidebar', this.sidebarColumns === 2);
        setTimeout(() => {
          this.render.canvas.width = document.getElementById('physics-canvas').clientWidth;
          this.render.canvas.height = document.getElementById('physics-canvas').clientHeight;
        }, 550);
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
    document.getElementById('btn-play').onclick = () => {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) Runner.run(this.runner, this.engine);
      else Runner.stop(this.runner);
      document.getElementById('btn-play').querySelector('span').textContent = this.isPlaying ? "STOP" : "RUN";
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
  }

  addNodon(type, x, y) {
    const id = Date.now();
    const color = this.getNodonColor(type);
    let body, constraint;
    const common = { label: id.toString(), render: { visible: false } };
    
    switch(type) {
      case 'ball': body = Bodies.circle(x, y, 25, { ...common, friction: 0.01, restitution: 0.8 }); break;
      case 'ramp': body = Bodies.rectangle(x, y, 240, 24, { ...common, angle: Math.PI / 12, isStatic: true }); break;
      case 'box': body = Bodies.rectangle(x, y, 70, 70, { ...common, chamfer: { radius: 10 } }); break;
      case 'floor': body = Bodies.rectangle(x, y, 500, 30, { ...common, isStatic: true, chamfer: { radius: 5 } }); break;
      case 'sensor': body = Bodies.rectangle(x, y, 80, 80, { ...common, isStatic: true, isSensor: true }); break;
      case 'accelerator': body = Bodies.circle(x, y, 45, { ...common, isStatic: true, isSensor: true }); break;
      case 'timer': body = Bodies.circle(x, y, 45, { ...common, isStatic: true, isSensor: true }); break;
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
      source.isActive = true; setTimeout(() => source.isActive = false, 300);
      this.connections.filter(c => c.fromId === source.id).forEach(c => {
        const target = this.nodons.find(n => n.id === c.toId);
        if (target && target.type === 'accelerator') {
          Matter.Body.applyForce(targetBody, targetBody.position, { x: Math.cos(target.body.angle) * 2.5, y: Math.sin(target.body.angle) * 2.5 });
          target.isActive = true; setTimeout(() => target.isActive = false, 300);
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
    if (['ball', 'accelerator', 'timer'].includes(type)) {
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shape.setAttribute('r', type === 'ball' ? '25' : '45');
    } else {
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      let w = 70, h = 70;
      if (type === 'ramp') { w = 240; h = 24; }
      else if (type === 'floor') { w = 500; h = 30; }
      shape.setAttribute('x', -w/2); shape.setAttribute('y', -h/2);
      shape.setAttribute('width', w); shape.setAttribute('height', h);
      shape.setAttribute('rx', '12');
    }
    shape.setAttribute('fill', color);
    shape.setAttribute('stroke', '#fff');
    shape.setAttribute('stroke-width', '4');
    g.appendChild(shape);

    this.addFace(g, type, active);
  }

  addFace(g, type, active) {
    const ox = 12, size = 6;
    [-ox, ox].forEach(x => {
      const e = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      e.setAttribute('cx', x); e.setAttribute('cy', -5); e.setAttribute('r', size);
      e.setAttribute('fill', active ? '#fff' : '#212529');
      g.appendChild(e);
    });
    const m = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    m.setAttribute('d', `M -10 15 Q 0 ${active ? 25 : 20} 10 15`);
    m.setAttribute('stroke', active ? '#fff' : '#212529');
    m.setAttribute('fill', 'none'); m.setAttribute('stroke-width', '4');
    g.appendChild(m);
  }

  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '15');
    c.style.fill = type === 'output' ? 'var(--accent)' : 'var(--secondary)';
    c.style.stroke = '#fff'; c.style.strokeWidth = '4'; c.style.pointerEvents = 'auto';
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
      if (['sensor', 'timer', 'accelerator'].includes(n.type)) {
        this.createPort(n, n.body.position.x + 60, n.body.position.y, 'output');
        this.createPort(n, n.body.position.x - 60, n.body.position.y, 'input');
      }
    });
  }

  drawWires() {
    const svg = document.getElementById('wiring-layer');
    this.connections.forEach(conn => {
      const f = this.nodons.find(n => n.id === conn.fromId), t = this.nodons.find(n => n.id === conn.toId);
      if (f && t) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const p1 = { x: f.body.position.x + 60, y: f.body.position.y }, p2 = { x: t.body.position.x - 60, y: t.body.position.y };
        path.setAttribute('d', `M ${p1.x} ${p1.y} C ${p1.x+80} ${p1.y} ${p2.x-80} ${p2.y} ${p2.x} ${p2.y}`);
        path.setAttribute('stroke', 'var(--accent)'); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '8');
        svg.appendChild(path);
      }
    });
    if (this.isWiring) {
      const p1 = this.wireStartPort, p2 = this.mouseConstraint.mouse.position;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`);
      path.setAttribute('stroke', 'var(--accent)'); path.setAttribute('stroke-dasharray', '10,10'); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '4');
      svg.appendChild(path);
    }
  }

  getNodonColor(type) {
    const p = { ball: '#ffd43b', ramp: '#adb5bd', box: '#ff922b', floor: '#495057', sensor: '#ffffff', accelerator: '#51cf66', timer: '#4dabf7' };
    return p[type] || '#ffd43b';
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
