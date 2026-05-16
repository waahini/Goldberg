const I18N = {
  ko: {
    app_title: "허니 골든 빌더",
    btn_play: "실행하기", btn_reset: "초기화", btn_clear: "전체 삭제", btn_manual: "설명서",
    cat_phys: "물리 오브젝트", cat_logic: "논리 프로그래밍",
    nodon_ball: "공", nodon_ramp: "경사로", nodon_box: "상자", nodon_floor: "바닥",
    nodon_seesaw: "시소", nodon_pendulum: "진공추", nodon_domino: "도미노", nodon_hammer: "망치",
    nodon_sensor: "센서", nodon_accelerator: "가속기", nodon_gate_and: "AND 게이트", nodon_gate_not: "NOT 게이트",
    nodon_timer: "타이머", nodon_counter: "카운터",
    history_title: "골드버그의 역사: 기발한 상상력의 발자취", 
    history_p1: "루브 골드버그(Rube Goldberg)는 미국의 만화가이자 발명가로, 아주 간단한 일을 처리하기 위해 수십 가지의 복잡한 과정을 거치는 기계 장치를 고안한 것으로 유명합니다.",
    history_p2: "HONEY GOLDEN 빌더는 이러한 역사적 유산을 현대적인 디지털 아틀리에로 재해석하여, 누구나 엔지니어가 되어 자신만의 물리 법칙을 설계하고 실험할 수 있는 공간을 제공합니다.",
    guide_title: "제작 마스터클래스: 완벽한 장치를 위한 팁",
    guide_step1_title: "에너지 아키텍처 설계",
    guide_step1_desc_long: "모든 장치의 심장은 '위치 에너지'입니다. 빌더의 가장 높은 곳에 시작 노돈을 배치하여 중력 가속도를 최대한 활용하세요.",
    guide_step2_title: "뉴럴 논리 회로 구성",
    guide_step2_desc_long: "단순한 물리적 충돌을 넘어, 논리 노돈을 사용하여 지능형 장치를 만드세요. AND 게이트를 사용하면 더 복잡한 장치를 만들 수 있습니다.",
    guide_step3_title: "실험과 반복의 즐거움",
    guide_step3_desc_long: "실패는 데이터가 됩니다. 공이 멈춘 지점을 분석하고, 타이머의 지연 시간을 0.1초 단위로 튜닝하세요.",
    physics_title: "물리법칙: 장치 속에 숨겨진 과학",
    phys_momentum: "운동량 보존 법칙",
    phys_momentum_desc: "질량과 속도의 곱으로 정의되는 운동량은 충돌 시 다른 물체로 전달됩니다.",
    phys_logic: "부울 논리와 제어",
    phys_logic_desc: "센서와 게이트를 통한 신호 제어는 현대 컴퓨터 공학의 기초인 부울 논리(Boolean Logic)를 따릅니다.",
    nav_editor: "빌더", nav_history: "기록", nav_guide: "마스터클래스", nav_encyclo: "백과사전", nav_physics: "물리법칙",
    success_title: "미션 성공!", success_msg: "장치가 완벽하게 작동했습니다."
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

  initDragAndDrop() {
    const items = document.querySelectorAll('.nodon-item');
    const container = document.getElementById('physics-canvas');

    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('nodon-type', item.dataset.type);
        this.dragPreview = { type: item.dataset.type, x: 0, y: 0 };
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        this.dragPreview = null;
      });
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

    const labels = document.querySelectorAll('.prop-group label');
    if (labels[0]) labels[0].textContent = "탄성 (튕기는 정도)";
    if (labels[1]) labels[1].textContent = "지연 시간 (초)";
    if (labels[2]) labels[2].textContent = "밀어내는 힘";

    this.inputs.restitution.oninput = (e) => { if (this.selectedNodon) this.selectedNodon.body.restitution = parseFloat(e.target.value); };
    this.inputs.delay.oninput = (e) => { if (this.selectedNodon) this.selectedNodon.delay = parseFloat(e.target.value) * 1000; };
    this.inputs.power.oninput = (e) => { if (this.selectedNodon) this.selectedNodon.power = parseFloat(e.target.value); };
  }

  addNodon(type, x, y) {
    const id = Date.now();
    const color = this.getNodonColor(type);
    let body, constraint;
    const common = { label: id.toString(), render: { fillStyle: color, strokeStyle: '#fff', lineWidth: 4 } };
    
    switch(type) {
      case 'ball': body = Bodies.circle(x, y, 25, { ...common, friction: 0.01, restitution: 0.8 }); break;
      case 'ramp': body = Bodies.rectangle(x, y, 240, 24, { ...common, angle: Math.PI / 10, isStatic: true }); break;
      case 'box': body = Bodies.rectangle(x, y, 70, 70, { ...common, chamfer: { radius: 10 } }); break;
      case 'floor': body = Bodies.rectangle(x, y, 500, 30, { ...common, isStatic: true, chamfer: { radius: 5 } }); break;
      case 'seesaw': 
        body = Bodies.rectangle(x, y, 260, 15, { ...common, chamfer: { radius: 5 } });
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, stiffness: 1, length: 0 });
        break;
      case 'pendulum':
        body = Bodies.circle(x, y + 150, 32, { ...common, frictionAir: 0, restitution: 1 });
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, stiffness: 0.9, length: 150 });
        break;
      case 'domino': body = Bodies.rectangle(x, y, 16, 60, { ...common, friction: 0.5, density: 0.02, chamfer: { radius: 2 } }); break;
      case 'hammer':
        body = Bodies.rectangle(x + 80, y, 160, 35, { ...common, density: 0.1, chamfer: { radius: 5 } });
        constraint = Constraint.create({ pointA: { x, y }, bodyB: body, pointB: { x: -80, y: 0 }, stiffness: 1, length: 0 });
        break;
      case 'sensor': body = Bodies.rectangle(x, y, 100, 100, { ...common, isStatic: true, isSensor: true, render: { ...common.render, fillStyle: 'transparent', strokeStyle: color, dash: [10, 10], lineWidth: 4 } }); break;
      case 'accelerator': body = Bodies.circle(x, y, 45, { ...common, isStatic: true, isSensor: true }); break;
      case 'gate-and': body = Bodies.rectangle(x, y, 110, 70, { ...common, isStatic: true, isSensor: true, chamfer: { radius: 10 } }); break;
      case 'gate-not': body = Bodies.circle(x, y, 45, { ...common, isStatic: true, isSensor: true }); break;
      case 'timer': body = Bodies.circle(x, y, 45, { ...common, isStatic: true, isSensor: true }); break;
      case 'counter': body = Bodies.rectangle(x, y, 90, 90, { ...common, isStatic: true, chamfer: { radius: 10 } }); break;
    }

    if (body) {
      Composite.add(this.world, body);
      if (constraint) Composite.add(this.world, constraint);
      const nodon = { id, type, body, constraint, initialPos: { x: body.position.x, y: body.position.y }, initialAngle: body.angle, power: 0.15, delay: 1000, isActive: false };
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
        if (target && target.type === 'accelerator') {
          Matter.Body.applyForce(targetBody, targetBody.position, { x: Math.cos(target.body.angle) * 2, y: Math.sin(target.body.angle) * 2 });
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
    g.setAttribute('opacity', '0.5');
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '35');
    circle.setAttribute('fill', this.getNodonColor(type));
    circle.setAttribute('stroke', '#fff');
    circle.setAttribute('stroke-width', '4');
    circle.setAttribute('stroke-dasharray', '8,8');
    g.appendChild(circle);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('y', '60');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#333');
    text.setAttribute('font-weight', '900');
    text.setAttribute('font-size', '14');
    text.textContent = "여기에 놓으세요!";
    g.appendChild(text);
    
    svg.appendChild(g);
  }

  drawNodonSkins() {
    this.nodons.forEach(nodon => {
      const { x, y } = nodon.body.position;
      const angle = nodon.body.angle;
      const svg = document.getElementById('wiring-layer');
      if (!svg) return;
      
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${x},${y}) rotate(${angle * 180 / Math.PI})`);
      
      const color = this.getNodonColor(nodon.type);
      const isLogic = ['sensor', 'timer', 'accelerator', 'counter', 'gate-and', 'gate-not'].includes(nodon.type);
      
      // Detailed Highlight
      const shine = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      shine.setAttribute('cx', '-12'); shine.setAttribute('cy', '-18'); shine.setAttribute('rx', '10'); shine.setAttribute('ry', '5');
      shine.setAttribute('fill', 'rgba(255,255,255,0.5)'); shine.setAttribute('transform', 'rotate(-35)');
      
      // Face
      this.addFaceToGroup(g, isLogic ? 10 : 8, isLogic ? 18 : 14, Date.now(), nodon.isActive);
      g.appendChild(shine);
      
      svg.appendChild(g);
    });
  }

  addFaceToGroup(g, size, offset, time, active) {
    [-offset, offset].forEach(ox => {
      const eye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      eye.setAttribute('cx', ox); eye.setAttribute('cy', -8); eye.setAttribute('r', size);
      eye.setAttribute('fill', active ? '#fff' : '#222'); g.appendChild(eye);
      if (!active) {
        const iris = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        iris.setAttribute('cx', ox + Math.sin(time/500)*2); iris.setAttribute('cy', -8); iris.setAttribute('r', size/2);
        iris.setAttribute('fill', '#fff'); g.appendChild(iris);
      }
    });
    const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mouth.setAttribute('d', `M ${-offset} 15 Q 0 ${15 + (active ? 20 : 8)} ${offset} 15`);
    mouth.setAttribute('stroke', active ? '#fff' : '#222'); mouth.setAttribute('fill', active ? '#ff6b6b' : 'none'); mouth.setAttribute('stroke-width', '5');
    mouth.setAttribute('stroke-linecap', 'round');
    g.appendChild(mouth);
  }

  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '14');
    c.style.fill = type === 'output' ? 'var(--accent)' : 'var(--secondary)';
    c.style.stroke = '#fff'; c.style.strokeWidth = '4'; c.style.pointerEvents = 'auto'; c.style.cursor = 'crosshair';
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
        path.setAttribute('stroke-linecap', 'round');
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
    const palette = { 
      ball: 'var(--primary)', ramp: 'var(--text)', box: 'var(--accent)', 
      floor: 'var(--text)', seesaw: 'var(--primary)', pendulum: 'var(--text)', 
      domino: 'var(--accent)', hammer: 'var(--text)', sensor: 'rgba(255,255,255,0.3)',
      accelerator: 'var(--success)', 'gate-and': 'var(--secondary)', 'gate-not': 'var(--accent)'
    };
    return palette[type] || 'var(--primary)';
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
