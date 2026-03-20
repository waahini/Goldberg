// Initialize Lucide icons
lucide.createIcons();

const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Vector } = Matter;

class GoldbergApp {
  constructor() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.isPlaying = false;
    this.nodons = [];
    this.connections = []; // { fromId, toId }
    this._selectedNodon = null;
    this.isWiring = false;
    this.wireStartPort = null;
    this.goalReached = false;

    this.initCanvas();
    this.initControls();
    this.initDragAndDrop();
    this.initEvents();
    this.initSuccessUI();
    this.initSettingsPanel();
    
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'r' && this.selectedNodon) {
        const body = this.selectedNodon.body;
        Matter.Body.setAngle(body, body.angle + Math.PI / 12);
        this.selectedNodon.initialAngle = body.angle;
      }
      if (e.key === 'Delete' && this.selectedNodon) {
        this.removeNodon(this.selectedNodon);
      }
    });

    this.animate();
  }

  get selectedNodon() { return this._selectedNodon; }
  set selectedNodon(val) {
    this._selectedNodon = val;
    this.updateSettingsPanel();
  }

  initSettingsPanel() {
    this.panel = document.getElementById('settings-panel');
    this.btnDelete = document.getElementById('node-delete');
    this.btnDelete.onclick = () => this.removeNodon(this.selectedNodon);

    // Property Inputs
    this.inputs = {
      restitution: document.getElementById('input-restitution'),
      delay: document.getElementById('input-delay'),
      power: document.getElementById('input-power')
    };

    this.inputs.restitution.oninput = (e) => {
      if (this.selectedNodon) this.selectedNodon.body.restitution = parseFloat(e.target.value);
    };
    this.inputs.delay.oninput = (e) => {
      if (this.selectedNodon) this.selectedNodon.delay = parseFloat(e.target.value) * 1000;
    };
    this.inputs.power.oninput = (e) => {
      if (this.selectedNodon) this.selectedNodon.power = parseFloat(e.target.value);
    };
  }

  updateSettingsPanel() {
    if (!this.selectedNodon) {
      this.panel.classList.add('hidden');
      return;
    }
    this.panel.classList.remove('hidden');
    document.getElementById('node-name').textContent = this.selectedNodon.type.toUpperCase();

    // Show/Hide relevant props
    const type = this.selectedNodon.type;
    document.getElementById('prop-restitution').style.display = ['ball', 'box'].includes(type) ? 'block' : 'none';
    document.getElementById('prop-delay').style.display = (type === 'timer') ? 'block' : 'none';
    document.getElementById('prop-power').style.display = ['fan', 'magnet'].includes(type) ? 'block' : 'none';

    // Set values
    this.inputs.restitution.value = this.selectedNodon.body.restitution || 0.5;
    this.inputs.delay.value = (this.selectedNodon.delay || 1000) / 1000;
    this.inputs.power.value = this.selectedNodon.power || 0.05;
  }

  initSuccessUI() {
    const msg = document.createElement('div');
    msg.id = 'success-msg';
    msg.innerHTML = '<h2>골인 성공!</h2><p>환상적인 장치입니다!</p>';
    document.body.appendChild(msg);
    this.successMsg = msg;
  }

  removeNodon(nodon) {
    if (!nodon) return;
    Composite.remove(this.world, nodon.body);
    this.nodons = this.nodons.filter(n => n.id !== nodon.id);
    this.connections = this.connections.filter(c => c.fromId !== nodon.id && c.toId !== nodon.id);
    this.selectedNodon = null;
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
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(this.world, this.mouseConstraint);
    this.render.mouse = mouse;

    window.addEventListener('resize', () => {
      this.render.canvas.width = container.clientWidth;
      this.render.canvas.height = container.clientHeight;
    });
  }

  initControls() {
    const btnPlay = document.getElementById('btn-play');
    const btnReset = document.getElementById('btn-reset');
    const btnClear = document.getElementById('btn-clear');

    btnPlay.addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      this.goalReached = false;
      btnPlay.innerHTML = this.isPlaying ? '<i data-lucide="pause"></i> 정지' : '<i data-lucide="play"></i> 시작';
      lucide.createIcons();
      if (this.isPlaying) Runner.run(this.runner, this.engine);
      else Runner.stop(this.runner);
    });

    btnReset.addEventListener('click', () => {
      this.resetSimulation();
      this.goalReached = false;
      this.successMsg.classList.remove('show');
    });
    btnClear.addEventListener('click', () => this.clearAll());
  }

  initDragAndDrop() {
    const items = document.querySelectorAll('.nodon-item');
    items.forEach(item => {
      item.addEventListener('dragstart', (e) => e.dataTransfer.setData('type', item.dataset.type));
    });

    const container = document.getElementById('physics-canvas');
    container.addEventListener('dragover', (e) => e.preventDefault());
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('type');
      const rect = container.getBoundingClientRect();
      this.addNodon(type, e.clientX - rect.left, e.clientY - rect.top);
    });
  }

  initEvents() {
    Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => this.handleCollisions(pair.bodyA, pair.bodyB));
    });

    const canvas = this.render.canvas;
    canvas.addEventListener('mousedown', (e) => {
      if (this.isPlaying) return;
      const mousePos = { x: e.offsetX, y: e.offsetY };
      const clickedBody = Matter.Query.point(Composite.allBodies(this.world), mousePos)[0];
      if (clickedBody) this.selectedNodon = this.nodons.find(n => n.body === clickedBody);
      else if (!e.target.classList || !e.target.classList.contains('port')) this.selectedNodon = null;
    });
  }

  handleCollisions(bodyA, bodyB) {
    this.triggerNodonLogic(bodyA, bodyB);
    this.triggerNodonLogic(bodyB, bodyA);

    const nodonA = this.nodons.find(n => n.body === bodyA);
    const nodonB = this.nodons.find(n => n.body === bodyB);

    // Warp Logic
    if (nodonA?.type === 'warp-a' && nodonB?.type === 'ball') this.teleport(nodonB.body, 'warp-b');
    if (nodonB?.type === 'warp-a' && nodonA?.type === 'ball') this.teleport(nodonA.body, 'warp-b');

    // Goal Logic
    if ((nodonA?.type === 'goal' && nodonB?.type === 'ball') || (nodonB?.type === 'goal' && nodonA?.type === 'ball')) {
      this.reachGoal();
    }
  }

  teleport(body, targetType) {
    const target = this.nodons.find(n => n.type === targetType);
    if (target) {
      Matter.Body.setPosition(body, { x: target.body.position.x, y: target.body.position.y });
    }
  }

  reachGoal() {
    if (this.goalReached) return;
    this.goalReached = true;
    this.successMsg.classList.add('show');
    setTimeout(() => this.successMsg.classList.remove('show'), 3000);
  }

  addNodon(type, x, y) {
    let body;
    const id = Date.now();
    const options = { label: id.toString(), render: { fillStyle: this.getNodonColor(type) } };

    switch(type) {
      case 'ball': body = Bodies.circle(x, y, 15, { ...options, friction: 0.005, restitution: 0.5 }); break;
      case 'ramp': body = Bodies.rectangle(x, y, 150, 20, { ...options, angle: Math.PI / 10, isStatic: true }); break;
      case 'box': body = Bodies.rectangle(x, y, 40, 40, options); break;
      case 'floor': body = Bodies.rectangle(x, y, 300, 20, { ...options, isStatic: true }); break;
      case 'goal': body = Bodies.rectangle(x, y, 60, 40, { ...options, isStatic: true }); break;
      case 'fan': body = Bodies.circle(x, y, 25, { ...options, isStatic: true }); break;
      case 'sensor': body = Bodies.rectangle(x, y, 60, 60, { ...options, isStatic: true, isSensor: true }); break;
      case 'timer': body = Bodies.circle(x, y, 25, { ...options, isStatic: true, isSensor: true }); break;
      case 'warp-a': case 'warp-b': body = Bodies.circle(x, y, 25, { ...options, isStatic: true, isSensor: true }); break;
      case 'magnet': body = Bodies.circle(x, y, 30, { ...options, isStatic: true, isSensor: true }); break;
    }

    if (body) {
      Composite.add(this.world, body);
      const nodon = { id, type, body, initialPos: { x, y }, initialAngle: body.angle, power: 0.05, delay: 1000 };
      this.nodons.push(nodon);
      this.selectedNodon = nodon;
    }
  }

  addConnection(from, to) {
    const triggers = ['sensor', 'timer'];
    if (!triggers.includes(from.type)) return;
    if (!this.connections.some(c => c.fromId === from.id && c.toId === to.id)) {
      this.connections.push({ fromId: from.id, toId: to.id });
    }
  }

  triggerNodonLogic(sensorBody, otherBody) {
    const sensorNodon = this.nodons.find(n => n.body === sensorBody);
    if (!sensorNodon) return;

    if (sensorNodon.type === 'sensor' || sensorNodon.type === 'timer') {
      const runLogic = () => {
        this.connections.filter(c => c.fromId === sensorNodon.id).forEach(c => {
          const target = this.nodons.find(n => n.id === c.toId);
          this.applyAction(target, otherBody);
        });
      };

      if (sensorNodon.type === 'timer') setTimeout(runLogic, sensorNodon.delay || 1000);
      else runLogic();
    }
  }

  applyAction(target, sourceBody) {
    if (!target) return;
    if (target.type === 'fan') {
      const force = target.power || 0.05;
      Matter.Body.applyForce(sourceBody, sourceBody.position, {
        x: Math.cos(target.body.angle) * force,
        y: Math.sin(target.body.angle) * force
      });
    }
    target.body.render.fillStyle = '#f7d716';
    setTimeout(() => target.body.render.fillStyle = this.getNodonColor(target.type), 200);
  }

  getNodonColor(type) {
    const colors = {
      ball: '#ff7675', ramp: '#74b9ff', box: '#fab1a0', floor: '#636e72',
      fan: '#81ecec', sensor: '#55efc4', timer: '#eb3b5a',
      'warp-a': '#8854d0', 'warp-b': '#3867d6', magnet: '#2f3542', goal: '#fd9644'
    };
    return colors[type] || '#dfe6e9';
  }

  resetSimulation() {
    this.nodons.forEach(n => {
      Matter.Body.setPosition(n.body, n.initialPos);
      Matter.Body.setAngle(n.body, n.initialAngle);
      Matter.Body.setVelocity(n.body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(n.body, 0);
    });
  }

  clearAll() {
    Composite.clear(this.world, false);
    Composite.add(this.world, this.mouseConstraint);
    this.nodons = [];
    this.connections = [];
    this.selectedNodon = null;
  }

  animate() {
    const svg = document.getElementById('wiring-layer');
    svg.innerHTML = '';
    this.drawWires();
    this.drawSelectionHighlight();
    this.drawPorts();
    this.handleMagnets();
    requestAnimationFrame(() => this.animate());
  }

  handleMagnets() {
    if (!this.isPlaying) return;
    const magnets = this.nodons.filter(n => n.type === 'magnet');
    const balls = this.nodons.filter(n => n.type === 'ball');
    
    magnets.forEach(m => {
      balls.forEach(b => {
        const dist = Vector.magnitude(Vector.sub(m.body.position, b.body.position));
        if (dist < 200) {
          const force = Vector.mult(Vector.normalise(Vector.sub(m.body.position, b.body.position)), (m.power || 0.05) * (1 - dist/200));
          Matter.Body.applyForce(b.body, b.body.position, force);
        }
      });
    });
  }

  drawPorts() {
    if (this.isPlaying) return;
    this.nodons.forEach(nodon => {
      const { x, y } = nodon.body.position;
      if (['sensor', 'timer'].includes(nodon.type)) this.createPort(nodon, x + 35, y, 'output');
      if (['fan', 'timer'].includes(nodon.type)) this.createPort(nodon, x - 35, y, 'input');
    });
  }

  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '8');
    circle.classList.add('port', type);
    circle.onmousedown = (e) => {
      e.stopPropagation();
      if (type === 'output') { this.isWiring = true; this.wireStartPort = { nodon, x, y }; }
      else if (this.isWiring) { this.addConnection(this.wireStartPort.nodon, nodon); this.isWiring = false; }
    };
    svg.appendChild(circle);
  }

  drawWires() {
    this.connections.forEach(conn => {
      const from = this.nodons.find(n => n.id === conn.fromId);
      const to = this.nodons.find(n => n.id === conn.toId);
      if (from && to) this.createWire({ x: from.body.position.x + 35, y: from.body.position.y }, { x: to.body.position.x - 35, y: to.body.position.y }, '#4a90e2');
    });
    if (this.isWiring) this.createWire(this.wireStartPort, this.mouseConstraint.mouse.position, '#ff5e5e', true);
  }

  createWire(p1, p2, color, isDashed = false) {
    const svg = document.getElementById('wiring-layer');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const dx = Math.abs(p2.x - p1.x) * 0.5;
    path.setAttribute('d', `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`);
    path.setAttribute('stroke', color);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-linecap', 'round');
    if (isDashed) path.setAttribute('stroke-dasharray', '8,8');
    svg.appendChild(path);
  }

  drawSelectionHighlight() {
    if (!this.selectedNodon) return;
    const { x, y } = this.selectedNodon.body.position;
    const svg = document.getElementById('wiring-layer');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', '40');
    circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', '#ff5e5e');
    circle.setAttribute('stroke-width', '2'); circle.setAttribute('stroke-dasharray', '4,4');
    svg.appendChild(circle);
  }
}

const app = new GoldbergApp();
