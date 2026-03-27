// Initialize Lucide icons
lucide.createIcons();

const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Vector } = Matter;

const I18N = {
  ko: {
    app_title: "골드버그 노돈 빌더",
    btn_play: "실행", btn_reset: "초기화", btn_clear: "전체 삭제", btn_manual: "설명서",
    cat_phys: "물리 노돈 (움직이는 물체)", cat_logic: "논리 노돈 (명령하는 물체)",
    nodon_ball: "공", nodon_ramp: "경사로", nodon_box: "상자", nodon_floor: "바닥", nodon_goal: "골인 지점",
    nodon_spring: "스프링", nodon_treadmill: "컨베이어 벨트", nodon_breakable: "부서지는 상자", nodon_balloon: "풍선",
    nodon_sensor: "터치 센서", nodon_fan: "강풍기", nodon_timer: "타이머", nodon_warp_a: "워프 입구 (A)", nodon_warp_b: "워프 출구 (B)", nodon_magnet: "자석", nodon_counter: "카운터",
    settings_title: "환경 설정", label_language: "언어 선택", label_theme: "테마 설정",
    manual_title: "📖 노돈 가이드북",
    success_title: "성공!", success_msg: "정말 멋진 장치예요!",
    guide_title: "🛠️ 골드버그 노돈 빌더 사용 가이드",
    guide_intro: "골드버그 장치는 아주 간단한 일을 처리하기 위해 수많은 단계를 거치도록 복잡하게 만들어진 장치입니다.",
    guide_step1_title: "1. 노돈 배치",
    guide_step1_desc: "사이드바에서 노돈을 드래그하여 배치하세요.",
    guide_step2_title: "2. 연결의 힘",
    guide_step2_desc: "Shift 키를 누른 채 드래그하여 논리를 연결하세요.",
    guide_step3_title: "3. 실험과 수정",
    guide_step3_desc: "물리 엔진을 통해 최적의 경로를 찾아보세요.",
    encyclo_title: "📚 노돈 백과사전",
    encyclo_intro: "각 노돈의 역할과 성격을 확인해보세요.",
    nodon_ball_desc: "중력의 영향을 받아 굴러가는 주인공입니다.",
    nodon_warp_desc: "A 입구로 들어가면 B 출구로 순간이동합니다.",
    nodon_sensor_desc_title: "센서",
    nodon_sensor_desc_text: "물체의 충돌을 감지하여 신호를 보냅니다.",
    nodon_fan_desc_title: "팬",
    nodon_fan_desc_text: "바람의 힘으로 물체를 밀어냅니다.",
    physics_title: "🎓 학습할 수 있는 물리 원리",
    physics_intro: "Matter.js 물리 엔진 기반의 STEM 교육 도구입니다.",
    phys_gravity_title: "중력과 자유 낙하",
    phys_gravity_desc: "물체가 아래로 떨어지는 물리 현상을 체험합니다.",
    phys_momentum_title: "운동량과 충돌",
    phys_momentum_desc: "충돌 시 에너지 전달 과정을 관찰합니다.",
    phys_elasticity_title: "탄성과 반발력",
    phys_elasticity_desc: "스프링을 통한 에너지 변환을 이해합니다.",
    vision_title: "🎨 골드버그 노돈 빌더의 비전",
    vision_desc1: "우리는 물리 법칙을 재미있게 배울 수 있는 세상을 꿈꿉니다.",
    vision_desc2: "창의적 사고를 기를 수 있는 최고의 도구를 제공합니다.",
    vision_highlight_title: "왜 골드버그 노돈 빌더인가요?",
    vision_li1: "무한한 자유도: 상상력이 곧 설계도가 됩니다.",
    vision_li2: "직관적인 연결: 복잡한 코딩 없이 논리를 구현합니다.",
    vision_li3: "실시간 피드백: 즉각적인 물리 시뮬레이션이 가능합니다.",
    faq_title: "❓ 자주 묻는 질문 (FAQ)",
    faq_q1: "작동하지 않아요.", faq_a1: "시작 버튼과 연결 방향을 확인하세요.",
    faq_q2: "삭제 방법은?", faq_a2: "노돈 클릭 후 휴지통 아이콘을 누르세요.",
    faq_q3: "모바일 지원?", faq_a3: "네, 반응형으로 설계되었습니다.",
    footer_tagline: "창의력과 물리 법칙이 만나는 곳.",
    footer_nav_title: "탐색", nav_editor: "빌더", nav_guide: "가이드", nav_encyclo: "백과사전",
    footer_legal_title: "법적 고지", nav_privacy: "개인정보처리방침", nav_terms: "이용약관",
    privacy_title: "개인정보처리방침",
    privacy_p1: "개인정보를 수집하지 않으며, 광고 제공을 위해 쿠키를 사용합니다.",
    terms_title: "이용약관",
    terms_h1: "서비스 이용",
    terms_p1: "교육적 목적으로 자유롭게 이용 가능합니다.",
    tip_ball: "물리 법칙을 따르는 기본 공입니다.",
    tip_ramp: "공이 굴러내려갈 수 있는 경사면입니다.",
    tip_box: "장애물을 만들 수 있는 상자입니다.",
    tip_floor: "장치를 지탱하는 고정된 바닥입니다.",
    tip_goal: "최종 목적지입니다!",
    tip_spring: "물체를 튕겨내는 용수철입니다.",
    tip_treadmill: "물체를 한쪽으로 이동시킵니다.",
    tip_breakable: "충격에 부서지는 상자입니다.",
    tip_balloon: "위로 떠오르는 풍선입니다.",
    tip_sensor: "충돌을 감지하여 신호를 보냅니다.",
    tip_fan: "바람을 내뿜어 물체를 날립니다.",
    tip_timer: "시간 지연 후 신호를 전달합니다.",
    tip_warp_a: "순간이동 입구입니다.",
    tip_warp_b: "순간이동 출구입니다.",
    tip_magnet: "금속 공을 끌어당기는 자석입니다.",
    tip_counter: "신호의 횟수를 세는 카운터입니다."
  },
  en: {
    app_title: "Goldberg Nodon Builder",
    btn_play: "Play", btn_reset: "Reset", btn_clear: "Clear All", btn_manual: "Manual",
    cat_phys: "Physical Nodons", cat_logic: "Logical Nodons",
    nodon_ball: "Ball", nodon_ramp: "Ramp", nodon_box: "Box", nodon_floor: "Floor", nodon_goal: "Goal",
    nodon_spring: "Spring", nodon_treadmill: "Treadmill", nodon_breakable: "Breakable Box", nodon_balloon: "Balloon",
    nodon_sensor: "Sensor", nodon_fan: "Fan", nodon_timer: "Timer", nodon_warp_a: "Warp A", nodon_warp_b: "Warp B", nodon_magnet: "Magnet", nodon_counter: "Counter",
    settings_title: "Settings", label_language: "Language", label_theme: "Theme",
    manual_title: "📖 Nodon Guidebook",
    success_title: "Success!", success_msg: "Amazing Contraption!",
    guide_title: "🛠️ Goldberg Nodon Builder Guide",
    guide_intro: "A Goldberg machine is a complex contraption for simple tasks.",
    guide_step1_title: "1. Place Nodons",
    guide_step1_desc: "Drag and drop Nodons from the sidebar.",
    guide_step2_title: "2. Power of Wiring",
    guide_step2_desc: "Hold Shift and drag to connect logic wires.",
    guide_step3_title: "3. Experiment & Refine",
    guide_step3_desc: "Find the perfect path via physics engine.",
    encyclo_title: "📚 Nodon Encyclopedia",
    encyclo_intro: "Learn about each Nodon's role.",
    nodon_ball_desc: "The main character that follows gravity.",
    nodon_warp_desc: "Teleports objects from A to B.",
    nodon_sensor_desc_title: "Sensor",
    nodon_sensor_desc_text: "Sends signals on collision.",
    nodon_fan_desc_title: "Fan",
    nodon_fan_desc_text: "Pushes objects with wind force.",
    physics_title: "🎓 Physics Principles",
    physics_intro: "STEM tool powered by Matter.js.",
    phys_gravity_title: "Gravity & Free Fall",
    phys_gravity_desc: "Experience objects falling under gravity.",
    phys_momentum_title: "Momentum & Collisions",
    phys_momentum_desc: "Observe energy transfer during impacts.",
    phys_elasticity_title: "Elasticity & Bouncing",
    phys_elasticity_desc: "Understand energy conversion via springs.",
    vision_title: "🎨 Vision of Nodon Builder",
    vision_desc1: "Making physics learning fun for everyone.",
    vision_desc2: "The ultimate tool for creative thinking.",
    vision_highlight_title: "Why Nodon Builder?",
    vision_li1: "Infinite Freedom: Your imagination is the blueprint.",
    vision_li2: "Intuitive: Logic without complex coding.",
    vision_li3: "Real-time: Instant physics simulation.",
    faq_title: "❓ FAQ",
    faq_q1: "Not working?", faq_a1: "Check Play button and wiring direction.",
    faq_q2: "How to delete?", faq_a2: "Click Nodon and use the trash icon.",
    faq_q3: "Mobile support?", faq_a3: "Yes, it is fully responsive.",
    footer_tagline: "Where creativity meets physics.",
    footer_nav_title: "Explore", nav_editor: "Builder", nav_guide: "Guide", nav_encyclo: "Encyclopedia",
    footer_legal_title: "Legal", nav_privacy: "Privacy Policy", nav_terms: "Terms",
    privacy_title: "Privacy Policy",
    privacy_p1: "No personal data collected; uses cookies for ads.",
    terms_title: "Terms",
    terms_h1: "Usage",
    terms_p1: "Free for educational and personal use.",
    tip_ball: "A basic marble that follows physics.",
    tip_ramp: "An inclined surface for the ball.",
    tip_box: "A physical cube for obstacles.",
    tip_floor: "A static platform to support the machine.",
    tip_goal: "The ultimate target!",
    tip_spring: "Launches any object that touches it.",
    tip_treadmill: "Moves objects in a specific direction.",
    tip_breakable: "Fragile box that shatters on impact.",
    tip_balloon: "Defies gravity and floats upwards.",
    tip_sensor: "Detects collisions and sends signals.",
    tip_fan: "Blasts wind when triggered.",
    tip_timer: "Waits for a delay before signaling.",
    tip_warp_a: "The entrance portal.",
    tip_warp_b: "The exit portal.",
    tip_magnet: "Attracts nearby metallic balls.",
    tip_counter: "Increments count on signal."
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
    this.hoveredNodon = null;

    this.initCanvas();
    this.initControls();
    this.initDragAndDrop();
    this.initEvents();
    this.initSuccessUI();
    this.initSettings();
    this.initManual();
    this.initLegal();
    this.initSmoothScroll();
    this.applyLanguage();
    
    this.animate();
  }

  initLegal() {
    const showPrivacy = document.getElementById('show-privacy');
    const showTerms = document.getElementById('show-terms');
    const privacyModal = document.getElementById('privacy-modal');
    const termsModal = document.getElementById('terms-modal');

    if (showPrivacy) showPrivacy.onclick = (e) => { e.preventDefault(); privacyModal.classList.remove('hidden'); };
    if (showTerms) showTerms.onclick = (e) => { e.preventDefault(); termsModal.classList.remove('hidden'); };

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.onclick = () => {
        const modalId = btn.dataset.modal;
        if (modalId) document.getElementById(modalId).classList.add('hidden');
      };
    });
  }

  initSmoothScroll() {
    document.querySelectorAll('.nav-link, .footer-nav a').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  get selectedNodon() { return this._selectedNodon; }
  set selectedNodon(val) {
    this._selectedNodon = val;
    this.updateSettingsPanel();
  }

  initManual() {
    const modal = document.getElementById('manual-modal');
    const btnOpen = document.getElementById('btn-manual');
    const btnClose = document.getElementById('btn-close-manual');
    if (btnOpen) btnOpen.onclick = () => modal.classList.remove('hidden');
    if (btnClose) btnClose.onclick = () => modal.classList.add('hidden');
  }

  initSettings() {
    const modal = document.getElementById('settings-modal');
    const btnOpen = document.getElementById('btn-settings');
    const btnClose = document.getElementById('btn-close-settings');
    const selLang = document.getElementById('select-lang');
    const selTheme = document.getElementById('select-theme');

    if (btnOpen) btnOpen.onclick = () => modal.classList.remove('hidden');
    if (btnClose) btnClose.onclick = () => modal.classList.add('hidden');
    
    if (selLang) {
      selLang.value = this.lang;
      selLang.onchange = (e) => {
        this.lang = e.target.value;
        this.applyLanguage();
      };
    }

    if (selTheme) {
      selTheme.onchange = (e) => {
        this.theme = e.target.value;
        document.body.className = this.theme === 'dark' ? 'theme-dark' : 'theme-nintendo';
      };
    }

    // Sidebar hover logic
    document.querySelectorAll('.nodon-item').forEach(item => {
      item.addEventListener('mouseenter', () => this.showTooltip(item.dataset.type));
      item.addEventListener('mouseleave', () => this.hideTooltip());
      item.addEventListener('mousemove', (e) => this.moveTooltip(e.clientX, e.clientY));
    });
  }

  showTooltip(type) {
    const tooltip = document.getElementById('hover-tooltip');
    if (!tooltip) return;
    const nameKey = `nodon_${type.replace('-', '_')}`;
    const tipKey = `tip_${type.replace('-', '_')}`;
    tooltip.querySelector('.tooltip-title').textContent = I18N[this.lang][nameKey] || type;
    tooltip.querySelector('.tooltip-body').textContent = I18N[this.lang][tipKey] || "...";
    tooltip.classList.remove('hidden');
  }

  hideTooltip() {
    const tooltip = document.getElementById('hover-tooltip');
    if (tooltip) tooltip.classList.add('hidden');
  }

  moveTooltip(x, y) {
    const tooltip = document.getElementById('hover-tooltip');
    if (!tooltip) return;
    const tx = Math.min(x + 15, window.innerWidth - 260);
    const ty = Math.min(y + 15, window.innerHeight - 160);
    tooltip.style.left = tx + 'px';
    tooltip.style.top = ty + 'px';
  }

  applyLanguage() {
    document.querySelectorAll('[data-lang]').forEach(el => {
      const key = el.dataset.lang;
      if (I18N[this.lang][key]) el.textContent = I18N[this.lang][key];
    });
    this.updateSettingsPanel();
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
        background: 'transparent',
        pixelRatio: window.devicePixelRatio || 1
      }
    });
    Render.run(this.render);
    this.runner = Runner.create();
    const mouse = Mouse.create(this.render.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
    Composite.add(this.world, this.mouseConstraint);

    // Dynamic resizing to maintain 1:1 coordinate mapping
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      
      this.render.canvas.width = w;
      this.render.canvas.height = h;
      this.render.options.width = w;
      this.render.options.height = h;
      
      // Update mouse offset if canvas moved
      if (this.mouseConstraint.mouse) {
        Matter.Mouse.setOffset(this.mouseConstraint.mouse, { x: 0, y: 0 });
      }
    });
    resizeObserver.observe(container);
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
    
    this.panel = document.getElementById('settings-panel');
    document.getElementById('node-delete').onclick = () => this.removeNodon(this.selectedNodon);
    
    this.inputs = {
      restitution: document.getElementById('input-restitution'),
      delay: document.getElementById('input-delay'),
      power: document.getElementById('input-power')
    };
    
    this.inputs.restitution.oninput = (e) => {
      if (!this.selectedNodon) return;
      const val = parseFloat(e.target.value);
      this.selectedNodon.body.restitution = val;
    };
    
    this.inputs.delay.oninput = (e) => {
      if (!this.selectedNodon) return;
      this.selectedNodon.delay = parseFloat(e.target.value) * 1000;
    };
    
    this.inputs.power.oninput = (e) => {
      if (!this.selectedNodon) return;
      this.selectedNodon.power = parseFloat(e.target.value);
    };
  }

  updateSettingsPanel() {
    if (!this.selectedNodon) { this.panel.classList.add('hidden'); return; }
    this.panel.classList.remove('hidden');
    const nameKey = `nodon_${this.selectedNodon.type.replace('-', '_')}`;
    document.getElementById('node-name').textContent = I18N[this.lang][nameKey] || this.selectedNodon.type.toUpperCase();
    
    const type = this.selectedNodon.type;
    // Show/Hide relevant controls
    document.getElementById('prop-restitution').style.display = ['ball', 'box', 'spring', 'breakable', 'floor', 'ramp'].includes(type) ? 'block' : 'none';
    document.getElementById('prop-delay').style.display = (type === 'timer') ? 'block' : 'none';
    document.getElementById('prop-power').style.display = ['fan', 'magnet', 'treadmill', 'spring'].includes(type) ? 'block' : 'none';
    
    this.inputs.restitution.value = this.selectedNodon.body.restitution || 0.5;
    this.inputs.delay.value = (this.selectedNodon.delay || 1000) / 1000;
    this.inputs.power.value = this.selectedNodon.power || 0.05;
  }

  initDragAndDrop() {
    document.querySelectorAll('.nodon-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', item.dataset.type);
      });
    });

    const container = document.getElementById('canvas-container');
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    container.addEventListener('drop', (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('type');
      if (!type) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.addNodon(type, x, y);
    });
  }

  initEvents() {
    Events.on(this.engine, 'collisionStart', (event) => event.pairs.forEach(pair => this.handleCollisions(pair.bodyA, pair.bodyB, pair)));
    
    const canvas = this.render.canvas;
    canvas.onmousedown = (e) => {
      if (this.isPlaying) return;
      const clickedBody = Matter.Query.point(Composite.allBodies(this.world), { x: e.offsetX, y: e.offsetY })[0];
      if (clickedBody) {
        const nodon = this.nodons.find(n => n.body === clickedBody);
        if (nodon) this.selectedNodon = nodon;
      } else if (!e.target.classList.contains('port')) {
        this.selectedNodon = null;
      }
    };

    canvas.onmousemove = (e) => {
      const mousePos = { x: e.offsetX, y: e.offsetY };
      const hoveredBodies = Matter.Query.point(Composite.allBodies(this.world), mousePos);
      const hoveredBody = hoveredBodies.find(b => this.nodons.some(n => n.body === b));
      const nodon = hoveredBody ? this.nodons.find(n => n.body === hoveredBody) : null;
      
      if (nodon) {
        this.hoveredNodon = nodon;
        this.showTooltip(nodon.type);
        this.moveTooltip(e.clientX, e.clientY);
      } else {
        if (this.hoveredNodon) this.hideTooltip();
        this.hoveredNodon = null;
      }
    };

    Events.on(this.mouseConstraint, 'mousedown', () => {
      if (!this.isPlaying && this.mouseConstraint.body) {
        const nodon = this.nodons.find(n => n.body === this.mouseConstraint.body);
        if (nodon) this.selectedNodon = nodon;
      }
    });

    Events.on(this.mouseConstraint, 'mouseup', () => {
      if (!this.isPlaying && this.selectedNodon) {
        this.selectedNodon.initialPos = { ...this.selectedNodon.body.position };
        this.selectedNodon.initialAngle = this.selectedNodon.body.angle;
      }
    });
    
    window.onkeydown = (e) => {
      if (e.key.toLowerCase() === 'r' && this.selectedNodon) {
        Matter.Body.setAngle(this.selectedNodon.body, this.selectedNodon.body.angle + Math.PI / 8);
        this.selectedNodon.initialAngle = this.selectedNodon.body.angle;
      }
    };

    Events.on(this.engine, 'beforeUpdate', () => {
      this.nodons.forEach(n => {
        if (n.type === 'treadmill' && this.isPlaying) {
          const bodiesOnTop = Matter.Query.region(Composite.allBodies(this.world), n.body.bounds);
          bodiesOnTop.forEach(b => {
            if (b !== n.body && !b.isStatic) {
              const force = n.power * 2.5;
              Matter.Body.translate(b, { x: Math.cos(n.body.angle) * force, y: Math.sin(n.body.angle) * force });
            }
          });
        }
        if (n.type === 'balloon' && this.isPlaying) {
          Matter.Body.applyForce(n.body, n.body.position, { x: 0, y: -0.0018 });
        }
      });
    });
  }

  handleCollisions(bodyA, bodyB, pair) {
    const nA = this.nodons.find(n => n.body === bodyA);
    const nB = this.nodons.find(n => n.body === bodyB);
    if (!nA || !nB) return;

    if (nA.type === 'sensor' || nA.type === 'timer') this.triggerNodonLogic(nA, nB.body);
    if (nB.type === 'sensor' || nB.type === 'timer') this.triggerNodonLogic(nB, nA.body);
    if (nA.type === 'spring') this.applySpring(nA, nB.body);
    if (nB.type === 'spring') this.applySpring(nB, nA.body);
    if (nA.type === 'breakable' && pair.collision.depth > 3) this.breakNodon(nA);
    if (nB.type === 'breakable' && pair.collision.depth > 3) this.breakNodon(nB);
    if (nA.type === 'warp-a' && nB.type === 'ball') this.teleport(nB.body, 'warp-b');
    if (nB.type === 'warp-a' && nA.type === 'ball') this.teleport(nA.body, 'warp-b');
    if ((nA.type === 'goal' && nB.type === 'ball') || (nB.type === 'goal' && nA.type === 'ball')) this.reachGoal();
  }

  applySpring(spring, body) {
    const angle = spring.body.angle - Math.PI/2;
    const force = spring.power || 0.07;
    Matter.Body.applyForce(body, body.position, { x: Math.cos(angle) * force, y: Math.sin(angle) * force });
    spring.isActive = true;
    setTimeout(() => spring.isActive = false, 250);
  }

  breakNodon(nodon) {
    if (nodon.isBroken) return;
    nodon.isBroken = true;
    this.removeNodon(nodon);
  }

  teleport(body, targetType) {
    const target = this.nodons.find(n => n.type === targetType);
    if (target) {
      Matter.Body.setPosition(body, { x: target.body.position.x, y: target.body.position.y });
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
    }
  }

  reachGoal() {
    if (this.goalReached) return;
    this.goalReached = true;
    const msg = document.getElementById('success-msg');
    if (msg) msg.classList.add('show');
    setTimeout(() => msg && msg.classList.remove('show'), 5000);
  }

  addNodon(type, x, y) {
    const id = Date.now();
    const color = this.getNodonColor(type);
    let body;
    const common = { label: id.toString(), render: { fillStyle: color, strokeStyle: '#2F3542', lineWidth: 3 } };
    
    switch(type) {
      case 'ball': body = Bodies.circle(x, y, 15, { ...common, friction: 0.005, restitution: 0.6 }); break;
      case 'ramp': body = Bodies.rectangle(x, y, 180, 25, { ...common, angle: Math.PI / 8, isStatic: true }); break;
      case 'box': body = Bodies.rectangle(x, y, 55, 55, common); break;
      case 'floor': body = Bodies.rectangle(x, y, 350, 30, { ...common, isStatic: true }); break;
      case 'goal': body = Bodies.rectangle(x, y, 80, 50, { ...common, isStatic: true }); break;
      case 'spring': body = Bodies.rectangle(x, y, 80, 25, { ...common, isStatic: true }); break;
      case 'treadmill': body = Bodies.rectangle(x, y, 160, 35, { ...common, isStatic: true }); break;
      case 'breakable': body = Bodies.rectangle(x, y, 50, 50, { ...common, friction: 0.3 }); break;
      case 'balloon': body = Bodies.circle(x, y, 30, { ...common, frictionAir: 0.1 }); break;
      case 'fan': body = Bodies.circle(x, y, 35, { ...common, isStatic: true }); break;
      case 'sensor': body = Bodies.rectangle(x, y, 70, 70, { ...common, isStatic: true, isSensor: true }); break;
      case 'timer': body = Bodies.circle(x, y, 35, { ...common, isStatic: true, isSensor: true }); break;
      case 'warp-a': case 'warp-b': body = Bodies.circle(x, y, 35, { ...common, isStatic: true, isSensor: true }); break;
      case 'magnet': body = Bodies.circle(x, y, 40, { ...common, isStatic: true, isSensor: true }); break;
      case 'counter': body = Bodies.rectangle(x, y, 65, 65, { ...common, isStatic: true }); break;
    }

    if (body) {
      Composite.add(this.world, body);
      const nodon = { id, type, body, initialPos: { x, y }, initialAngle: body.angle, power: 0.07, delay: 1000, count: 0, target: 3 };
      this.nodons.push(nodon);
      this.selectedNodon = nodon;
    }
  }

  triggerNodonLogic(sensor, targetBody) {
    if (sensor.type === 'counter') {
      sensor.count++;
      if (sensor.count < sensor.target) return;
      sensor.count = 0;
    }
    const run = () => this.connections.filter(c => c.fromId === sensor.id).forEach(c => this.applyAction(this.nodons.find(n => n.id === c.toId), targetBody));
    if (sensor.type === 'timer') setTimeout(run, sensor.delay);
    else run();
  }

  applyAction(target, source) {
    if (!target) return;
    if (target.type === 'fan') {
      const angle = target.body.angle;
      Matter.Body.applyForce(source, source.position, { x: Math.cos(angle) * target.power, y: Math.sin(angle) * target.power });
    }
    target.isActive = true;
    setTimeout(() => target.isActive = false, 300);
  }

  getNodonColor(type) {
    const palette = {
      ball: '#FF4757', ramp: '#1E90FF', box: '#FFA502', floor: '#747D8C',
      spring: '#FED330', treadmill: '#2F3542', breakable: '#CED6E0', balloon: '#FF6B81',
      fan: '#2ED573', sensor: '#70A1FF', timer: '#FF6348', 'warp-a': '#6C5CE7',
      'warp-b': '#A29BFE', magnet: '#2F3542', goal: '#ECCC68', counter: '#535C68'
    };
    return palette[type] || '#CED6E0';
  }

  animate() {
    const svg = document.getElementById('wiring-layer');
    if (!svg) return;
    svg.innerHTML = '';
    this.drawWires();
    this.drawPortalConnections();
    this.drawNodonSkins();
    this.handleMagnets();
    this.drawPorts();
    this.drawSelectionHighlight();
    requestAnimationFrame(() => this.animate());
  }

  drawPortalConnections() {
    const a = this.nodons.find(n => n.type === 'warp-a');
    const b = this.nodons.find(n => n.type === 'warp-b');
    if (a && b) this.createWire(a.body.position, b.body.position, 'rgba(108, 92, 231, 0.5)', true);
  }

  drawNodonSkins() {
    const balls = this.nodons.filter(n => n.type === 'ball');
    const firstBall = balls[0]?.body.position;
    const time = Date.now();
    
    this.nodons.forEach(nodon => {
      const { x, y } = nodon.body.position;
      const angle = nodon.body.angle;
      const svg = document.getElementById('wiring-layer');
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${x},${y}) rotate(${angle * 180 / Math.PI})`);
      
      this.drawHighQualitySkin(g, nodon, time);
      
      const isLogic = ['sensor', 'timer', 'fan', 'warp-a', 'warp-b', 'magnet', 'counter'].includes(nodon.type);
      const lookAt = firstBall ? Vector.mult(Vector.normalise(Vector.sub(firstBall, nodon.body.position)), 3.5) : { x: 0, y: 0 };
      this.addFaceToGroup(g, isLogic ? 7 : 5, isLogic ? 12 : 8, time, lookAt, this.selectedNodon === nodon, nodon.isActive);
      
      svg.appendChild(g);
    });
  }

  drawHighQualitySkin(g, nodon, time) {
    const type = nodon.type;
    // Shading
    if (['ball', 'balloon', 'fan', 'timer', 'warp-a', 'warp-b', 'magnet'].includes(type)) {
      const shade = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shade.setAttribute('cx', 5); shade.setAttribute('cy', 5);
      shade.setAttribute('r', type === 'magnet' ? 40 : 35); shade.setAttribute('fill', 'rgba(0,0,0,0.1)');
      g.appendChild(shade);
    }

    if (type === 'ball') {
      const shine = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shine.setAttribute('cx', -5); shine.setAttribute('cy', -5); shine.setAttribute('r', 5); shine.setAttribute('fill', 'rgba(255,255,255,0.4)');
      g.appendChild(shine);
    }
    if (type === 'box') {
      for(let i=0; i<3; i++) {
        const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l.setAttribute('x1', -25); l.setAttribute('y1', -15 + i*15); l.setAttribute('x2', 25); l.setAttribute('y2', -15 + i*15);
        l.setAttribute('stroke', 'rgba(0,0,0,0.1)'); l.setAttribute('stroke-width', '2'); g.appendChild(l);
      }
    }
    if (type === 'ramp') {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', 'M -90 12 L 90 12 L 90 -12 Z'); p.setAttribute('fill', 'rgba(255,255,255,0.3)'); g.appendChild(p);
    }
    if (type === 'spring') {
      const h = nodon.isActive ? 8 : 20;
      for(let i=0; i<5; i++) {
        const coil = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const yOff = -10 + i * (h/4);
        coil.setAttribute('d', `M -35 ${yOff} Q 0 ${yOff - 5} 35 ${yOff}`);
        coil.setAttribute('stroke', 'white'); coil.setAttribute('fill', 'none'); coil.setAttribute('stroke-width', '4'); g.appendChild(coil);
      }
    }
    if (type === 'treadmill') {
      const offset = (time / 8) % 40;
      for(let i=-3; i<4; i++) {
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrow.setAttribute('d', `M ${i*40 + offset - 85} 0 L ${i*40 + offset - 75} 5 L ${i*40 + offset - 85} 10`);
        arrow.setAttribute('stroke', 'white'); arrow.setAttribute('fill', 'none'); arrow.setAttribute('stroke-width', '3'); g.appendChild(arrow);
      }
    }
    if (type === 'fan') {
      const bladeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      bladeG.setAttribute('transform', `rotate(${(time / (nodon.isActive ? 1.5 : 8)) % 360})`);
      for(let i=0; i<4; i++) {
        const b = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        b.setAttribute('d', 'M 0 0 C 20 -10 30 -30 0 -35 C -30 -30 -20 -10 0 0');
        b.setAttribute('fill', 'rgba(255,255,255,0.8)'); b.setAttribute('transform', `rotate(${i * 90})`); bladeG.appendChild(b);
      }
      g.appendChild(bladeG);
    }
    if (type === 'timer') {
      const hand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      hand.setAttribute('y2', -25); hand.setAttribute('stroke', 'white'); hand.setAttribute('stroke-width', '3');
      hand.setAttribute('transform', `rotate(${(time/10)%360})`); g.appendChild(hand);
    }
    if (type === 'warp-a' || type === 'warp-b') {
      const swirl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      swirl.setAttribute('r', 25); swirl.setAttribute('fill', 'none'); swirl.setAttribute('stroke', 'white');
      swirl.setAttribute('stroke-width', '4'); swirl.setAttribute('stroke-dasharray', '5,15');
      swirl.setAttribute('transform', `rotate(${(time/5)%360})`); g.appendChild(swirl);
    }
    if (type === 'magnet') {
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('r', 35); ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', 'rgba(255,255,255,0.2)');
      ring.setAttribute('stroke-width', '8'); ring.setAttribute('stroke-dasharray', '10,10');
      ring.setAttribute('transform', `rotate(${(time/20)%360})`); g.appendChild(ring);
    }
    if (type === 'goal') {
      const pole = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      pole.setAttribute('x', -3); pole.setAttribute('y', -50); pole.setAttribute('width', 6); pole.setAttribute('height', 50);
      pole.setAttribute('fill', '#57606F'); g.appendChild(pole);
      const flag = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const off = Math.sin(time / 120) * 10;
      flag.setAttribute('d', `M 0 -50 L ${35+off} -35 L 0 -20 Z`);
      flag.setAttribute('fill', '#FF4757'); flag.setAttribute('stroke', 'white'); flag.setAttribute('stroke-width', '2'); g.appendChild(flag);
    }
    if (type === 'counter') {
      const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      box.setAttribute('x', -25); box.setAttribute('y', 10); box.setAttribute('width', 50); box.setAttribute('height', 25);
      box.setAttribute('fill', '#2F3542'); box.setAttribute('rx', '5'); g.appendChild(box);
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('y', 28); txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('fill', '#FED330');
      txt.setAttribute('font-weight', 'bold'); txt.setAttribute('font-size', '18'); txt.setAttribute('font-family', 'monospace');
      txt.textContent = `${nodon.count}/${nodon.target}`; g.appendChild(txt);
    }
  }

  addFaceToGroup(g, size, offset, time, look, selected, active) {
    const isBlinking = (Math.floor(time / 100) % 60 === 0);
    [ -offset, offset ].forEach(ox => {
      if (isBlinking) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', ox - size); line.setAttribute('y1', -3); line.setAttribute('x2', ox + size); line.setAttribute('y2', -3);
        line.setAttribute('stroke', '#2F3542'); line.setAttribute('stroke-width', '3'); g.appendChild(line);
      } else {
        const w = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        w.setAttribute('cx', ox); w.setAttribute('cy', -3); w.setAttribute('r', size); w.setAttribute('fill', 'white');
        w.setAttribute('stroke', '#2F3542'); w.setAttribute('stroke-width', '1'); g.appendChild(w);
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        p.setAttribute('cx', ox + look.x); p.setAttribute('cy', -3 + look.y); p.setAttribute('r', size / 1.8); p.setAttribute('fill', '#2F3542'); g.appendChild(p);
      }
    });
    const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const mh = active ? size * 3 : 2.5;
    mouth.setAttribute('d', `M ${-size*1.6} 8 Q 0 ${8 + mh} ${size*1.6} 8`);
    mouth.setAttribute('fill', active ? '#2F3542' : 'none'); mouth.setAttribute('stroke', '#2F3542'); mouth.setAttribute('stroke-width', '2.5');
    g.appendChild(mouth);
    if (selected) {
      [ -offset-8, offset+8 ].forEach(bx => {
        const b = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        b.setAttribute('cx', bx); b.setAttribute('cy', 5); b.setAttribute('r', 5); b.setAttribute('fill', 'rgba(255,100,100,0.6)'); g.appendChild(b);
      });
    }
  }

  handleMagnets() {
    if (!this.isPlaying) return;
    this.nodons.filter(n => n.type === 'magnet').forEach(m => {
      this.nodons.filter(n => n.type === 'ball').forEach(b => {
        const d = Vector.magnitude(Vector.sub(m.body.position, b.body.position));
        if (d < 280) Matter.Body.applyForce(b.body, b.body.position, Vector.mult(Vector.normalise(Vector.sub(m.body.position, b.body.position)), m.power * (1 - d/280)));
      });
    });
  }

  drawPorts() {
    if (this.isPlaying) return;
    this.nodons.forEach(n => {
      if (['sensor', 'timer', 'counter'].includes(n.type)) this.createPort(n, n.body.position.x + 45, n.body.position.y, 'output');
      if (['fan', 'timer', 'counter'].includes(n.type)) this.createPort(n, n.body.position.x - 45, n.body.position.y, 'input');
    });
  }

  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '10'); c.classList.add('port', type);
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
      if (f && t) this.createWire({ x: f.body.position.x + 45, y: f.body.position.y }, { x: t.body.position.x - 45, y: t.body.position.y }, '#4a90e2');
    });
    if (this.isWiring) this.createWire(this.wireStartPort, this.mouseConstraint.mouse.position, '#ff4757', true);
  }

  createWire(p1, p2, color, isDashed = false) {
    const svg = document.getElementById('wiring-layer');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const dx = Math.abs(p2.x - p1.x) * 0.65;
    path.setAttribute('d', `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`);
    path.setAttribute('stroke', color); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '6'); path.setAttribute('stroke-linecap', 'round');
    if (isDashed) path.setAttribute('stroke-dasharray', '12,12');
    svg.appendChild(path);
  }

  drawSelectionHighlight() {
    if (!this.selectedNodon) return;
    const { x, y } = this.selectedNodon.body.position;
    const svg = document.getElementById('wiring-layer');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', 60);
    circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', '#ff4757'); circle.setAttribute('stroke-width', '4'); circle.setAttribute('stroke-dasharray', '6,6');
    svg.appendChild(circle);
  }

  resetSimulation() {
    this.nodons.forEach(n => { 
      if (!n.body.isStatic) {
        Matter.Body.setPosition(n.body, n.initialPos); 
        Matter.Body.setAngle(n.body, n.initialAngle); 
        Matter.Body.setVelocity(n.body, { x: 0, y: 0 }); 
        Matter.Body.setAngularVelocity(n.body, 0);
      }
      n.count = 0; n.isActive = false;
    });
    this.goalReached = false; 
    const msg = document.getElementById('success-msg');
    if (msg) msg.classList.remove('show');
  }

  clearAll() {
    Composite.clear(this.world, false); Composite.add(this.world, this.mouseConstraint);
    this.nodons = []; this.connections = []; this.selectedNodon = null;
  }

  initSuccessUI() {
    let msg = document.getElementById('success-msg');
    if (!msg) {
      msg = document.createElement('div'); msg.id = 'success-msg';
      document.body.appendChild(msg);
    }
    msg.innerHTML = '<h2 data-lang="success_title">성공!</h2><p data-lang="success_msg">정말 멋진 장치예요!</p>';
    I18N.ko.success_title = "성공!"; I18N.ko.success_msg = "정말 멋진 장치예요!";
    I18N.en.success_title = "Success!"; I18N.en.success_msg = "Amazing Contraption!";
  }

  removeNodon(n) {
    if (!n) return; Composite.remove(this.world, n.body);
    this.nodons = this.nodons.filter(x => x.id !== n.id);
    this.connections = this.connections.filter(c => c.fromId !== n.id && c.toId !== n.id);
    if (this.selectedNodon === n) this.selectedNodon = null;
  }
}

const app = new GoldbergApp();
g', 'path');
        b.setAttribute('d', 'M 0 0 C 20 -10 30 -30 0 -35 C -30 -30 -20 -10 0 0');
        b.setAttribute('fill', 'rgba(255,255,255,0.8)'); b.setAttribute('transform', `rotate(${i * 90})`); bladeG.appendChild(b);
      }
      g.appendChild(bladeG);
    }
    if (type === 'timer') {
      const hand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      hand.setAttribute('y2', -25); hand.setAttribute('stroke', 'white'); hand.setAttribute('stroke-width', '3');
      hand.setAttribute('transform', `rotate(${(time/10)%360})`); g.appendChild(hand);
    }
    if (type === 'warp-a' || type === 'warp-b') {
      const swirl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      swirl.setAttribute('r', 25); swirl.setAttribute('fill', 'none'); swirl.setAttribute('stroke', 'white');
      swirl.setAttribute('stroke-width', '4'); swirl.setAttribute('stroke-dasharray', '5,15');
      swirl.setAttribute('transform', `rotate(${(time/5)%360})`); g.appendChild(swirl);
    }
    if (type === 'magnet') {
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('r', 35); ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', 'rgba(255,255,255,0.2)');
      ring.setAttribute('stroke-width', '8'); ring.setAttribute('stroke-dasharray', '10,10');
      ring.setAttribute('transform', `rotate(${(time/20)%360})`); g.appendChild(ring);
    }
    if (type === 'goal') {
      const pole = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      pole.setAttribute('x', -3); pole.setAttribute('y', -50); pole.setAttribute('width', 6); pole.setAttribute('height', 50);
      pole.setAttribute('fill', '#57606F'); g.appendChild(pole);
      const flag = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const off = Math.sin(time / 120) * 10;
      flag.setAttribute('d', `M 0 -50 L ${35+off} -35 L 0 -20 Z`);
      flag.setAttribute('fill', '#FF4757'); flag.setAttribute('stroke', 'white'); flag.setAttribute('stroke-width', '2'); g.appendChild(flag);
    }
    if (type === 'counter') {
      const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      box.setAttribute('x', -25); box.setAttribute('y', 10); box.setAttribute('width', 50); box.setAttribute('height', 25);
      box.setAttribute('fill', '#2F3542'); box.setAttribute('rx', '5'); g.appendChild(box);
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('y', 28); txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('fill', '#FED330');
      txt.setAttribute('font-weight', 'bold'); txt.setAttribute('font-size', '18'); txt.setAttribute('font-family', 'monospace');
      txt.textContent = `${nodon.count}/${nodon.target}`; g.appendChild(txt);
    }
  }

  addFaceToGroup(g, size, offset, time, look, selected, active) {
    const isBlinking = (Math.floor(time / 100) % 60 === 0);
    [ -offset, offset ].forEach(ox => {
      if (isBlinking) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', ox - size); line.setAttribute('y1', -3); line.setAttribute('x2', ox + size); line.setAttribute('y2', -3);
        line.setAttribute('stroke', '#2F3542'); line.setAttribute('stroke-width', '3'); g.appendChild(line);
      } else {
        const w = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        w.setAttribute('cx', ox); w.setAttribute('cy', -3); w.setAttribute('r', size); w.setAttribute('fill', 'white');
        w.setAttribute('stroke', '#2F3542'); w.setAttribute('stroke-width', '1'); g.appendChild(w);
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        p.setAttribute('cx', ox + look.x); p.setAttribute('cy', -3 + look.y); p.setAttribute('r', size / 1.8); p.setAttribute('fill', '#2F3542'); g.appendChild(p);
      }
    });
    const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const mh = active ? size * 3 : 2.5;
    mouth.setAttribute('d', `M ${-size*1.6} 8 Q 0 ${8 + mh} ${size*1.6} 8`);
    mouth.setAttribute('fill', active ? '#2F3542' : 'none'); mouth.setAttribute('stroke', '#2F3542'); mouth.setAttribute('stroke-width', '2.5');
    g.appendChild(mouth);
    if (selected) {
      [ -offset-8, offset+8 ].forEach(bx => {
        const b = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        b.setAttribute('cx', bx); b.setAttribute('cy', 5); b.setAttribute('r', 5); b.setAttribute('fill', 'rgba(255,100,100,0.6)'); g.appendChild(b);
      });
    }
  }

  handleMagnets() {
    if (!this.isPlaying) return;
    this.nodons.filter(n => n.type === 'magnet').forEach(m => {
      this.nodons.filter(n => n.type === 'ball').forEach(b => {
        const d = Vector.magnitude(Vector.sub(m.body.position, b.body.position));
        if (d < 280) Matter.Body.applyForce(b.body, b.body.position, Vector.mult(Vector.normalise(Vector.sub(m.body.position, b.body.position)), m.power * (1 - d/280)));
      });
    });
  }

  drawPorts() {
    if (this.isPlaying) return;
    this.nodons.forEach(n => {
      if (['sensor', 'timer', 'counter'].includes(n.type)) this.createPort(n, n.body.position.x + 45, n.body.position.y, 'output');
      if (['fan', 'timer', 'counter'].includes(n.type)) this.createPort(n, n.body.position.x - 45, n.body.position.y, 'input');
    });
  }

  createPort(nodon, x, y, type) {
    const svg = document.getElementById('wiring-layer');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '10'); c.classList.add('port', type);
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
      if (f && t) this.createWire({ x: f.body.position.x + 45, y: f.body.position.y }, { x: t.body.position.x - 45, y: t.body.position.y }, '#4a90e2');
    });
    if (this.isWiring) this.createWire(this.wireStartPort, this.mouseConstraint.mouse.position, '#ff4757', true);
  }

  createWire(p1, p2, color, isDashed = false) {
    const svg = document.getElementById('wiring-layer');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const dx = Math.abs(p2.x - p1.x) * 0.65;
    path.setAttribute('d', `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`);
    path.setAttribute('stroke', color); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '6'); path.setAttribute('stroke-linecap', 'round');
    if (isDashed) path.setAttribute('stroke-dasharray', '12,12');
    svg.appendChild(path);
  }

  drawSelectionHighlight() {
    if (!this.selectedNodon) return;
    const { x, y } = this.selectedNodon.body.position;
    const svg = document.getElementById('wiring-layer');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', 60);
    circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', '#ff4757'); circle.setAttribute('stroke-width', '4'); circle.setAttribute('stroke-dasharray', '6,6');
    svg.appendChild(circle);
  }

  resetSimulation() {
    this.nodons.forEach(n => { 
      if (!n.body.isStatic) {
        Matter.Body.setPosition(n.body, n.initialPos); 
        Matter.Body.setAngle(n.body, n.initialAngle); 
        Matter.Body.setVelocity(n.body, { x: 0, y: 0 }); 
        Matter.Body.setAngularVelocity(n.body, 0);
      }
      n.count = 0; n.isActive = false;
    });
    this.goalReached = false; 
    const msg = document.getElementById('success-msg');
    if (msg) msg.classList.remove('show');
  }

  clearAll() {
    Composite.clear(this.world, false); Composite.add(this.world, this.mouseConstraint);
    this.nodons = []; this.connections = []; this.selectedNodon = null;
  }

  initSuccessUI() {
    let msg = document.getElementById('success-msg');
    if (!msg) {
      msg = document.createElement('div'); msg.id = 'success-msg';
      document.body.appendChild(msg);
    }
    msg.innerHTML = '<h2 data-lang="success_title">성공!</h2><p data-lang="success_msg">정말 멋진 장치예요!</p>';
    I18N.ko.success_title = "성공!"; I18N.ko.success_msg = "정말 멋진 장치예요!";
    I18N.en.success_title = "Success!"; I18N.en.success_msg = "Amazing Contraption!";
  }

  removeNodon(n) {
    if (!n) return; Composite.remove(this.world, n.body);
    this.nodons = this.nodons.filter(x => x.id !== n.id);
    this.connections = this.connections.filter(c => c.fromId !== n.id && c.toId !== n.id);
    if (this.selectedNodon === n) this.selectedNodon = null;
  }
}

const app = new GoldbergApp();
