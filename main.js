const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Vector, Constraint } = Matter;

const I18N = {
  ko: {
    app_title: "골드버그 노돈",
    btn_play: "실행하기", btn_reset: "되돌리기", btn_clear: "전체 삭제",
    cat_phys: "물리 노돈", cat_logic: "논리 노돈", cat_action: "액션 노돈", cat_effect: "환경/효과",
    nodon_ball: "탱탱공", nodon_ramp: "미끄럼틀", nodon_box: "상자", nodon_floor: "바닥",
    nodon_seesaw: "시소", nodon_pendulum: "흔들추", nodon_domino: "도미노", nodon_hammer: "뿅망치",
    nodon_sensor: "감지센서", nodon_accelerator: "부스터", nodon_gate_and: "AND 로봇", nodon_gate_not: "NOT 로봇", nodon_gate_or: "OR 로봇",
    nodon_timer: "알람시계", nodon_counter: "숫자봇",
    nodon_magnet: "자석 노돈", nodon_trampoline: "트램펄린", nodon_conveyor: "컨베이어", nodon_portal: "워프게이트", nodon_cannon: "대포", nodon_pulley: "도르래",
    nodon_toggle: "토글스위치", nodon_splitter: "신호분배기", nodon_random: "무작위분배", nodon_delay: "지연노돈",
    nodon_explosion: "다이너마이트", nodon_color_gate: "도색게이트", nodon_black_hole: "블랙홀", nodon_gravity_inv: "중력반전", nodon_windmill: "바람개비",
    nav_builder: "빌더", nav_history: "탄생일기", nav_manual: "설명서", nav_comment: "댓글", nav_masterclass: "마스터클래스",
    prop_bounce: "탄성 (Bounce)", prop_angle: "기울기 (Angle)", btn_master: "골드버그 마스터클래스",
    success_title: "미션 클리어!", success_msg: "장치가 완벽하게 작동했습니다!"
  },
  en: {
    app_title: "GOLDBERG NODON",
    btn_play: "RUN", btn_reset: "RESET", btn_clear: "CLEAR ALL",
    cat_phys: "PHYSICAL", cat_logic: "LOGIC", cat_action: "ACTION", cat_effect: "ENVIRONMENT",
    nodon_ball: "Ball", nodon_ramp: "Ramp", nodon_box: "Box", nodon_floor: "Floor",
    nodon_seesaw: "Seesaw", nodon_pendulum: "Pendulum", nodon_domino: "Domino", nodon_hammer: "Hammer",
    nodon_sensor: "Sensor", nodon_accelerator: "Booster", nodon_gate_and: "AND Gate", nodon_gate_not: "NOT Gate", nodon_gate_or: "OR Gate",
    nodon_timer: "Timer", nodon_counter: "Counter",
    nodon_magnet: "Magnet", nodon_trampoline: "Trampoline", nodon_conveyor: "Conveyor", nodon_portal: "Portal", nodon_cannon: "Cannon", nodon_pulley: "Pulley",
    nodon_toggle: "Toggle Switch", nodon_splitter: "Splitter", nodon_random: "Randomizer", nodon_delay: "Delay",
    nodon_explosion: "Dynamite", nodon_color_gate: "Color Gate", nodon_black_hole: "Black Hole", nodon_gravity_inv: "Gravity Inverter", nodon_windmill: "Windmill",
    nav_builder: "BUILDER", nav_history: "HISTORY", nav_manual: "DOCS", nav_comment: "FORUM", nav_masterclass: "MASTERCLASS",
    prop_bounce: "Elasticity", prop_angle: "Rotation", btn_master: "Masterclass",
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
    document.getElementById('btn-masterclass').onclick = () => { document.getElementById('essay-section').scrollIntoView({ behavior: 'smooth' }); };
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
      
      // V12 New Action Nodes
      case 'magnet': body = Bodies.rectangle(x, y, 100, 100, { ...common, isStatic: true, isSensor: true }); break;
      case 'trampoline': body = Bodies.rectangle(x, y, 150, 40, { ...common, isStatic: true, restitution: 1.5 }); break;
      case 'conveyor': body = Bodies.rectangle(x, y, 300, 35, { ...common, isStatic: true, friction: 0 }); break;
      case 'portal': body = Bodies.circle(x, y, 45, { ...common, isStatic: true, isSensor: true }); break;
      case 'cannon': body = Bodies.rectangle(x, y, 120, 80, { ...common, isStatic: true, isSensor: true }); break;
      case 'pulley': body = Bodies.circle(x, y, 35, { ...common, isStatic: true }); break;

      // V12 New Logic Nodes
      case 'toggle': body = Bodies.rectangle(x, y, 100, 100, { ...common, isStatic: true, isSensor: true }); break;
      case 'splitter': body = Bodies.rectangle(x, y, 100, 100, { ...common, isStatic: true, isSensor: true }); break;
      case 'random': body = Bodies.circle(x, y, 50, { ...common, isStatic: true, isSensor: true }); break;
      case 'delay': body = Bodies.circle(x, y, 50, { ...common, isStatic: true, isSensor: true }); break;

      // V12 New Effects/Env Nodes
      case 'explosion': body = Bodies.circle(x, y, 60, { ...common, isStatic: true, isSensor: true }); break;
      case 'color-gate': body = Bodies.rectangle(x, y, 100, 100, { ...common, isStatic: true, isSensor: true }); break;
      case 'black-hole': body = Bodies.circle(x, y, 80, { ...common, isStatic: true, isSensor: true }); break;
      case 'gravity-inv': body = Bodies.circle(x, y, 50, { ...common, isStatic: true, isSensor: true }); break;
      case 'windmill': body = Bodies.circle(x, y, 60, { ...common, isStatic: true, isSensor: true }); break;
    }
    if (body) {
      Composite.add(this.world, body);
      if (constraint) Composite.add(this.world, constraint);
      this.nodons.push({ id, type, body, constraint, initialPos: { x: body.position.x, y: body.position.y }, initialAngle: body.angle, isActive: false, signals: new Map(), state: 0, color: null });
      this.selectedNodon = this.nodons[this.nodons.length - 1];
    }
  }

  initEvents() {
    Events.on(this.engine, 'beforeUpdate', () => {
      if (!this.isPlaying) return;
      this.nodons.forEach(n => {
        if (n.type === 'magnet' || n.type === 'black-hole' || n.type === 'windmill' || n.type === 'conveyor') {
          const bodies = Composite.allBodies(this.world);
          bodies.forEach(b => {
            if (b.isStatic || b === n.body) return;
            const dist = Vector.magnitude(Vector.sub(b.position, n.body.position));
            
            if (n.type === 'magnet') {
              const range = 300;
              if (dist < range) {
                const strength = 0.008 * (1 - dist/range);
                const dir = Vector.normalise(Vector.sub(n.body.position, b.position));
                // N pulls (state 0/inactive-ish), S pushes (active)
                const force = Vector.mult(dir, n.isActive ? -strength : strength);
                Matter.Body.applyForce(b, b.position, force);
              }
            } else if (n.type === 'black-hole') {
              const range = 400;
              if (dist < range) {
                const strength = 0.012 * (1 - dist/range);
                const dir = Vector.normalise(Vector.sub(n.body.position, b.position));
                Matter.Body.applyForce(b, b.position, Vector.mult(dir, strength));
                // Spin effect as it gets closer
                if (dist < 100) Matter.Body.setAngularVelocity(b, b.angularVelocity + 0.1);
                if (dist < 25) Matter.Composite.remove(this.world, b);
              }
            } else if (n.type === 'windmill') {
              const range = 350;
              const angle = n.body.angle;
              const effectDir = { x: Math.cos(angle), y: Math.sin(angle) };
              const toBody = Vector.normalise(Vector.sub(b.position, n.body.position));
              const dot = Vector.dot(effectDir, toBody);
              if (dist < range && dot > 0.7) { // Wind cone
                const strength = 0.005 * dot * (1 - dist/range);
                Matter.Body.applyForce(b, b.position, Vector.mult(effectDir, strength));
              }
            }
          });
        }
        // Windmill blade rotation
        if (n.type === 'windmill') n.state = (n.state || 0) + 0.1;
      });
    });

    Events.on(this.engine, 'collisionStart', (event) => { event.pairs.forEach(pair => this.handleCollisions(pair.bodyA, pair.bodyB)); });
    const canvas = this.render.canvas;
    canvas.onmousedown = (e) => { const rect = canvas.getBoundingClientRect(); const mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top }; const clickedBody = Matter.Query.point(Composite.allBodies(this.world), mousePos)[0]; this.selectedNodon = clickedBody ? this.nodons.find(n => n.body === clickedBody) : null; };
  }

  handleCollisions(bodyA, bodyB) {
    const nA = this.nodons.find(n => n.body === bodyA), nB = this.nodons.find(n => n.body === bodyB);
    if (!nA || !nB) return;
    
    // Trampoline: Instant elastic impulse
    if (nA.type === 'trampoline') { Matter.Body.setVelocity(nB.body, { x: nB.body.velocity.x, y: -22 }); nA.isActive = true; setTimeout(() => nA.isActive = false, 200); }
    if (nB.type === 'trampoline') { Matter.Body.setVelocity(nA.body, { x: nA.body.velocity.x, y: -22 }); nB.isActive = true; setTimeout(() => nB.isActive = false, 200); }

    // Conveyor: Constant surface velocity
    if (nA.type === 'conveyor') { const speed = 8; const angle = nA.body.angle; Matter.Body.setVelocity(nB.body, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }); }
    if (nB.type === 'conveyor') { const speed = 8; const angle = nB.body.angle; Matter.Body.setVelocity(nA.body, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }); }
    
    // Portal: Smart cooldown teleport
    if (nA.type === 'portal' && !nA.isActive) this.teleport(nA, nB.body);
    if (nB.type === 'portal' && !nB.isActive) this.teleport(nB, nA.body);

    if (nA.type === 'color-gate') nB.body.render.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
    if (nB.type === 'color-gate') nA.body.render.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;

    if (nA.type === 'explosion') this.explode(nA);
    if (nB.type === 'explosion') this.explode(nB);

    if (nA.type === 'gravity-inv') { this.world.gravity.y *= -1; nA.isActive = true; setTimeout(() => nA.isActive = false, 500); }
    if (nB.type === 'gravity-inv') { this.world.gravity.y *= -1; nB.isActive = true; setTimeout(() => nB.isActive = false, 500); }

    const logicTypes = ['sensor', 'timer', 'accelerator', 'gate-and', 'gate-or', 'gate-not', 'toggle', 'splitter', 'random', 'delay', 'counter', 'cannon', 'magnet'];
    if (logicTypes.includes(nA.type)) this.triggerLogic(nA, nB.body);
    if (logicTypes.includes(nB.type)) this.triggerLogic(nB, nA.body);
  }

  teleport(source, body) {
    const other = this.nodons.find(n => n.type === 'portal' && n !== source);
    if (other && !other.isActive) {
      source.isActive = true; other.isActive = true;
      Matter.Body.setPosition(body, { x: other.body.position.x, y: other.body.position.y });
      // Teleportation effect: keep speed but align with output portal angle
      const speed = Math.max(Vector.magnitude(body.velocity), 5);
      Matter.Body.setVelocity(body, { x: Math.cos(other.body.angle) * speed, y: Math.sin(other.body.angle) * speed });
      setTimeout(() => { source.isActive = false; other.isActive = false; }, 1500);
    }
  }

  explode(source) {
    if (source.isActive) return;
    source.isActive = true;
    const bodies = Composite.allBodies(this.world);
    bodies.forEach(b => {
      if (b.isStatic) return;
      const vec = Vector.sub(b.position, source.body.position);
      const dist = Vector.magnitude(vec);
      if (dist < 250) {
        const strength = 0.8 * (1 - dist/250);
        const force = Vector.mult(Vector.normalise(vec), strength);
        Matter.Body.applyForce(b, b.position, force);
      }
    });
    setTimeout(() => source.isActive = false, 800);
  }

  triggerLogic(source, targetBody) {
    const fire = () => {
      source.isActive = true; 
      if (source.type === 'toggle') source.state = source.state === 0 ? 1 : 0;
      if (source.type === 'counter') source.state++;

      setTimeout(() => source.isActive = false, 350);
      
      this.connections.filter(c => c.fromId === source.id).forEach(c => {
        const target = this.nodons.find(n => n.id === c.toId);
        if (!target) return;
        
        if (source.type === 'random' && Math.random() > 0.5) return;
        if (source.type === 'toggle' && source.state === 0) return;
        if (source.type === 'counter' && source.state % 3 !== 0) return;

        if (target.type === 'accelerator') { 
          Matter.Body.applyForce(targetBody, targetBody.position, { x: Math.cos(target.body.angle) * 4.5, y: Math.sin(target.body.angle) * 4.5 }); 
          target.isActive = true; setTimeout(() => target.isActive = false, 350); 
        }
        if (target.type === 'cannon') {
          // Cannon: Powerful directional blast
          const angle = target.body.angle;
          Matter.Body.setVelocity(targetBody, { x: Math.cos(angle) * 25, y: Math.sin(angle) * 25 });
          target.isActive = true; setTimeout(() => target.isActive = false, 500);
        }
        if (target.type === 'magnet') target.isActive = !target.isActive;
        if (['sensor', 'timer', 'toggle', 'splitter', 'random', 'delay', 'counter'].includes(target.type)) this.triggerLogic(target, targetBody);
      });
    };
    if (source.type === 'timer') setTimeout(fire, 1000); 
    else if (source.type === 'delay') setTimeout(fire, 2000);
    else fire();
  }

  animate() {
    const svg = document.getElementById('wiring-layer');
    if (svg) { svg.innerHTML = ''; this.drawWires(); this.drawPorts(); this.drawDragPreview(); this.drawNodonSkins(); }
    requestAnimationFrame(() => this.animate());
  }

  drawDragPreview() { if (!this.dragPreview) return; const { type, x, y } = this.dragPreview; const svg = document.getElementById('wiring-layer'); const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('transform', `translate(${x},${y})`); g.setAttribute('opacity', '0.5'); this.renderUniqueSkin(g, type, false, null, 0); svg.appendChild(g); }

  drawNodonSkins() {
    const svg = document.getElementById('wiring-layer');
    this.nodons.forEach(nodon => {
      const { x, y } = nodon.body.position; const angle = nodon.body.angle;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('transform', `translate(${x},${y}) rotate(${angle * 180 / Math.PI})`);
      this.renderUniqueSkin(g, nodon.type, nodon.isActive, nodon.color, nodon.state);
      svg.appendChild(g);
    });
  }

  renderUniqueSkin(g, type, active, color, state) {
    const baseColor = color || this.getNodonColor(type);
    const main = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let d = "";
    if (['ball', 'accelerator', 'timer', 'pendulum', 'gate-not', 'portal', 'random', 'delay', 'explosion', 'black-hole', 'gravity-inv', 'windmill', 'pulley'].includes(type)) {
      const r = type === 'ball' ? 28 : (type === 'black-hole' ? 80 : 45); d = `M ${-r},0 a ${r},${r} 0 1,0 ${r*2},0 a ${r},${r} 0 1,0 ${-r*2},0`;
    } else {
      let w = 100, h = 100;
      if (type === 'ramp') { w = 260; h = 22; } else if (type === 'floor') { w = 600; h = 30; } else if (type === 'seesaw') { w = 300; h = 18; } else if (type === 'domino') { w = 18; h = 70; } else if (type === 'hammer') { w = 180; h = 35; } else if (type === 'trampoline') { w = 150; h = 40; } else if (type === 'conveyor') { w = 300; h = 35; } else if (type === 'cannon') { w = 120; h = 80; }
      const r = 12; d = `M ${-w/2+r},${-h/2} h ${w-r*2} a ${r},${r} 0 0,1 ${r},${r} v ${h-r*2} a ${r},${r} 0 0,1 ${-r},${r} h ${-w+r*2} a ${r},${r} 0 0,1 ${-r},${-r} v ${-h+r*2} a ${r},${r} 0 0,1 ${r},${-r} z`;
    }
    main.setAttribute('d', d); main.setAttribute('fill', baseColor); main.setAttribute('stroke', active ? '#fff' : 'rgba(255,255,255,0.8)'); main.setAttribute('stroke-width', active ? '8' : '4');
    if (type === 'black-hole') main.setAttribute('fill', '#000');
    g.appendChild(main);

    // V12 Decorative Features
    if (type === 'magnet') {
      if (active) {
        const field = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        field.setAttribute('r', 100 + Math.sin(Date.now()/100)*10);
        field.setAttribute('fill', 'rgba(25, 113, 194, 0.1)');
        field.setAttribute('stroke', 'rgba(25, 113, 194, 0.3)');
        field.setAttribute('stroke-dasharray', '5,5');
        g.appendChild(field);
      }
      const pole = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      pole.setAttribute('x', '-50'); pole.setAttribute('y', '-50'); pole.setAttribute('width', '100'); pole.setAttribute('height', '30'); pole.setAttribute('fill', '#1971c2'); g.appendChild(pole);
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text'); label.textContent = active ? "S" : "N"; label.setAttribute('text-anchor', 'middle'); label.setAttribute('y', '30'); label.setAttribute('fill', '#fff'); label.setAttribute('font-size', '40'); label.setAttribute('font-weight', '900'); g.appendChild(label);
    } else if (type === 'portal') {
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); ring.setAttribute('r', active ? 55 : 35); ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', '#fff'); ring.setAttribute('stroke-width', active ? '8' : '4'); ring.setAttribute('stroke-dasharray', '5,5'); g.appendChild(ring);
    } else if (type === 'cannon') {
      const barrel = document.createElementNS('http://www.w3.org/2000/svg', 'path'); barrel.setAttribute('d', 'M 20 -30 L 60 -20 L 60 20 L 20 30 Z'); barrel.setAttribute('fill', '#343a40'); g.appendChild(barrel);
      if (active) {
        const flash = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); flash.setAttribute('cx', '70'); flash.setAttribute('r', '30'); flash.setAttribute('fill', '#fab005'); g.appendChild(flash);
      }
    } else if (type === 'conveyor') {
      const offset = (Date.now() / 20) % 30;
      for(let i=-130-offset; i<150; i+=30) { 
        if (i < -140 || i > 140) continue;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); line.setAttribute('x1', i); line.setAttribute('y1', '-10'); line.setAttribute('x2', i+10); line.setAttribute('y2', '10'); line.setAttribute('stroke', '#fff'); line.setAttribute('stroke-width', '4'); g.appendChild(line); 
      }
    } else if (type === 'windmill') {
      const bladesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      bladesGroup.setAttribute('transform', `rotate(${(state || 0) * 50})`);
      const blades = document.createElementNS('http://www.w3.org/2000/svg', 'path'); blades.setAttribute('d', 'M 0 0 L 10 -40 L 40 -10 Z M 0 0 L 40 10 L 10 40 Z M 0 0 L -10 40 L -40 10 Z M 0 0 L -40 -10 L -10 -40 Z'); blades.setAttribute('fill', '#fff'); 
      bladesGroup.appendChild(blades); g.appendChild(bladesGroup);
    } else if (type === 'black-hole') {
      const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); glow.setAttribute('r', 90 + Math.sin(Date.now()/200)*10); glow.setAttribute('fill', 'none'); glow.setAttribute('stroke', '#ae3ec9'); glow.setAttribute('stroke-width', '4'); glow.setAttribute('stroke-dasharray', '10,5'); g.appendChild(glow);
      const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); core.setAttribute('r', 70); core.setAttribute('fill', '#000'); core.setAttribute('transform', `rotate(${Date.now()/10})`); core.setAttribute('stroke', '#ae3ec9'); core.setAttribute('stroke-dasharray', '20,10'); g.appendChild(core);
    } else if (type === 'toggle') {
      const switchBtn = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); switchBtn.setAttribute('cx', state === 1 ? 20 : -20); switchBtn.setAttribute('r', '20'); switchBtn.setAttribute('fill', state === 1 ? '#51cf66' : '#f03e3e'); g.appendChild(switchBtn);
    } else if (type === 'counter') {
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text'); txt.textContent = state; txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('y', '15'); txt.setAttribute('fill', '#fff'); txt.setAttribute('font-size', '40'); txt.setAttribute('font-weight', '900'); g.appendChild(txt);
    } else if (type === 'splitter') {
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path'); arrow.setAttribute('d', 'M -20 0 L 20 -20 M -20 0 L 20 20'); arrow.setAttribute('stroke', '#fff'); arrow.setAttribute('stroke-width', '6'); g.appendChild(arrow);
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

  getNodonColor(type) { return { ball: '#FFD43B', ramp: '#4dabf7', box: '#ff922b', floor: '#495057', seesaw: '#51cf66', pendulum: '#f06595', domino: '#cc5de8', hammer: '#343a40', sensor: '#ffffff', accelerator: '#20c997', 'gate-and': '#6741d9', 'gate-or': '#fd7e14', 'gate-not': '#ff6b6b', timer: '#4dabf7', counter: '#212529', magnet: '#e03131', trampoline: '#333', conveyor: '#495057', portal: '#ae3ec9', cannon: '#343a40', pulley: '#868e96', toggle: '#f59f00', splitter: '#748ffc', random: '#748ffc', delay: '#ff8787', explosion: '#f03e3e', 'color-gate': '#ffffff', 'black-hole': '#000', 'gravity-inv': '#15aabf', windmill: '#15aabf' }[type] || '#FFD43B'; }
  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer'); const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '16'); c.style.fill = type === 'output' ? 'var(--accent)' : 'var(--primary-dark)'; c.style.stroke = '#fff'; c.style.strokeWidth = '4'; c.style.pointerEvents = 'auto';
    c.onmousedown = (e) => { e.stopPropagation(); if (type === 'output') { this.isWiring = true; this.wireStartPort = { nodon, x, y }; } else if (this.isWiring) { this.connections.push({ fromId: this.wireStartPort.nodon.id, toId: nodon.id }); this.isWiring = false; } }; svg.appendChild(c);
  }
  drawPorts() { if (this.isPlaying) return; this.nodons.forEach(n => { if (['sensor', 'timer', 'counter', 'accelerator', 'gate-and', 'gate-or', 'gate-not', 'toggle', 'splitter', 'random', 'delay', 'cannon', 'magnet'].includes(n.type)) { this.createPort(n, n.body.position.x + 70, n.body.position.y, 'output'); this.createPort(n, n.body.position.x - 70, n.body.position.y, 'input'); } }); }
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
