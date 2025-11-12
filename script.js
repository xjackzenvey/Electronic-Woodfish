let merit = 0;
let currentConfig = 'default';
let configList = [];

const meritCountEl = document.getElementById('merit-count');
const woodfishEl = document.getElementById('woodfish');
const floatingContainer = document.getElementById('floating-container');
const audioEl = document.getElementById('audio-element');
const modal = document.getElementById('modal');
const configSelect = document.getElementById('config-select');
const currentConfigEl = document.getElementById('current-config');
const settingsBtn = document.getElementById('settings-btn');
const closeBtn = document.querySelector('.close');

// 初始化
async function init() {
  await loadConfigs();
  applyConfig('ciallo');
  bindEvents();
}

async function loadConfigs() {
  try {
    const res = await fetch('config.json');
    const configs = await res.json();
    configList = configs;
    populateConfigSelect();
  } catch (e) {
    console.error('Failed to load config.json', e);
    configList = [{ id: 'default', name: '默认', sound: 'assets/default/Windows-Background.wav', background: 'assets/default/back.png' }];
    populateConfigSelect();
  }
}

function populateConfigSelect() {
  configSelect.innerHTML = '';
  configList.forEach(cfg => {
    const opt = document.createElement('option');
    opt.value = cfg.id;
    opt.textContent = cfg.name;
    configSelect.appendChild(opt);
  });
}

function applyConfig(id) {
  const cfg = configList.find(c => c.id === id) || configList[0];
  currentConfig = cfg.id;
  currentConfigEl.textContent = cfg.name;

  // ✅ 更新背景图（只改 #bg-image）
  document.getElementById('bg-image').style.backgroundImage = `url('${cfg.background}')`;

  // 预加载音效
  audioEl.src = cfg.sound;
  audioEl.load();
}

function bindEvents() {
  woodfishEl.addEventListener('click', () => {
    // 动画
    woodfishEl.classList.remove('tapped');
    void woodfishEl.offsetWidth; // 触发重排
    woodfishEl.classList.add('tapped');

    // 播放声音
    audioEl.currentTime = 0;
    audioEl.play().catch(e => console.warn('Audio play failed:', e));

    // 功德 +1
    merit++;
    meritCountEl.textContent = `功德: ${merit}`;

    // 飘字
    const textEl = document.createElement('div');
    textEl.className = 'floating-text';
    textEl.textContent = '功德+1';
    floatingContainer.appendChild(textEl);

    setTimeout(() => {
      if (textEl.parentNode) textEl.parentNode.removeChild(textEl);
    }, 1600);
  });

  settingsBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  configSelect.addEventListener('change', () => {
    applyConfig(configSelect.value);
  });
}

// 启动
document.addEventListener('DOMContentLoaded', init);