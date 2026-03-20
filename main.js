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
    this.selectedNodon = null;
    this.isWiring = false;
    this.wireStartPort = null; // { nodon, x, y }
    this.goalReached = false;

    this.initCanvas();
    this.initControls();
    this.initDragAndDrop();
    this.initEvents();
    this.initSuccessUI();
    
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

  initSuccessUI() {
    const msg = document.createElement('div');
    msg.id = 'success-msg';
    msg.innerHTML = '<h2>골인 성공!</h2><p>환상적인 장치입니다!</p>';
    document.body.appendChild(msg);
    this.successMsg = msg;
  }

  removeNodon(nodon) {
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
    
    // Set up mouse constraint
    const mouse = Mouse.create(this.render.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
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
      btnPlay.innerHTML = this.isPlaying 
        ? '<i data-lucide="pause"></i> 정지' 
        : '<i data-lucide="play"></i> 시작';
      lucide.createIcons();
      
      if (this.isPlaying) {
        Runner.run(this.runner, this.engine);
      } else {
        Runner.stop(this.runner);
      }
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
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', item.dataset.type);
      });
    });

    const container = document.getElementById('physics-canvas');
    container.addEventListener('dragover', (e) => e.preventDefault());
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('type');
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.addNodon(type, x, y);
    });
  }

  initEvents() {
    // Collision detection
    Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        this.handleCollisions(bodyA, bodyB);
      });
    });

    // Selection logic
    const canvas = this.render.canvas;
    canvas.addEventListener('mousedown', (e) => {
      if (this.isPlaying) return;
      const mousePos = { x: e.offsetX, y: e.offsetY };
      const clickedBody = Matter.Query.point(Composite.allBodies(this.world), mousePos)[0];
      if (clickedBody) {
        this.selectedNodon = this.nodons.find(n => n.body === clickedBody);
      } else {
        if (!e.target.classList || !e.target.classList.contains('port')) {
          this.selectedNodon = null;
        }
      }
    });
  }

  handleCollisions(bodyA, bodyB) {
    this.triggerNodonLogic(bodyA, bodyB);
    this.triggerNodonLogic(bodyB, bodyA);

    const nodonA = this.nodons.find(n => n.body === bodyA);
    const nodonB = this.nodons.find(n => n.body === bodyB);

    if ((nodonA?.type === 'goal' && nodonB?.type === 'ball') || 
        (nodonB?.type === 'goal' && nodonA?.type === 'ball')) {
      this.reachGoal();
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
    const options = {
      label: id.toString(),
      render: { fillStyle: this.getNodonColor(type) }
    };

    switch(type) {
      case 'ball':
        body = Bodies.circle(x, y, 15, { ...options, friction: 0.005, restitution: 0.5 });
        break;
      case 'ramp':
        body = Bodies.rectangle(x, y, 150, 20, { ...options, angle: Math.PI / 10, isStatic: true });
        break;
      case 'box':
        body = Bodies.rectangle(x, y, 40, 40, options);
        break;
      case 'floor':
        body = Bodies.rectangle(x, y, 300, 20, { ...options, isStatic: true });
        break;
      case 'goal':
        body = Bodies.rectangle(x, y, 60, 40, { 
          ...options, 
          isStatic: true,
          render: {
            fillStyle: '#fd9644',
            strokeStyle: '#fa8231',
            lineWidth: 4
          }
        });
        break;
      case 'fan':
        body = Bodies.circle(x, y, 25, { ...options, isStatic: true });
        break;
      case 'sensor':
        body = Bodies.rectangle(x, y, 60, 60, { 
          ...options, 
          isStatic: true, 
          isSensor: true,
          render: {
            fillStyle: 'rgba(85, 239, 196, 0.2)',
            strokeStyle: '#00b894',
            lineWidth: 2
          }
        });
        break;
    }

    if (body) {
      Composite.add(this.world, body);
      this.nodons.push({ id, type, body, initialPos: { x, y }, initialAngle: body.angle });
    }
  }

  addConnection(from, to) {
    const validTriggers = ['sensor', 'button'];
    if (!validTriggers.includes(from.type)) return;
    if (!this.connections.some(c => c.fromId === from.id && c.toId === to.id)) {
      this.connections.push({ fromId: from.id, toId: to.id });
    }
  }

  triggerNodonLogic(sensorBody, otherBody) {
    const sensorNodon = this.nodons.find(n => n.body === sensorBody);
    if (!sensorNodon || sensorNodon.type !== 'sensor') return;

    const connectedNodons = this.connections
      .filter(c => c.fromId === sensorNodon.id)
      .map(c => this.nodons.find(n => n.id === c.toId));

    connectedNodons.forEach(nodon => {
      this.applyAction(nodon, otherBody);
    });
  }

  applyAction(target, sourceBody) {
    if (target.type === 'fan') {
      const force = 0.05;
      const angle = target.body.angle;
      const forceVector = {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force
      };
      Matter.Body.applyForce(sourceBody, sourceBody.position, forceVector);
    }
    const originalColor = target.body.render.fillStyle;
    target.body.render.fillStyle = '#f7d716';
    setTimeout(() => {
      target.body.render.fillStyle = originalColor;
    }, 200);
  }

  getNodonColor(type) {
    const colors = {
      ball: '#ff7675', ramp: '#74b9ff', box: '#fab1a0',
      floor: '#636e72', fan: '#81ecec', sensor: '#55efc4',
      button: '#fdcb6e', goal: '#fd9644'
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
  }

  animate() {
    const svg = document.getElementById('wiring-layer');
    svg.innerHTML = '';
    this.drawWires();
    this.drawSelectionHighlight();
    this.drawPorts();
    requestAnimationFrame(() => this.animate());
  }

  drawPorts() {
    if (this.isPlaying) return;
    this.nodons.forEach(nodon => {
      const { x, y } = nodon.body.position;
      if (['sensor', 'button'].includes(nodon.type)) {
        this.createPort(nodon, x + 35, y, 'output');
      }
      if (['fan'].includes(nodon.type)) {
        this.createPort(nodon, x - 35, y, 'input');
      }
    });
  }

  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '8');
    circle.classList.add('port', type);
    circle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      if (type === 'output') {
        this.isWiring = true;
        this.wireStartPort = { nodon, x, y };
      } else if (this.isWiring && type === 'input') {
        this.addConnection(this.wireStartPort.nodon, nodon);
        this.isWiring = false;
        this.wireStartPort = null;
      }
    });
    svg.appendChild(circle);
  }

  drawWires() {
    this.connections.forEach(conn => {
      const from = this.nodons.find(n => n.id === conn.fromId);
      const to = this.nodons.find(n => n.id === conn.toId);
      if (from && to) {
        const p1 = { x: from.body.position.x + 35, y: from.body.position.y };
        const p2 = { x: to.body.position.x - 35, y: to.body.position.y };
        this.createWire(p1, p2, '#4a90e2');
      }
    });
    if (this.isWiring && this.wireStartPort) {
      const mouse = this.mouseConstraint.mouse.position;
      this.createWire(this.wireStartPort, mouse, '#ff5e5e', true);
    }
  }

  createWire(p1, p2, color, isDashed = false) {
    const svg = document.getElementById('wiring-layer');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const dx = Math.abs(p2.x - p1.x) * 0.5;
    const d = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
    path.setAttribute('d', d);
    path.setAttribute('stroke', color);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-linecap', 'round');
    if (isDashed) path.setAttribute('stroke-dasharray', '8,8');
    svg.appendChild(path);
  }

  drawSelectionHighlight() {
    if (!this.selectedNodon) return;
    const body = this.selectedNodon.body;
    const svg = document.getElementById('wiring-layer');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', body.position.x);
    circle.setAttribute('cy', body.position.y);
    circle.setAttribute('r', '35');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', '#ff5e5e');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('stroke-dasharray', '4,4');
    svg.appendChild(circle);
  }
}

const app = new GoldbergApp();
