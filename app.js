(() => {
  'use strict';

  const DATA = window.WIKELO_DATA;
  if (!DATA || !Array.isArray(DATA.contracts)) {
    document.body.innerHTML = '<div style="padding:40px;font-family:Segoe UI,sans-serif;color:#eee;background:#060a0e;min-height:100vh">Не удалось загрузить data.js. Проверьте, что файл находится рядом с index.html.</div>';
    return;
  }

  const CONTRACTS = DATA.contracts;
  const CONTRACT_BY_ID = new Map(CONTRACTS.map((c) => [c.id, c]));
  const RESOURCE_DETAILS = window.WIKELO_DETAILS || {};

  const FAB_DATA = window.FABRICATOR_DATA && typeof window.FABRICATOR_DATA === 'object' ? window.FABRICATOR_DATA : {};
  const FAB_BLUEPRINTS = Array.isArray(FAB_DATA.blueprints) ? FAB_DATA.blueprints : [];
  const FAB_MISSIONS = Array.isArray(FAB_DATA.missions) ? FAB_DATA.missions : [];
  const FAB_RESOURCES = Array.isArray(FAB_DATA.resources) ? FAB_DATA.resources : [];
  const FAB_BP_BY_ID = new Map(FAB_BLUEPRINTS.map((bp) => [bp.id, bp]));
  const FAB_RESOURCE_BY_NAME = new Map(FAB_RESOURCES.map((resource) => [resource.name, resource]));
  const LOOT_DATA = window.LOOT_DATA && typeof window.LOOT_DATA === 'object' ? window.LOOT_DATA : {};
  const LOOT_LOCATIONS = Array.isArray(LOOT_DATA.locations) ? LOOT_DATA.locations : [];
  const LOOT_TYPES = LOOT_DATA.types && typeof LOOT_DATA.types === 'object' ? LOOT_DATA.types : {};
  const LOOT_RISKS = LOOT_DATA.risks && typeof LOOT_DATA.risks === 'object' ? LOOT_DATA.risks : {};
  const LOOT_BY_ID = new Map(LOOT_LOCATIONS.map((location) => [location.id, location]));
  const LOOT_SYSTEMS = ['Stanton', 'Pyro', 'Nyx'];
  const LOOT_MODES = ['PvE', 'PvPvE', 'PvP'];
  const COMPARISON_DATA = window.COMPARISON_DATA && typeof window.COMPARISON_DATA === 'object' ? window.COMPARISON_DATA : {};
  const COMPARISON_BUY = COMPARISON_DATA.buy && typeof COMPARISON_DATA.buy === 'object' ? COMPARISON_DATA.buy : {};
  const COMPARISON_BLUEPRINTS = COMPARISON_DATA.blueprints && typeof COMPARISON_DATA.blueprints === 'object' ? COMPARISON_DATA.blueprints : {};
  const COMPARISON_CONTRACTS = COMPARISON_DATA.contracts && typeof COMPARISON_DATA.contracts === 'object' ? COMPARISON_DATA.contracts : {};
  const QUALITY_DATA = window.QUALITY_DATA && typeof window.QUALITY_DATA === 'object' ? window.QUALITY_DATA : {};
  const QUALITY_BLUEPRINTS = QUALITY_DATA.blueprints && typeof QUALITY_DATA.blueprints === 'object' ? QUALITY_DATA.blueprints : {};
  const QUALITY_MIN = 0;
  const QUALITY_MAX = 1000;
  const QUALITY_NEUTRAL = 500;
  const LOOT_TOTAL = LOOT_LOCATIONS.length;
  const LOOT_TOP_TOTAL = LOOT_LOCATIONS.filter((location) => location.top).length;
  const LOOT_EXTREME_TOTAL = LOOT_LOCATIONS.filter((location) => location.risk === 'extreme').length;
  const FAB_TOTAL = FAB_BLUEPRINTS.length;
  const FAB_DEFAULT_TOTAL = FAB_BLUEPRINTS.filter((bp) => bp.def).length;
  const FAB_MISSION_TOTAL = FAB_BLUEPRINTS.filter((bp) => !bp.def && bp.m && bp.m.length).length;
  const FAB_NO_SOURCE_TOTAL = FAB_BLUEPRINTS.filter((bp) => !bp.def && (!bp.m || !bp.m.length)).length;
  const FAB_PAGE_SIZE = 48;
  const INV_PAGE_SIZE = 24;
  const FAB_FORMS = ['чертёж', 'чертежа', 'чертежей'];

  const CATEGORY_ORDER = ['currency', 'weapons', 'armor', 'vehicles', 'ships', 'other'];
  const CATEGORY_META = {
    currency: { label: 'Валюта', icon: 'coin' },
    weapons: { label: 'Оружие', icon: 'weapon' },
    armor: { label: 'Броня', icon: 'armor' },
    vehicles: { label: 'Транспорт', icon: 'vehicle' },
    ships: { label: 'Корабли', icon: 'ship' },
    other: { label: 'Другое', icon: 'box' }
  };
  const FAB_CATEGORY_ORDER = ['armor', 'fps', 'attach', 'shipweap', 'comp', 'mining', 'other'];
  const FAB_CATEGORY_META = {
    armor: { label: 'Броня', icon: 'armor' },
    fps: { label: 'FPS-оружие', icon: 'weapon' },
    attach: { label: 'Обвесы', icon: 'tech' },
    shipweap: { label: 'Корабельное оружие', icon: 'ship' },
    comp: { label: 'Корабельные компоненты', icon: 'tech' },
    mining: { label: 'Добыча и салвадж', icon: 'ore' },
    other: { label: 'Другое', icon: 'crate' }
  };
  const FAB_TYPE_LABELS = {
    Helmet: 'Шлем',
    Core: 'Торс',
    Arms: 'Руки',
    Legs: 'Ноги',
    Backpack: 'Рюкзак',
    Undersuit: 'Поддоспешник',
    'FPS weapon': 'FPS-оружие',
    'Weapon attachment': 'Обвес',
    'Ship weapon': 'Корабельное оружие',
    'Power plant': 'Энергоустановка',
    Cooler: 'Кулер',
    Shield: 'Щит',
    'Quantum drive': 'Квантовый двигатель',
    Radar: 'Радар',
    'Mining laser': 'Добывающий лазер',
    'Mining module': 'Добывающий модуль',
    'Salvage module': 'Модуль салваджа',
    'Salvage Head': 'Салвадж-голова',
    'Tractor beam': 'Луч-захват',
    'Docking Collar': 'Стыковочный узел',
    Container: 'Контейнер',
    Cargo: 'Груз',
    Misc: 'Прочее',
    'Char Clothing Torso 1': 'Одежда',
    'Char Clothing Legs': 'Одежда',
    'Char Clothing Torso 0': 'Одежда',
    'Char Clothing Feet': 'Одежда'
  };
  const FAB_MISSION_TYPE_LABELS = {
    Appointment: 'Встреча',
    Battaglia: 'Батталья',
    'Bounty Hunter': 'Охотник за головами',
    Collection: 'Сбор',
    Courier: 'Курьер',
    Delivery: 'Доставка',
    'ECN Alert': 'Тревога ECN',
    'Ground Vehicle Mining': 'Добыча на транспорте',
    'Hand Mining': 'Ручная добыча',
    Hauling: 'Грузоперевозки',
    'Hauling - Interstellar': 'Межзвёздные перевозки',
    'Hauling - Local': 'Местные перевозки',
    'Hauling - Planetary': 'Планетарные перевозки',
    'Hauling - Stellar': 'Перевозки в системе',
    Investigation: 'Расследование',
    Local: 'Локальная',
    Maintenance: 'Обслуживание',
    Mercenary: 'Наёмник',
    Priority: 'Приоритетная',
    'PvP Missions': 'PvP',
    'RSI Discovery Event': 'Событие RSI',
    Racing: 'Гонки',
    Refueling: 'Дозаправка',
    Research: 'Исследование',
    Salvage: 'Салвадж',
    Search: 'Поиск',
    'Service Beacons': 'Сервисные маяки',
    'Ship Mining': 'Корабельная добыча',
    'Wikelo - Other Items': 'Викело: предметы',
    'Wikelo - Vehicles': 'Викело: транспорт'
  };
  const FAB_SOURCE_META = {
    all: { label: 'Все' },
    default: { label: 'Базовый' },
    mission: { label: 'Из миссии' },
    none: { label: 'Без источника' }
  };
  const FAB_SYSTEM_RU = {
    Stanton: 'Стэнтон',
    Pyro: 'Пиро',
    Nyx: 'Никс',
    Terra: 'Терра',
    Odin: 'Один',
    Sol: 'Сол',
    Virgil: 'Вирджил'
  };
  const FAB_MINE_TYPE_RU = {
    Asteroid: 'Астероид',
    Asteroid_ValidQT: 'Астероид',
    Moon: 'Луна',
    Planet: 'Планета',
    Outpost: 'Аутпост',
    Station: 'Станция'
  };
  const FAB_RARITY_RU = {
    Common: 'Обычный',
    Uncommon: 'Необычный',
    Rare: 'Редкий',
    'Very Rare': 'Очень редкий',
    Legendary: 'Легендарный'
  };
  const fabSystemRu = (system) => FAB_SYSTEM_RU[system] || system || '—';
  const fabMineTypeRu = (type) => FAB_MINE_TYPE_RU[type] || type || '—';
  const fabRarityRu = (rarity) => FAB_RARITY_RU[rarity] || rarity || '';
  const KIND_META = {
    currency: { label: 'Валюта', icon: 'coin' },
    ore: { label: 'Руда', icon: 'ore' },
    creature: { label: 'Трофей', icon: 'creature' },
    tech: { label: 'Технология', icon: 'tech' },
    artifact: { label: 'Артефакт', icon: 'artifact' },
    consumable: { label: 'Расходник', icon: 'consumable' },
    salvage: { label: 'Салвадж', icon: 'salvage' },
    equipment: { label: 'Снаряжение', icon: 'crate' }
  };
  const REP_LABELS = {
    'Very Good Customer': 'Very Good Customer',
    'Very Best Customer': 'Very Best Customer'
  };
  const STORAGE_KEY = 'wikeloTracker.state.v1';
  const UI_KEY = 'wikeloTracker.ui.v1';
  const APP_ID = 'wikelo-tracker';
  const APP_VERSION = 3;
  const UPDATE_MANIFEST_URL = 'https://raw.githubusercontent.com/PROtoKOPs/craft-tracker/main/version.json';
  const UPDATE_DISMISS_KEY = 'wikeloTracker.updateDismissed.v1';
  const TOTAL_CONTRACTS = CONTRACTS.length;

  const ICON_PATHS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    coin: '<circle cx="12" cy="12" r="8"/><path d="M9.5 9.5h5v5h-5z"/>',
    weapon: '<circle cx="12" cy="12" r="5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    armor: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
    vehicle: '<rect x="3" y="8" width="18" height="8" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M6 8l2-3h8l2 3"/>',
    ship: '<path d="M12 2l4 9-4 11-4-11 4-9z"/><path d="M8 11H4l2 4M16 11h4l-2 4"/>',
    box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    crate: '<path d="M4 7l8-4 8 4v10l-8 4-8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10M8 5l8 4"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z"/>',
    download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 20h16"/>',
    upload: '<path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 20h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v10H4V8z"/><circle cx="12" cy="13" r="3.2"/>',
    check: '<path d="M4 12l5 5L20 6"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chevronDown: '<path d="M6 9l6 6 6-6"/>',
    chevronRight: '<path d="M9 6l6 6-6 6"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    menu: '<circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v5M14 11v5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".8" fill="currentColor" stroke="none"/>',
    alert: '<path d="M12 3L2.8 20h18.4L12 3z"/><path d="M12 9v5"/><circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4"/><path d="M12 13v5M8 21h8M9 18h6"/>',
    ore: '<path d="M12 2l6 6-6 14L6 8l6-6z"/><path d="M6 8h12M9 8l3 14 3-14"/>',
    creature: '<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="17" cy="9" r="2"/><path d="M6 16c0-3 2.5-5 6-5s6 2 6 5c0 2.5-2 4-6 4s-6-1.5-6-4z"/>',
    tech: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/><rect x="10" y="10" width="4" height="4" rx=".5"/>',
    artifact: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13L6 22l6-3 6 3-2.5-9"/>',
    consumable: '<path d="M9 3h6M10 3v5L5 18a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V3"/><path d="M7 15h10"/>',
    salvage: '<path d="M14 7a4 4 0 0 0-5 5l-5 5 3 3 5-5a4 4 0 0 0 5-5l-2 2-3-3 2-2z"/>',
    file: '<path d="M6 2h7l5 5v15H6V2z"/><path d="M13 2v5h5"/>',
    blueprint: '<path d="M6 3h12v18H6V3z"/><path d="M9 7h6M9 11h6M9 15h4"/><path d="M4 7H2M4 12H2M4 17H2"/>',
    map: '<path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/><circle cx="12" cy="11" r="1.5"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h5a5 5 0 0 0 5-5V8"/>',
    skull: '<path d="M5 10a7 7 0 1 1 14 0v4l-2 2v3h-3v-2h-4v2H7v-3l-2-2v-4z"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M10 15h4"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2"/><circle cx="17" cy="9" r="2"/><path d="M16 14a5 5 0 0 1 5 5v2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>',
    arrowRight: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    arrowUp: '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>'
  };

  const svgIcon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name] || ''}</svg>`;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const norm = (value) => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const fmt = (n) => Number(n || 0).toLocaleString('ru-RU');
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const unitShort = (unit) => (unit === 'SCU' ? 'SCU' : 'шт.');
  const qtyLabel = (qty, unit) => `${fmt(qty)} ${unitShort(unit)}`;
  const plural = (n, one, few, many) => {
    const n10 = Math.abs(n) % 10;
    const n100 = Math.abs(n) % 100;
    if (n10 === 1 && n100 !== 11) return one;
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
    return many;
  };
  const countOf = (n, forms) => `${fmt(n)} ${plural(n, forms[0], forms[1], forms[2])}`;
  const CONTRACT_FORMS = ['контракт', 'контракта', 'контрактов'];
  const RESOURCE_FORMS = ['ресурс', 'ресурса', 'ресурсов'];
  const POSITION_FORMS = ['позиция', 'позиции', 'позиций'];
  const PINNED_FORMS = ['закреплён', 'закреплено', 'закреплено'];
  const IMAGES = DATA.images || {};
  const contractImage = (contract) => IMAGES.contracts?.[contract.id] || '';
  const resourceImage = (order) => customImageFor(order.name) || IMAGES.resources?.[`${order.name}|${order.unit}`] || '';
  const contractUsageThumbHtml = (contract) => {
    if (!contract) return '';
    const category = CATEGORY_META[contract.category] || CATEGORY_META.other;
    const art = contractImage(contract);
    return `<span class="contract-usage-thumb" title="${esc(contract.name)}">${svgIcon(category.icon)}${art ? imageTag(art, contract.name) : ''}</span>`;
  };
  const blueprintUsageThumbHtml = (bp) => {
    if (!bp) return '';
    const category = fabCategoryMeta(bp.c);
    const art = bp.img || '';
    return `<span class="contract-usage-thumb" title="${esc(bp.n)}">${svgIcon(category.icon)}${art ? imageTag(art, bp.n) : ''}</span>`;
  };
  const rewardImage = (reward) => IMAGES.rewards?.[`${reward.name}|${reward.unit}`] || '';
  const imageTag = (src, alt, eager = false) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" onload="this.parentElement.classList.add('has-loaded-img')" onerror="this.remove()">`;

  // --- Ресурсы личного склада ---------------------------------------------
  const INVENTORY_MAX_QTY = 1000000000;
  const INVENTORY_UNIT_FORMS = ['единица', 'единицы', 'единиц'];
  const INVENTORY_RESOURCE_MAP = new Map();

  function inventoryProfile(name) {
    let profile = INVENTORY_RESOURCE_MAP.get(name);
    if (!profile) {
      profile = { name, contracts: [], blueprints: [], material: null };
      INVENTORY_RESOURCE_MAP.set(name, profile);
    }
    return profile;
  }

  function inventoryResourceKind(name, material) {
    if (material && material.kind && KIND_META[material.kind]) return material.kind;
    return resourceKind(name);
  }

  for (const contract of CONTRACTS) {
    for (const order of contract.orders) {
      inventoryProfile(order.name).contracts.push({
        contractId: contract.id,
        orderName: order.name,
        unit: order.unit,
        qty: order.qty,
        qtyUnits: fabUnits(order.qty, order.unit),
        detailKey: `${order.name}|${order.unit}`
      });
    }
  }

  for (const bp of FAB_BLUEPRINTS) {
    for (const row of fabAggregateIngredients(bp)) {
      const qtyUnits = fabUnits(row.qty, row.unit);
      if (qtyUnits <= 0) continue;
      inventoryProfile(row.name).blueprints.push({
        bpId: bp.id,
        key: `${row.name}|${row.unit}`,
        unit: row.unit,
        qty: row.qty,
        qtyUnits,
        parts: row.parts
      });
    }
  }

  for (const material of FAB_RESOURCES) {
    inventoryProfile(material.name).material = material;
  }

  const INVENTORY_RESOURCES = [...INVENTORY_RESOURCE_MAP.values()].map((profile) => {
    const material = profile.material;
    const kind = inventoryResourceKind(profile.name, material);
    const detailKey = profile.contracts[0]?.detailKey || `${profile.name}|unit`;
    const detail = RESOURCE_DETAILS[detailKey]
      || RESOURCE_DETAILS[`${profile.name}|SCU`]
      || RESOURCE_DETAILS[`${profile.name}|unit`]
      || null;
    const image = IMAGES.resources?.[detailKey]
      || IMAGES.resources?.[`${profile.name}|SCU`]
      || IMAGES.resources?.[`${profile.name}|unit`]
      || material?.img
      || '';
    profile.contracts.sort((a, b) => (CONTRACT_BY_ID.get(a.contractId)?.name || '').localeCompare(CONTRACT_BY_ID.get(b.contractId)?.name || '', 'en', { sensitivity: 'base' }));
    profile.blueprints.sort((a, b) => (FAB_BP_BY_ID.get(a.bpId)?.n || '').localeCompare(FAB_BP_BY_ID.get(b.bpId)?.n || '', 'en', { sensitivity: 'base' }));
    return {
      ...profile,
      kind,
      kindLabel: material?.kindLabel || KIND_META[kind]?.label || 'Ресурс',
      detailKey,
      detail,
      image
    };
  }).sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  const INVENTORY_BY_NAME = new Map(INVENTORY_RESOURCES.map((resource) => [resource.name, resource]));
  const INVENTORY_RESOURCE_NAMES = new Set(INVENTORY_BY_NAME.keys());
  const TOTAL_RESOURCES = INVENTORY_RESOURCES.length;
  const INVENTORY_SEARCH_INDEX = new Map(INVENTORY_RESOURCES.map((profile) => [
    profile.name,
    norm([
      profile.name,
      profile.kindLabel,
      ...profile.contracts.map((row) => CONTRACT_BY_ID.get(row.contractId)?.name || ''),
      ...profile.blueprints.map((row) => FAB_BP_BY_ID.get(row.bpId)?.n || '')
    ].join(' '))
  ]));
  const INVENTORY_KIND_COUNTS = INVENTORY_RESOURCES.reduce((acc, profile) => {
    acc[profile.kind] = (acc[profile.kind] || 0) + 1;
    return acc;
  }, {});
  const INVENTORY_KINDS = Object.keys(KIND_META).filter((kind) => INVENTORY_KIND_COUNTS[kind] > 0);
  const FAB_BLUEPRINT_REQUIREMENTS = new Map(FAB_BLUEPRINTS.map((bp) => [
    bp.id,
    new Map(fabAggregateIngredients(bp).map((row) => [`${row.name}|${row.unit}`, fabUnits(row.qty, row.unit)]))
  ]));

  const dateFmt = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeFmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const fmtDate = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '—' : dateFmt.format(d);
  };
  const dateStamp = () => new Date().toISOString().slice(0, 10);

  const el = {
    saveIndicator: document.getElementById('save-indicator'),
    saveText: document.getElementById('save-text'),
    countContracts: document.getElementById('count-contracts'),
    countActive: document.getElementById('count-active'),
    countResources: document.getElementById('count-resources'),
    countInventory: document.getElementById('count-inventory'),
    countFabricator: document.getElementById('count-fabricator'),
    countLoot: document.getElementById('count-loot'),
    statContracts: document.getElementById('stat-contracts'),
    statActive: document.getElementById('stat-active'),
    statDone: document.getElementById('stat-done'),
    statResources: document.getElementById('stat-resources'),
    statLabelContracts: document.getElementById('stat-label-contracts'),
    statLabelActive: document.getElementById('stat-label-active'),
    statLabelDone: document.getElementById('stat-label-done'),
    statLabelResources: document.getElementById('stat-label-resources'),
    sidebar: document.getElementById('sidebar'),
    workspace: document.getElementById('workspace'),
    viewRoot: document.getElementById('view-root'),
    viewTitle: document.getElementById('view-title'),
    viewEyebrow: document.getElementById('view-eyebrow'),
    resultCount: document.getElementById('result-count'),
    resetFilters: document.getElementById('reset-filters'),
    activeFilters: document.getElementById('active-filters'),
    filtersToggle: document.getElementById('filters-toggle'),
    drawerLayer: document.getElementById('drawer-layer'),
    drawer: document.getElementById('drawer'),
    modalLayer: document.getElementById('modal-layer'),
    toastRegion: document.getElementById('toast-region'),
    storageWarning: document.getElementById('storage-warning'),
    importFile: document.getElementById('import-file'),
    customImageFile: document.getElementById('custom-image-file'),
    toTop: document.getElementById('to-top'),
    menuBtn: document.getElementById('menu-btn'),
    mainMenu: document.getElementById('main-menu'),
    exportBtn: document.getElementById('export-btn'),
    importBtn: document.getElementById('import-btn'),
    dataDate: document.getElementById('data-date'),
    gameVersion: document.getElementById('game-version'),
    fabricatorVersion: document.getElementById('fabricator-version')
  };

  let storageOk = true;
  try {
    const testKey = '__wikelo_tracker_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
  } catch (error) {
    storageOk = false;
  }

  const defaultUi = () => ({
    tab: 'contracts',
    contractSearch: '',
    category: 'all',
    reputation: 'all',
    status: 'all',
    pinnedOnly: false,
    contractSort: 'name-asc',
    resourceSearch: '',
    resourceScope: 'all',
    resourceHideDone: false,
    resourceSort: 'name-asc',
    resourceScopeV2: true,
    expandedResources: [],
    inventorySearch: '',
    inventoryFilter: 'all',
    inventoryKind: 'all',
    inventorySort: 'name-asc',
    inventoryShown: INV_PAGE_SIZE,
    fabricatorMode: 'blueprints',
    fabricatorSearch: '',
    fabricatorCategory: 'all',
    fabricatorSubcategory: 'all',
    fabricatorFavoritesOnly: false,
    fabricatorSource: 'all',
    fabricatorResource: 'all',
    fabricatorSystem: 'all',
    fabricatorFaction: 'all',
    fabricatorMissionType: 'all',
    fabricatorSort: 'source-asc',
    fabricatorShown: FAB_PAGE_SIZE,
    lootSearch: '',
    lootSystem: 'all',
    lootType: 'all',
    lootRisk: 'all',
    lootMode: 'all',
    lootSoloOnly: false,
    lootSort: 'rank'
  });

  function sanitizePinned(raw) {
    if (!Array.isArray(raw)) return [];
    return [...new Set(raw.filter((id) => typeof id === 'string' && CONTRACT_BY_ID.has(id)))];
  }

  function sanitizeFavorites(raw) {
    if (!Array.isArray(raw)) return [];
    return [...new Set(raw.filter((id) => typeof id === 'string' && FAB_BP_BY_ID.has(id)))];
  }

  function qualityValue(value) {
    const n = Math.round(Number(value));
    return clamp(Number.isFinite(n) ? n : QUALITY_NEUTRAL, QUALITY_MIN, QUALITY_MAX);
  }

  function lotsFromRaw(raw) {
    const out = [];
    const add = (q, n) => {
      const quality = qualityValue(q);
      const qty = Math.min(INVENTORY_MAX_QTY, Math.floor(Number(n) || 0));
      if (qty <= 0) return;
      const existing = out.find((lot) => lot.q === quality);
      if (existing) existing.n = Math.min(INVENTORY_MAX_QTY, existing.n + qty);
      else out.push({ q: quality, n: qty });
    };
    if (typeof raw === 'number') add(QUALITY_NEUTRAL, raw);
    else if (Array.isArray(raw)) {
      for (const lot of raw) if (lot && typeof lot === 'object') add(lot.q, lot.n);
    } else if (raw && typeof raw === 'object') {
      for (const [quality, qty] of Object.entries(raw)) {
        if (!/^\d+$/.test(quality)) continue;
        add(Number(quality), qty);
      }
    }
    return out.sort((a, b) => a.q - b.q);
  }

  function lotsToObject(lots) {
    const out = {};
    for (const lot of lots || []) {
      if (!lot || lot.n <= 0) continue;
      out[String(qualityValue(lot.q))] = Math.min(INVENTORY_MAX_QTY, Math.floor(lot.n));
    }
    return out;
  }

  function lotsTotal(lots) {
    return (lots || []).reduce((sum, lot) => sum + (Number(lot.n) || 0), 0);
  }

  function lotsAverage(lots) {
    const total = lotsTotal(lots);
    if (total <= 0) return QUALITY_NEUTRAL;
    return Math.round((lots || []).reduce((sum, lot) => sum + lot.q * lot.n, 0) / total);
  }

  function lotsAdd(lots, quality, amount) {
    const q = qualityValue(quality);
    const qty = Math.floor(Number(amount) || 0);
    const next = (lots || []).map((lot) => ({ ...lot }));
    if (qty <= 0) return next;
    const existing = next.find((lot) => lot.q === q);
    if (existing) existing.n = Math.min(INVENTORY_MAX_QTY, existing.n + qty);
    else next.push({ q, n: Math.min(INVENTORY_MAX_QTY, qty) });
    return next.filter((lot) => lot.n > 0).sort((a, b) => a.q - b.q);
  }

  function lotsTake(lots, amount, from = 'highest') {
    let left = Math.max(0, Math.floor(Number(amount) || 0));
    const ordered = (lots || [])
      .map((lot) => ({ ...lot }))
      .sort((a, b) => (from === 'highest' ? b.q - a.q : a.q - b.q));
    const taken = [];
    for (const lot of ordered) {
      if (left <= 0) break;
      const take = Math.min(lot.n, left);
      if (take <= 0) continue;
      taken.push({ q: lot.q, n: take });
      lot.n -= take;
      left -= take;
    }
    return {
      taken: taken.sort((a, b) => a.q - b.q),
      remaining: ordered.filter((lot) => lot.n > 0).sort((a, b) => a.q - b.q),
      short: left
    };
  }

  function lotsLimit(lots, max, from = 'highest') {
    const total = lotsTotal(lots);
    if (total <= max) return (lots || []).map((lot) => ({ ...lot }));
    return lotsTake(lots, total - max, from).remaining;
  }

  function sanitizeInventory(raw) {
    const out = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    for (const [name, value] of Object.entries(raw)) {
      if (!INVENTORY_RESOURCE_NAMES.has(name)) continue;
      const lots = lotsFromRaw(value);
      if (lots.length) out[name] = lotsToObject(lots);
    }
    return out;
  }

  function sanitizeContractDeposits(raw, progress) {
    const out = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    for (const contract of CONTRACTS) {
      const source = raw[contract.id];
      if (!source || typeof source !== 'object' || Array.isArray(source)) continue;
      for (const order of contract.orders) {
        const found = Number(progress[contract.id]?.[order.name]) || 0;
        const lots = lotsFromRaw(source[order.name]);
        if (!lots.length || found <= 0) continue;
        const clamped = Math.min(order.qty, found, lotsTotal(lots));
        if (clamped <= 0) continue;
        const limited = lotsLimit(lots, clamped, 'lowest');
        if (!out[contract.id]) out[contract.id] = {};
        out[contract.id][order.name] = lotsToObject(limited);
      }
    }
    return out;
  }

  function sanitizeBlueprintProgress(raw) {
    const out = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    for (const [bpId, rows] of Object.entries(raw)) {
      const requirements = FAB_BLUEPRINT_REQUIREMENTS.get(bpId);
      if (!requirements || !rows || typeof rows !== 'object' || Array.isArray(rows)) continue;
      for (const [key, value] of Object.entries(rows)) {
        const required = requirements.get(key);
        const amount = Math.floor(Number(value));
        if (!required || !Number.isFinite(amount) || amount <= 0) continue;
        if (!out[bpId]) out[bpId] = {};
        out[bpId][key] = Math.min(required, amount);
      }
    }
    return out;
  }

  function sanitizeBlueprintDeposits(raw, progress) {
    const out = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    for (const [bpId, rows] of Object.entries(raw)) {
      if (!rows || typeof rows !== 'object' || Array.isArray(rows)) continue;
      for (const [key, value] of Object.entries(rows)) {
        const lots = lotsFromRaw(value);
        const found = Number(progress[bpId]?.[key]) || 0;
        if (!lots.length || found <= 0) continue;
        const clamped = Math.min(found, lotsTotal(lots));
        if (clamped <= 0) continue;
        const limited = lotsLimit(lots, clamped, 'lowest');
        if (!out[bpId]) out[bpId] = {};
        out[bpId][key] = lotsToObject(limited);
      }
    }
    return out;
  }

  function sanitizeResourceFavorites(raw) {
    if (!Array.isArray(raw)) return [];
    return [...new Set(raw.filter((name) => typeof name === 'string' && INVENTORY_RESOURCE_NAMES.has(name)))];
  }

  function sanitizeCustomImages(raw) {
    const out = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    for (const [name, value] of Object.entries(raw)) {
      if (!INVENTORY_RESOURCE_NAMES.has(name)) continue;
      if (typeof value !== 'string' || value.length > 900000) continue;
      if (!/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(value)) continue;
      out[name] = value;
    }
    return out;
  }

  function sanitizeProgress(raw) {
    const out = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    for (const contract of CONTRACTS) {
      const source = raw[contract.id];
      if (!source || typeof source !== 'object' || Array.isArray(source)) continue;
      for (const order of contract.orders) {
        const value = Number(source[order.name]);
        if (!Number.isFinite(value) || value <= 0 || order.qty <= 0) continue;
        const clamped = Math.min(order.qty, Math.max(1, Math.round(value)));
        if (!out[contract.id]) out[contract.id] = {};
        out[contract.id][order.name] = clamped;
      }
    }
    return out;
  }

  function normalizeState(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const progress = sanitizeProgress(source.progress);
    const blueprintProgress = sanitizeBlueprintProgress(source.blueprintProgress);
    return {
      app: APP_ID,
      version: APP_VERSION,
      progress,
      inventory: sanitizeInventory(source.inventory),
      contractDeposits: sanitizeContractDeposits(source.contractDeposits, progress),
      blueprintProgress,
      blueprintDeposits: sanitizeBlueprintDeposits(source.blueprintDeposits, blueprintProgress),
      pinned: sanitizePinned(source.pinned),
      favorites: sanitizeFavorites(source.favorites),
      resourceFavorites: sanitizeResourceFavorites(source.resourceFavorites),
      customImages: sanitizeCustomImages(source.customImages),
      updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : null
    };
  }

  function freshState() {
    return {
      app: APP_ID,
      version: APP_VERSION,
      progress: {},
      inventory: {},
      contractDeposits: {},
      blueprintProgress: {},
      blueprintDeposits: {},
      pinned: [],
      favorites: [],
      resourceFavorites: [],
      customImages: {},
      updatedAt: null
    };
  }

  function loadState() {
    if (!storageOk) return freshState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return freshState();
      const normalized = normalizeState(JSON.parse(raw));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)); } catch (error) { /* storage may be read-only */ }
      return normalized;
    } catch (error) {
      return freshState();
    }
  }

  function loadUi() {
    const defaults = defaultUi();
    if (!storageOk) return defaults;
    try {
      const raw = localStorage.getItem(UI_KEY);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      const ui = { ...defaults, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
      if (!['contracts', 'active', 'resources', 'inventory', 'fabricator', 'loot'].includes(ui.tab)) ui.tab = defaults.tab;
      if (ui.category !== 'all' && !CATEGORY_ORDER.includes(ui.category)) ui.category = 'all';
      if (!['all', 'none', 'very-good', 'very-best'].includes(ui.reputation)) ui.reputation = 'all';
      if (!['all', 'active', 'not-started', 'in-progress', 'done'].includes(ui.status)) ui.status = 'all';
      if (!['name-asc', 'name-desc', 'progress-desc', 'progress-asc', 'requirements-desc', 'requirements-asc', 'category'].includes(ui.contractSort)) ui.contractSort = 'name-asc';
      if (!['all', 'wikelo', 'active'].includes(ui.resourceScope)) ui.resourceScope = 'all';
      if (!['remaining-desc', 'required-desc', 'name-asc', 'contracts-desc', 'blueprints-desc'].includes(ui.resourceSort)) ui.resourceSort = 'name-asc';
      if (!Array.isArray(ui.expandedResources)) ui.expandedResources = [];
      ui.expandedResources = ui.expandedResources.filter((key) => typeof key === 'string');
      ui.contractSearch = typeof ui.contractSearch === 'string' ? ui.contractSearch : '';
      ui.resourceSearch = typeof ui.resourceSearch === 'string' ? ui.resourceSearch : '';
      ui.inventorySearch = typeof ui.inventorySearch === 'string' ? ui.inventorySearch : '';
      if (!['all', 'stock', 'committed', 'favorites', 'needed'].includes(ui.inventoryFilter)) ui.inventoryFilter = 'all';
      if (ui.inventoryKind !== 'all' && !INVENTORY_KINDS.includes(ui.inventoryKind)) ui.inventoryKind = 'all';
      if (!['name-asc', 'stock-desc', 'committed-desc', 'need-desc', 'coverage-asc'].includes(ui.inventorySort)) ui.inventorySort = 'name-asc';
      const invShown = Number(ui.inventoryShown);
      ui.inventoryShown = Number.isFinite(invShown) ? clamp(Math.round(invShown), INV_PAGE_SIZE, INVENTORY_RESOURCES.length) : INV_PAGE_SIZE;
      if (!['blueprints', 'materials'].includes(ui.fabricatorMode)) ui.fabricatorMode = 'blueprints';
      if (ui.fabricatorCategory !== 'all' && !FAB_CATEGORY_ORDER.includes(ui.fabricatorCategory)) ui.fabricatorCategory = 'all';
      if (ui.fabricatorSubcategory !== 'all' && !FAB_BLUEPRINTS.some((bp) => bp.t === ui.fabricatorSubcategory)) ui.fabricatorSubcategory = 'all';
      ui.fabricatorFavoritesOnly = Boolean(ui.fabricatorFavoritesOnly);
      if (!['all', 'default', 'mission', 'none'].includes(ui.fabricatorSource)) ui.fabricatorSource = 'all';
      if (ui.fabricatorResource !== 'all' && !FAB_RESOURCES.some((resource) => resource.name === ui.fabricatorResource)) ui.fabricatorResource = 'all';
      if (ui.fabricatorSystem !== 'all' && !FAB_MISSIONS.some((mission) => (mission.s || []).includes(ui.fabricatorSystem))) ui.fabricatorSystem = 'all';
      if (ui.fabricatorFaction !== 'all' && !FAB_MISSIONS.some((mission) => mission.f === ui.fabricatorFaction)) ui.fabricatorFaction = 'all';
      if (ui.fabricatorMissionType !== 'all' && !FAB_MISSIONS.some((mission) => mission.k === ui.fabricatorMissionType)) ui.fabricatorMissionType = 'all';
      if (!['source-asc', 'name-asc', 'craft-asc', 'missions-desc', 'category', 'subtype'].includes(ui.fabricatorSort)) ui.fabricatorSort = 'source-asc';
      ui.fabricatorSearch = typeof ui.fabricatorSearch === 'string' ? ui.fabricatorSearch : '';
      const shown = Number(ui.fabricatorShown);
      ui.fabricatorShown = Number.isFinite(shown) ? clamp(Math.round(shown), FAB_PAGE_SIZE, Math.max(FAB_PAGE_SIZE, FAB_TOTAL)) : FAB_PAGE_SIZE;
      ui.lootSearch = typeof ui.lootSearch === 'string' ? ui.lootSearch : '';
      if (ui.lootSystem !== 'all' && !LOOT_SYSTEMS.includes(ui.lootSystem)) ui.lootSystem = 'all';
      if (ui.lootType !== 'all' && !LOOT_TYPES[ui.lootType]) ui.lootType = 'all';
      if (ui.lootRisk !== 'all' && !LOOT_RISKS[ui.lootRisk]) ui.lootRisk = 'all';
      if (ui.lootMode !== 'all' && !LOOT_MODES.includes(ui.lootMode)) ui.lootMode = 'all';
      if (!['rank', 'risk-desc', 'name-asc', 'system'].includes(ui.lootSort)) ui.lootSort = 'rank';
      ui.lootSoloOnly = Boolean(ui.lootSoloOnly);
      if (!(parsed && parsed.resourceScopeV2 === true)) {
        ui.resourceScope = 'all';
        ui.resourceHideDone = false;
        ui.resourceSort = 'name-asc';
        ui.resourceScopeV2 = true;
        try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch (error) { /* storage may be read-only */ }
      }
      return ui;
    } catch (error) {
      return defaults;
    }
  }

  let state = loadState();
  let ui = loadUi();
  let pinnedSet = new Set(state.pinned);
  let favoriteSet = new Set(state.favorites);
  let resourceFavoriteSet = new Set(state.resourceFavorites);
  let drawerContractId = null;
  let drawerBpId = null;
  let drawerDirty = false;
  let modalOpen = false;
  let modalLastFocused = null;
  let modalCloseHandler = null;
  let inventoryModalName = null;
  let inventoryUsageShowAll = false;
  let inventoryLotQuality = QUALITY_NEUTRAL;
  let imageEditorName = null;
  let pendingImport = null;
  let pendingConfirm = null;
  let uiSaveTimer = null;
  let searchRenderTimer = null;
  let focusAfterRender = null;
  let capturedFocus = null;

  const SEARCH_INDEX = new Map(CONTRACTS.map((contract) => [
    contract.id,
    norm([
      contract.name,
      CATEGORY_META[contract.category]?.label || '',
      contract.reputation || '',
      ...contract.orders.map((o) => o.name),
      ...contract.rewards.map((r) => r.name),
      ...contract.blueprints.map((b) => b.name)
    ].join(' '))
  ]));

  const CATEGORY_COUNTS = CONTRACTS.reduce((acc, contract) => {
    acc[contract.category] = (acc[contract.category] || 0) + 1;
    return acc;
  }, {});

  function fabCategoryMeta(key) {
    return FAB_CATEGORY_META[key] || { label: key || 'Другое', icon: 'crate' };
  }

  function fabResourceKind(name) {
    if (/Yormandi Eye/i.test(name)) return 'creature';
    return 'ore';
  }

  function fabTypeLabel(type) {
    return FAB_TYPE_LABELS[type] || type || 'Предмет';
  }

  function fabMissionTypeLabel(type) {
    return FAB_MISSION_TYPE_LABELS[type] || type || 'Миссия';
  }

  function fabSourceKey(bp) {
    if (bp.def) return 'default';
    return bp.m && bp.m.length ? 'mission' : 'none';
  }

  function fabSourceLabel(bp) {
    const key = fabSourceKey(bp);
    if (key === 'default') return 'Базовый';
    if (key === 'mission') return `Миссии: ${fmt(bp.m.length)}`;
    return 'Нет источника';
  }

  function fabMissionRows(bp) {
    return (bp.m || [])
      .map(([index, chance, pool]) => ({
        mission: FAB_MISSIONS[index],
        chance: Number(chance) || 1,
        pool: Number(pool) || 1
      }))
      .filter((row) => row.mission)
      .sort((a, b) => {
        const repA = Number(a.mission.rp) || 0;
        const repB = Number(b.mission.rp) || 0;
        return repA - repB || a.pool - b.pool || a.mission.t.localeCompare(b.mission.t, 'en');
      });
  }

  function fabAggregateIngredients(bp) {
    const map = new Map();
    for (const [part, ingredients] of bp.parts || []) {
      for (const [name, qty, unit] of ingredients || []) {
        const key = `${name}|${unit}`;
        let row = map.get(key);
        if (!row) {
          row = { name, unit, qty: 0, parts: [] };
          map.set(key, row);
        }
        row.qty += Number(qty) || 0;
        if (!row.parts.includes(part)) row.parts.push(part);
      }
    }
    return [...map.values()]
      .map((row) => ({ ...row, qty: row.unit === 'SCU' ? Math.round(row.qty * 1000) / 1000 : Math.round(row.qty) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  }

  function fabUnits(qty, unit) {
    const value = Number(qty) || 0;
    return Math.ceil((unit === 'SCU' ? value * 100 : value) - 1e-9);
  }

  function fabQtyLabel(qty, unit) {
    return `${fmt(fabUnits(qty, unit))} ед.`;
  }

  function fabQtySummary(rows) {
    const units = rows.reduce((sum, row) => sum + fabUnits(row.qty, row.unit), 0);
    return `${countOf(rows.length, RESOURCE_FORMS)} · ${countOf(units, ['единица', 'единицы', 'единиц'])}`;
  }

  const cmpNumber = (value) => Number(value || 0).toLocaleString('ru-RU', { maximumFractionDigits: 1 });
  const cmpUnit = (unit) => (unit ? ` ${esc(unit)}` : '');
  const cmpBuyKey = (buy) => buy ? `${buy.price}|${buy.where || ''}` : '';

  function comparisonBuyHtml(baseBuy, itemBuy, standard = false) {
    const lines = [];
    const add = (buy, label) => {
      if (!buy) return;
      const key = cmpBuyKey(buy);
      if (lines.some((line) => line.key === key)) return;
      lines.push({ key, html: `<div class="cmp-buy-line"><span>${esc(label)}</span><b>${fmt(buy.price)} aUEC</b><small>${esc(buy.where || '')}${buy.system ? ` · ${esc(buy.system)}` : ''}</small></div>` });
    };
    if (standard) add(itemBuy || baseBuy, 'Купить');
    else {
      add(baseBuy, 'Обычная версия');
      add(itemBuy, 'Этот вариант');
    }
    if (!lines.length) return '<div class="cmp-buy is-missing">Нет цены в продаже</div>';
    return `<div class="cmp-buy">${lines.map((line) => line.html).join('')}</div>`;
  }

  function comparisonStatHtml(stat) {
    const sign = stat.delta > 0 ? '+' : '';
    const delta = stat.delta === null ? '—' : `${sign}${cmpNumber(stat.delta)}%`;
    return `<div class="cmp-stat is-${stat.better}">
      <span class="cmp-stat-label">${esc(stat.label)}</span>
      <span class="cmp-stat-values">${cmpNumber(stat.base)}${cmpUnit(stat.unit)} <i>→</i> ${cmpNumber(stat.variant)}${cmpUnit(stat.unit)}</span>
      <span class="cmp-stat-delta">${esc(delta)}</span>
    </div>`;
  }

  function comparisonRowHtml(row) {
    const kindLabel = row.kind === 'vehicle' ? 'Корабль' : row.kind === 'unknown' ? 'Оценка' : row.kind === 'standard' ? 'Обычная версия' : 'Предмет';
    const badgeLabel = row.kind === 'vehicle' ? 'Спецверсия' : row.kind === 'unknown' ? 'Нет данных' : row.kind === 'standard' ? 'Стандарт' : 'Вариант';
    const badgeClass = row.kind === 'vehicle' ? 'is-vehicle' : row.kind === 'unknown' ? 'is-unknown' : row.kind === 'standard' ? 'is-standard' : 'is-item';
    const baseLine = row.baseName && row.baseName !== row.variantName
      ? `<div class="cmp-base">Обычная версия: <b>${esc(row.baseName)}</b></div>`
      : '';
    return `<article class="cmp-row">
      <div class="cmp-row-head">
        <div class="cmp-row-title">
          <span class="cmp-kicker">${esc(kindLabel)}</span>
          <h4>${esc(row.variantName || row.name || '')}</h4>
        </div>
        <span class="cmp-badge ${badgeClass}">${esc(badgeLabel)}</span>
      </div>
      ${baseLine}
      ${row.stats && row.stats.length ? `<div class="cmp-stats">${row.stats.map(comparisonStatHtml).join('')}</div>` : ''}
      <p class="cmp-summary">${esc(row.summary || '')}</p>
      ${row.verdict ? `<p class="cmp-verdict">${esc(row.verdict)}</p>` : ''}
      ${comparisonBuyHtml(row.baseBuy, row.itemBuy, row.kind === 'standard')}
    </article>`;
  }

  function comparisonSourceHtml() {
    const meta = COMPARISON_DATA.meta || {};
    return `<p class="cmp-source">Источник: Star Citizen Wiki API ${esc(meta.gameVersion || '4.10.2')} и UEX; снимок ${esc(meta.fetchedAt || '2026-10-31')}. Цена — минимальная найденная покупка за aUEC, наличие и цены меняются между патчами.</p>`;
  }

  function contractComparisonHtml(contract) {
    const data = COMPARISON_CONTRACTS[contract.id];
    if (!data || !Array.isArray(data.rows) || !data.rows.length) return '';
    return `<section class="drawer-section cmp-section">
      <h3>Чем отличается награда <span>${countOf(data.rows.length, ['вариант', 'варианта', 'вариантов'])}</span></h3>
      <p class="cmp-intro">${esc(data.summary || '')}</p>
      <div class="cmp-list">${data.rows.map(comparisonRowHtml).join('')}</div>
      ${comparisonSourceHtml()}
    </section>`;
  }

  function blueprintComparisonHtml(bp) {
    const data = COMPARISON_BLUEPRINTS[bp.id];
    const buy = COMPARISON_BUY[bp.id] || null;
    const meta = COMPARISON_DATA.meta || {};
    if (!data) {
      return `<section class="drawer-section cmp-section">
        <h3>Обычная версия и покупка</h3>
        <div class="cmp-standard">
          <span class="cmp-badge is-standard">Стандартная версия</span>
          <p class="cmp-summary">Это обычная версия предмета. Отдельного специального варианта в базе нет.</p>
          ${comparisonBuyHtml(null, buy, true)}
        </div>
        ${comparisonSourceHtml()}
      </section>`;
    }
    return `<section class="drawer-section cmp-section">
      <h3>Обычная версия и покупка <span>${data.stats.length ? 'есть отличия' : 'внешний вид'}</span></h3>
      <div class="cmp-list">${comparisonRowHtml({
        kind: 'item',
        name: bp.n,
        baseName: data.baseName,
        variantName: bp.n,
        stats: data.stats || [],
        summary: data.summary,
        verdict: data.verdict,
        baseBuy: data.baseBuy,
        itemBuy: data.itemBuy || buy
      })}</div>
      ${comparisonSourceHtml()}
    </section>`;
  }

  function fabCraftTime(seconds) {
    const value = Number(seconds) || 0;
    if (!value) return '—';
    if (value < 60) return `${fmt(value)} сек`;
    const minutes = Math.round(value / 60);
    if (minutes < 60) return `${fmt(minutes)} мин`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? `${fmt(hours)} ч ${fmt(rest)} мин` : `${fmt(hours)} ч`;
  }

  function fabMaterial(name) {
    return FAB_RESOURCE_BY_NAME.get(name) || null;
  }

  function fabMaterialBest(name) {
    const material = fabMaterial(name);
    return material?.top?.find((row) => Number.isFinite(Number(row.spawn))) || material?.top?.[0] || null;
  }

  function fabMaterialHint(name) {
    const material = fabMaterial(name);
    if (!material) return '';
    const best = fabMaterialBest(name);
    const place = best ? `${best.body}${Number.isFinite(Number(best.spawn)) ? ` · ${fmt(best.spawn)}%` : ''}` : 'точки не указаны';
    return `${material.methodLabel || 'Добыча'} · чаще: ${place}`;
  }

  function fabSourceSummary(bp) {
    if (bp.def) return 'Базовый чертёж · доступен с начала';
    const rows = fabMissionRows(bp);
    if (!rows.length) return 'В файлах игры нет миссии-источника';
    const best = rows[0];
    const faction = best.mission.f || best.mission.g || 'без фракции';
    const rank = best.mission.r ? ` · ${best.mission.r}` : '';
    const prefix = rows.length > 1 ? `${countOf(rows.length, ['миссия', 'миссии', 'миссий'])} · ` : '';
    return `${prefix}${faction}${rank}`;
  }

  function fabEasiestRep(bp) {
    const rows = fabMissionRows(bp);
    return rows.length ? Number(rows[0].mission.rp) || 0 : Number.MAX_SAFE_INTEGER;
  }

  const FAB_CATEGORY_COUNTS = FAB_BLUEPRINTS.reduce((acc, bp) => {
    acc[bp.c] = (acc[bp.c] || 0) + 1;
    return acc;
  }, {});
  const FAB_SUBCATEGORY_COUNTS = FAB_BLUEPRINTS.reduce((acc, bp) => {
    acc[bp.t] = (acc[bp.t] || 0) + 1;
    return acc;
  }, {});
  const FAB_ARMOR_SLOTS = ['Helmet', 'Core', 'Arms', 'Legs', 'Backpack', 'Undersuit'];
  const FAB_SUBCATEGORIES = Object.keys(FAB_SUBCATEGORY_COUNTS).sort((a, b) => {
    const ia = FAB_ARMOR_SLOTS.indexOf(a);
    const ib = FAB_ARMOR_SLOTS.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return fabTypeLabel(a).localeCompare(fabTypeLabel(b), 'ru', { sensitivity: 'base' });
  });

  const FAB_SYSTEMS = [...new Set(FAB_MISSIONS.flatMap((mission) => mission.s || []))].sort((a, b) => {
    const order = ['Stanton', 'Pyro', 'Nyx'];
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return a.localeCompare(b, 'en');
  });
  const FAB_FACTIONS = [...new Set(FAB_MISSIONS.map((mission) => mission.f).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'en'));
  const FAB_MISSION_TYPES = [...new Set(FAB_MISSIONS.map((mission) => mission.k).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'en'));
  const FAB_GIVER_COUNT = new Set(FAB_MISSIONS.map((mission) => mission.g).filter(Boolean)).size;

  const FAB_RESOURCE_USAGE = new Map();
  for (const bp of FAB_BLUEPRINTS) {
    const seen = new Set();
    for (const [, ingredients] of bp.parts || []) {
      for (const [name] of ingredients || []) {
        if (seen.has(name)) continue;
        seen.add(name);
        let row = FAB_RESOURCE_USAGE.get(name);
        if (!row) {
          row = { name, count: 0, missionCount: 0, defaultCount: 0, examples: [] };
          FAB_RESOURCE_USAGE.set(name, row);
        }
        row.count += 1;
        if (bp.m && bp.m.length) row.missionCount += 1;
        if (bp.def) row.defaultCount += 1;
        if (row.examples.length < 4) row.examples.push(bp.n);
      }
    }
  }
  const FAB_RESOURCE_ROWS = FAB_RESOURCES.map((resource) => {
    const usage = FAB_RESOURCE_USAGE.get(resource.name) || { count: 0, missionCount: 0, defaultCount: 0, examples: [] };
    return { ...resource, ...usage, unit: (resource.units && resource.units[0]) || 'SCU' };
  }).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

  const FAB_SEARCH_INDEX = new Map(FAB_BLUEPRINTS.map((bp) => {
    const category = fabCategoryMeta(bp.c);
    const ingredients = (bp.parts || []).flatMap(([, rows]) => (rows || []).map(([name]) => name)).join(' ');
    const missions = fabMissionRows(bp).map(({ mission }) => [mission.t, mission.g, mission.f, mission.k, ...(mission.s || []), ...(mission.p || [])].join(' ')).join(' ');
    return [bp.id, norm([bp.n, bp.t, fabTypeLabel(bp.t), category.label, ingredients, missions].join(' '))];
  }));

  const FAB_EASIEST_REP = new Map(FAB_BLUEPRINTS.map((bp) => [bp.id, fabEasiestRep(bp)]));

  const LOOT_SYSTEM_COUNTS = LOOT_SYSTEMS.reduce((acc, system) => {
    acc[system] = LOOT_LOCATIONS.filter((location) => lootSystems(location).includes(system)).length;
    return acc;
  }, { all: LOOT_TOTAL });
  const LOOT_TYPE_COUNTS = LOOT_LOCATIONS.reduce((acc, location) => {
    acc[location.type] = (acc[location.type] || 0) + 1;
    return acc;
  }, {});
  const LOOT_RISK_COUNTS = Object.keys(LOOT_RISKS).reduce((acc, risk) => {
    acc[risk] = LOOT_LOCATIONS.filter((location) => location.risk === risk).length;
    return acc;
  }, { all: LOOT_TOTAL });
  const LOOT_SEARCH_INDEX = new Map(LOOT_LOCATIONS.map((location) => {
    const type = lootTypeMeta(location.type);
    return [location.id, norm([
      location.name,
      location.system,
      location.location,
      type.label,
      location.summary,
      location.why,
      ...(location.loot || []),
      ...(location.tips || []),
      ...(location.access || [])
    ].join(' '))];
  }));

  function lootSystems(location) {
    return String(location?.system || '').split('·').map((part) => part.trim()).filter(Boolean);
  }

  function lootTypeMeta(type) {
    return LOOT_TYPES[type] || { label: type || 'Локация', icon: 'map' };
  }

  function lootRiskMeta(risk) {
    return LOOT_RISKS[risk] || { label: risk || 'Неизвестно', level: 0 };
  }

  function lootFiltered() {
    const query = norm(ui.lootSearch.trim());
    return LOOT_LOCATIONS.filter((location) => {
      if (query && !(LOOT_SEARCH_INDEX.get(location.id) || '').includes(query)) return false;
      if (ui.lootSystem !== 'all' && !lootSystems(location).includes(ui.lootSystem)) return false;
      if (ui.lootType !== 'all' && location.type !== ui.lootType) return false;
      if (ui.lootRisk !== 'all' && location.risk !== ui.lootRisk) return false;
      if (ui.lootMode !== 'all' && location.mode !== ui.lootMode) return false;
      if (ui.lootSoloOnly && !location.solo) return false;
      return true;
    });
  }

  function lootSort(locations) {
    const list = locations.slice();
    if (ui.lootSort === 'risk-desc') {
      return list.sort((a, b) => lootRiskMeta(b.risk).level - lootRiskMeta(a.risk).level || a.rank - b.rank);
    }
    if (ui.lootSort === 'name-asc') {
      return list.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    }
    if (ui.lootSort === 'system') {
      return list.sort((a, b) => String(a.system).localeCompare(String(b.system), 'en') || a.rank - b.rank);
    }
    return list.sort((a, b) => a.rank - b.rank);
  }

  function fabFilteredBlueprints() {
    const query = norm(ui.fabricatorSearch.trim());
    return FAB_BLUEPRINTS.filter((bp) => {
      if (query && !(FAB_SEARCH_INDEX.get(bp.id) || '').includes(query)) return false;
      if (ui.fabricatorCategory !== 'all' && bp.c !== ui.fabricatorCategory) return false;
      if (ui.fabricatorSubcategory !== 'all' && bp.t !== ui.fabricatorSubcategory) return false;
      if (ui.fabricatorFavoritesOnly && !favoriteSet.has(bp.id)) return false;
      if (ui.fabricatorSource !== 'all' && fabSourceKey(bp) !== ui.fabricatorSource) return false;
      if (ui.fabricatorResource !== 'all' && !(bp.parts || []).some(([, rows]) => (rows || []).some(([name]) => name === ui.fabricatorResource))) return false;
      if (ui.fabricatorSystem !== 'all' || ui.fabricatorFaction !== 'all' || ui.fabricatorMissionType !== 'all') {
        const missions = fabMissionRows(bp).map((row) => row.mission);
        if (ui.fabricatorSystem !== 'all' && !missions.some((mission) => (mission.s || []).includes(ui.fabricatorSystem))) return false;
        if (ui.fabricatorFaction !== 'all' && !missions.some((mission) => mission.f === ui.fabricatorFaction)) return false;
        if (ui.fabricatorMissionType !== 'all' && !missions.some((mission) => mission.k === ui.fabricatorMissionType)) return false;
      }
      return true;
    });
  }

  function fabSortBlueprints(list) {
    const byName = (a, b) => a.n.localeCompare(b.n, 'en', { sensitivity: 'base' });
    const sourceRank = (bp) => (bp.m && bp.m.length ? 0 : bp.def ? 1 : 2);
    const comparators = {
      'source-asc': (a, b) => sourceRank(a) - sourceRank(b) || (FAB_EASIEST_REP.get(a.id) || 0) - (FAB_EASIEST_REP.get(b.id) || 0) || byName(a, b),
      'name-asc': byName,
      'craft-asc': (a, b) => (Number(a.ct) || 0) - (Number(b.ct) || 0) || byName(a, b),
      'missions-desc': (a, b) => (b.m || []).length - (a.m || []).length || byName(a, b),
      category: (a, b) => FAB_CATEGORY_ORDER.indexOf(a.c) - FAB_CATEGORY_ORDER.indexOf(b.c) || byName(a, b),
      subtype: (a, b) => FAB_CATEGORY_ORDER.indexOf(a.c) - FAB_CATEGORY_ORDER.indexOf(b.c) || fabTypeLabel(a.t).localeCompare(fabTypeLabel(b.t), 'ru', { sensitivity: 'base' }) || byName(a, b)
    };
    return list.sort(comparators[ui.fabricatorSort] || comparators['source-asc']);
  }

  function resourceKind(name) {
    if (/Scrip|Wikelo Favor/i.test(name)) return 'currency';
    if (/Vanduul (Plating|Metal)/i.test(name)) return 'salvage';
    if (/Carinite|Copper|Corundum|Jaclium|Quantainium|Saldynium|Savrilium|Tungsten|\(Ore\)/i.test(name)) return 'ore';
    if (/Valakkar|Kopion|Yormandi|Sadaryx|Bluemoon|Fungus|Pearl|Fang|Horn|Tongue|Eye/i.test(name)) return 'creature';
    if (/Medal|Marker|Artifact/i.test(name)) return 'artifact';
    if (/ASD Secure Drive|DCHS|Metamaterial|Polaris Bit|RCMBNT|Comp-Board/i.test(name)) return 'tech';
    if (/Smoothie|Ice Cream|Burrito|Snaggle/i.test(name)) return 'consumable';
    return 'equipment';
  }

  // --- Личный склад --------------------------------------------------------

  function customImageFor(name) {
    return state.customImages?.[name] || '';
  }

  function resourceOriginalImage(name) {
    return INVENTORY_BY_NAME.get(name)?.image || '';
  }

  function resourceDisplayImage(name) {
    return customImageFor(name) || resourceOriginalImage(name);
  }

  function imageEditorButtonHtml(name, extraClass = '') {
    const custom = Boolean(customImageFor(name));
    return `<button class="image-edit-btn${custom ? ' is-custom' : ''}${extraClass ? ` ${extraClass}` : ''}" type="button" data-action="open-image-editor" data-resource="${esc(name)}" aria-label="${custom ? 'Своё фото материала' : 'Добавить своё фото материала'} ${esc(name)}" title="${custom ? 'Своё фото: заменить или вернуть оригинал' : 'Добавить своё фото: файл или буфер обмена'}">${svgIcon('camera')}</button>`;
  }

  function imageCustomBadgeHtml(name) {
    return customImageFor(name) ? '<span class="image-custom-badge">Своё фото</span>' : '';
  }

  function inventoryLots(name) {
    return lotsFromRaw(state.inventory?.[name]);
  }

  function inventoryQty(name) {
    return lotsTotal(inventoryLots(name));
  }

  function inventoryQuality(name) {
    return lotsAverage(inventoryLots(name));
  }

  function inventoryStockCount() {
    return Object.keys(state.inventory || {}).filter((name) => inventoryQty(name) > 0).length;
  }

  function inventoryTotalUnits() {
    return Object.keys(state.inventory || {}).reduce((sum, name) => sum + inventoryQty(name), 0);
  }

  function inventoryWriteLots(name, lots) {
    if (!INVENTORY_RESOURCE_NAMES.has(name)) return [];
    let next = [];
    for (const lot of lots || []) {
      if (!lot || lot.n <= 0) continue;
      next = lotsAdd(next, lot.q, lot.n);
    }
    const total = lotsTotal(next);
    if (total > INVENTORY_MAX_QTY) next = lotsLimit(next, INVENTORY_MAX_QTY, 'lowest');
    next.sort((a, b) => a.q - b.q);
    if (next.length) state.inventory[name] = lotsToObject(next);
    else delete state.inventory[name];
    return next;
  }

  function inventoryAddLots(name, lots) {
    if (!INVENTORY_RESOURCE_NAMES.has(name)) return inventoryLots(name);
    let next = inventoryLots(name);
    for (const lot of lots || []) next = lotsAdd(next, lot.q, lot.n);
    return inventoryWriteLots(name, next);
  }

  function takeInventoryLots(name, amount, from = 'lowest') {
    if (!INVENTORY_RESOURCE_NAMES.has(name)) return { taken: [], remaining: [], short: Math.max(0, Math.floor(Number(amount) || 0)) };
    const result = lotsTake(inventoryLots(name), amount, from);
    inventoryWriteLots(name, result.remaining);
    return result;
  }

  function takeInventoryLot(name, quality, amount) {
    const q = qualityValue(quality);
    const qty = Math.max(0, Math.floor(Number(amount) || 0));
    const lots = inventoryLots(name);
    const lot = lots.find((item) => item.q === q);
    if (!lot || lot.n < qty) return false;
    lot.n -= qty;
    inventoryWriteLots(name, lots);
    return true;
  }

  function inventorySetLots(name, lots) {
    return inventoryWriteLots(name, lots);
  }

  function addInventoryRaw(name, amount, quality = QUALITY_NEUTRAL) {
    const value = Math.floor(Number(amount) || 0);
    if (value > 0) return lotsTotal(inventoryAddLots(name, [{ q: quality, n: value }]));
    if (value < 0) return lotsTotal(takeInventoryLots(name, -value, 'lowest').remaining);
    return inventoryQty(name);
  }

  function setInventoryLot(name, quality, value) {
    if (!INVENTORY_RESOURCE_NAMES.has(name)) return;
    const q = qualityValue(quality);
    const amount = clamp(Math.floor(Number(value) || 0), 0, INVENTORY_MAX_QTY);
    const lots = inventoryLots(name).filter((lot) => lot.q !== q);
    if (amount > 0) lots.push({ q, n: amount });
    if (lots.length) state.inventory[name] = lotsToObject(lots.sort((a, b) => a.q - b.q));
    else delete state.inventory[name];
    persistState();
    refreshStockSurfaces();
  }

  function removeInventoryLot(name, quality) {
    if (!INVENTORY_RESOURCE_NAMES.has(name)) return;
    setInventoryLot(name, quality, 0);
  }

  function contractCommittedUnits(name) {
    let total = 0;
    for (const [contractId, rows] of Object.entries(state.contractDeposits || {})) {
      const lots = lotsFromRaw(rows?.[name]);
      if (!lots.length) continue;
      const contract = CONTRACT_BY_ID.get(contractId);
      const order = contract?.orders.find((row) => row.name === name);
      if (order) total += lotsTotal(lots) * contractUnitFactor(order);
    }
    return total;
  }

  function blueprintCommittedUnits(name) {
    let total = 0;
    for (const rows of Object.values(state.blueprintDeposits || {})) {
      for (const [key, value] of Object.entries(rows || {})) {
        if (key.slice(0, key.lastIndexOf('|')) !== name) continue;
        total += lotsTotal(lotsFromRaw(value));
      }
    }
    return total;
  }

  function inventoryCommitted(name) {
    return contractCommittedUnits(name) + blueprintCommittedUnits(name);
  }

  function inventoryCommittedTotal() {
    let total = 0;
    for (const [contractId, rows] of Object.entries(state.contractDeposits || {})) {
      const contract = CONTRACT_BY_ID.get(contractId);
      if (!contract) continue;
      for (const [name, value] of Object.entries(rows || {})) {
        const order = contract.orders.find((row) => row.name === name);
        if (order) total += lotsTotal(lotsFromRaw(value)) * contractUnitFactor(order);
      }
    }
    for (const rows of Object.values(state.blueprintDeposits || {})) {
      for (const value of Object.values(rows || {})) total += lotsTotal(lotsFromRaw(value));
    }
    return total;
  }

  function inventoryCommittedPositions() {
    return INVENTORY_RESOURCES.filter((profile) => inventoryCommitted(profile.name) > 0).length;
  }

  function inventoryCommittedBreakdown(name) {
    const contracts = [];
    const blueprints = [];
    let total = 0;
    for (const [contractId, rows] of Object.entries(state.contractDeposits || {})) {
      const lots = lotsFromRaw(rows?.[name]);
      if (!lots.length) continue;
      const contract = CONTRACT_BY_ID.get(contractId);
      const order = contract?.orders.find((row) => row.name === name);
      if (!contract || !order) continue;
      const deposited = lotsTotal(lots);
      const units = deposited * contractUnitFactor(order);
      contracts.push({ contract, order, deposited, lots, quality: lotsAverage(lots), units });
      total += units;
    }
    for (const [bpId, rows] of Object.entries(state.blueprintDeposits || {})) {
      const bp = FAB_BP_BY_ID.get(bpId);
      if (!bp) continue;
      for (const [key, value] of Object.entries(rows || {})) {
        if (key.slice(0, key.lastIndexOf('|')) !== name) continue;
        const lots = lotsFromRaw(value);
        const deposited = lotsTotal(lots);
        if (deposited <= 0) continue;
        blueprints.push({ bp, key, deposited, lots, quality: lotsAverage(lots) });
        total += deposited;
      }
    }
    contracts.sort((a, b) => a.contract.name.localeCompare(b.contract.name, 'en', { sensitivity: 'base' }));
    blueprints.sort((a, b) => a.bp.n.localeCompare(b.bp.n, 'en', { sensitivity: 'base' }));
    return { total, contracts, blueprints };
  }

  function toggleResourceFavorite(name) {
    if (!INVENTORY_BY_NAME.has(name)) return;
    const active = !resourceFavoriteSet.has(name);
    if (active) resourceFavoriteSet.add(name);
    else resourceFavoriteSet.delete(name);
    state.resourceFavorites = [...resourceFavoriteSet];
    if (ui.tab === 'inventory' && !inventoryModalName) focusAfterRender = { type: 'inventory-fav', name };
    persistState();
    refreshStockSurfaces();
    toast(active ? `${name} в избранном` : `${name} убран из избранного`, 'success');
  }

  function contractDepositLots(contractId, resourceName) {
    const found = Math.floor(Number(state.progress?.[contractId]?.[resourceName]) || 0);
    const lots = lotsFromRaw(state.contractDeposits?.[contractId]?.[resourceName]);
    if (found <= 0 || !lots.length) return [];
    const total = lotsTotal(lots);
    return total <= found ? lots : lotsLimit(lots, found, 'lowest');
  }

  function contractDeposited(contractId, resourceName) {
    return lotsTotal(contractDepositLots(contractId, resourceName));
  }

  function contractDepositQuality(contractId, resourceName) {
    return lotsAverage(contractDepositLots(contractId, resourceName));
  }

  function blueprintProgressValue(bpId, key, required) {
    const value = Math.floor(Number(state.blueprintProgress?.[bpId]?.[key]) || 0);
    return clamp(value, 0, Math.max(0, required));
  }

  function blueprintDepositLots(bpId, key, required) {
    const progress = blueprintProgressValue(bpId, key, required);
    const lots = lotsFromRaw(state.blueprintDeposits?.[bpId]?.[key]);
    if (progress <= 0 || !lots.length) return [];
    const total = lotsTotal(lots);
    return total <= progress ? lots : lotsLimit(lots, progress, 'lowest');
  }

  function blueprintDepositedValue(bpId, key, required) {
    return lotsTotal(blueprintDepositLots(bpId, key, required));
  }

  function blueprintDepositQuality(bpId, key, required) {
    return lotsAverage(blueprintDepositLots(bpId, key, required));
  }

  const contractUnitFactor = (order) => (order.unit === 'SCU' ? 100 : 1);

  function contractDepositCapacity(order, lots) {
    return (lots || []).reduce((sum, lot) => {
      const capacity = order.unit === 'SCU' ? Math.floor(lot.n / 100) : lot.n;
      return sum + Math.max(0, capacity);
    }, 0);
  }

  function planContractDeposit(name, order, remaining, quality = 'all') {
    const factor = contractUnitFactor(order);
    const all = quality === 'all' || quality === '' || quality == null;
    const selected = all ? null : qualityValue(quality);
    const pool = (all ? inventoryLots(name) : inventoryLots(name).filter((lot) => lot.q === selected))
      .slice()
      .sort((a, b) => (all ? a.q - b.q : 0));
    let left = Math.max(0, Math.floor(Number(remaining) || 0));
    const lots = [];
    const takeUnits = [];
    const used = [];
    for (const lot of pool) {
      if (left <= 0) break;
      const capacity = order.unit === 'SCU' ? Math.floor(lot.n / 100) : lot.n;
      const take = Math.min(capacity, left);
      if (take <= 0) continue;
      lots.push({ q: lot.q, n: take });
      used.push({ q: lot.q, n: take });
      takeUnits.push({ q: lot.q, n: take * factor });
      left -= take;
    }
    return { lots, takeUnits, used, amount: lotsTotal(lots), short: left };
  }

  function contractDepositLabel(amount, order) {
    return order.unit === 'SCU' ? `${fmt(amount)} SCU` : `${fmt(amount)} шт.`;
  }

  function blueprintRequirementRows(bp) {
    return fabAggregateIngredients(bp).map((row) => {
      const key = `${row.name}|${row.unit}`;
      const required = fabUnits(row.qty, row.unit);
      const progress = blueprintProgressValue(bp.id, key, required);
      const depositedLots = blueprintDepositLots(bp.id, key, required);
      const deposited = lotsTotal(depositedLots);
      return {
        ...row,
        key,
        required,
        progress,
        deposited,
        depositedLots,
        quality: lotsAverage(depositedLots),
        remaining: Math.max(0, required - progress),
        stock: inventoryQty(row.name),
        stockLots: inventoryLots(row.name)
      };
    });
  }

  function blueprintStats(bp) {
    const rows = blueprintRequirementRows(bp);
    const required = rows.reduce((sum, row) => sum + row.required, 0);
    const progress = rows.reduce((sum, row) => sum + row.progress, 0);
    const deposited = rows.reduce((sum, row) => sum + row.deposited, 0);
    const available = rows.reduce((sum, row) => sum + Math.min(row.stock, row.remaining), 0);
    return {
      rows,
      required,
      progress,
      deposited,
      available,
      remaining: Math.max(0, required - progress),
      percent: required > 0 ? Math.round((progress / required) * 100) : 100
    };
  }

  function qualityTone(value) {
    const q = qualityValue(value);
    if (q < 500) return 'is-low';
    if (q > 500) return 'is-high';
    return 'is-neutral';
  }

  function qualityChipHtml(quality, amount, unit = 'ед.') {
    const q = qualityValue(quality);
    return `<span class="q-chip ${qualityTone(q)}"><b>Q${fmt(q)}</b>${Number.isFinite(Number(amount)) ? `<span>${fmt(amount)} ${esc(unit)}</span>` : ''}</span>`;
  }

  function qualityLotsChips(lots, options = {}) {
    const list = lotsFromRaw(lots);
    if (!list.length) return `<span class="q-empty">${esc(options.empty || 'нет партий')}</span>`;
    return list.map((lot) => qualityChipHtml(lot.q, lot.n, options.unit || 'ед.')).join('');
  }

  function qualitySelectHtml(name, options = {}) {
    const lots = inventoryLots(name);
    if (!lots.length) return '';
    const includeAll = Boolean(options.includeAll);
    const selected = options.selected == null ? (includeAll ? 'all' : String([...lots].sort((a, b) => b.q - a.q)[0].q)) : String(options.selected);
    const optionsHtml = [];
    if (includeAll) optionsHtml.push(`<option value="all"${selected === 'all' ? ' selected' : ''}>${esc(options.allLabel || 'Все партии · сначала ниже качеством')}</option>`);
    for (const lot of lots) {
      optionsHtml.push(`<option value="${lot.q}"${selected === String(lot.q) ? ' selected' : ''}>Q${fmt(lot.q)} · ${fmt(lot.n)} ед.</option>`);
    }
    return `<label class="q-select"><span>${esc(options.label || 'Партия')}</span><span class="select-wrap"><select data-role="deposit-quality" aria-label="${esc(options.aria || `Партия ресурса ${name}`)}">${optionsHtml.join('')}</select>${svgIcon('chevronDown')}</span></label>`;
  }

  function qualityModifierAt(modifier, quality) {
    const q = qualityValue(quality);
    if (modifier.type === 'segments' && Array.isArray(modifier.segments) && modifier.segments.length) {
      const segment = modifier.segments.find((item) => q >= item.qMin && q <= item.qMax) || modifier.segments[modifier.segments.length - 1];
      const span = segment.qMax - segment.qMin;
      const ratio = span > 0 ? clamp((q - segment.qMin) / span, 0, 1) : 0;
      return segment.start + (segment.end - segment.start) * ratio;
    }
    const min = Number(modifier.qMin) || QUALITY_MIN;
    const max = Number(modifier.qMax) || QUALITY_MAX;
    const span = max - min;
    const ratio = span > 0 ? clamp((q - min) / span, 0, 1) : 0;
    return Number(modifier.atMin) + (Number(modifier.atMax) - Number(modifier.atMin)) * ratio;
  }

  function qualityForecast(bp) {
    const data = QUALITY_BLUEPRINTS[bp.id];
    const rows = blueprintRequirementRows(bp);
    const rowByName = new Map();
    const rowByKey = new Map(rows.map((row) => [row.key, row]));
    for (const row of rows) {
      if (!rowByName.has(row.name)) rowByName.set(row.name, []);
      rowByName.get(row.name).push(row);
    }
    const materialQuality = new Map();
    for (const [name, list] of rowByName) {
      let weighted = 0;
      let units = 0;
      for (const row of list) {
        for (const lot of row.depositedLots) {
          weighted += lot.q * lot.n;
          units += lot.n;
        }
        const manual = Math.max(0, row.progress - row.deposited);
        if (manual > 0) {
          weighted += QUALITY_NEUTRAL * manual;
          units += manual;
        }
      }
      materialQuality.set(name, units > 0 ? Math.round(weighted / units) : QUALITY_NEUTRAL);
    }
    const totalRequired = rows.reduce((sum, row) => sum + row.required, 0);
    const totalProgress = rows.reduce((sum, row) => sum + row.progress, 0);
    const totalDeposited = rows.reduce((sum, row) => sum + row.deposited, 0);
    const coverage = totalRequired > 0 ? Math.round((totalProgress / totalRequired) * 100) : 0;
    if (!data || !Array.isArray(data.groups) || !data.groups.length) {
      return { hasData: false, groups: [], itemQuality: QUALITY_NEUTRAL, coverage, totalRequired, totalProgress, totalDeposited, warnings: [] };
    }
    const groups = [];
    let itemWeighted = 0;
    let itemUnits = 0;
    const warnings = [];
    for (const group of data.groups) {
      const materials = Array.isArray(group.materials) ? group.materials : [];
      if (!materials.length) continue;
      let groupUnits = 0;
      let qualityWeighted = 0;
      let progressUnits = 0;
      const materialNames = [];
      for (const material of materials) {
        const units = Math.max(0, Number(material.units) || 0);
        if (units <= 0) continue;
        const quality = materialQuality.get(material.name) ?? QUALITY_NEUTRAL;
        groupUnits += units;
        qualityWeighted += quality * units;
        const aggregate = rowByName.get(material.name) || [];
        const progress = aggregate.reduce((sum, row) => sum + Math.min(row.progress, row.required), 0);
        const required = aggregate.reduce((sum, row) => sum + row.required, 0);
        const ratio = required > 0 ? progress / required : 0;
        progressUnits += Math.min(units, units * ratio);
        materialNames.push(material.name);
      }
      if (groupUnits <= 0) continue;
      const quality = Math.round(qualityWeighted / groupUnits);
      const completion = Math.round((progressUnits / groupUnits) * 100);
      const minQuality = Number(group.minQuality) || 0;
      if (minQuality >= 500 && quality < minQuality) {
        warnings.push(completion > 0
          ? `${group.name}: нужно минимум Q${fmt(minQuality)}, сейчас Q${fmt(quality)}`
          : `${group.name}: требуется минимум Q${fmt(minQuality)}`);
      }
      const modifiers = (group.modifiers || []).map((modifier) => {
        const value = qualityModifierAt(modifier, quality);
        const baseline = qualityModifierAt(modifier, QUALITY_NEUTRAL);
        const delta = baseline !== 0 ? ((value - baseline) / Math.abs(baseline)) * 100 : null;
        const improved = modifier.better === 'lower' ? value < baseline : value > baseline;
        const worsened = modifier.better === 'lower' ? value > baseline : value < baseline;
        return {
          key: modifier.key,
          label: modifier.label,
          better: modifier.better,
          value,
          baseline,
          delta: delta == null ? null : Math.round(delta * 10) / 10,
          improved,
          worsened
        };
      });
      groups.push({
        name: group.name || group.key || 'Слот',
        quality,
        minQuality,
        completion,
        units: groupUnits,
        materials: materialNames,
        modifiers
      });
      itemWeighted += quality * groupUnits;
      itemUnits += groupUnits;
    }
    const itemQuality = itemUnits > 0 ? Math.round(itemWeighted / itemUnits) : QUALITY_NEUTRAL;
    return {
      hasData: groups.length > 0,
      groups,
      itemQuality,
      coverage,
      totalRequired,
      totalProgress,
      totalDeposited,
      warnings
    };
  }

  function qualityForecastHtml(bp) {
    const forecast = qualityForecast(bp);
    if (!forecast.hasData) {
      return `<section class="drawer-section quality-forecast">
        <h3>Качество крафта</h3>
        <div class="modal-hint">Для этого чертежа Wiki API не публикует модификаторы качества. Итоговое качество предсказать нельзя, но партии материалов всё равно сохраняются при внесении и возврате.</div>
      </section>`;
    }
    const summary = forecast.coverage >= 100
      ? `Все материалы внесены: ${fmt(forecast.totalProgress)} из ${fmt(forecast.totalRequired)} ед. (100%). Прогноз учитывает качество каждой партии.`
      : forecast.coverage > 0
        ? `Внесено ${fmt(forecast.totalProgress)} из ${fmt(forecast.totalRequired)} ед. (${forecast.coverage}%). Недостающие материалы в прогнозе считаются базовыми Q500.`
        : 'Материалы ещё не внесены — показан базовый результат Q500.';
    const groupRows = forecast.groups.map((group) => {
      const mods = group.modifiers.length
        ? group.modifiers.map((modifier) => {
          const delta = modifier.delta == null ? '—' : `${modifier.delta > 0 ? '+' : ''}${fmt(modifier.delta)}%`;
          const tone = modifier.improved ? 'is-better' : modifier.worsened ? 'is-worse' : 'is-even';
          const direction = modifier.better === 'lower' ? 'меньше — лучше' : 'больше — лучше';
          return `<div class="qf-mod ${tone}">
            <span class="qf-mod-name">${esc(modifier.label)}</span>
            <span class="qf-mod-value">×${(Number(modifier.value) || 0).toFixed(3)} <small>${delta}</small></span>
            <span class="qf-mod-note">${esc(direction)}</span>
          </div>`;
        }).join('')
        : '<div class="qf-mod-note">Подтверждённых модификаторов для этого слота нет.</div>';
      return `<div class="qf-group">
        <div class="qf-group-head">
          <div><b>${esc(group.name)}</b><span>${esc(group.materials.join(', '))}</span></div>
          <div class="qf-group-side">${qualityChipHtml(group.quality)}<small>${group.completion}% собрано</small></div>
        </div>
        <div class="qf-mods">${mods}</div>
      </div>`;
    }).join('');
    const warnings = forecast.warnings.length
      ? `<div class="qf-warning">${svgIcon('alert')}<div><b>Качество ниже минимума слота.</b>${forecast.warnings.map((text) => `<span>${esc(text)}</span>`).join('')}</div></div>`
      : '';
    const incomplete = forecast.coverage < 100
      ? `<div class="qf-note">${svgIcon('info')} Прогноз предварительный: часть материалов ещё не внесена. После полной сборки качество пересчитается автоматически.</div>`
      : '';
    return `<section class="drawer-section quality-forecast">
      <h3>Качество крафта <span>предварительный расчёт</span></h3>
      <div class="qf-summary">
        <div class="qf-grade ${qualityTone(forecast.itemQuality)}">
          <span>Прогноз качества предмета</span>
          <b>Q${fmt(forecast.itemQuality)}</b>
          <small>${forecast.coverage}% материалов · ${fmt(forecast.totalRequired)} ед.</small>
        </div>
        <p>${esc(summary)}</p>
      </div>
      ${warnings}
      ${groupRows}
      ${incomplete}
      <p class="qf-source">Считается по подтверждённым модификаторам Star Citizen Wiki API ${esc(QUALITY_DATA.meta?.gameVersion || '4.10.2')}: линейные и сегментные диапазоны, Q500 — нейтральная точка. Это локальная оценка, а не гарантия игрового экрана крафта.</p>
    </section>`;
  }

  function contractUsageFor(name) {
    const profile = INVENTORY_BY_NAME.get(name);
    if (!profile) return [];
    return profile.contracts.map((usage) => {
      const contract = CONTRACT_BY_ID.get(usage.contractId);
      const order = contract?.orders.find((row) => row.name === usage.orderName);
      if (!contract || !order) return null;
      const found = getFound(contract, order.name);
      const depositedLots = contractDepositLots(contract.id, order.name);
      const deposited = lotsTotal(depositedLots);
      const remaining = Math.max(0, order.qty - found);
      return {
        ...usage,
        name: order.name,
        contract,
        order,
        found,
        deposited,
        depositedLots,
        quality: lotsAverage(depositedLots),
        remaining,
        remainingUnits: fabUnits(remaining, order.unit),
        stockLots: inventoryLots(order.name)
      };
    }).filter(Boolean);
  }

  function blueprintUsageFor(name) {
    const profile = INVENTORY_BY_NAME.get(name);
    if (!profile) return [];
    return profile.blueprints.map((usage) => {
      const bp = FAB_BP_BY_ID.get(usage.bpId);
      if (!bp) return null;
      const progress = blueprintProgressValue(bp.id, usage.key, usage.qtyUnits);
      const depositedLots = blueprintDepositLots(bp.id, usage.key, usage.qtyUnits);
      const deposited = lotsTotal(depositedLots);
      return {
        ...usage,
        name,
        bp,
        progress,
        deposited,
        depositedLots,
        quality: lotsAverage(depositedLots),
        remaining: Math.max(0, usage.qtyUnits - progress),
        stockLots: inventoryLots(name)
      };
    }).filter(Boolean);
  }

  function resourceNeedSummary(name) {
    const stock = inventoryQty(name);
    const committed = inventoryCommitted(name);
    const contracts = contractUsageFor(name).filter((row) => row.remaining > 0);
    const activeContracts = contracts.filter((row) => pinnedSet.has(row.contract.id) || contractStats(row.contract).started);
    const blueprints = blueprintUsageFor(name);
    const activeBlueprints = blueprints.filter((row) => row.remaining > 0 && (row.progress > 0 || row.deposited > 0 || favoriteSet.has(row.bp.id)));
    const contractUnits = activeContracts.reduce((sum, row) => sum + row.remainingUnits, 0);
    const allContractUnits = contracts.reduce((sum, row) => sum + row.remainingUnits, 0);
    const planUnits = activeBlueprints.reduce((sum, row) => sum + row.remaining, 0);
    const need = contractUnits + planUnits;
    return {
      stock,
      committed,
      contracts,
      activeContracts,
      blueprints,
      activeBlueprints,
      contractUnits,
      allContractUnits,
      planUnits,
      need,
      percent: need > 0 ? Math.min(100, Math.round((stock / need) * 100)) : 0,
      usedBlueprints: blueprints.length,
      totalUsage: contracts.length + blueprints.length
    };
  }

  function inventoryFilteredResources() {
    const query = norm(ui.inventorySearch.trim());
    let rows = INVENTORY_RESOURCES.map((profile) => ({ profile, ...resourceNeedSummary(profile.name) }));
    if (query) {
      rows = rows.filter((row) => (INVENTORY_SEARCH_INDEX.get(row.profile.name) || '').includes(query));
    }
    if (ui.inventoryKind !== 'all') rows = rows.filter((row) => row.profile.kind === ui.inventoryKind);
    if (ui.inventoryFilter === 'stock') rows = rows.filter((row) => row.stock > 0);
    else if (ui.inventoryFilter === 'committed') rows = rows.filter((row) => row.committed > 0);
    else if (ui.inventoryFilter === 'favorites') rows = rows.filter((row) => resourceFavoriteSet.has(row.profile.name));
    else if (ui.inventoryFilter === 'needed') rows = rows.filter((row) => row.activeContracts.length > 0 || row.activeBlueprints.length > 0);
    const byName = (a, b) => a.profile.name.localeCompare(b.profile.name, 'en', { sensitivity: 'base' });
    const comparators = {
      'name-asc': byName,
      'stock-desc': (a, b) => b.stock - a.stock || byName(a, b),
      'committed-desc': (a, b) => b.committed - a.committed || byName(a, b),
      'need-desc': (a, b) => b.need - a.need || byName(a, b),
      'coverage-asc': (a, b) => {
        if ((a.need > 0) !== (b.need > 0)) return a.need > 0 ? -1 : 1;
        return a.percent - b.percent || b.need - a.need || byName(a, b);
      }
    };
    const searchRank = (row) => {
      if (!query) return 0;
      const name = norm(row.profile.name);
      if (name === query) return 0;
      if (name.startsWith(query)) return 1;
      if (name.includes(query)) return 2;
      return 3;
    };
    rows.sort((a, b) => (searchRank(a) - searchRank(b)) || (comparators[ui.inventorySort] || byName)(a, b));
    return rows;
  }

  function depositContractFromInventory(name, contractId, quality = 'all') {
    const contract = CONTRACT_BY_ID.get(contractId);
    const order = contract?.orders.find((row) => row.name === name);
    if (!contract || !order) return;
    const stock = inventoryQty(name);
    const found = getFound(contract, order.name);
    const plan = planContractDeposit(name, order, order.qty - found, quality);
    if (plan.amount <= 0) {
      if (stock <= 0) toast(`В инвентаре нет ${name}`, 'error');
      else if (quality !== 'all' && !inventoryLots(name).some((lot) => lot.q === qualityValue(quality))) toast(`Партии Q${qualityValue(quality)} больше нет на складе`, 'error');
      else if (order.unit === 'SCU' && stock < 100) toast('Для 1 SCU нужно минимум 100 ед.', 'error');
      else if (order.unit === 'SCU' && contractDepositCapacity(order, inventoryLots(name).filter((lot) => quality === 'all' || lot.q === qualityValue(quality))) <= 0) toast('В выбранной партии меньше 100 ед. — для 1 SCU нужна целая сотня', 'error');
      else toast('Ресурс уже внесён полностью');
      return;
    }
    for (const lot of plan.takeUnits) takeInventoryLot(name, lot.q, lot.n);
    setFoundValue(contract, order, found + plan.amount);
    if (!state.contractDeposits[contract.id]) state.contractDeposits[contract.id] = {};
    let depositLots = contractDepositLots(contract.id, order.name);
    for (const lot of plan.lots) depositLots = lotsAdd(depositLots, lot.q, lot.n);
    state.contractDeposits[contract.id][order.name] = lotsToObject(depositLots);
    persistState();
    refreshStockSurfaces();
    const qualityText = plan.lots.length === 1 ? ` · Q${plan.lots[0].q}` : '';
    toast(`Внесено: ${contractDepositLabel(plan.amount, order)}${qualityText} · ${contract.name}`, 'success');
  }

  function withdrawContractDeposit(name, contractId) {
    const contract = CONTRACT_BY_ID.get(contractId);
    const order = contract?.orders.find((row) => row.name === name);
    if (!contract || !order) return;
    const lots = contractDepositLots(contract.id, order.name);
    const deposited = lotsTotal(lots);
    if (deposited <= 0) return;
    const found = getFound(contract, order.name);
    setFoundValue(contract, order, found - deposited);
    for (const lot of lots) inventoryAddLots(name, [{ q: lot.q, n: lot.n * contractUnitFactor(order) }]);
    delete state.contractDeposits[contract.id][order.name];
    if (Object.keys(state.contractDeposits[contract.id]).length === 0) delete state.contractDeposits[contract.id];
    persistState();
    refreshStockSurfaces();
    toast(`Возвращено на склад: ${contractDepositLabel(deposited, order)}`, 'success');
  }

  function depositBlueprintFromInventory(name, bpId, key, quality = 'highest') {
    const bp = FAB_BP_BY_ID.get(bpId);
    const required = FAB_BLUEPRINT_REQUIREMENTS.get(bpId)?.get(key);
    if (!bp || !required) return;
    const progress = blueprintProgressValue(bp.id, key, required);
    const remaining = Math.max(0, required - progress);
    if (remaining <= 0) {
      toast('Материал уже внесён полностью', 'info');
      return;
    }
    const lots = inventoryLots(name).filter((lot) => lot.n > 0);
    if (!lots.length) {
      toast(`В инвентаре нет ${name}`, 'error');
      return;
    }
    const selected = quality === 'highest' || quality === '' || quality == null
      ? [...lots].sort((a, b) => b.q - a.q)[0]
      : lots.find((lot) => lot.q === qualityValue(quality));
    if (!selected) {
      toast(`Партии Q${qualityValue(quality)} больше нет на складе`, 'error');
      return;
    }
    const amount = Math.min(selected.n, remaining);
    if (amount <= 0) {
      toast('Материал уже внесён полностью', 'info');
      return;
    }
    takeInventoryLot(name, selected.q, amount);
    if (!state.blueprintProgress[bp.id]) state.blueprintProgress[bp.id] = {};
    if (!state.blueprintDeposits[bp.id]) state.blueprintDeposits[bp.id] = {};
    let depositLots = blueprintDepositLots(bp.id, key, required);
    depositLots = lotsAdd(depositLots, selected.q, amount);
    state.blueprintProgress[bp.id][key] = progress + amount;
    state.blueprintDeposits[bp.id][key] = lotsToObject(depositLots);
    persistState();
    refreshStockSurfaces();
    toast(`Внесено: ${fmt(amount)} ед. ${name} · Q${selected.q} · ${bp.n}`, 'success');
  }

  function withdrawBlueprintDeposit(bpId, key) {
    const bp = FAB_BP_BY_ID.get(bpId);
    const required = FAB_BLUEPRINT_REQUIREMENTS.get(bpId)?.get(key);
    if (!bp || !required) return;
    const lots = blueprintDepositLots(bp.id, key, required);
    const deposited = lotsTotal(lots);
    if (deposited <= 0) return;
    const name = key.slice(0, key.lastIndexOf('|'));
    const progress = blueprintProgressValue(bp.id, key, required);
    for (const lot of lots) inventoryAddLots(name, [{ q: lot.q, n: lot.n }]);
    if (progress - deposited > 0) state.blueprintProgress[bp.id][key] = progress - deposited;
    else delete state.blueprintProgress[bp.id][key];
    delete state.blueprintDeposits[bp.id][key];
    if (Object.keys(state.blueprintDeposits[bp.id] || {}).length === 0) delete state.blueprintDeposits[bp.id];
    if (Object.keys(state.blueprintProgress[bp.id] || {}).length === 0) delete state.blueprintProgress[bp.id];
    persistState();
    refreshStockSurfaces();
    toast(`Возвращено на склад: ${fmt(deposited)} ед.`, 'success');
  }

  function depositAllBlueprintMaterials(bpId) {
    const bp = FAB_BP_BY_ID.get(bpId);
    if (!bp) return;
    const rows = blueprintRequirementRows(bp);
    let total = 0;
    for (const row of rows) {
      const amount = Math.min(row.stock, row.remaining);
      if (amount <= 0) continue;
      const take = lotsTake(row.stockLots, amount, 'lowest');
      if (!take.taken.length) continue;
      inventorySetLots(row.name, take.remaining);
      if (!state.blueprintProgress[bp.id]) state.blueprintProgress[bp.id] = {};
      if (!state.blueprintDeposits[bp.id]) state.blueprintDeposits[bp.id] = {};
      let depositLots = blueprintDepositLots(bp.id, row.key, row.required);
      let added = 0;
      for (const lot of take.taken) {
        depositLots = lotsAdd(depositLots, lot.q, lot.n);
        added += lot.n;
      }
      state.blueprintProgress[bp.id][row.key] = row.progress + added;
      state.blueprintDeposits[bp.id][row.key] = lotsToObject(depositLots);
      total += added;
    }
    if (total <= 0) {
      toast('В инвентаре нет подходящих материалов', 'info');
      return;
    }
    persistState();
    refreshStockSurfaces();
    toast(`Внесено в «${bp.n}»: ${fmt(total)} ед.`, 'success');
  }

  function withdrawAllBlueprintMaterials(bpId) {
    const bp = FAB_BP_BY_ID.get(bpId);
    if (!bp) return;
    const deposits = state.blueprintDeposits?.[bpId] || {};
    let total = 0;
    for (const [key, value] of Object.entries(deposits)) {
      const lots = lotsFromRaw(value);
      const amount = lotsTotal(lots);
      if (amount <= 0) continue;
      const name = key.slice(0, key.lastIndexOf('|'));
      for (const lot of lots) inventoryAddLots(name, [{ q: lot.q, n: lot.n }]);
      const required = FAB_BLUEPRINT_REQUIREMENTS.get(bpId)?.get(key) || amount;
      const progress = blueprintProgressValue(bpId, key, required);
      if (progress - amount > 0) state.blueprintProgress[bpId][key] = progress - amount;
      else delete state.blueprintProgress[bpId]?.[key];
      total += amount;
    }
    if (total <= 0) {
      toast('Нет ресурсов, внесённых из инвентаря', 'info');
      return;
    }
    delete state.blueprintDeposits[bpId];
    if (Object.keys(state.blueprintProgress[bpId] || {}).length === 0) delete state.blueprintProgress[bpId];
    persistState();
    refreshStockSurfaces();
    toast(`Возвращено на склад: ${fmt(total)} ед.`, 'success');
  }

  function refreshStockSurfaces() {
    updateCounters();
    if (ui.tab === 'inventory') {
      const scroll = el.sidebar.scrollTop;
      renderInventorySidebar();
      el.sidebar.scrollTop = scroll;
    } else if (ui.tab === 'resources') {
      const scroll = el.sidebar.scrollTop;
      renderResourceSidebar();
      el.sidebar.scrollTop = scroll;
    }
    renderView();
    updateContentHead();
    if (el.drawerLayer.classList.contains('is-open')) refreshOpenDrawer();
    if (inventoryModalName) openInventoryResourceModal(inventoryModalName, { preserveScroll: true, preserveFocus: true });
  }

  function getFound(contract, resourceName) {
    const order = contract.orders.find((o) => o.name === resourceName);
    if (!order) return 0;
    const raw = Number(state.progress[contract.id]?.[resourceName]) || 0;
    return clamp(Math.round(raw), 0, order.qty);
  }

  function setFoundValue(contract, order, value) {
    const next = clamp(Math.round(Number(value) || 0), 0, order.qty);
    if (!state.progress[contract.id]) state.progress[contract.id] = {};
    if (next > 0) state.progress[contract.id][order.name] = next;
    else delete state.progress[contract.id][order.name];
    if (Object.keys(state.progress[contract.id]).length === 0) delete state.progress[contract.id];
  }

  function contractStats(contract) {
    let total = contract.orders.length;
    let done = 0;
    let ratioSum = 0;
    let foundLines = 0;
    let qtyTotal = 0;
    let qtyFound = 0;
    for (const order of contract.orders) {
      const found = getFound(contract, order.name);
      const ratio = order.qty > 0 ? Math.min(found, order.qty) / order.qty : 1;
      ratioSum += ratio;
      if (found >= order.qty) done += 1;
      if (found > 0) foundLines += 1;
      qtyTotal += order.qty;
      qtyFound += Math.min(found, order.qty);
    }
    const ratio = total > 0 ? ratioSum / total : 0;
    return {
      total,
      done,
      ratio,
      percent: Math.round(ratio * 100),
      complete: total > 0 && done === total,
      started: foundLines > 0,
      foundLines,
      qtyTotal,
      qtyFound
    };
  }

  function isActive(contract) {
    return pinnedSet.has(contract.id) || contractStats(contract).started;
  }

  function activeContracts() {
    return CONTRACTS.filter((contract) => isActive(contract));
  }

  function saveUiSoon() {
    if (!storageOk) return;
    clearTimeout(uiSaveTimer);
    uiSaveTimer = setTimeout(() => {
      try {
        localStorage.setItem(UI_KEY, JSON.stringify(ui));
      } catch (error) {
        // UI-настройки не критичны; прогресс сохраняется отдельно.
      }
    }, 240);
  }

  function updateSaveIndicator(mode = 'idle') {
    if (!el.saveIndicator) return;
    el.saveIndicator.classList.toggle('is-error', mode === 'error');
    el.saveIndicator.classList.toggle('is-saving', mode === 'saving');
    if (!storageOk || mode === 'error') {
      el.saveText.textContent = 'Не сохраняется';
      return;
    }
    if (mode === 'saved' && state.updatedAt) {
      el.saveText.textContent = `Сохранено · ${timeFmt.format(new Date(state.updatedAt))}`;
    } else if (state.updatedAt) {
      el.saveText.textContent = `Сохранено · ${timeFmt.format(new Date(state.updatedAt))}`;
    } else {
      el.saveText.textContent = 'Локальное сохранение';
    }
  }

  function persistState() {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      storageOk = true;
      updateSaveIndicator('saved');
    } catch (error) {
      storageOk = false;
      updateSaveIndicator('error');
      showStorageWarning('Не удалось сохранить прогресс в браузере. Скачайте экспорт, чтобы не потерять данные.');
    }
  }

  function showStorageWarning(message) {
    if (!el.storageWarning) return;
    el.storageWarning.innerHTML = `<b>Внимание.</b> ${esc(message)}`;
    el.storageWarning.hidden = false;
  }

  function downloadBlob(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1600);
  }

  function toast(message, type = 'info') {
    if (!el.toastRegion) return;
    const icon = type === 'success' ? 'check' : type === 'error' ? 'alert' : 'info';
    const node = document.createElement('div');
    node.className = `toast${type === 'success' ? ' is-success' : type === 'error' ? ' is-error' : ''}`;
    node.innerHTML = `${svgIcon(icon)}<span>${esc(message)}</span>`;
    el.toastRegion.appendChild(node);
    while (el.toastRegion.children.length > 3) el.toastRegion.firstElementChild.remove();
    setTimeout(() => {
      node.classList.add('is-out');
      setTimeout(() => node.remove(), 240);
    }, 3000);
  }

  function getFilteredContracts() {
    const stats = new Map(CONTRACTS.map((contract) => [contract.id, contractStats(contract)]));
    const query = norm(ui.contractSearch.trim());
    const list = CONTRACTS.filter((contract) => {
      const stat = stats.get(contract.id);
      if (ui.tab === 'active' && !stat.started && !pinnedSet.has(contract.id)) return false;
      if (ui.category !== 'all' && contract.category !== ui.category) return false;
      if (ui.reputation === 'none' && contract.reputation) return false;
      if (ui.reputation === 'very-good' && contract.reputation !== 'Very Good Customer') return false;
      if (ui.reputation === 'very-best' && contract.reputation !== 'Very Best Customer') return false;
      if (ui.pinnedOnly && !pinnedSet.has(contract.id)) return false;
      if (ui.status === 'active' && !(stat.started || pinnedSet.has(contract.id))) return false;
      if (ui.status === 'not-started' && stat.started) return false;
      if (ui.status === 'in-progress' && (!stat.started || stat.complete)) return false;
      if (ui.status === 'done' && !stat.complete) return false;
      if (query && !SEARCH_INDEX.get(contract.id).includes(query)) return false;
      return true;
    });

    const byName = (a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
    const comparators = {
      'name-asc': byName,
      'name-desc': (a, b) => byName(b, a),
      'progress-desc': (a, b) => stats.get(b.id).ratio - stats.get(a.id).ratio || byName(a, b),
      'progress-asc': (a, b) => stats.get(a.id).ratio - stats.get(b.id).ratio || byName(a, b),
      'requirements-desc': (a, b) => b.orders.length - a.orders.length || byName(a, b),
      'requirements-asc': (a, b) => a.orders.length - b.orders.length || byName(a, b),
      category: (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) || byName(a, b)
    };
    const comparator = comparators[ui.contractSort] || byName;
    list.sort((a, b) => {
      if (ui.tab === 'active') {
        const pinDiff = Number(pinnedSet.has(b.id)) - Number(pinnedSet.has(a.id));
        if (pinDiff) return pinDiff;
      }
      return comparator(a, b);
    });
    return { list, stats };
  }

  function getResourceKindClass(kind) {
    return `kind-${kind}`;
  }

  function resourceProfileIsActive(profile) {
    if (resourceFavoriteSet.has(profile.name)) return true;
    for (const usage of profile.contracts) {
      const contract = CONTRACT_BY_ID.get(usage.contractId);
      if (contract && isActive(contract)) return true;
    }
    for (const usage of profile.blueprints) {
      if (favoriteSet.has(usage.bpId)) return true;
      if (blueprintProgressValue(usage.bpId, usage.key, usage.qtyUnits) > 0) return true;
    }
    return false;
  }

  function aggregateResources() {
    const scope = ui.resourceScope;
    const profiles = INVENTORY_RESOURCES.filter((profile) => {
      if (scope === 'all') return true;
      if (scope === 'wikelo') return profile.contracts.length > 0;
      return resourceProfileIsActive(profile);
    });
    const map = new Map();
    for (const profile of profiles) {
      let required = 0;
      let found = 0;
      let unit = 'unit';
      const contracts = [];
      for (const usage of profile.contracts) {
        const contract = CONTRACT_BY_ID.get(usage.contractId);
        const order = contract?.orders.find((row) => row.name === usage.orderName);
        if (!contract || !order) continue;
        unit = order.unit;
        const lineFound = Math.min(getFound(contract, order.name), order.qty);
        required += order.qty;
        found += lineFound;
        contracts.push({
          id: contract.id,
          name: contract.name,
          category: contract.category,
          qty: order.qty,
          found: lineFound
        });
      }
      map.set(profile.name, {
        key: profile.name,
        name: profile.name,
        unit,
        required,
        found,
        contracts,
        profile,
        craftOnly: contracts.length === 0
      });
    }
    const allRows = [...map.values()].map((row) => {
      row.remaining = Math.max(0, row.required - row.found);
      row.complete = row.required > 0 && row.remaining === 0;
      row.percent = row.required > 0 ? Math.round((row.found / row.required) * 100) : 0;
      row.kind = row.profile.kind;
      row.kindLabel = row.profile.kindLabel;
      row.image = resourceDisplayImage(row.profile.name);
      row.blueprintCount = row.profile.blueprints.length;
      row.blueprintExamples = row.profile.blueprints.slice(0, 4).map((usage) => FAB_BP_BY_ID.get(usage.bpId)).filter(Boolean);
      row.favorite = resourceFavoriteSet.has(row.name);
      row.contracts.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
      return row;
    });
    const contractRows = allRows.filter((row) => row.required > 0);
    const totalResources = contractRows.length;
    const completeResources = contractRows.filter((row) => row.complete).length;
    const query = norm(ui.resourceSearch.trim());
    let rows = allRows;
    if (query) {
      rows = rows.filter((row) => (INVENTORY_SEARCH_INDEX.get(row.name) || '').includes(query));
    }
    if (ui.resourceHideDone) rows = rows.filter((row) => !row.complete);
    const byName = (a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
    const comparators = {
      'remaining-desc': (a, b) => b.remaining - a.remaining || byName(a, b),
      'required-desc': (a, b) => b.required - a.required || byName(a, b),
      'name-asc': byName,
      'contracts-desc': (a, b) => b.contracts.length - a.contracts.length || byName(a, b),
      'blueprints-desc': (a, b) => b.blueprintCount - a.blueprintCount || byName(a, b)
    };
    const searchRank = (row) => {
      if (!query) return 0;
      const name = norm(row.name);
      if (name === query) return 0;
      if (name.startsWith(query)) return 1;
      if (name.includes(query)) return 2;
      return 3;
    };
    rows.sort((a, b) => (searchRank(a) - searchRank(b)) || (comparators[ui.resourceSort] || comparators['name-asc'])(a, b));
    const includedContracts = new Set();
    for (const row of allRows) for (const contract of row.contracts) includedContracts.add(contract.id);
    const includedBlueprints = new Set();
    for (const profile of profiles) for (const usage of profile.blueprints) includedBlueprints.add(usage.bpId);
    return {
      rows,
      totalResources,
      completeResources,
      includedContracts: includedContracts.size,
      includedBlueprints: includedBlueprints.size,
      scope
    };
  }

  function rewardQty(qty, unit) {
    if (unit === 'SCU') return `${fmt(qty)} SCU`;
    return qty > 1 ? `${fmt(qty)}×` : '1×';
  }

  function contractCardHtml(contract, stats) {
    const stat = stats || contractStats(contract);
    const category = CATEGORY_META[contract.category] || CATEGORY_META.other;
    const pinned = pinnedSet.has(contract.id);
    const reward = contract.rewards[0];
    const art = contractImage(contract);
    const rewardTitle = contract.rewards.map((r) => `${rewardQty(r.qty, r.unit)} ${r.name}`).join('; ');
    const missing = contract.orders.filter((o) => getFound(contract, o.name) < o.qty);
    const shownMissing = missing.slice(0, 3);
    const moreMissing = missing.length - shownMissing.length;
    const stockMissing = missing.filter((order) => inventoryQty(order.name) > 0).length;
    const missingHtml = missing.length === 0
      ? `<div class="missing-done">${svgIcon('check')} Все ресурсы собраны</div>`
      : shownMissing.map((order) => `<span class="missing-chip">${esc(order.name)} <b>${fmt(order.qty)}</b> <span class="unit">${unitShort(order.unit)}</span></span>`).join('') +
        (moreMissing > 0 ? `<span class="missing-chip">+${moreMissing}</span>` : '') +
        (stockMissing > 0 ? `<span class="missing-chip missing-chip--stock" title="Эти ресурсы есть на личном складе и готовы к внесению">${svgIcon('box')} ${fmt(stockMissing)} из склада</span>` : '');
    const repBadge = contract.reputation
      ? `<span class="badge badge--rep" title="Минимальная репутация">${svgIcon('star')} ${esc(repLabel(contract.reputation))}</span>`
      : '';
    const doneBadge = stat.complete ? `<span class="badge badge--done">${svgIcon('check')} Готово</span>` : '';
    return `
      <article class="contract-card cat-${contract.category}${stat.complete ? ' is-complete' : ''}" data-card-id="${contract.id}" data-action="open-contract" data-id="${contract.id}" title="Открыть чек-лист">
        <div class="card-visual" title="${esc(rewardTitle)}">
          <span class="card-visual-art${art ? '' : ' is-empty'}">${svgIcon('trophy')}${art ? imageTag(art, reward?.name || contract.name) : ''}</span>
          <div class="card-visual-top">
            <span class="cat-badge" title="${esc(category.label)}">${svgIcon(category.icon)}</span>
            <button class="pin-btn${pinned ? ' is-pinned' : ''}" type="button" data-action="toggle-pin" data-id="${contract.id}" aria-pressed="${pinned}" aria-label="${pinned ? 'Убрать из закреплённых' : 'Закрепить контракт'}" title="${pinned ? 'Убрать из закреплённых' : 'Закрепить контракт'}">${svgIcon('star')}</button>
          </div>
          <div class="card-visual-caption">
            <span class="reward-label">Награда</span>
            <span class="reward-name">${reward ? `${rewardQty(reward.qty, reward.unit)} ${esc(reward.name)}` : 'Нет данных о награде'}${contract.rewards.length > 1 ? ` <span class="reward-more">+${contract.rewards.length - 1} ещё</span>` : ''}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-head">
            <div class="card-titles">
              <h3>${esc(contract.name)}</h3>
            </div>
          </div>
          <div class="card-meta">
            <span class="badge badge--cat">${esc(category.label)}</span>
            ${repBadge}
            ${doneBadge}
          </div>
          <div class="card-progress">
            <div class="progress-meta"><span><b>${stat.done}</b> / ${stat.total} ${plural(stat.total, POSITION_FORMS[0], POSITION_FORMS[1], POSITION_FORMS[2])}</span><span class="pct">${stat.percent}%</span></div>
            <div class="progress-track"><div class="progress-fill" style="width:${stat.percent}%"></div></div>
          </div>
          <div class="card-missing">${missingHtml}</div>
          <div class="card-foot">
            <span class="card-hint">${stat.complete ? 'Готово к сдаче' : stat.started ? 'В работе' : 'Не начат'}</span>
            <button class="card-open" type="button" aria-label="Открыть чек-лист ${esc(contract.name)}">Чек-лист ${svgIcon('arrowRight')}</button>
          </div>
        </div>
      </article>`;
  }

  function repLabel(rep) {
    return REP_LABELS[rep] || rep || 'Без требований';
  }

  function emptyState(icon, title, text, actions = '', extraClass = '') {
    return `
      <div class="empty ${extraClass}">
        <div class="empty-icon">${svgIcon(icon)}</div>
        <h3>${esc(title)}</h3>
        <p>${text}</p>
        ${actions ? `<div class="empty-actions">${actions}</div>` : ''}
      </div>`;
  }

  function renderContractsView() {
    const { list, stats } = getFilteredContracts();
    const activeCount = activeContracts().length;
    if (list.length === 0) {
      if (ui.tab === 'active' && activeCount === 0) {
        el.viewRoot.innerHTML = emptyState(
          'star',
          'В работе пока пусто',
          'Отметьте найденные ресурсы в чек-листе контракта или закрепите контракт звёздочкой — он появится в этом списке.',
          `<button class="btn btn-primary" type="button" data-action="switch-tab" data-tab="contracts">К контрактам</button>`
        );
      } else {
        el.viewRoot.innerHTML = emptyState(
          'search',
          'Ничего не найдено',
          'Попробуйте изменить запрос или сбросить фильтры. Поиск ищет по названию контракта, награде и ресурсам.',
          `<button class="btn btn-outline" type="button" data-action="reset-contract-filters">Сбросить фильтры</button><button class="btn btn-primary" type="button" data-action="switch-tab" data-tab="contracts">Все контракты</button>`
        );
      }
      el.resultCount.textContent = countOf(0, CONTRACT_FORMS);
      return;
    }
    el.viewRoot.innerHTML = `<div class="contract-grid">${list.map((contract) => contractCardHtml(contract, stats.get(contract.id))).join('')}</div>`;
    el.resultCount.textContent = ui.tab === 'active'
      ? `${countOf(list.length, CONTRACT_FORMS)} в работе`
      : `${fmt(list.length)} из ${fmt(TOTAL_CONTRACTS)} ${plural(TOTAL_CONTRACTS, CONTRACT_FORMS[0], CONTRACT_FORMS[1], CONTRACT_FORMS[2])}`;
  }

  function resourceUsage(key) {
    const sep = key.lastIndexOf('|');
    const name = sep >= 0 ? key.slice(0, sep) : key;
    const unit = sep >= 0 ? key.slice(sep + 1) : 'unit';
    const contracts = [];
    let required = 0;
    let found = 0;
    for (const contract of CONTRACTS) {
      for (const order of contract.orders) {
        if (order.name !== name || order.unit !== unit) continue;
        const lineFound = Math.min(getFound(contract, order.name), order.qty);
        required += order.qty;
        found += lineFound;
        contracts.push({
          id: contract.id,
          name: contract.name,
          category: contract.category,
          qty: order.qty,
          found: lineFound
        });
      }
    }
    contracts.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    return {
      key,
      name,
      unit,
      required,
      found,
      remaining: Math.max(0, required - found),
      percent: required > 0 ? Math.round((found / required) * 100) : 100,
      contracts
    };
  }

  function openResourceModal(key) {
    const usage = resourceUsage(key);
    if (!usage.name) return;
    const detail = RESOURCE_DETAILS[key] || {};
    const kindKey = resourceKind(usage.name);
    const kind = KIND_META[kindKey] || KIND_META.equipment;
    const art = resourceImage(usage);
    const description = detail.description || `${usage.name} — ресурс, необходимый для контрактов Викело.`;
    const obtain = detail.obtain || 'Подробную информацию о способе получения смотрите на странице Star Citizen Wiki.';
    const tips = detail.tips || '';
    const tipsSource = detail.tipsSource || '';
    const wikiUrl = detail.wiki || `https://starcitizen.tools/${encodeURIComponent(usage.name.replace(/ /g, '_'))}`;
    const contractRows = usage.contracts.map((line) => {
      const done = line.found >= line.qty;
      const partial = line.found > 0 && !done;
      const state = done ? 'Собрано' : partial ? 'В работе' : 'Не начат';
      const stateClass = done ? ' is-done' : partial ? ' is-partial' : '';
      return `<button class="resource-use-row" type="button" data-action="open-contract" data-id="${line.id}" title="Открыть чек-лист ${esc(line.name)}">
        <span class="resource-use-title">
          ${contractUsageThumbHtml(CONTRACT_BY_ID.get(line.id))}
          <span class="resource-use-name">${esc(line.name)}</span>
        </span>
        <span class="resource-use-qty">${fmt(line.found)} / ${qtyLabel(line.qty, usage.unit)}</span>
        <span class="resource-use-state${stateClass}">${state}</span>
        <span class="resource-use-arrow">${svgIcon('chevronRight')}</span>
      </button>`;
    }).join('');
    openModal({
      wide: true,
      kicker: `${kind.label} · ресурс`,
      title: usage.name,
      body: `
        <div class="resource-detail-hero">
          <div class="resource-detail-media ${getResourceKindClass(kindKey)}${art ? ' has-image' : ''}">
            ${svgIcon(kind.icon)}
            ${art ? imageTag(art, usage.name, true) : ''}
            ${art ? `<button class="image-zoom-btn" type="button" data-action="open-image" data-src="${esc(art)}" data-alt="${esc(usage.name)}" aria-label="Увеличить изображение ${esc(usage.name)}">${svgIcon('search')}</button>` : ''}
            ${imageEditorButtonHtml(usage.name)}
            ${imageCustomBadgeHtml(usage.name)}
          </div>
          <div class="resource-detail-copy">
            <p class="resource-detail-desc">${esc(description)}</p>
            <div class="resource-detail-stats">
              <div class="resource-detail-stat"><span>Всего нужно</span><b>${qtyLabel(usage.required, usage.unit)}</b></div>
              <div class="resource-detail-stat"><span>Собрано</span><b>${qtyLabel(usage.found, usage.unit)}</b></div>
              <div class="resource-detail-stat"><span>Осталось</span><b>${qtyLabel(usage.remaining, usage.unit)}</b></div>
            </div>
            <div class="resource-detail-progress">
              <div class="progress-meta"><span>Прогресс сбора</span><span class="pct">${usage.percent}%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width:${usage.percent}%"></div></div>
            </div>
          </div>
        </div>
        <section class="resource-detail-section">
          <h3>Как получить</h3>
          <p class="resource-detail-obtain">${esc(obtain)}</p>
        </section>
        ${tips ? `<section class="resource-detail-section resource-detail-tips">
          <h3>Где искать чаще <span>советы сообщества</span></h3>
          <p class="resource-detail-obtain">${esc(tips)}</p>
          ${tipsSource ? `<p class="resource-detail-source">Источники: ${esc(tipsSource)}</p>` : ''}
        </section>` : ''}
        <section class="resource-detail-section">
          <h3>Используется в контрактах <span>${countOf(usage.contracts.length, CONTRACT_FORMS)}</span></h3>
          <div class="resource-use-list">${contractRows || '<div class="modal-hint">Этот ресурс не найден ни в одном контракте.</div>'}</div>
        </section>
        <a class="wiki-link" href="${esc(wikiUrl)}" target="_blank" rel="noopener">Подробнее на Star Citizen Wiki ${svgIcon('external')}</a>`,
      initialFocus: '.modal-close'
    });
  }

  function inventoryStockControls(name) {
    const lots = inventoryLots(name);
    const stock = lotsTotal(lots);
    return `<div class="inv-stock-editor inv-stock-editor--lots">
      <div class="inv-stock-total"><span>Всего</span><b>${fmt(stock)} <small>ед.</small></b></div>
      <div class="inv-lot-chips">${qualityLotsChips(lots, { empty: 'Свободных партий нет' })}</div>
      <button class="btn btn-outline btn-xs inv-lots-btn" type="button" data-action="open-inventory-resource" data-resource="${esc(name)}">Партии качества ${svgIcon('arrowRight')}</button>
    </div>`;
  }

  function inventoryLotsPanel(name) {
    const lots = inventoryLots(name);
    const total = lotsTotal(lots);
    const average = lotsAverage(lots);
    const rows = lots.length
      ? lots.map((lot) => `<div class="inv-lot-row">
          ${qualityChipHtml(lot.q, lot.n)}
          <span class="inv-lot-share">${total > 0 ? Math.round((lot.n / total) * 100) : 0}% запаса</span>
          <button class="inv-lot-remove" type="button" data-action="remove-inventory-lot" data-resource="${esc(name)}" data-quality="${lot.q}" aria-label="Удалить партию Q${lot.q}">${svgIcon('trash')}</button>
        </div>`).join('')
      : '<div class="inv-lot-empty">На складе нет партий этого ресурса.</div>';
    return `<div class="inv-lots-panel">
      <div class="inv-lots-head">
        <div><b>Партии качества</b><span>Q0–Q1000 · Q500 — нейтральное</span></div>
        <div class="inv-lots-avg">${total > 0 ? `Среднее ${qualityChipHtml(average)}` : ''}</div>
      </div>
      <div class="inv-lot-list">${rows}</div>
      <div class="inv-lot-form" data-lot-resource="${esc(name)}">
        <label><span>Качество</span><input type="number" inputmode="numeric" min="0" max="1000" step="1" value="${inventoryLotQuality}" data-role="inventory-lot-quality" data-resource="${esc(name)}" aria-label="Качество партии ${esc(name)} от 0 до 1000"></label>
        <label><span>Количество</span><input type="number" inputmode="numeric" min="1" step="1" value="1" data-role="inventory-lot-qty" data-resource="${esc(name)}" aria-label="Количество единиц ${esc(name)} в партии"></label>
        <button class="btn btn-primary btn-xs" type="button" data-action="add-inventory-lot" data-resource="${esc(name)}">Добавить партию</button>
      </div>
      <p class="inv-lot-hint">Укажите качество найденного ресурса: Q500 — базовое, ниже — хуже, выше — лучше. При крафте партии смешиваются, итог считается по среднему качеству. В контракте качество не влияет на прогресс, но сохраняется при возврате.</p>
    </div>`;
  }

  function inventoryContractUsageRow(row) {
    const capacity = Math.min(contractDepositCapacity(row.order, row.stockLots), row.remaining);
    const actions = [
      capacity > 0 ? `${qualitySelectHtml(row.name, { includeAll: true, label: 'Партия' })}<button class="btn btn-primary btn-xs" type="button" data-action="deposit-inventory-contract" data-resource="${esc(row.name)}" data-contract-id="${esc(row.contract.id)}">Внести</button>` : '',
      row.deposited > 0 ? `<button class="btn btn-quiet btn-xs" type="button" data-action="withdraw-contract-deposit" data-resource="${esc(row.name)}" data-contract-id="${esc(row.contract.id)}">Вернуть ${contractDepositLabel(row.deposited, row.order)} · Q${fmt(row.quality)}</button>` : ''
    ].join('');
    return `<div class="inv-use-row" data-deposit-scope>
      <span class="inv-use-title">
        ${contractUsageThumbHtml(row.contract)}
        <button class="inv-use-name" type="button" data-action="open-contract" data-id="${esc(row.contract.id)}" title="Открыть ${esc(row.contract.name)}">${esc(row.contract.name)}</button>
      </span>
      <span class="inv-use-progress">${fmt(row.found)} / ${qtyLabel(row.qty, row.order.unit)}</span>
      <span class="inv-use-remain${row.remaining <= 0 ? ' is-done' : ''}">${row.remaining > 0 ? `нужно ${qtyLabel(row.remaining, row.order.unit)}` : 'готово'}</span>
      ${actions ? `<div class="inv-use-actions">${actions}</div>` : ''}
    </div>`;
  }

  function inventoryBlueprintUsageRow(row) {
    const top = [...row.stockLots].sort((a, b) => b.q - a.q)[0];
    const amount = top ? Math.min(top.n, row.remaining) : 0;
    const actions = [
      amount > 0 ? `${qualitySelectHtml(row.name, { label: 'Партия' })}<button class="btn btn-primary btn-xs" type="button" data-action="deposit-inventory-blueprint" data-resource="${esc(row.name)}" data-bp-id="${esc(row.bp.id)}" data-key="${esc(row.key)}">Внести</button>` : '',
      row.deposited > 0 ? `<button class="btn btn-quiet btn-xs" type="button" data-action="withdraw-blueprint-deposit" data-bp-id="${esc(row.bp.id)}" data-key="${esc(row.key)}">Вернуть ${fmt(row.deposited)} ед. · Q${fmt(row.quality)}</button>` : ''
    ].join('');
    return `<div class="inv-use-row inv-use-row--bp" data-deposit-scope>
      <span class="inv-use-title">
        ${blueprintUsageThumbHtml(row.bp)}
        <button class="inv-use-name" type="button" data-action="open-fabricator" data-id="${esc(row.bp.id)}" title="Открыть ${esc(row.bp.n)}">${esc(row.bp.n)}</button>
      </span>
      <span class="inv-use-progress">${fmt(row.progress)} / ${fmt(row.qtyUnits)} ед.</span>
      <span class="inv-use-remain${row.remaining <= 0 ? ' is-done' : ''}">${row.remaining > 0 ? `нужно ${fmt(row.remaining)} ед.` : 'готово'}</span>
      ${actions ? `<div class="inv-use-actions">${actions}</div>` : ''}
    </div>`;
  }

  function inventoryResourceModalBody(profile) {
    const summary = resourceNeedSummary(profile.name);
    const committed = inventoryCommittedBreakdown(profile.name);
    const contracts = contractUsageFor(profile.name);
    const blueprints = blueprintUsageFor(profile.name);
    const sortedBlueprints = [...blueprints].sort((a, b) => {
      const aActive = a.progress > 0 || a.deposited > 0;
      const bActive = b.progress > 0 || b.deposited > 0;
      if (aActive !== bActive) return aActive ? -1 : 1;
      const aFav = favoriteSet.has(a.bp.id);
      const bFav = favoriteSet.has(b.bp.id);
      if (aFav !== bFav) return aFav ? -1 : 1;
      return a.bp.n.localeCompare(b.bp.n, 'en', { sensitivity: 'base' });
    });
    const shownBlueprints = inventoryUsageShowAll ? sortedBlueprints : sortedBlueprints.slice(0, 8);
    const hiddenCount = sortedBlueprints.length - shownBlueprints.length;
    const material = profile.material;
    const art = resourceDisplayImage(profile.name);
    const description = profile.detail?.description || material?.desc || `${profile.name} — ресурс для контрактов Викело и чертежей фабрикатора.`;
    const obtain = profile.detail?.obtain || material?.obtain || '';
    const tips = profile.detail?.tips || '';
    const kind = KIND_META[profile.kind] || KIND_META.equipment;
    const wikiUrl = profile.detail?.wiki || material?.sourceUrl || `https://starcitizen.tools/${encodeURIComponent(profile.name.replace(/ /g, '_'))}`;
    const contractRows = contracts.map(inventoryContractUsageRow).join('');
    const blueprintRows = shownBlueprints.map(inventoryBlueprintUsageRow).join('');
    const committedContractRows = committed.contracts.map((row) => `<div class="inv-committed-row">
      <span class="inv-committed-icon">${svgIcon('blueprint')}</span>
      <button class="inv-use-name" type="button" data-action="open-contract" data-id="${esc(row.contract.id)}">${esc(row.contract.name)}</button>
      <span class="inv-committed-qty">${contractDepositLabel(row.deposited, row.order)} · ${qualityChipHtml(row.quality)}</span>
      <button class="btn btn-quiet btn-xs" type="button" data-action="withdraw-contract-deposit" data-resource="${esc(profile.name)}" data-contract-id="${esc(row.contract.id)}">Вернуть</button>
    </div>`).join('');
    const committedBlueprintRows = committed.blueprints.map((row) => `<div class="inv-committed-row">
      <span class="inv-committed-icon">${svgIcon('file')}</span>
      <button class="inv-use-name" type="button" data-action="open-fabricator" data-id="${esc(row.bp.id)}">${esc(row.bp.n)}</button>
      <span class="inv-committed-qty">${fmt(row.deposited)} ед. · ${qualityChipHtml(row.quality)}</span>
      <button class="btn btn-quiet btn-xs" type="button" data-action="withdraw-blueprint-deposit" data-bp-id="${esc(row.bp.id)}" data-key="${esc(row.key)}">Вернуть</button>
    </div>`).join('');
    return `
      <div class="inv-modal-hero">
        <div class="resource-detail-media ${getResourceKindClass(profile.kind)}${art ? ' has-image' : ''}">
          ${svgIcon(kind.icon)}
          ${art ? imageTag(art, profile.name, true) : ''}
          ${art ? `<button class="image-zoom-btn" type="button" data-action="open-image" data-src="${esc(art)}" data-alt="${esc(profile.name)}" aria-label="Увеличить изображение ${esc(profile.name)}">${svgIcon('search')}</button>` : ''}
          ${imageEditorButtonHtml(profile.name)}
          ${imageCustomBadgeHtml(profile.name)}
        </div>
        <div class="resource-detail-copy">
          <p class="resource-detail-desc">${esc(description)}</p>
          <div class="resource-detail-badges">
            <span class="badge">${esc(profile.kindLabel)}</span>
            ${material?.rarity ? `<span class="badge">${esc(fabRarityRu(material.rarity))}</span>` : ''}
            ${material?.methodLabel ? `<span class="badge">${esc(material.methodLabel)}</span>` : ''}
            ${profile.contracts.length ? `<span class="badge">${countOf(profile.contracts.length, CONTRACT_FORMS)}</span>` : ''}
            ${blueprints.length ? `<span class="badge">${countOf(blueprints.length, FAB_FORMS)}</span>` : ''}
          </div>
          <div class="inv-modal-stock">
            <span>Свободно на складе · ${fmt(summary.stock)} ед.</span>
            <span class="inv-modal-quality">${summary.stock > 0 ? `Среднее качество ${qualityChipHtml(inventoryQuality(profile.name))}` : 'Партии не заданы'}</span>
          </div>
          ${inventoryLotsPanel(profile.name)}
          <div class="inv-stat-grid">
            <div class="inv-stat"><span>Свободно</span><b>${fmt(summary.stock)} <small>ед.</small></b></div>
            <div class="inv-stat is-committed"><span>Внесено</span><b>${fmt(committed.total)} <small>ед.</small></b></div>
            <div class="inv-stat"><span>Нужно</span><b>${fmt(summary.need)} <small>ед.</small></b></div>
            <div class="inv-stat"><span>Покрытие</span><b>${summary.need > 0 ? `${summary.percent}%` : '—'}</b></div>
          </div>
          <p class="resource-detail-source">«Внесено» — ресурсы, уже добавленные в прогресс контрактов и чертежей. «Нужно сейчас» учитывает активные контракты и чертежи с прогрессом или в избранном.</p>
        </div>
      </div>
      ${obtain ? `<section class="resource-detail-section">
        <h3>Как получить</h3>
        <p class="resource-detail-obtain">${esc(obtain)}</p>
      </section>` : ''}
      ${tips ? `<section class="resource-detail-section resource-detail-tips">
        <h3>Где искать чаще <span>советы сообщества</span></h3>
        <p class="resource-detail-obtain">${esc(tips)}</p>
        ${profile.detail?.tipsSource ? `<p class="resource-detail-source">Источники: ${esc(profile.detail.tipsSource)}</p>` : ''}
      </section>` : ''}
      ${committed.total > 0 ? `<section class="resource-detail-section inv-committed-section">
        <h3>Куда внесено <span>${fmt(committed.total)} ед.</span></h3>
        <div class="inv-committed-list">
          ${committedContractRows}${committedBlueprintRows}
        </div>
      </section>` : ''}
      <section class="resource-detail-section">
        <h3>Нужен в контрактах <span>${countOf(contracts.length, CONTRACT_FORMS)}</span></h3>
        <div class="inv-use-list">${contractRows || '<div class="modal-hint">Этот ресурс не требуется ни в одном контракте Викело.</div>'}</div>
      </section>
      <section class="resource-detail-section">
        <h3>Нужен в чертежах <span>${countOf(blueprints.length, FAB_FORMS)}</span></h3>
        <p class="modal-hint">Сначала показаны чертежи, куда уже внесены материалы или которые добавлены в избранное.</p>
        <div class="inv-use-list${inventoryUsageShowAll ? ' is-scroll' : ''}">${blueprintRows || '<div class="modal-hint">Этот ресурс не используется в чертежах фабрикатора.</div>'}</div>
        ${hiddenCount > 0 ? `<button class="btn btn-outline resource-more-btn" type="button" data-action="toggle-inventory-usage">Показать все (${fmt(sortedBlueprints.length)}) ${svgIcon('chevronDown')}</button>` : ''}
        ${inventoryUsageShowAll && sortedBlueprints.length > 8 ? `<button class="btn btn-quiet resource-more-btn" type="button" data-action="toggle-inventory-usage">Свернуть</button>` : ''}
      </section>
      <a class="wiki-link" href="${esc(wikiUrl)}" target="_blank" rel="noopener">Подробнее на Star Citizen Wiki ${svgIcon('external')}</a>`;
  }

  function openInventoryResourceModal(name, options = {}) {
    const profile = INVENTORY_BY_NAME.get(name);
    if (!profile) return;
    if (inventoryModalName !== name) inventoryUsageShowAll = false;
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusState = options.preserveFocus && active ? {
      role: active.dataset.role || '',
      action: active.dataset.action || '',
      resource: active.dataset.resource || '',
      contractId: active.dataset.contractId || '',
      bpId: active.dataset.bpId || '',
      key: active.dataset.key || '',
      delta: active.dataset.delta || ''
    } : null;
    const previousScroll = options.preserveScroll ? (el.modalLayer.querySelector('.modal-body')?.scrollTop || 0) : 0;
    openModal({
      wide: true,
      kicker: `${profile.kindLabel} · личный склад`,
      title: profile.name,
      body: inventoryResourceModalBody(profile),
      initialFocus: '.modal-close'
    });
    inventoryModalName = name;
    if (previousScroll > 0) {
      requestAnimationFrame(() => {
        const body = el.modalLayer.querySelector('.modal-body');
        if (body) body.scrollTop = previousScroll;
      });
    }
    if (focusState) {
      setTimeout(() => {
        if (!modalOpen || inventoryModalName !== name) return;
        const candidates = [...el.modalLayer.querySelectorAll('[data-role], [data-action]')];
        let target = candidates.find((node) => (
          (node.dataset.role || '') === focusState.role
          && (node.dataset.action || '') === focusState.action
          && (node.dataset.resource || '') === focusState.resource
          && (node.dataset.contractId || '') === focusState.contractId
          && (node.dataset.bpId || '') === focusState.bpId
          && (node.dataset.key || '') === focusState.key
          && (node.dataset.delta || '') === focusState.delta
        ));
        if (!target && focusState.action === 'deposit-inventory-blueprint') {
          target = candidates.find((node) => node.dataset.action === 'withdraw-blueprint-deposit'
            && (node.dataset.bpId || '') === focusState.bpId
            && (node.dataset.key || '') === focusState.key);
        }
        if (!target && focusState.action === 'deposit-inventory-contract') {
          target = candidates.find((node) => node.dataset.action === 'withdraw-contract-deposit'
            && (node.dataset.contractId || '') === focusState.contractId
            && (node.dataset.resource || '') === focusState.resource);
        }
        if (!target) return;
        target.focus({ preventScroll: true });
        if (target instanceof HTMLInputElement && target.type === 'number') {
          try { target.setSelectionRange(target.value.length, target.value.length); } catch (error) { /* number inputs may not support selection */ }
        }
      }, 70);
    }
  }

  function resourceCardHtml(row) {
    const kind = KIND_META[row.kind] || KIND_META.equipment;
    const kindClass = getResourceKindClass(row.kind);
    const art = row.image || resourceImage(row);
    const favorite = resourceFavoriteSet.has(row.name);
    const status = row.craftOnly
      ? 'Только в крафте'
      : row.complete
        ? 'Собрано'
        : row.found > 0
          ? `Собрано ${row.percent}%`
          : `Нужно ${qtyLabel(row.required, row.unit)}`;
    const contractMeta = row.required > 0 ? countOf(row.contracts.length, CONTRACT_FORMS) : '0 контрактов';
    const craftMeta = countOf(row.blueprintCount, FAB_FORMS);
    return `<article class="contract-card resource-card ${kindClass}${row.complete ? ' is-complete' : ''}" style="--cat:var(--kind,var(--accent));--cat-dim:var(--kind-dim,var(--accent-dim))" data-resource-key="${esc(row.key)}" data-action="open-inventory-resource" data-resource="${esc(row.name)}" title="Подробнее о ${esc(row.name)}">
      <div class="card-visual">
        <span class="card-visual-art${art ? '' : ' is-empty'}">${svgIcon(kind.icon)}${art ? imageTag(art, row.name) : ''}</span>
        <div class="card-visual-top">
          <span class="cat-badge" title="${esc(kind.label)}">${svgIcon(kind.icon)}</span>
          <button class="pin-btn${favorite ? ' is-pinned' : ''}" type="button" data-action="toggle-resource-favorite" data-resource="${esc(row.name)}" aria-pressed="${favorite}" aria-label="${favorite ? 'Убрать из избранного' : 'Добавить в избранное'}" title="${favorite ? 'Убрать из избранного' : 'Добавить в избранное'}">${svgIcon('star')}</button>
        </div>
        <div class="card-visual-caption">
          <span class="reward-label">${esc(kind.label)}</span>
          <span class="reward-name">${esc(status)}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-head">
          <div class="card-titles"><h3>${esc(row.name)}</h3></div>
        </div>
        <div class="card-meta">
          <span class="badge badge--cat">${esc(kind.label)}</span>
          ${row.required > 0 ? `<span class="badge">${contractMeta}</span>` : '<span class="badge">Крафт</span>'}
          ${row.blueprintCount ? `<span class="badge">${craftMeta}</span>` : ''}
        </div>
        ${row.required > 0 ? `<div class="card-progress">
          <div class="progress-meta"><span><b>${fmt(row.found)}</b> / ${qtyLabel(row.required, row.unit)}</span><span class="pct">${row.percent}%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width:${row.percent}%"></div></div>
        </div>` : `<div class="resource-card-craft">${svgIcon('blueprint')} <span>В контрактах не требуется · используется в ${craftMeta}</span></div>`}
        <div class="card-foot">
          <span class="card-hint">${row.craftOnly ? 'Только в крафте' : row.complete ? 'Готово к сдаче' : row.found > 0 ? 'В работе' : 'Не начат'}</span>
          <button class="card-open" type="button" data-action="open-inventory-resource" data-resource="${esc(row.name)}">Подробнее ${svgIcon('arrowRight')}</button>
        </div>
      </div>
    </article>`;
  }

  function renderInventorySidebar() {
    const stockCount = inventoryStockCount();
    const freeUnits = inventoryTotalUnits();
    const committedUnits = inventoryCommittedTotal();
    const committedCount = inventoryCommittedPositions();
    const counts = inventoryStatusCounts();
    const totalUnits = freeUnits + committedUnits;
    const freeShare = totalUnits > 0 ? (freeUnits / totalUnits) * 100 : 0;
    const committedShare = totalUnits > 0 ? (committedUnits / totalUnits) * 100 : 0;
    const statusButtons = [
      ['all', 'Все позиции', 'grid', 'var(--accent)', counts.all],
      ['stock', 'Свободно', 'box', 'var(--accent)', counts.stock],
      ['committed', 'Внесено', 'blueprint', 'var(--amber)', counts.committed],
      ['favorites', 'Избранное', 'star', 'var(--amber)', counts.favorites],
      ['needed', 'Нужны сейчас', 'crate', 'var(--violet)', counts.needed]
    ].map(([key, label, icon, color, count]) => `<button class="filter-item${ui.inventoryFilter === key ? ' is-active' : ''}" type="button" data-action="set-inventory-filter" data-filter="${key}" style="--cat:${color}">${svgIcon(icon)}<span>${label}</span><span class="count">${fmt(count)}</span></button>`).join('');
    el.sidebar.innerHTML = `
      <div class="sidebar-card sidebar-card--wide">
        <div class="search-box">
          ${svgIcon('search')}
          <input id="inventory-search" type="search" data-role="inventory-search" value="${esc(ui.inventorySearch)}" placeholder="Поиск по складу" aria-label="Поиск по личному складу: ресурс, контракт или чертёж">
          <span class="search-hint">/</span>
        </div>
      </div>
      <div class="sidebar-card sidebar-card--wide">
        <div class="sidebar-title"><span>Статус</span><span>${fmt(INVENTORY_RESOURCES.length)}</span></div>
        <div class="filter-list">${statusButtons}</div>
      </div>
      <div class="sidebar-card">
        <div class="sidebar-title"><span>Тип и порядок</span>${svgIcon('filter')}</div>
        <div class="field">
          <label for="inventory-kind">Тип ресурса</label>
          <div class="select-wrap">
            <select id="inventory-kind" data-role="inventory-kind">
              ${option('all', `Все типы · ${fmt(INVENTORY_RESOURCES.length)}`, ui.inventoryKind === 'all')}
              ${INVENTORY_KINDS.map((kind) => option(kind, `${KIND_META[kind].label} · ${fmt(INVENTORY_KIND_COUNTS[kind] || 0)}`, ui.inventoryKind === kind)).join('')}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <div class="field">
          <label for="inventory-sort">Сортировка</label>
          <div class="select-wrap">
            <select id="inventory-sort" data-role="inventory-sort">
              ${option('name-asc', 'Название: A → Z', ui.inventorySort === 'name-asc')}
              ${option('stock-desc', 'Свободно: больше', ui.inventorySort === 'stock-desc')}
              ${option('committed-desc', 'Внесено: больше', ui.inventorySort === 'committed-desc')}
              ${option('need-desc', 'Потребность: больше', ui.inventorySort === 'need-desc')}
              ${option('coverage-asc', 'Покрытие: меньше', ui.inventorySort === 'coverage-asc')}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <button class="btn btn-quiet sidebar-reset" type="button" data-action="reset-inventory-filters">${svgIcon('refresh')} Сбросить фильтры</button>
      </div>
      <div class="sidebar-card inv-warehouse-card">
        <div class="sidebar-title"><span>Склад</span>${svgIcon('box')}</div>
        <div class="inv-warehouse-metrics">
          <div class="inv-warehouse-metric">
            <span>Свободно</span>
            <b>${fmt(freeUnits)}</b>
            <small>ед.</small>
          </div>
          <div class="inv-warehouse-metric is-committed">
            <span>Внесено</span>
            <b>${fmt(committedUnits)}</b>
            <small>ед.</small>
          </div>
        </div>
        <div class="inv-warehouse-bar" title="Свободно ${fmt(freeUnits)} ед., внесено ${fmt(committedUnits)} ед.">
          <span class="is-free" style="width:${freeShare}%"></span>
          <span class="is-committed" style="width:${committedShare}%"></span>
        </div>
        <div class="inv-warehouse-meta">
          <span>${fmt(stockCount)} ${plural(stockCount, 'позиция', 'позиции', 'позиций')} свободно</span>
          <span>${fmt(committedCount)} ${plural(committedCount, 'позиция', 'позиции', 'позиций')} внесено</span>
          <span>${fmt(resourceFavoriteSet.size)} ${plural(resourceFavoriteSet.size, 'избранный', 'избранных', 'избранных')}</span>
        </div>
        <button class="btn btn-quiet sidebar-reset inv-clear-btn" type="button" data-action="open-clear-inventory"${stockCount === 0 ? ' disabled' : ''}>${svgIcon('trash')} Очистить свободный склад</button>
      </div>
      <div class="sidebar-note">Свободные ресурсы можно вносить в контракты и чертежи. Внесённые единицы остаются в карточке, пока вы не вернёте их. Для SCU действует пересчёт 1 SCU = 100 ед.</div>`;
  }

  function inventoryCardHtml(row) {
    const profile = row.profile;
    const art = resourceDisplayImage(profile.name);
    const stock = row.stock;
    const committed = row.committed;
    const active = resourceFavoriteSet.has(profile.name);
    const kind = KIND_META[profile.kind] || KIND_META.equipment;
    const kindClass = getResourceKindClass(profile.kind);
    const singleContract = row.activeContracts.length === 1
      ? row.activeContracts[0]
      : row.contracts.length === 1 ? row.contracts[0] : null;
    const singleBlueprint = !singleContract && row.activeBlueprints.length === 1 ? row.activeBlueprints[0] : null;
    let quickAction = '';
    if (stock > 0 && singleContract) {
      const amount = Math.min(contractDepositCapacity(singleContract.order, inventoryLots(profile.name)), singleContract.remaining);
      if (amount > 0) {
        quickAction = `<button class="btn btn-primary btn-xs" type="button" data-action="deposit-inventory-contract" data-resource="${esc(profile.name)}" data-contract-id="${esc(singleContract.contract.id)}">Внести ${contractDepositLabel(amount, singleContract.order)}</button>`;
      }
    }
    if (!quickAction && stock > 0 && singleBlueprint) {
      const top = [...inventoryLots(profile.name)].sort((a, b) => b.q - a.q)[0];
      const amount = top ? Math.min(top.n, singleBlueprint.remaining) : 0;
      if (amount > 0) {
        quickAction = `<button class="btn btn-primary btn-xs" type="button" data-action="deposit-inventory-blueprint" data-resource="${esc(profile.name)}" data-bp-id="${esc(singleBlueprint.bp.id)}" data-key="${esc(singleBlueprint.key)}">Внести Q${top.q}</button>`;
      }
    }
    const contractLabel = row.activeContracts.length > 0
      ? `В работе: <b>${fmt(row.contractUnits)}</b> ед.`
      : row.contracts.length > 0
        ? `Не в работе: <b>${fmt(row.allContractUnits)}</b> ед.`
        : 'В контрактах: нет';
    const blueprintLabel = row.activeBlueprints.length > 0
      ? `В плане: <b>${fmt(row.planUnits)}</b> ед.`
      : row.usedBlueprints > 0 ? `Чертежи: <b>${fmt(row.usedBlueprints)}</b>` : 'Чертежи: нет';
    const metaParts = [profile.kindLabel];
    if (row.contracts.length) metaParts.push(countOf(row.contracts.length, CONTRACT_FORMS));
    if (row.usedBlueprints) metaParts.push(countOf(row.usedBlueprints, FAB_FORMS));
    if (metaParts.length === 1) metaParts.push('не используется');
    const statusText = committed > 0
      ? `Внесено ${fmt(committed)} ед.`
      : stock > 0 ? `Свободно ${fmt(stock)} ед.` : row.need > 0 ? 'Нужен сейчас' : 'Пусто';
    const statusClass = committed > 0 ? 'is-committed' : stock > 0 ? 'is-free' : row.need > 0 ? 'is-needed' : 'is-idle';
    const committedCell = committed > 0
      ? `<button class="inv-qty-cell is-committed" type="button" data-action="open-inventory-resource" data-resource="${esc(profile.name)}" title="Показать, куда внесено"><span>Внесено</span><b>${fmt(committed)} <small>ед.</small></b>${svgIcon('chevronRight')}</button>`
      : `<div class="inv-qty-cell is-committed is-zero"><span>Внесено</span><b>0 <small>ед.</small></b></div>`;
    return `<article class="inv-card ${kindClass}${stock > 0 ? ' has-stock' : ''}${committed > 0 ? ' has-committed' : ''}${active ? ' is-favorite' : ''}" data-inventory-name="${esc(profile.name)}">
      <div class="inv-card-media${art ? '' : ' is-empty'}">
        <span class="inv-media-fallback">${svgIcon(kind.icon)}</span>
        ${art ? imageTag(art, profile.name) : ''}
        <span class="inv-media-scan" aria-hidden="true"></span>
        <button class="inv-media-open" type="button" data-action="open-inventory-resource" data-resource="${esc(profile.name)}" aria-label="Подробнее о ${esc(profile.name)}"></button>
        <div class="inv-media-top">
          <span class="cat-badge" title="${esc(profile.kindLabel)}">${svgIcon(kind.icon)}</span>
          <button class="pin-btn${active ? ' is-pinned' : ''}" type="button" data-action="toggle-resource-favorite" data-resource="${esc(profile.name)}" aria-pressed="${active}" aria-label="${active ? 'Убрать из избранного' : 'Добавить в избранное'}" title="${active ? 'Убрать из избранного' : 'Добавить в избранное'}">${svgIcon('star')}</button>
        </div>
        <span class="inv-status-pill ${statusClass}">${statusText}</span>
        ${art ? `<button class="image-zoom-btn image-zoom-btn--card inv-media-zoom" type="button" data-action="open-image" data-src="${esc(art)}" data-alt="${esc(profile.name)}" aria-label="Увеличить изображение ${esc(profile.name)}">${svgIcon('search')}</button>` : ''}
        ${imageEditorButtonHtml(profile.name, 'image-edit-btn--card')}
      </div>
      <div class="inv-card-body">
        <div class="inv-card-title">
          <button class="inv-name" type="button" data-action="open-inventory-resource" data-resource="${esc(profile.name)}" title="${esc(profile.name)}">${esc(profile.name)}</button>
          <span class="inv-meta">${esc(metaParts.join(' · '))}</span>
        </div>
        <div class="inv-qty-summary">
          <div class="inv-qty-cell"><span>Свободно</span><b>${fmt(stock)} <small>ед.</small></b></div>
          ${committedCell}
        </div>
        <div class="inv-stock-row">
          <span class="inv-stock-label">Мой запас</span>
          ${inventoryStockControls(profile.name)}
        </div>
        <div class="inv-needs">
          <span>${contractLabel}</span>
          <span>${blueprintLabel}</span>
        </div>
        <div class="inv-coverage${row.need > 0 ? '' : ' is-idle'}">
          <div class="progress-track"><div class="progress-fill" style="width:${row.percent}%"></div></div>
          <span>${row.need > 0
            ? `Покрытие ${row.percent}%`
            : row.totalUsage > 0 ? 'Нет активной потребности' : stock > 0 ? 'Сейчас не требуется' : 'Не используется'}</span>
        </div>
        <div class="inv-card-foot">
          <button class="btn btn-outline btn-xs" type="button" data-action="open-inventory-resource" data-resource="${esc(profile.name)}">Где нужен ${svgIcon('arrowRight')}</button>
          ${quickAction}
        </div>
      </div>
    </article>`;
  }

  function inventoryStatusCounts() {
    const counts = {
      all: INVENTORY_RESOURCES.length,
      stock: inventoryStockCount(),
      committed: 0,
      favorites: resourceFavoriteSet.size,
      needed: 0
    };
    for (const profile of INVENTORY_RESOURCES) {
      if (inventoryCommitted(profile.name) > 0) counts.committed += 1;
      const summary = resourceNeedSummary(profile.name);
      if (summary.activeContracts.length > 0 || summary.activeBlueprints.length > 0) counts.needed += 1;
    }
    return counts;
  }

  function renderInventoryView() {
    const rows = inventoryFilteredResources();
    if (rows.length === 0) {
      let empty;
      if (ui.inventorySearch.trim()) {
        empty = emptyState(
          'search',
          'Ничего не найдено',
          'На складе нет ресурсов под этот запрос. Поиск ищет по названию ресурса, контракта и чертежа.',
          `<button class="btn btn-outline" type="button" data-action="reset-inventory-filters">Сбросить поиск</button>`
        );
      } else if (ui.inventoryFilter === 'stock') {
        empty = emptyState(
          'box',
          'Свободный склад пуст',
          'Добавьте количество любого ресурса — и он сразу появится в контрактах и чертежах как доступный для внесения.',
          `<button class="btn btn-primary" type="button" data-action="set-inventory-filter" data-filter="all">Показать все ресурсы</button>`
        );
      } else if (ui.inventoryFilter === 'committed') {
        empty = emptyState(
          'blueprint',
          'Пока ничего не внесено',
          'Внесённые ресурсы появятся здесь с указанием контракта или чертежа. Используйте «Внести» в чек-листе или рецепте.',
          `<button class="btn btn-outline" type="button" data-action="set-inventory-filter" data-filter="all">Показать все ресурсы</button>`
        );
      } else if (ui.inventoryFilter === 'favorites') {
        empty = emptyState(
          'star',
          'Избранных ресурсов нет',
          'Отмечайте звёздочкой ресурсы, которые часто нужны или которые вы хотите держать на виду.',
          `<button class="btn btn-outline" type="button" data-action="set-inventory-filter" data-filter="all">Показать все</button>`
        );
      } else {
        empty = emptyState(
          'crate',
          'Нет подходящих ресурсов',
          'Измените фильтр или сбросьте настройки склада.',
          `<button class="btn btn-outline" type="button" data-action="reset-inventory-filters">Сбросить фильтры</button>`
        );
      }
      el.viewRoot.innerHTML = empty;
      el.resultCount.textContent = countOf(0, RESOURCE_FORMS);
      return;
    }
    const shownRows = rows.slice(0, ui.inventoryShown);
    const more = rows.length - shownRows.length;
    const moreHtml = more > 0
      ? `<div class="inv-more-wrap"><button class="btn btn-outline" type="button" data-action="show-more-inventory">Показать ещё ${fmt(Math.min(INV_PAGE_SIZE, more))}</button><span>Показано ${fmt(shownRows.length)} из ${fmt(rows.length)}</span></div>`
      : '';
    el.viewRoot.innerHTML = `<div class="inv-grid">${shownRows.map(inventoryCardHtml).join('')}</div>` + moreHtml;
    el.resultCount.textContent = `${fmt(rows.length)} из ${fmt(INVENTORY_RESOURCES.length)} ${plural(INVENTORY_RESOURCES.length, RESOURCE_FORMS[0], RESOURCE_FORMS[1], RESOURCE_FORMS[2])}`;
  }

  function showMoreInventory() {
    if (ui.tab !== 'inventory') return;
    const total = inventoryFilteredResources().length;
    if (ui.inventoryShown >= total) return;
    ui.inventoryShown = Math.min(total, ui.inventoryShown + INV_PAGE_SIZE);
    saveUiSoon();
    renderView();
    updateContentHead();
  }

  function renderResourcesView() {
    const data = aggregateResources();
    if (data.rows.length === 0) {
      if (data.scope === 'active' && data.includedContracts === 0 && data.includedBlueprints === 0) {
        el.viewRoot.innerHTML = emptyState(
          'crate',
          'Нет избранных и активных ресурсов',
          'Добавьте ресурс в избранное или начните контракт либо чертёж — и здесь появится сводный список того, что важно сейчас.',
          `<button class="btn btn-primary" type="button" data-action="switch-tab" data-tab="contracts">К контрактам</button><button class="btn btn-outline" type="button" data-action="set-resource-scope" data-scope="all">Показать все ресурсы</button>`
        );
      } else if (ui.resourceSearch.trim()) {
        el.viewRoot.innerHTML = emptyState(
          'search',
          'Ничего не найдено',
          'В сводном списке нет ресурсов, подходящих под запрос. Попробуйте изменить поиск.',
          `<button class="btn btn-outline" type="button" data-action="reset-resource-filters">Сбросить поиск</button>`
        );
      } else if (ui.resourceHideDone && data.totalResources > 0 && data.completeResources === data.totalResources) {
        el.viewRoot.innerHTML = emptyState(
          'trophy',
          'Всё собрано',
          'По выбранным контрактам не осталось ресурсов. Можно показать уже собранные позиции или перейти к другим контрактам.',
          `<button class="btn btn-outline" type="button" data-action="show-completed-resources">Показать собранное</button><button class="btn btn-primary" type="button" data-action="switch-tab" data-tab="contracts">К контрактам</button>`,
          'empty--celebrate'
        );
      } else {
        el.viewRoot.innerHTML = emptyState(
          'crate',
          'Нет ресурсов для отображения',
          'Измените фильтры или выберите другую область: все ресурсы, Викело или избранные / в работе.',
          `<button class="btn btn-outline" type="button" data-action="reset-resource-filters">Сбросить фильтры</button>`
        );
      }
      el.resultCount.textContent = countOf(0, RESOURCE_FORMS);
      return;
    }
    el.viewRoot.innerHTML = `<div class="resource-grid">${data.rows.map(resourceCardHtml).join('')}</div>`;
    el.resultCount.textContent = countOf(data.rows.length, RESOURCE_FORMS);
  }

  function updateResultCount(text) {
    el.resultCount.textContent = text;
  }

  const option = (value, label, selected) => `<option value="${esc(value)}"${selected ? ' selected' : ''}>${esc(label)}</option>`;

  function sourceNoteHtml(extraLabel = '') {
    const meta = DATA.meta || {};
    return `<div class="sidebar-card sidebar-card--wide source-card">
      <div class="sidebar-title"><span>Источник данных</span>${svgIcon('info')}</div>
      <div class="source-note">
        <a href="${esc(meta.source || 'https://starcitizen.tools/Wikelo')}" target="_blank" rel="noopener">Star Citizen Wiki · Wikelo${esc(extraLabel)} ↗</a>
        <span class="snap">Снимок ${fmtDate(meta.fetchedAt)} · ${esc(meta.gameVersion || '—')}</span>
      </div>
    </div>`;
  }

  function renderContractSidebar() {
    const categories = [`<button class="filter-item${ui.category === 'all' ? ' is-active' : ''}" type="button" data-action="set-category" data-category="all" style="--cat:var(--accent)">${svgIcon('grid')}<span>Все контракты</span><span class="count">${fmt(TOTAL_CONTRACTS)}</span></button>`]
      .concat(CATEGORY_ORDER.map((key) => {
        const meta = CATEGORY_META[key];
        return `<button class="filter-item cat-${key}${ui.category === key ? ' is-active' : ''}" type="button" data-action="set-category" data-category="${key}">${svgIcon(meta.icon)}<span>${esc(meta.label)}</span><span class="count">${fmt(CATEGORY_COUNTS[key] || 0)}</span></button>`;
      })).join('');

    el.sidebar.innerHTML = `
      <div class="sidebar-card sidebar-card--wide">
        <div class="search-box">
          ${svgIcon('search')}
          <input id="contract-search" type="search" data-role="contract-search" value="${esc(ui.contractSearch)}" placeholder="Контракт, награда, ресурс" aria-label="Поиск контрактов">
          <span class="search-hint">/</span>
        </div>
      </div>
      <div class="sidebar-card sidebar-card--wide">
        <div class="sidebar-title"><span>Категории</span><span>${fmt(TOTAL_CONTRACTS)}</span></div>
        <div class="filter-list">${categories}</div>
      </div>
      <div class="sidebar-card">
        <div class="sidebar-title"><span>Фильтры</span>${svgIcon('filter')}</div>
        <div class="field">
          <label for="rep-filter">Репутация</label>
          <div class="select-wrap">
            <select id="rep-filter" data-role="rep-filter">
              ${option('all', 'Любая', ui.reputation === 'all')}
              ${option('none', 'Без требований', ui.reputation === 'none')}
              ${option('very-good', 'Very Good Customer', ui.reputation === 'very-good')}
              ${option('very-best', 'Very Best Customer', ui.reputation === 'very-best')}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <div class="field">
          <label for="status-filter">Статус</label>
          <div class="select-wrap">
            <select id="status-filter" data-role="status-filter">
              ${option('all', 'Все статусы', ui.status === 'all')}
              ${option('active', 'В работе', ui.status === 'active')}
              ${option('not-started', 'Не начатые', ui.status === 'not-started')}
              ${option('in-progress', 'В процессе', ui.status === 'in-progress')}
              ${option('done', 'Завершённые', ui.status === 'done')}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <label class="toggle"><input type="checkbox" data-role="pinned-only"${ui.pinnedOnly ? ' checked' : ''}> Только закреплённые</label>
        <div class="field">
          <label for="contract-sort">Сортировка</label>
          <div class="select-wrap">
            <select id="contract-sort" data-role="contract-sort">
              ${option('name-asc', 'Название: A → Z', ui.contractSort === 'name-asc')}
              ${option('name-desc', 'Название: Z → A', ui.contractSort === 'name-desc')}
              ${option('progress-desc', 'Прогресс: больше', ui.contractSort === 'progress-desc')}
              ${option('progress-asc', 'Прогресс: меньше', ui.contractSort === 'progress-asc')}
              ${option('requirements-desc', 'Ресурсов: больше', ui.contractSort === 'requirements-desc')}
              ${option('requirements-asc', 'Ресурсов: меньше', ui.contractSort === 'requirements-asc')}
              ${option('category', 'По категории', ui.contractSort === 'category')}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <button class="btn btn-quiet sidebar-reset" type="button" data-action="reset-contract-filters">${svgIcon('refresh')} Сбросить фильтры</button>
      </div>
      ${sourceNoteHtml()}`;
  }

  function renderResourceSidebar() {
    const allCount = INVENTORY_RESOURCES.length;
    const wikeloCount = INVENTORY_RESOURCES.filter((profile) => profile.contracts.length > 0).length;
    const activeCount = INVENTORY_RESOURCES.filter(resourceProfileIsActive).length;
    const scopeButtons = [
      ['all', 'Все ресурсы', 'crate', 'var(--accent)', allCount],
      ['wikelo', 'Викело', 'grid', 'var(--violet)', wikeloCount],
      ['active', 'Избранные / в работе', 'star', 'var(--amber)', activeCount]
    ].map(([key, label, icon, color, count]) => `<button class="filter-item${ui.resourceScope === key ? ' is-active' : ''}" type="button" data-action="set-resource-scope" data-scope="${key}" style="--cat:${color}">${svgIcon(icon)}<span>${label}</span><span class="count">${fmt(count)}</span></button>`).join('');
    el.sidebar.innerHTML = `
      <div class="sidebar-card sidebar-card--wide">
        <div class="search-box">
          ${svgIcon('search')}
          <input id="resource-search" type="search" data-role="resource-search" value="${esc(ui.resourceSearch)}" placeholder="Ресурс, контракт или чертёж" aria-label="Поиск ресурсов по контрактам и крафтам">
          <span class="search-hint">/</span>
        </div>
      </div>
      <div class="sidebar-card sidebar-card--wide">
        <div class="sidebar-title"><span>Что показать</span><span>${fmt(allCount)}</span></div>
        <div class="filter-list">${scopeButtons}</div>
        <label class="toggle"><input type="checkbox" data-role="resource-hide-done"${ui.resourceHideDone ? ' checked' : ''}> Скрыть собранные контракты</label>
      </div>
      <div class="sidebar-card">
        <div class="sidebar-title"><span>Сортировка</span>${svgIcon('refresh')}</div>
        <div class="field">
          <label for="resource-sort">Порядок</label>
          <div class="select-wrap">
            <select id="resource-sort" data-role="resource-sort">
              ${option('name-asc', 'Название: A → Z', ui.resourceSort === 'name-asc')}
              ${option('remaining-desc', 'Остаток: больше', ui.resourceSort === 'remaining-desc')}
              ${option('required-desc', 'Нужно: больше', ui.resourceSort === 'required-desc')}
              ${option('contracts-desc', 'Контрактов: больше', ui.resourceSort === 'contracts-desc')}
              ${option('blueprints-desc', 'Чертежей: больше', ui.resourceSort === 'blueprints-desc')}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <button class="btn btn-quiet sidebar-reset" type="button" data-action="reset-resource-filters">${svgIcon('refresh')} Сбросить фильтры</button>
      </div>
      ${sourceNoteHtml(' + Item Fabricator')}
      <div class="sidebar-note">«Все ресурсы» — 125 позиций из контрактов Викело и всех рецептов фабрикатора. «Викело» оставляет только ресурсы контрактов. «Избранные / в работе» — избранные ресурсы и всё, что нужно активным контрактам и чертежам.</div>`;
  }

  function fabMissionPreText(pre) {
    return (pre || []).map(([count, titles]) => {
      const list = (titles || []).map((title) => esc(title)).join(' или ');
      if (!list) return '';
      return Number(count) > 1 ? `${fmt(count)} из: ${list}` : list;
    }).filter(Boolean).join('; ');
  }

  function fabMissionHtml(row) {
    const mission = row.mission;
    const badges = [];
    if (mission.k) badges.push(`<span class="badge">${esc(fabMissionTypeLabel(mission.k))}</span>`);
    if (mission.f) badges.push(`<span class="badge">${esc(mission.f)}</span>`);
    for (const system of mission.s || []) badges.push(`<span class="badge badge--sys">${esc(system)}</span>`);
    if (mission.r) badges.push(`<span class="badge badge--rep">${svgIcon('star')} ${esc(mission.r)}${mission.rp ? ` · ${fmt(mission.rp)}` : ''}</span>`);
    if (mission.rx && mission.rx !== mission.r) badges.push(`<span class="badge">до ${esc(mission.rx)}</span>`);
    if (mission.il) badges.push('<span class="badge badge--warn">Нелегальная</span>');
    if (Number(mission.pl) > 1) badges.push(`<span class="badge">Группа ${fmt(mission.pl)}</span>`);
    if (mission.once) badges.push('<span class="badge">Одноразовая</span>');
    if (Number(mission.n) > 1) badges.push(`<span class="badge">Вариантов: ${fmt(mission.n)}</span>`);
    const odds = row.pool > 1 ? `1 из ${fmt(row.pool)}` : 'Гарантированно';
    const chance = row.chance < 1 ? ` · ${Math.round(row.chance * 100)}% шанс пула` : '';
    const giver = mission.g && mission.g !== mission.f ? `<div class="fab-mission-extra">Выдаёт: ${esc(mission.g)}</div>` : '';
    const places = (mission.p || []).length
      ? `<div class="fab-mission-extra">Локации: ${esc(mission.p.slice(0, 5).join(', '))}${mission.p.length > 5 ? ` +${mission.p.length - 5}` : ''}</div>`
      : '';
    const pre = fabMissionPreText(mission.pre);
    return `<li class="fab-mission">
      <div class="fab-mission-head">
        <b>${esc(mission.t)}</b>
        <span class="fab-odds${row.pool === 1 ? ' is-good' : ''}">${odds}${chance}</span>
      </div>
      <div class="fab-mission-meta">${badges.join('')}</div>
      ${giver}${places}
      ${pre ? `<div class="fab-mission-pre">${svgIcon('info')} Сначала: ${pre}</div>` : ''}
    </li>`;
  }

  function fabCardHtml(bp) {
    const category = fabCategoryMeta(bp.c);
    const typeLabel = fabTypeLabel(bp.t);
    const sourceKey = fabSourceKey(bp);
    const ingredients = fabAggregateIngredients(bp);
    const craft = blueprintStats(bp);
    const shown = ingredients.slice(0, 3);
    const more = ingredients.length - shown.length;
    const showCategory = category.label !== typeLabel;
    const favorite = favoriteSet.has(bp.id);
    return `<article class="contract-card fab-card cat-${esc(bp.c)}${favorite ? ' is-favorite' : ''}" data-fab-id="${esc(bp.id)}" data-action="open-fabricator" data-id="${esc(bp.id)}">
      <div class="card-visual">
        <span class="card-visual-art${bp.img ? '' : ' is-empty'}">${svgIcon(category.icon)}${bp.img ? imageTag(bp.img, bp.n) : ''}</span>
        <div class="card-visual-top">
          <span class="cat-badge" title="${esc(category.label)}">${svgIcon(category.icon)}</span>
          <button class="pin-btn${favorite ? ' is-pinned' : ''}" type="button" data-action="toggle-fab-favorite" data-id="${esc(bp.id)}" aria-pressed="${favorite}" aria-label="${favorite ? 'Убрать из избранного' : 'Добавить в избранное'}" title="${favorite ? 'Убрать из избранного' : 'Добавить в избранное'}">${svgIcon('star')}</button>
        </div>
        <div class="card-visual-caption">
          <span class="reward-label">${esc(typeLabel)}</span>
          <span class="reward-name">${esc(fabSourceLabel(bp))}</span>
        </div>
        ${bp.img ? `<button class="image-zoom-btn image-zoom-btn--card" type="button" data-action="open-image" data-src="${esc(bp.img)}" data-alt="${esc(bp.n)}" aria-label="Увеличить изображение ${esc(bp.n)}">${svgIcon('search')}</button>` : ''}
      </div>
      <div class="card-body">
        <div class="card-head">
          <div class="card-titles"><h3>${esc(bp.n)}</h3></div>
        </div>
        <div class="card-meta">
          <span class="badge badge--cat">${esc(showCategory ? category.label : typeLabel)}</span>
          <span class="badge">${svgIcon('clock')} ${esc(fabCraftTime(bp.ct))}</span>
          ${craft.available > 0 ? `<span class="badge fab-stock-chip" title="Можно внести из личного склада">${svgIcon('box')} ${fmt(craft.available)} ед.</span>` : ''}
        </div>
        <div class="fab-mats">
          ${shown.map((row) => `<span class="fab-mat"><span>${esc(row.name)}</span><b>${fabQtyLabel(row.qty, row.unit)}</b></span>`).join('')}
          ${more > 0 ? `<span class="fab-mat fab-mat--more">+${fmt(more)} ${plural(more, RESOURCE_FORMS[0], RESOURCE_FORMS[1], RESOURCE_FORMS[2])}</span>` : ''}
        </div>
        ${craft.progress > 0 ? `<div class="card-progress"><div class="progress-meta"><span>Собрано для крафта</span><span class="pct">${craft.percent}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${craft.percent}%"></div></div></div>` : ''}
        <div class="card-foot">
          <span class="card-hint">${countOf(ingredients.length, RESOURCE_FORMS)}</span>
          <button class="card-open fab-open" type="button" aria-label="Открыть рецепт ${esc(bp.n)}">Рецепт и чертёж ${svgIcon('arrowRight')}</button>
        </div>
      </div>
    </article>`;
  }

  function fabResourceCardHtml(row) {
    const kindKey = fabResourceKind(row.name);
    const kind = KIND_META[kindKey] || KIND_META.ore;
    const material = fabMaterial(row.name) || row;
    const art = resourceDisplayImage(row.name);
    const percent = FAB_TOTAL > 0 ? Math.round((row.count / FAB_TOTAL) * 100) : 0;
    const best = fabMaterialBest(row.name);
    const bestText = best
      ? `${best.body}${Number.isFinite(Number(best.spawn)) ? ` · ${fmt(best.spawn)}%` : ''}`
      : 'нет подтверждённых точек';
    return `<article class="contract-card fab-resource-card ${getResourceKindClass(kindKey)}" style="--cat:var(--kind,var(--accent));--cat-dim:var(--kind-dim,var(--accent-dim))" data-action="open-fab-material" data-resource="${esc(row.name)}" title="Подробнее о добыче ${esc(row.name)}">
      <div class="card-visual">
        <span class="card-visual-art${art ? '' : ' is-empty'}">${svgIcon(kind.icon)}${art ? imageTag(art, row.name) : ''}</span>
        <div class="card-visual-top">
          <span class="cat-badge" title="${esc(material.kindLabel || kind.label)}">${svgIcon(kind.icon)}</span>
          <span class="badge fab-resource-count-badge">${countOf(row.count, FAB_FORMS)}</span>
        </div>
        <div class="card-visual-caption">
          <span class="reward-label">${esc(material.kindLabel || kind.label)}</span>
          <span class="reward-name">${esc(material.methodLabel || 'Добыча')}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-head">
          <div class="card-titles"><h3>${esc(row.name)}</h3></div>
        </div>
        <div class="card-meta">
          <span class="badge badge--cat">${esc(material.kindLabel || kind.label)}</span>
          ${material.rarity ? `<span class="badge">${esc(fabRarityRu(material.rarity))}</span>` : ''}
          <span class="badge">${fmt(row.missionCount)} с миссией</span>
        </div>
        <div class="card-progress">
          <div class="progress-meta"><span>Используется в рецептах</span><span class="pct">${percent}%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
        </div>
        <p class="fab-resource-best"><span>Чаще</span><b>${esc(bestText)}</b></p>
        <div class="card-foot">
          <span class="card-hint">${row.missionCount ? countOf(row.missionCount, ['миссия', 'миссии', 'миссий']) : 'Только крафт'}</span>
          <button class="card-open" type="button" data-action="filter-fabricator-resource" data-resource="${esc(row.name)}">Чертежи ${svgIcon('arrowRight')}</button>
        </div>
      </div>
    </article>`;
  }

  function fabFilteredResources() {
    const query = norm(ui.fabricatorSearch.trim());
    const rank = (row) => {
      if (!query) return 0;
      const name = norm(row.name);
      if (name === query) return 0;
      if (name.startsWith(query)) return 1;
      if (name.includes(query)) return 2;
      return 3;
    };
    return FAB_RESOURCE_ROWS
      .filter((row) => !query || (INVENTORY_SEARCH_INDEX.get(row.name) || '').includes(query))
      .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  }

  function renderFabricatorMaterials() {
    const rows = fabFilteredResources();
    if (!rows.length) {
      el.viewRoot.innerHTML = emptyState(
        'search',
        'Материалы не найдены',
        'Попробуйте изменить запрос. Поиск ищет по названию материала и чертежам, в которых он используется.',
        `<button class="btn btn-outline" type="button" data-action="reset-fabricator-filters">Сбросить поиск</button>`
      );
      el.resultCount.textContent = countOf(0, RESOURCE_FORMS);
      return;
    }
    el.viewRoot.innerHTML = `<div class="fab-resource-grid">${rows.map(fabResourceCardHtml).join('')}</div>`;
    el.resultCount.textContent = countOf(rows.length, RESOURCE_FORMS);
  }

  function renderFabricatorView() {
    if (!FAB_TOTAL) {
      el.viewRoot.innerHTML = emptyState(
        'blueprint',
        'Данные фабрикатора не загружены',
        'Проверьте, что файл fabricator-data.js находится рядом с index.html и подключён перед app.js.',
        `<button class="btn btn-outline" type="button" data-action="switch-tab" data-tab="contracts">К контрактам</button>`
      );
      el.resultCount.textContent = countOf(0, FAB_FORMS);
      return;
    }
    if (ui.fabricatorMode === 'materials') {
      renderFabricatorMaterials();
      return;
    }
    const list = fabSortBlueprints(fabFilteredBlueprints());
    const shown = Math.min(ui.fabricatorShown, list.length);
    const cards = list.slice(0, shown).map(fabCardHtml).join('');
    const more = list.length - shown;
    const empty = emptyState(
      'search',
      'Ничего не найдено',
      'Попробуйте изменить запрос или сбросить фильтры. Поиск ищет по названию чертежа, типу, ресурсам и миссиям.',
      `<button class="btn btn-outline" type="button" data-action="reset-fabricator-filters">Сбросить фильтры</button>`
    );
    el.viewRoot.innerHTML =
      (list.length ? `<div class="fab-grid">${cards}</div>` : empty) +
      (more > 0 ? `<div class="fab-more-wrap"><button class="btn btn-outline" type="button" data-action="show-more-fabricator">Показать ещё ${fmt(Math.min(FAB_PAGE_SIZE, more))}</button><span>${fmt(shown)} из ${fmt(list.length)}</span></div>` : '');
    el.resultCount.textContent = countOf(list.length, FAB_FORMS);
  }

  function fabDrawerHtml(bp) {
    const category = fabCategoryMeta(bp.c);
    const sourceKey = fabSourceKey(bp);
    const ingredients = fabAggregateIngredients(bp);
    const craft = blueprintStats(bp);
    const missionRows = fabMissionRows(bp);
    const totalRows = craft.rows.map((row) => {
      const material = fabMaterial(row.name);
      const art = resourceDisplayImage(row.name);
      const topLot = [...row.stockLots].sort((a, b) => b.q - a.q)[0];
      const amount = topLot ? Math.min(topLot.n, row.remaining) : 0;
      return `<div class="fab-total-item${row.remaining <= 0 ? ' is-ready' : ''}" data-deposit-scope>
        <button class="fab-total-row" type="button" data-action="open-fab-material" data-resource="${esc(row.name)}" aria-label="Где добыть ${esc(row.name)}">
          <span class="fab-total-name">
            <span class="fab-total-thumb">${svgIcon('ore')}${art ? imageTag(art, row.name) : ''}</span>
            <span>${esc(row.name)}</span>
          </span>
          <span class="fab-total-parts">${row.parts.map((part) => esc(part)).join(', ')}</span>
          <b>${fabQtyLabel(row.qty, row.unit)}</b>
          <span class="fab-total-arrow">${svgIcon('chevronRight')}</span>
        </button>
        <div class="fab-total-hint">${esc(fabMaterialHint(row.name))}</div>
        <div class="fab-total-stock">
          <div class="fab-total-stockline${row.stock > 0 ? ' has-stock' : ''}">${svgIcon('box')} ${row.stock > 0 ? `На складе: ${fmt(row.stock)} ед.` : 'Нет на складе'}</div>
          ${row.stockLots.length ? `<div class="fab-total-lots">${qualityLotsChips(row.stockLots)}</div>` : ''}
          ${row.deposited > 0 ? `<span class="fab-total-progress">Внесено ${fmt(row.deposited)} ед. · Q${fmt(row.quality)}${row.remaining > 0 ? ` из ${fmt(row.required)}` : ''}</span>` : ''}
          <div class="fab-total-actions">
            ${amount > 0 ? `${qualitySelectHtml(row.name, { label: 'Партия' })}<button class="btn btn-primary btn-xs" type="button" data-action="deposit-inventory-blueprint" data-resource="${esc(row.name)}" data-bp-id="${esc(bp.id)}" data-key="${esc(row.key)}">Внести</button>` : ''}
            ${row.deposited > 0 ? `<button class="btn btn-quiet btn-xs" type="button" data-action="withdraw-blueprint-deposit" data-bp-id="${esc(bp.id)}" data-key="${esc(row.key)}">Вернуть ${fmt(row.deposited)} ед. · Q${fmt(row.quality)}</button>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');
    const craftProgressHtml = `<div class="fab-drawer-progress">
      <div class="progress-meta"><span>Собрано для крафта</span><span class="pct">${fmt(craft.progress)} / ${fmt(craft.required)} ед. · ${craft.percent}%</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${craft.percent}%"></div></div>
      <div class="fab-drawer-actions">
        ${craft.available > 0 ? `<button class="btn btn-primary" type="button" data-action="deposit-all-blueprint" data-id="${esc(bp.id)}">${svgIcon('box')} Внести всё со склада · ${fmt(craft.available)} ед.</button>` : ''}
        ${craft.deposited > 0 ? `<button class="btn btn-quiet" type="button" data-action="withdraw-all-blueprint" data-id="${esc(bp.id)}">Вернуть всё · ${fmt(craft.deposited)} ед.</button>` : ''}
      </div>
    </div>`;
    const partRows = (bp.parts || []).filter(([, rows]) => (rows || []).length).map(([part, rows]) => `<div class="fab-part">
      <div class="fab-part-head"><span>${esc(part)}</span><span>${countOf(rows.length, RESOURCE_FORMS)}</span></div>
      <div class="fab-part-rows">${rows.map(([name, qty, unit]) => `<button class="fab-ing fab-ing--link" type="button" data-action="open-fab-material" data-resource="${esc(name)}" aria-label="Где добыть ${esc(name)}"><span>${esc(name)}</span><b>${fabQtyLabel(qty, unit)}</b>${svgIcon('chevronRight')}</button>`).join('')}</div>
    </div>`).join('');
    const specs = Array.isArray(bp.specs) ? bp.specs : [];
    const specsHtml = specs.map(([label, value]) => `<div class="info-cell"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('');
    const descriptionHtml = bp.desc ? `<section class="drawer-section fab-about">
      <h3>О предмете <span>${esc(bp.man || 'Star Citizen')}</span></h3>
      <p class="fab-item-desc">${esc(bp.desc)}</p>
      <p class="fab-item-desc-src">${bp.descRu ? 'Машинный перевод описания Star Citizen Wiki (EN → RU); названия предметов, производителей и мест оставлены на английском.' : 'Оригинал описания Star Citizen Wiki (EN).'}</p>
    </section>` : '';
    let how;
    if (sourceKey === 'default') {
      how = `<div class="fab-source-empty is-default">${svgIcon('check')}<div><b>Базовый чертёж.</b><p>Доступен всем с начала игры, отдельная миссия не требуется.</p></div></div>`;
    } else if (sourceKey === 'none') {
      how = `<div class="fab-source-empty is-missing">${svgIcon('alert')}<div><b>Источник не найден.</b><p>В файлах игры Alpha 4.10.2 нет миссии, которая выдаёт этот чертёж. Он может быть событийным, магазинным или ещё не добавленным — маршрут не придумываем.</p></div></div>`;
    } else {
      how = `<p class="fab-how-note">Всего источников: ${fmt(missionRows.length)}. «1 из N» — один случайный чертёж из пула; если указан процент, это шанс выпадения самого пула.</p>
        <ol class="fab-mission-list">${missionRows.map(fabMissionHtml).join('')}</ol>`;
    }
    const sourceSummary = sourceKey === 'mission'
      ? countOf(missionRows.length, ['миссия', 'миссии', 'миссий'])
      : sourceKey === 'default' ? 'базовый' : 'не найден';
    const typeLabel = fabTypeLabel(bp.t);
    const showType = typeLabel !== category.label;
    const wikiUrl = `https://starcitizen.tools/index.php?search=${encodeURIComponent(bp.n)}`;
    return `
      <button class="btn btn-icon drawer-close" type="button" data-action="close-drawer" aria-label="Закрыть карточку">${svgIcon('close')}</button>
      <div class="drawer-head">
        <div class="drawer-breadcrumb">Фабрикатор / ${esc(category.label)}</div>
        <div class="drawer-title-row">
          <div class="drawer-art drawer-art--bp cat-${esc(bp.c)}">
            ${svgIcon(category.icon)}
            ${bp.img ? imageTag(bp.img, bp.n, true) : ''}
            ${bp.img ? `<button class="image-zoom-btn" type="button" data-action="open-image" data-src="${esc(bp.img)}" data-alt="${esc(bp.n)}" aria-label="Увеличить изображение ${esc(bp.n)}">${svgIcon('search')}</button>` : ''}
          </div>
          <div class="drawer-title-main">
            <h2 id="drawer-title">${esc(bp.n)}</h2>
            <div class="drawer-badges">
              <span class="badge badge--cat">${esc(category.label)}</span>
              ${showType ? `<span class="badge">${esc(typeLabel)}</span>` : ''}
              <span class="badge fab-badge--${sourceKey}">${esc(fabSourceLabel(bp))}</span>
              <span class="badge">${svgIcon('clock')} ${esc(fabCraftTime(bp.ct))}</span>
            </div>
            <button class="btn btn-quiet fab-fav-drawer${favoriteSet.has(bp.id) ? ' is-fav' : ''}" type="button" data-action="toggle-fab-favorite" data-id="${esc(bp.id)}" aria-pressed="${favoriteSet.has(bp.id)}" aria-label="${favoriteSet.has(bp.id) ? 'Убрать из избранного' : 'Добавить в избранное'}">${svgIcon('star')} <span class="fab-fav-label">${favoriteSet.has(bp.id) ? 'В избранном' : 'В избранное'}</span></button>
          </div>
        </div>
      </div>
      <div class="drawer-body">
        ${descriptionHtml}
        ${blueprintComparisonHtml(bp)}
        <section class="drawer-section">
          <h3>Характеристики <span>${countOf(specs.length, ['параметр', 'параметра', 'параметров'])}</span></h3>
          ${specs.length ? `<div class="info-grid info-grid--specs">${specsHtml}</div>` : '<div class="modal-hint">Подтверждённых характеристик в Wiki API нет.</div>'}
          <p class="fab-item-desc-src">Источник: Star Citizen Wiki API ${esc(FAB_DATA.meta?.itemVersion || '4.10.2')}.</p>
        </section>
        <section class="drawer-section">
          <h3>Материалы <span>${craft.progress > 0 ? `${craft.percent}% · ` : ''}${esc(fabQtySummary(ingredients))}</span></h3>
          <p class="fab-how-note">Количество указано в единицах: 1 SCU = 100 ед., округление вверх. Кнопка «Внести» списывает материал со склада в прогресс чертежа; «Вернуть» возвращает его обратно.</p>
          ${craftProgressHtml}
          <div class="fab-total-list">${totalRows}</div>
          <div class="fab-parts">${partRows}</div>
        </section>
        ${qualityForecastHtml(bp)}
        <section class="drawer-section">
          <h3>Как открывается чертёж <span>${esc(sourceSummary)}</span></h3>
          ${how}
        </section>
        <section class="drawer-section">
          <h3>Чертёж</h3>
          <div class="info-grid">
            <div class="info-cell"><dt>Категория</dt><dd>${esc(category.label)}</dd></div>
            <div class="info-cell"><dt>Тип</dt><dd>${esc(fabTypeLabel(bp.t))}</dd></div>
            <div class="info-cell"><dt>Время крафта</dt><dd>${esc(fabCraftTime(bp.ct))}</dd></div>
            <div class="info-cell"><dt>Источник</dt><dd>${esc(fabSourceLabel(bp))}</dd></div>
            <div class="info-cell info-cell--wide"><dt>ID чертежа</dt><dd class="mono">${esc(bp.id)}</dd></div>
          </div>
          <a class="wiki-link" href="${esc(wikiUrl)}" target="_blank" rel="noopener">Найти на Star Citizen Wiki ${svgIcon('external')}</a>
        </section>
        <div class="fab-drawer-source">Данные: Jokers Gambit / игровые файлы ${esc(FAB_DATA.meta?.gameVersion || 'Alpha 4.10.2')}; рецепты и характеристики сверены с Star Citizen Wiki API ${esc(FAB_DATA.meta?.itemVersion || '4.10.2')}; описания переведены на русский, имена предметов, производителей и мест сохранены на английском; таблицы добычи — starcitizen.tools. Изображения: ${fmt(FAB_DATA.meta?.counts?.images || 0)} из ${fmt(FAB_TOTAL)}; для остальных Wiki не публикует изображение. ${fmt(FAB_NO_SOURCE_TOTAL)} чертежей без миссионного источника.</div>
      </div>`;
  }

  function openFabMaterialModal(name) {
    const material = fabMaterial(name);
    if (!material) return;
    const usage = FAB_RESOURCE_USAGE.get(name) || { name, count: 0, missionCount: 0, defaultCount: 0, examples: [] };
    const kindKey = fabResourceKind(name);
    const kind = KIND_META[kindKey] || KIND_META.ore;
    const art = resourceDisplayImage(name);
    const percent = FAB_TOTAL > 0 ? Math.round((usage.count / FAB_TOTAL) * 100) : 0;
    const rows = (material.top || []).slice(0, 10);
    const best = rows.find((row) => Number.isFinite(Number(row.spawn))) || rows[0] || null;
    const locationRows = rows.map((row) => `<div class="resource-mine-row">
      <span class="resource-mine-place"><b>${esc(row.body)}</b><span>${esc(fabSystemRu(row.system))} · ${esc(fabMineTypeRu(row.type))}</span></span>
      <span class="resource-mine-spawn">${Number.isFinite(Number(row.spawn)) ? `${fmt(row.spawn)}%` : '—'}</span>
      <span class="resource-mine-quality">${esc(row.quality || '—')}</span>
    </div>`).join('');
    const used = FAB_BLUEPRINTS.filter((bp) => (bp.parts || []).some(([, list]) => (list || []).some(([resource]) => resource === name))).slice(0, 6);
    const usedRows = used.map((bp) => `<button class="resource-use-row" type="button" data-action="open-fabricator" data-id="${esc(bp.id)}" title="Открыть чертёж ${esc(bp.n)}">
      <span class="resource-use-title">
        ${blueprintUsageThumbHtml(bp)}
        <span class="resource-use-name">${esc(bp.n)}</span>
      </span>
      <span class="resource-use-qty">${esc(fabCategoryMeta(bp.c).label)}</span>
      <span class="resource-use-arrow">${svgIcon('chevronRight')}</span>
    </button>`).join('');
    const locationNote = material.totalLocations
      ? `Показано ${fmt(rows.length)} из ${fmt(material.totalLocations)} известных точек. «Доля» — процент точек, где встречается ресурс.`
      : 'Подтверждённых точек добычи в таблицах Wiki нет.';
    const wikiUrl = material.sourceUrl || `https://starcitizen.tools/${encodeURIComponent(name.replace(/ /g, '_'))}`;
    openModal({
      wide: true,
      kicker: `${material.kindLabel || kind.label} · материал`,
      title: name,
      body: `
        <div class="resource-detail-hero">
          <div class="resource-detail-media ${getResourceKindClass(kindKey)}${art ? ' has-image' : ''}">
            ${svgIcon(kind.icon)}
            ${art ? imageTag(art, name, true) : ''}
            ${art ? `<button class="image-zoom-btn" type="button" data-action="open-image" data-src="${esc(art)}" data-alt="${esc(name)}" aria-label="Увеличить изображение ${esc(name)}">${svgIcon('search')}</button>` : ''}
            ${imageEditorButtonHtml(name)}
            ${imageCustomBadgeHtml(name)}
          </div>
          <div class="resource-detail-copy">
            <p class="resource-detail-desc">${esc(material.desc || `${name} — материал для чертежей фабрикатора.`)}</p>
            <div class="resource-detail-stats">
              <div class="resource-detail-stat"><span>В чертежах</span><b>${countOf(usage.count, FAB_FORMS)}</b></div>
              <div class="resource-detail-stat"><span>С миссией</span><b>${fmt(usage.missionCount)}</b></div>
              <div class="resource-detail-stat"><span>Точек добычи</span><b>${material.totalLocations ? fmt(material.totalLocations) : '—'}</b></div>
            </div>
            <div class="resource-detail-progress">
              <div class="progress-meta"><span>Доля чертежей</span><span class="pct">${percent}%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
            </div>
            <div class="resource-detail-badges">
              <span class="badge">${esc(material.methodLabel || 'Добыча')}</span>
              ${material.rarity ? `<span class="badge">${esc(fabRarityRu(material.rarity))}</span>` : ''}
              ${best ? `<span class="badge">Чаще: ${esc(best.body)}${Number.isFinite(Number(best.spawn)) ? ` · ${fmt(best.spawn)}%` : ''}</span>` : ''}
            </div>
          </div>
        </div>
        <section class="resource-detail-section">
          <h3>Как добыть</h3>
          <p class="resource-detail-obtain">${esc(material.obtain || 'Подробную информацию о способе получения смотрите на Star Citizen Wiki.')}</p>
        </section>
        <section class="resource-detail-section resource-detail-tips">
          <h3>Где искать чаще <span>таблицы добычи</span></h3>
          ${locationRows ? `<div class="resource-mine-table">
            <div class="resource-mine-head"><span>Система / место</span><span>Доля</span><span>Качество</span></div>
            ${locationRows}
          </div>` : '<p class="resource-detail-obtain">Подтверждённых точек в таблицах Wiki нет.</p>'}
          <p class="resource-detail-source">${esc(locationNote)} ${esc(material.sourceNote || '')}</p>
        </section>
        <section class="resource-detail-section">
          <h3>Используется в чертежах <span>${countOf(usage.count, FAB_FORMS)}</span></h3>
          <div class="resource-use-list">${usedRows || '<div class="modal-hint">Этот материал не найден ни в одном чертеже.</div>'}</div>
          ${usage.count > used.length ? `<button class="btn btn-quiet resource-more-btn" type="button" data-action="filter-fabricator-resource" data-resource="${esc(name)}">Показать все ${fmt(usage.count)} ${plural(usage.count, FAB_FORMS[0], FAB_FORMS[1], FAB_FORMS[2])} ${svgIcon('arrowRight')}</button>` : ''}
        </section>
        <a class="wiki-link" href="${esc(wikiUrl)}" target="_blank" rel="noopener">Таблица добычи на Star Citizen Wiki ${svgIcon('external')}</a>`,
      actions: `
        <button class="btn btn-quiet" type="button" data-action="close-modal">Закрыть</button>
        <button class="btn btn-primary" type="button" data-action="filter-fabricator-resource" data-resource="${esc(name)}">Показать чертежи ${svgIcon('arrowRight')}</button>`
    });
  }

  function toggleFabFavorite(id) {
    if (!FAB_BP_BY_ID.has(id)) return;
    const active = !favoriteSet.has(id);
    if (active) favoriteSet.add(id);
    else favoriteSet.delete(id);
    state.favorites = [...favoriteSet];
    persistState();
    document.querySelectorAll(`[data-action="toggle-fab-favorite"][data-id="${cssEscape(id)}"]`).forEach((button) => {
      button.classList.toggle('is-fav', active);
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', active ? 'Убрать из избранного' : 'Добавить в избранное');
      button.title = active ? 'Убрать из избранного' : 'Добавить в избранное';
      const label = button.querySelector('.fab-fav-label');
      if (label) label.textContent = active ? 'В избранном' : 'В избранное';
    });
    document.querySelectorAll(`[data-fab-id="${cssEscape(id)}"]`).forEach((card) => card.classList.toggle('is-favorite', active));
    const count = document.getElementById('fab-fav-count');
    if (count) count.textContent = fmt(favoriteSet.size);
    if (ui.fabricatorFavoritesOnly && ui.tab === 'fabricator') {
      renderView();
      updateContentHead();
    }
    toast(active ? 'Добавлено в избранное' : 'Удалено из избранного', 'success');
  }

  function openImageLightbox(src, alt) {
    if (!src) return;
    openModal({
      wide: true,
      kicker: 'Изображение',
      title: alt || 'Просмотр изображения',
      body: `<div class="image-lightbox"><img src="${esc(src)}" alt="${esc(alt || '')}" loading="eager" decoding="async"></div>`,
      actions: `
        <a class="btn btn-outline" href="${esc(src)}" target="_blank" rel="noopener">Открыть файл ${svgIcon('external')}</a>
        <button class="btn btn-primary" type="button" data-action="close-modal">Закрыть</button>`
    });
  }

  function imageEditorBody(name) {
    const custom = customImageFor(name);
    const original = resourceOriginalImage(name);
    const art = custom || original;
    const profile = INVENTORY_BY_NAME.get(name);
    const kindKey = profile?.kind || 'equipment';
    const kind = KIND_META[kindKey] || KIND_META.equipment;
    return `<div class="image-editor">
      <div class="image-editor-preview ${getResourceKindClass(kindKey)}${art ? ' has-image' : ''}">
        ${svgIcon(kind.icon)}
        ${art ? imageTag(art, name, true) : ''}
        ${custom ? '<span class="image-custom-badge">Своё фото</span>' : ''}
        ${!art ? '<span class="image-editor-empty">Фото пока нет</span>' : ''}
      </div>
      <div class="image-editor-copy">
        <p class="image-editor-lead">Добавьте своё фото для материала <b>${esc(name)}</b>. Оно появится на карточке склада, в контрактах и в рецептах фабрикатора.</p>
        <div class="image-editor-actions">
          <button class="btn btn-primary" type="button" data-action="pick-custom-image">${svgIcon('upload')} Выбрать файл</button>
          <button class="btn btn-outline" type="button" data-action="paste-custom-image">${svgIcon('camera')} Вставить из буфера</button>
          ${custom ? `<button class="btn btn-quiet" type="button" data-action="reset-custom-image">${svgIcon('refresh')} Вернуть оригинал</button>` : ''}
        </div>
        <div class="image-editor-hint">
          <p><b>Файл:</b> PNG, JPG, WebP или GIF. Фото автоматически уменьшается до 480 px и сохраняется локально в браузере.</p>
          <p><b>Буфер:</b> нажмите «Вставить из буфера» или просто <kbd>Ctrl</kbd> + <kbd>V</kbd>, когда это окно открыто.</p>
          <p>${original ? 'Оригинальное фото остаётся в файлах приложения — его можно вернуть в любой момент.' : 'У этого материала нет оригинального фото в базе; после удаления своего фото останется иконка.'}</p>
        </div>
        <p class="image-editor-status">${custom ? 'Сейчас используется ваше фото.' : 'Сейчас используется оригинальное фото.'}</p>
      </div>
    </div>`;
  }

  function openImageEditor(name) {
    if (!INVENTORY_RESOURCE_NAMES.has(name)) return;
    openModal({
      wide: true,
      kicker: 'Фото материала',
      title: name,
      body: imageEditorBody(name),
      initialFocus: '[data-action="pick-custom-image"]',
      actions: '<button class="btn btn-outline" type="button" data-action="close-modal">Закрыть</button>'
    });
    imageEditorName = name;
  }

  function readImageElement(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
      reader.onload = () => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Не удалось открыть изображение'));
        image.src = String(reader.result || '');
      };
      reader.readAsDataURL(file);
    });
  }

  async function makeCustomImageData(file) {
    if (!file || !String(file.type || '').startsWith('image/')) throw new Error('Выберите файл изображения');
    if (file.size > 20 * 1024 * 1024) throw new Error('Файл больше 20 МБ');
    const image = await readImageElement(file);
    const max = 480;
    const scale = Math.min(1, max / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
    const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
    const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Браузер не поддерживает обработку изображений');
    ctx.fillStyle = '#0b1115';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    let dataUrl = canvas.toDataURL('image/webp', 0.8);
    if (!dataUrl.startsWith('data:image/webp')) dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    let quality = 0.8;
    while (dataUrl.length > 820000 && quality > 0.4) {
      quality -= 0.1;
      dataUrl = dataUrl.startsWith('data:image/webp')
        ? canvas.toDataURL('image/webp', quality)
        : canvas.toDataURL('image/jpeg', quality);
    }
    if (dataUrl.length > 900000) throw new Error('Изображение слишком большое даже после сжатия');
    return dataUrl;
  }

  async function applyCustomImage(file, name = imageEditorName) {
    if (!name) return;
    try {
      const dataUrl = await makeCustomImageData(file);
      state.customImages = state.customImages && typeof state.customImages === 'object' ? state.customImages : {};
      state.customImages[name] = dataUrl;
      persistState();
      if (storageOk) {
        let saved = false;
        try {
          const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
          saved = stored?.customImages?.[name] === dataUrl;
        } catch (error) { /* ignore read-back errors */ }
        if (!saved) {
          delete state.customImages[name];
          refreshStockSurfaces();
          if (modalOpen) openImageEditor(name);
          toast('Не удалось сохранить фото: в браузере не хватает места.', 'error');
          return;
        }
      }
      refreshStockSurfaces();
      if (modalOpen) openImageEditor(name);
      toast(`Фото материала обновлено: ${name}`, 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Не удалось добавить фото', 'error');
    }
  }

  function pickCustomImage() {
    if (!imageEditorName || !el.customImageFile) return;
    el.customImageFile.value = '';
    el.customImageFile.click();
  }

  async function pasteCustomImageFromClipboard() {
    if (!imageEditorName) return;
    if (!navigator.clipboard?.read) {
      toast('Браузер не поддерживает чтение буфера. Нажмите Ctrl+V в этом окне.', 'error');
      return;
    }
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = (item.types || []).find((value) => String(value).startsWith('image/'));
        if (!type) continue;
        const blob = await item.getType(type);
        await applyCustomImage(blob, imageEditorName);
        return;
      }
      toast('В буфере обмена нет изображения', 'error');
    } catch (error) {
      toast('Нет доступа к буферу. Нажмите Ctrl+V в этом окне.', 'error');
    }
  }

  function resetCustomImage() {
    if (!imageEditorName) return;
    const name = imageEditorName;
    if (state.customImages && state.customImages[name]) {
      delete state.customImages[name];
      persistState();
      refreshStockSurfaces();
      openImageEditor(name);
      toast(`Возвращено оригинальное фото: ${name}`, 'success');
    }
  }

  function onCustomImageFileChange() {
    const file = el.customImageFile?.files?.[0];
    if (!file || !imageEditorName) return;
    const name = imageEditorName;
    el.customImageFile.value = '';
    applyCustomImage(file, name);
  }

  function onDocumentPaste(event) {
    if (!modalOpen || !imageEditorName) return;
    const item = [...(event.clipboardData?.items || [])].find((entry) => String(entry.type || '').startsWith('image/'));
    if (!item) return;
    const file = item.getAsFile();
    if (!file) return;
    event.preventDefault();
    applyCustomImage(file, imageEditorName);
  }

  function openFabricatorDrawer(id) {
    const bp = FAB_BP_BY_ID.get(id);
    if (!bp) return;
    closeModal();
    capturedFocus = captureFocus();
    drawerContractId = null;
    drawerBpId = id;
    drawerDirty = false;
    el.drawer.innerHTML = fabDrawerHtml(bp);
    el.drawerLayer.classList.add('is-open');
    el.drawerLayer.setAttribute('aria-hidden', 'false');
    updateBodyScroll();
    setTimeout(() => {
      el.drawer.querySelector('.drawer-close')?.focus({ preventScroll: true });
    }, 60);
  }

  function fabSourceNoteHtml() {
    const meta = FAB_DATA.meta || {};
    return `<div class="sidebar-card sidebar-card--wide source-card">
      <div class="sidebar-title"><span>Источник данных</span>${svgIcon('info')}</div>
      <div class="source-note">
        <a href="${esc(meta.sourceUrl || 'https://jokersgambit.org/blueprints')}" target="_blank" rel="noopener">Jokers Gambit · Blueprint Finder ↗</a>
        <span class="snap">${esc(meta.gameVersion || 'Alpha 4.10.2')} · ${countOf(FAB_TOTAL, FAB_FORMS)}</span>
        <span class="snap">${countOf(FAB_MISSIONS.length, ['миссия', 'миссии', 'миссий'])} · ${countOf(FAB_GIVER_COUNT, ['источник миссий', 'источника миссий', 'источников миссий'])}</span>
        <span class="snap">Характеристики и изображения: Star Citizen Wiki API ${esc(meta.itemVersion || '4.10.2')}</span>
        <span class="snap">Описания: перевод EN → RU, имена предметов, производителей и мест — на английском</span>
        <span class="snap">Добыча материалов: starcitizen.tools</span>
      </div>
    </div>`;
  }

  function renderFabricatorSidebar() {
    const searchCard = `<div class="sidebar-card sidebar-card--wide">
      <div class="search-box">
        ${svgIcon('search')}
        <input id="fabricator-search" type="search" data-role="fabricator-search" value="${esc(ui.fabricatorSearch)}" placeholder="${ui.fabricatorMode === 'materials' ? 'Материал или чертёж' : 'Чертёж, материал, миссия'}" aria-label="Поиск по фабрикатору">
        <span class="search-hint">/</span>
      </div>
    </div>`;
    const modeButtons = [
      ['blueprints', 'Чертежи', 'blueprint', 'var(--accent)', FAB_TOTAL],
      ['materials', 'Материалы', 'ore', 'var(--accent-2)', FAB_RESOURCE_ROWS.length]
    ].map(([key, label, icon, color, count]) => `<button class="filter-item${ui.fabricatorMode === key ? ' is-active' : ''}" type="button" data-action="set-fabricator-mode" data-mode="${key}" style="--cat:${color}">${svgIcon(icon)}<span>${label}</span><span class="count">${fmt(count)}</span></button>`).join('');
    const modeCard = `<div class="sidebar-card sidebar-card--wide">
      <div class="sidebar-title"><span>Режим</span><span>${fmt(ui.fabricatorMode === 'materials' ? FAB_RESOURCE_ROWS.length : FAB_TOTAL)}</span></div>
      <div class="filter-list">${modeButtons}</div>
    </div>`;
    if (ui.fabricatorMode === 'materials') {
      el.sidebar.innerHTML = searchCard + modeCard + `<div class="sidebar-card">
        <div class="sidebar-title"><span>Материалы</span>${svgIcon('ore')}</div>
        <p class="sidebar-inline-hint">Показаны материалы всех рецептов фабрикатора. Поиск ищет по названию материала и чертежам, где он используется.</p>
        <button class="btn btn-quiet sidebar-reset" type="button" data-action="reset-fabricator-filters">${svgIcon('refresh')} Сбросить поиск</button>
      </div>`;
      return;
    }
    const categoryButtons = [`<button class="filter-item${ui.fabricatorCategory === 'all' ? ' is-active' : ''}" type="button" data-action="set-fabricator-category" data-category="all" style="--cat:var(--accent)">${svgIcon('grid')}<span>Все чертежи</span><span class="count">${fmt(FAB_TOTAL)}</span></button>`]
      .concat(FAB_CATEGORY_ORDER.map((key) => {
        const meta = fabCategoryMeta(key);
        return `<button class="filter-item cat-${key}${ui.fabricatorCategory === key ? ' is-active' : ''}" type="button" data-action="set-fabricator-category" data-category="${key}">${svgIcon(meta.icon)}<span>${esc(meta.label)}</span><span class="count">${fmt(FAB_CATEGORY_COUNTS[key] || 0)}</span></button>`;
      })).join('');
    const sourceButtons = [
      ['all', 'Все источники', 'grid', 'var(--accent)', FAB_TOTAL],
      ['default', 'Базовые', 'check', 'var(--green)', FAB_DEFAULT_TOTAL],
      ['mission', 'Из миссий', 'blueprint', 'var(--violet)', FAB_MISSION_TOTAL],
      ['none', 'Без источника', 'alert', 'var(--text-3)', FAB_NO_SOURCE_TOTAL]
    ].map(([key, label, icon, color, count]) => `<button class="filter-item${ui.fabricatorSource === key ? ' is-active' : ''}" type="button" data-action="set-fabricator-source" data-source="${key}" style="--cat:${color}">${svgIcon(icon)}<span>${label}</span><span class="count">${fmt(count)}</span></button>`).join('');
    const resourceOptions = FAB_RESOURCE_ROWS.map((row) => option(row.name, `${row.name} · ${fmt(row.count)}`, ui.fabricatorResource === row.name)).join('');
    const systemOptions = FAB_SYSTEMS.map((system) => option(system, system, ui.fabricatorSystem === system)).join('');
    const factionOptions = FAB_FACTIONS.map((faction) => option(faction, faction, ui.fabricatorFaction === faction)).join('');
    const typeOptions = FAB_MISSION_TYPES.map((type) => option(type, fabMissionTypeLabel(type), ui.fabricatorMissionType === type)).join('');
    el.sidebar.innerHTML = `${searchCard}${modeCard}
      <div class="sidebar-card sidebar-card--wide">
        <div class="sidebar-title"><span>Категории</span><span>${fmt(FAB_TOTAL)}</span></div>
        <div class="filter-list">${categoryButtons}</div>
        <div class="field fab-subcategory-field">
          <label for="fab-subcategory-filter">Слот / подтип</label>
          <div class="select-wrap">
            <select id="fab-subcategory-filter" data-role="fabricator-subcategory">
              ${option('all', 'Все подтипы', ui.fabricatorSubcategory === 'all')}
              ${FAB_SUBCATEGORIES.map((type) => option(type, `${fabTypeLabel(type)} · ${fmt(FAB_SUBCATEGORY_COUNTS[type] || 0)}`, ui.fabricatorSubcategory === type)).join('')}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
      </div>
      <div class="sidebar-card">
        <div class="sidebar-title"><span>Источник чертежа</span>${svgIcon('blueprint')}</div>
        <div class="filter-list">${sourceButtons}</div>
      </div>
      <div class="sidebar-card">
        <div class="sidebar-title"><span>Ресурсы и миссии</span>${svgIcon('filter')}</div>
        <div class="field">
          <label for="fab-resource-filter">Ресурс</label>
          <div class="select-wrap">
            <select id="fab-resource-filter" data-role="fabricator-resource">
              ${option('all', 'Любой ресурс', ui.fabricatorResource === 'all')}
              ${resourceOptions}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <div class="field">
          <label for="fab-system-filter">Система</label>
          <div class="select-wrap">
            <select id="fab-system-filter" data-role="fabricator-system">
              ${option('all', 'Все системы', ui.fabricatorSystem === 'all')}
              ${systemOptions}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <div class="field">
          <label for="fab-faction-filter">Фракция / контрактор</label>
          <div class="select-wrap">
            <select id="fab-faction-filter" data-role="fabricator-faction">
              ${option('all', 'Все фракции и контракторы', ui.fabricatorFaction === 'all')}
              ${factionOptions}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <div class="field">
          <label for="fab-type-filter">Тип миссии</label>
          <div class="select-wrap">
            <select id="fab-type-filter" data-role="fabricator-mission-type">
              ${option('all', 'Все типы', ui.fabricatorMissionType === 'all')}
              ${typeOptions}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
      </div>
      <div class="sidebar-card">
        <div class="sidebar-title"><span>Сортировка</span>${svgIcon('refresh')}</div>
        <div class="field">
          <label for="fab-sort">Порядок</label>
          <div class="select-wrap">
            <select id="fab-sort" data-role="fabricator-sort">
              ${option('source-asc', 'Сначала с миссией', ui.fabricatorSort === 'source-asc')}
              ${option('name-asc', 'Название: A → Z', ui.fabricatorSort === 'name-asc')}
              ${option('craft-asc', 'Крафт: быстрее', ui.fabricatorSort === 'craft-asc')}
              ${option('missions-desc', 'Миссий: больше', ui.fabricatorSort === 'missions-desc')}
              ${option('category', 'По категории', ui.fabricatorSort === 'category')}
              ${option('subtype', 'По слоту / подтипу', ui.fabricatorSort === 'subtype')}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <label class="toggle"><input type="checkbox" data-role="fabricator-favorites-only"${ui.fabricatorFavoritesOnly ? ' checked' : ''}> Только избранные <span class="fab-fav-count" id="fab-fav-count">${fmt(favoriteSet.size)}</span></label>
        <button class="btn btn-quiet sidebar-reset" type="button" data-action="reset-fabricator-filters">${svgIcon('refresh')} Сбросить фильтры</button>
      </div>
      ${fabSourceNoteHtml()}
      <div class="sidebar-note">${countOf(FAB_NO_SOURCE_TOTAL, FAB_FORMS)} без миссионного источника — это не ошибка: рецепт и материалы есть, но в файлах игры 4.10.2 для них нет миссии. Возможен событийный, магазинный или ещё не добавленный источник.</div>`;
  }

  function renderLootSidebar() {
    const systemButtons = [
      ['all', 'Все системы', 'map', 'var(--accent)', LOOT_TOTAL],
      ...LOOT_SYSTEMS.map((system) => [system, system, 'pin', 'var(--accent-2)', LOOT_SYSTEM_COUNTS[system] || 0])
    ].map(([key, label, icon, color, count]) => `<button class="filter-item${ui.lootSystem === key ? ' is-active' : ''}" type="button" data-action="set-loot-system" data-system="${key}" style="--cat:${color}">${svgIcon(icon)}<span>${esc(label)}</span><span class="count">${fmt(count)}</span></button>`).join('');
    const riskButtons = [
      ['all', 'Любой риск', 'grid', 'var(--accent)', LOOT_TOTAL],
      ['medium', 'Средний', 'users', 'var(--green)', LOOT_RISK_COUNTS.medium || 0],
      ['high', 'Высокий', 'alert', 'var(--amber)', LOOT_RISK_COUNTS.high || 0],
      ['extreme', 'Экстремальный', 'skull', 'var(--red)', LOOT_RISK_COUNTS.extreme || 0]
    ].map(([key, label, icon, color, count]) => `<button class="filter-item${ui.lootRisk === key ? ' is-active' : ''}" type="button" data-action="set-loot-risk" data-risk="${key}" style="--cat:${color}">${svgIcon(icon)}<span>${esc(label)}</span><span class="count">${fmt(count)}</span></button>`).join('');
    const typeOptions = Object.entries(LOOT_TYPES)
      .filter(([key]) => (LOOT_TYPE_COUNTS[key] || 0) > 0)
      .sort((a, b) => a[1].label.localeCompare(b[1].label, 'en', { sensitivity: 'base' }))
      .map(([key, meta]) => option(key, `${meta.label} · ${fmt(LOOT_TYPE_COUNTS[key] || 0)}`, ui.lootType === key)).join('');
    const modeOptions = LOOT_MODES.map((mode) => option(mode, mode, ui.lootMode === mode)).join('');
    const sourceLinks = (LOOT_DATA.meta?.sources || []).map((source) => `<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ↗</a>`).join('');
    el.sidebar.innerHTML = `
      <div class="sidebar-card sidebar-card--wide">
        <div class="search-box">
          ${svgIcon('search')}
          <input id="loot-search" type="search" data-role="loot-search" value="${esc(ui.lootSearch)}" placeholder="Локация, лут, система" aria-label="Поиск мест для лута">
          <span class="search-hint">/</span>
        </div>
      </div>
      <div class="sidebar-card sidebar-card--wide">
        <div class="sidebar-title"><span>Системы</span><span>${fmt(LOOT_TOTAL)}</span></div>
        <div class="filter-list">${systemButtons}</div>
      </div>
      <div class="sidebar-card">
        <div class="sidebar-title"><span>Риск</span>${svgIcon('skull')}</div>
        <div class="filter-list">${riskButtons}</div>
      </div>
      <div class="sidebar-card">
        <div class="sidebar-title"><span>Тип и режим</span>${svgIcon('filter')}</div>
        <div class="field">
          <label for="loot-type-filter">Тип локации</label>
          <div class="select-wrap">
            <select id="loot-type-filter" data-role="loot-type">
              ${option('all', 'Все типы', ui.lootType === 'all')}
              ${typeOptions}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <div class="field">
          <label for="loot-mode-filter">Режим</label>
          <div class="select-wrap">
            <select id="loot-mode-filter" data-role="loot-mode">
              ${option('all', 'Любой режим', ui.lootMode === 'all')}
              ${modeOptions}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <label class="toggle"><input type="checkbox" data-role="loot-solo-only"${ui.lootSoloOnly ? ' checked' : ''}> Только для соло</label>
      </div>
      <div class="sidebar-card">
        <div class="sidebar-title"><span>Сортировка</span>${svgIcon('refresh')}</div>
        <div class="field">
          <label for="loot-sort">Порядок</label>
          <div class="select-wrap">
            <select id="loot-sort" data-role="loot-sort">
              ${option('rank', 'По рекомендации', ui.lootSort === 'rank')}
              ${option('risk-desc', 'Сначала рискованнее', ui.lootSort === 'risk-desc')}
              ${option('name-asc', 'Название: A → Z', ui.lootSort === 'name-asc')}
              ${option('system', 'По системе', ui.lootSort === 'system')}
            </select>
            ${svgIcon('chevronDown')}
          </div>
        </div>
        <button class="btn btn-quiet sidebar-reset" type="button" data-action="reset-loot-filters">${svgIcon('refresh')} Сбросить фильтры</button>
      </div>
      <div class="sidebar-card sidebar-card--wide source-card">
        <div class="sidebar-title"><span>Источник данных</span>${svgIcon('info')}</div>
        <div class="source-note">
          <span class="snap">${esc(LOOT_DATA.meta?.version || 'Alpha 4.10.2')} · снимок ${esc(LOOT_DATA.meta?.snapshot || '2026-10-29')}</span>
          <span class="snap">${countOf(LOOT_TOTAL, ['локация', 'локации', 'локаций'])} · ${countOf(LOOT_SYSTEMS.filter((system) => LOOT_SYSTEM_COUNTS[system] > 0).length, ['система', 'системы', 'систем'])}</span>
          ${sourceLinks}
        </div>
      </div>
      <div class="sidebar-note">${esc(LOOT_DATA.meta?.disclaimer || 'Лут-таблицы меняются между патчами.')}</div>`;
  }

  function lootCardHtml(location) {
    const type = lootTypeMeta(location.type);
    const risk = lootRiskMeta(location.risk);
    const tags = (location.loot || []).slice(0, 3);
    return `<article class="contract-card loot-card loot-type--${esc(location.type)}" data-loot-id="${esc(location.id)}" data-action="open-loot" data-id="${esc(location.id)}">
      <div class="card-visual loot-card-visual">
        <span class="card-visual-art"><span class="loot-art-watermark" aria-hidden="true">${svgIcon(type.icon)}</span>${svgIcon(type.icon)}</span>
        <div class="card-visual-top">
          <span class="cat-badge" title="${esc(type.label)}">${svgIcon(type.icon)}</span>
          <div class="loot-card-flags">
            ${location.top ? '<span class="badge badge--rep">ТОП</span>' : ''}
            <span class="badge loot-risk-badge risk--${esc(location.risk)}">${esc(risk.label)}</span>
          </div>
        </div>
        <div class="card-visual-caption">
          <span class="reward-label">${esc(location.system)}</span>
          <span class="reward-name">${esc(location.location)}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-head">
          <div class="card-titles"><h3>${esc(location.name)}</h3></div>
        </div>
        <div class="card-meta">
          <span class="badge badge--cat">${esc(type.label)}</span>
          <span class="badge">${countOf((location.loot || []).length, ['предмет', 'предмета', 'предметов'])}</span>
        </div>
        <p class="loot-card-summary">${esc(location.summary)}</p>
        <div class="loot-tags">${tags.map((item) => `<span>${esc(item)}</span>`).join('')}${(location.loot || []).length > tags.length ? `<span class="is-more">+${fmt(location.loot.length - tags.length)}</span>` : ''}</div>
        <div class="card-foot">
          <span class="card-hint">${esc(location.mode)} · ${esc(location.group)}</span>
          <button class="card-open loot-open" type="button" aria-label="Открыть маршрут ${esc(location.name)}">Маршрут ${svgIcon('arrowRight')}</button>
        </div>
      </div>
    </article>`;
  }

  function renderLootView() {
    if (!LOOT_TOTAL) {
      el.viewRoot.innerHTML = emptyState(
        'map',
        'Справочник лута не загружен',
        'Проверьте, что файл loot-data.js находится рядом с index.html и подключён перед app.js.',
        `<button class="btn btn-outline" type="button" data-action="switch-tab" data-tab="fabricator">К фабрикатору</button>`
      );
      el.resultCount.textContent = countOf(0, ['локация', 'локации', 'локаций']);
      return;
    }
    const list = lootSort(lootFiltered());
    const empty = emptyState(
      'search',
      'Ничего не найдено',
      'Попробуйте изменить запрос или сбросить фильтры. Поиск ищет по названию, системе, типу и луту.',
      `<button class="btn btn-outline" type="button" data-action="reset-loot-filters">Сбросить фильтры</button>`
    );
    el.viewRoot.innerHTML = list.length ? `<div class="loot-grid">${list.map(lootCardHtml).join('')}</div>` : empty;
    el.resultCount.textContent = countOf(list.length, ['локация', 'локации', 'локаций']);
  }

  function lootDrawerHtml(location) {
    const type = lootTypeMeta(location.type);
    const risk = lootRiskMeta(location.risk);
    const lootItems = (location.loot || []).map((item) => `<li>${svgIcon('check')}<span>${esc(item)}</span></li>`).join('');
    const steps = (location.access || []).map((step) => `<li><span class="loot-step-num"></span><span>${esc(step)}</span></li>`).join('');
    const tips = (location.tips || []).map((tip) => `<li>${svgIcon('info')}<span>${esc(tip)}</span></li>`).join('');
    const risks = (location.risks || []).map((item) => `<span>${svgIcon('alert')} ${esc(item)}</span>`).join('');
    const sources = (location.sources || []).map((source) => `<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ${svgIcon('external')}</a>`).join('');
    return `
      <button class="btn btn-icon drawer-close" type="button" data-action="close-drawer" aria-label="Закрыть карточку">${svgIcon('close')}</button>
      <div class="drawer-head loot-drawer-head">
        <div class="drawer-breadcrumb">Лут / ${esc(type.label)}</div>
        <div class="loot-drawer-title-row">
          <div class="loot-drawer-icon loot-type--${esc(location.type)}">${svgIcon(type.icon)}</div>
          <div class="drawer-title-main">
            <h2 id="drawer-title">${esc(location.name)}</h2>
            <div class="drawer-badges">
              <span class="badge badge--cat">${esc(type.label)}</span>
              <span class="badge loot-risk-badge risk--${esc(location.risk)}">${svgIcon(location.risk === 'extreme' ? 'skull' : 'alert')} ${esc(risk.label)} риск</span>
              <span class="badge">${esc(location.mode)}</span>
              <span class="badge">${svgIcon('users')} ${esc(location.group)}</span>
              ${location.top ? '<span class="badge fab-badge--mission">Топ-место</span>' : ''}
            </div>
          </div>
        </div>
      </div>
      <div class="drawer-body">
        <div class="loot-detail-meta">
          <div><span>Система</span><b>${svgIcon('map')} ${esc(location.system)}</b></div>
          <div><span>Локация</span><b>${svgIcon('pin')} ${esc(location.location)}</b></div>
          <div><span>Соло</span><b>${location.solo ? 'Да, но осторожно' : 'Лучше группой'}</b></div>
        </div>
        <section class="drawer-section loot-why">
          <h3>Почему сюда <span>кратко</span></h3>
          <p>${esc(location.why)}</p>
        </section>
        <section class="drawer-section">
          <h3>Что лутать <span>${countOf((location.loot || []).length, ['категория', 'категории', 'категорий'])}</span></h3>
          <ul class="loot-loot-list">${lootItems}</ul>
        </section>
        <section class="drawer-section">
          <h3>Как добраться и что делать <span>${countOf((location.access || []).length, ['шаг', 'шага', 'шагов'])}</span></h3>
          <ol class="loot-steps">${steps}</ol>
        </section>
        <section class="drawer-section">
          <h3>Как лутать эффективно <span>советы</span></h3>
          <ul class="loot-tips-list">${tips}</ul>
        </section>
        <section class="drawer-section">
          <h3>Риски</h3>
          <div class="loot-risk-list">${risks}</div>
        </section>
        <section class="drawer-section">
          <h3>Параметры</h3>
          <div class="info-grid">
            <div class="info-cell"><dt>Тип</dt><dd>${esc(type.label)}</dd></div>
            <div class="info-cell"><dt>Риск</dt><dd>${esc(risk.label)}</dd></div>
            <div class="info-cell"><dt>Режим</dt><dd>${esc(location.mode)}</dd></div>
            <div class="info-cell"><dt>Группа</dt><dd>${esc(location.group)}</dd></div>
            <div class="info-cell info-cell--wide"><dt>Версия</dt><dd>${esc(LOOT_DATA.meta?.version || 'Alpha 4.10.2')}</dd></div>
          </div>
        </section>
        <div class="loot-source-list">
          <span>Источники:</span>
          ${sources || '<span>Star Citizen Wiki / LootingPower</span>'}
        </div>
        <div class="fab-drawer-source">Курируемый маршрут, а не гарантированный дроп-лист. Лут-таблицы и доступность меняются между патчами; проверяйте точку перед вылетом.</div>
      </div>`;
  }

  function openLootDrawer(id) {
    const location = LOOT_BY_ID.get(id);
    if (!location) return;
    closeModal();
    capturedFocus = captureFocus();
    drawerContractId = null;
    drawerBpId = null;
    drawerDirty = false;
    el.drawer.innerHTML = lootDrawerHtml(location);
    el.drawerLayer.classList.add('is-open');
    el.drawerLayer.setAttribute('aria-hidden', 'false');
    updateBodyScroll();
    setTimeout(() => {
      el.drawer.querySelector('.drawer-close')?.focus({ preventScroll: true });
    }, 60);
  }

  function setLootSystem(system) {
    if (system !== 'all' && !LOOT_SYSTEMS.includes(system)) return;
    ui.lootSystem = system;
    saveUiSoon();
    document.querySelectorAll('[data-action="set-loot-system"]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.system === system);
    });
    renderView();
    updateContentHead();
  }

  function setLootRisk(risk) {
    if (risk !== 'all' && !LOOT_RISKS[risk]) return;
    ui.lootRisk = risk;
    saveUiSoon();
    document.querySelectorAll('[data-action="set-loot-risk"]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.risk === risk);
    });
    renderView();
    updateContentHead();
  }

  function resetLootFilters() {
    ui.lootSearch = '';
    ui.lootSystem = 'all';
    ui.lootType = 'all';
    ui.lootRisk = 'all';
    ui.lootMode = 'all';
    ui.lootSoloOnly = false;
    ui.lootSort = 'rank';
    saveUiSoon();
    renderSidebar();
    updateContentHead();
    renderView();
  }

  function renderSidebar() {
    if (ui.tab === 'resources') renderResourceSidebar();
    else if (ui.tab === 'inventory') renderInventorySidebar();
    else if (ui.tab === 'fabricator') renderFabricatorSidebar();
    else if (ui.tab === 'loot') renderLootSidebar();
    else renderContractSidebar();
  }

  function activeFilterChips() {
    const chips = [];
    const add = (key, label) => chips.push({ key, label });
    const short = (value, limit = 28) => {
      const text = String(value || '').trim();
      return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
    };
    if (ui.tab === 'contracts' || ui.tab === 'active') {
      if (ui.contractSearch.trim()) add('contractSearch', `Поиск: ${short(ui.contractSearch)}`);
      if (ui.category !== 'all') add('category', CATEGORY_META[ui.category]?.label || ui.category);
      if (ui.reputation !== 'all') {
        const rep = ui.reputation === 'none' ? 'Без требований' : REP_LABELS[ui.reputation] || ui.reputation;
        add('reputation', rep);
      }
      if (ui.status !== 'all') {
        const status = { active: 'В работе', 'not-started': 'Не начаты', 'in-progress': 'В процессе', done: 'Готовы' }[ui.status] || ui.status;
        add('status', status);
      }
      if (ui.pinnedOnly) add('pinnedOnly', 'Только закреплённые');
    } else if (ui.tab === 'resources') {
      if (ui.resourceSearch.trim()) add('resourceSearch', `Поиск: ${short(ui.resourceSearch)}`);
      if (ui.resourceScope !== 'all') add('resourceScope', { wikelo: 'Викело', active: 'Избранные / в работе' }[ui.resourceScope] || ui.resourceScope);
      if (ui.resourceHideDone) add('resourceHideDone', 'Скрыто собранное');
      if (ui.resourceSort !== 'name-asc') {
        const sort = { 'remaining-desc': 'Остаток: больше', 'required-desc': 'Нужно: больше', 'contracts-desc': 'Контрактов: больше', 'blueprints-desc': 'Чертежей: больше' }[ui.resourceSort] || ui.resourceSort;
        add('resourceSort', `Сортировка: ${sort}`);
      }
    } else if (ui.tab === 'inventory') {
      if (ui.inventorySearch.trim()) add('inventorySearch', `Поиск: ${short(ui.inventorySearch)}`);
      if (ui.inventoryKind !== 'all') add('inventoryKind', KIND_META[ui.inventoryKind]?.label || ui.inventoryKind);
      if (ui.inventoryFilter !== 'all') {
        const filter = { stock: 'Свободно', committed: 'Внесено', favorites: 'Избранное', needed: 'Нужны' }[ui.inventoryFilter] || ui.inventoryFilter;
        add('inventoryFilter', filter);
      }
      if (ui.inventorySort !== 'name-asc') {
        const sort = { 'stock-desc': 'Свободно: больше', 'committed-desc': 'Внесено: больше', 'need-desc': 'Потребность: больше', 'coverage-asc': 'Покрытие: меньше' }[ui.inventorySort] || ui.inventorySort;
        add('inventorySort', `Сортировка: ${sort}`);
      }
    } else if (ui.tab === 'fabricator') {
      if (ui.fabricatorSearch.trim()) add('fabricatorSearch', `Поиск: ${short(ui.fabricatorSearch)}`);
      if (ui.fabricatorMode === 'blueprints') {
        if (ui.fabricatorCategory !== 'all') add('fabricatorCategory', FAB_CATEGORY_META[ui.fabricatorCategory]?.label || ui.fabricatorCategory);
        if (ui.fabricatorSubcategory !== 'all') add('fabricatorSubcategory', fabTypeLabel(ui.fabricatorSubcategory));
        if (ui.fabricatorSource !== 'all') add('fabricatorSource', FAB_SOURCE_META[ui.fabricatorSource]?.label || ui.fabricatorSource);
        if (ui.fabricatorResource !== 'all') add('fabricatorResource', ui.fabricatorResource);
        if (ui.fabricatorSystem !== 'all') add('fabricatorSystem', ui.fabricatorSystem);
        if (ui.fabricatorFaction !== 'all') add('fabricatorFaction', ui.fabricatorFaction);
        if (ui.fabricatorMissionType !== 'all') add('fabricatorMissionType', fabMissionTypeLabel(ui.fabricatorMissionType));
        if (ui.fabricatorFavoritesOnly) add('fabricatorFavoritesOnly', 'Только избранные');
      }
    } else if (ui.tab === 'loot') {
      if (ui.lootSearch.trim()) add('lootSearch', `Поиск: ${short(ui.lootSearch)}`);
      if (ui.lootSystem !== 'all') add('lootSystem', ui.lootSystem);
      if (ui.lootType !== 'all') add('lootType', LOOT_TYPES[ui.lootType]?.label || ui.lootType);
      if (ui.lootRisk !== 'all') add('lootRisk', LOOT_RISKS[ui.lootRisk]?.label || ui.lootRisk);
      if (ui.lootMode !== 'all') add('lootMode', ui.lootMode);
      if (ui.lootSoloOnly) add('lootSoloOnly', 'Только соло');
    }
    return chips;
  }

  function renderActiveFilters() {
    if (!el.activeFilters) return;
    const chips = activeFilterChips();
    const hideForMaterials = ui.tab === 'fabricator' && ui.fabricatorMode === 'materials';
    el.activeFilters.hidden = chips.length === 0 || hideForMaterials;
    el.activeFilters.innerHTML = chips.map((chip) => `<button class="active-filter-chip" type="button" data-action="clear-active-filter" data-filter-key="${esc(chip.key)}" aria-label="Убрать фильтр: ${esc(chip.label)}">${esc(chip.label)}${svgIcon('close')}</button>`).join('');
  }

  function clearActiveFilter(key) {
    if (!key) return;
    if (ui.tab === 'contracts' || ui.tab === 'active') {
      if (key === 'contractSearch') ui.contractSearch = '';
      else if (key === 'category') ui.category = 'all';
      else if (key === 'reputation') ui.reputation = 'all';
      else if (key === 'status') ui.status = 'all';
      else if (key === 'pinnedOnly') ui.pinnedOnly = false;
    } else if (ui.tab === 'resources') {
      if (key === 'resourceSearch') ui.resourceSearch = '';
      else if (key === 'resourceScope') ui.resourceScope = 'all';
      else if (key === 'resourceHideDone') ui.resourceHideDone = false;
      else if (key === 'resourceSort') ui.resourceSort = 'name-asc';
    } else if (ui.tab === 'inventory') {
      if (key === 'inventorySearch') ui.inventorySearch = '';
      else if (key === 'inventoryKind') ui.inventoryKind = 'all';
      else if (key === 'inventoryFilter') ui.inventoryFilter = 'all';
      else if (key === 'inventorySort') ui.inventorySort = 'name-asc';
      ui.inventoryShown = INV_PAGE_SIZE;
    } else if (ui.tab === 'fabricator') {
      if (key === 'fabricatorSearch') ui.fabricatorSearch = '';
      else if (key === 'fabricatorCategory') ui.fabricatorCategory = 'all';
      else if (key === 'fabricatorSubcategory') ui.fabricatorSubcategory = 'all';
      else if (key === 'fabricatorSource') ui.fabricatorSource = 'all';
      else if (key === 'fabricatorResource') ui.fabricatorResource = 'all';
      else if (key === 'fabricatorSystem') ui.fabricatorSystem = 'all';
      else if (key === 'fabricatorFaction') ui.fabricatorFaction = 'all';
      else if (key === 'fabricatorMissionType') ui.fabricatorMissionType = 'all';
      else if (key === 'fabricatorFavoritesOnly') ui.fabricatorFavoritesOnly = false;
      ui.fabricatorShown = FAB_PAGE_SIZE;
    } else if (ui.tab === 'loot') {
      if (key === 'lootSearch') ui.lootSearch = '';
      else if (key === 'lootSystem') ui.lootSystem = 'all';
      else if (key === 'lootType') ui.lootType = 'all';
      else if (key === 'lootRisk') ui.lootRisk = 'all';
      else if (key === 'lootMode') ui.lootMode = 'all';
      else if (key === 'lootSoloOnly') ui.lootSoloOnly = false;
    }
    saveUiSoon();
    renderSidebar();
    updateContentHead();
    renderView();
    requestAnimationFrame(() => document.querySelector('.tab.is-active')?.focus({ preventScroll: true }));
  }

  function hasActiveFilters() {
    if (ui.tab === 'inventory') {
      return Boolean(ui.inventorySearch.trim()) || ui.inventoryFilter !== 'all' || ui.inventoryKind !== 'all' || ui.inventorySort !== 'name-asc';
    }
    if (ui.tab === 'resources') {
      return Boolean(ui.resourceSearch.trim()) || ui.resourceScope !== 'all' || ui.resourceHideDone || ui.resourceSort !== 'name-asc';
    }
    if (ui.tab === 'fabricator') {
      if (ui.fabricatorMode === 'materials') return Boolean(ui.fabricatorSearch.trim());
      return Boolean(ui.fabricatorSearch.trim()) || ui.fabricatorCategory !== 'all' || ui.fabricatorSubcategory !== 'all' || ui.fabricatorFavoritesOnly || ui.fabricatorSource !== 'all' || ui.fabricatorResource !== 'all' || ui.fabricatorSystem !== 'all' || ui.fabricatorFaction !== 'all' || ui.fabricatorMissionType !== 'all';
    }
    if (ui.tab === 'loot') {
      return Boolean(ui.lootSearch.trim()) || ui.lootSystem !== 'all' || ui.lootType !== 'all' || ui.lootRisk !== 'all' || ui.lootMode !== 'all' || ui.lootSoloOnly;
    }
    return Boolean(ui.contractSearch.trim()) || ui.category !== 'all' || ui.reputation !== 'all' || ui.status !== 'all' || ui.pinnedOnly;
  }

  function updateContentHead() {
    if (ui.tab === 'contracts') {
      el.viewTitle.textContent = 'Контракты';
      el.viewEyebrow.textContent = 'База контрактов · Stanton';
    } else if (ui.tab === 'active') {
      el.viewTitle.textContent = 'В работе';
      el.viewEyebrow.textContent = 'Закреплённые и начатые';
    } else if (ui.tab === 'fabricator') {
      if (ui.fabricatorMode === 'materials') {
        el.viewTitle.textContent = 'Материалы';
        el.viewEyebrow.textContent = 'Item Fabricator · 4.10.2 · ресурсы';
      } else {
        el.viewTitle.textContent = 'Фабрикатор';
        el.viewEyebrow.textContent = 'Item Fabricator · Alpha 4.10.2';
      }
    } else if (ui.tab === 'loot') {
      el.viewTitle.textContent = 'Лут';
      el.viewEyebrow.textContent = 'Места для лута · Alpha 4.10.2';
    } else if (ui.tab === 'inventory') {
      el.viewTitle.textContent = 'Мои ресурсы';
      el.viewEyebrow.textContent = 'Личный склад · все ресурсы';
    } else {
      el.viewTitle.textContent = 'Ресурсы';
      el.viewEyebrow.textContent = 'Викело и фабрикатор · сводный список';
    }
    el.resetFilters.hidden = (ui.tab === 'fabricator' && ui.fabricatorMode === 'materials') ? true : !hasActiveFilters();
    renderActiveFilters();
  }

  function updateCounters() {
    let active = 0;
    let done = 0;
    for (const contract of CONTRACTS) {
      const stat = contractStats(contract);
      if (stat.started || pinnedSet.has(contract.id)) active += 1;
      if (stat.complete) done += 1;
    }
    el.countContracts.textContent = fmt(TOTAL_CONTRACTS);
    el.countActive.textContent = fmt(active);
    el.countResources.textContent = fmt(TOTAL_RESOURCES);
    if (el.countInventory) el.countInventory.textContent = fmt(INVENTORY_RESOURCES.length);
    if (el.countFabricator) el.countFabricator.textContent = FAB_TOTAL ? fmt(FAB_TOTAL) : '—';
    if (el.countLoot) el.countLoot.textContent = LOOT_TOTAL ? fmt(LOOT_TOTAL) : '—';
    if (ui.tab === 'inventory') {
      el.statContracts.textContent = fmt(INVENTORY_RESOURCES.length);
      el.statActive.textContent = fmt(inventoryStockCount());
      el.statDone.textContent = fmt(inventoryCommittedTotal());
      el.statResources.textContent = fmt(inventoryTotalUnits());
      if (el.statLabelContracts) el.statLabelContracts.textContent = 'ресурсов';
      if (el.statLabelActive) el.statLabelActive.textContent = 'свободно';
      if (el.statLabelDone) el.statLabelDone.textContent = 'внесено';
      if (el.statLabelResources) el.statLabelResources.textContent = 'единиц';
      el.statDone.classList.add('is-amber');
    } else if (ui.tab === 'loot' && LOOT_TOTAL) {
      el.statDone.classList.remove('is-amber');
      el.statContracts.textContent = fmt(LOOT_TOTAL);
      el.statActive.textContent = fmt(LOOT_SYSTEMS.filter((system) => LOOT_SYSTEM_COUNTS[system] > 0).length);
      el.statDone.textContent = fmt(LOOT_EXTREME_TOTAL);
      el.statResources.textContent = fmt(LOOT_TOP_TOTAL);
      if (el.statLabelContracts) el.statLabelContracts.textContent = 'локаций';
      if (el.statLabelActive) el.statLabelActive.textContent = 'системы';
      if (el.statLabelDone) el.statLabelDone.textContent = 'экстремальных';
      if (el.statLabelResources) el.statLabelResources.textContent = 'топ-мест';
    } else if (ui.tab === 'fabricator' && FAB_TOTAL) {
      el.statContracts.textContent = fmt(FAB_TOTAL);
      el.statActive.textContent = fmt(FAB_MISSION_TOTAL);
      el.statDone.textContent = fmt(FAB_DEFAULT_TOTAL);
      el.statResources.textContent = fmt(FAB_RESOURCE_ROWS.length);
      if (el.statLabelContracts) el.statLabelContracts.textContent = 'чертежей';
      if (el.statLabelActive) el.statLabelActive.textContent = 'с миссией';
      if (el.statLabelDone) el.statLabelDone.textContent = 'базовых';
      if (el.statLabelResources) el.statLabelResources.textContent = 'ресурсов';
    } else {
      el.statContracts.textContent = fmt(TOTAL_CONTRACTS);
      el.statActive.textContent = fmt(active);
      el.statDone.textContent = fmt(done);
      el.statResources.textContent = fmt(TOTAL_RESOURCES);
      if (el.statLabelContracts) el.statLabelContracts.textContent = 'контрактов';
      if (el.statLabelActive) el.statLabelActive.textContent = 'в работе';
      if (el.statLabelDone) el.statLabelDone.textContent = 'готово';
      if (el.statLabelResources) el.statLabelResources.textContent = 'ресурсов';
    }
    if (ui.tab !== 'inventory') el.statDone.classList.remove('is-amber');
  }

  function updateTabs() {
    document.querySelectorAll('.tab[data-tab]').forEach((tab) => {
      const isCurrent = tab.dataset.tab === ui.tab;
      tab.classList.toggle('is-active', isCurrent);
      tab.setAttribute('aria-selected', String(isCurrent));
    });
  }

  function renderView() {
    if (ui.tab === 'resources') renderResourcesView();
    else if (ui.tab === 'inventory') renderInventoryView();
    else if (ui.tab === 'fabricator') renderFabricatorView();
    else if (ui.tab === 'loot') renderLootView();
    else renderContractsView();
    applyFocusAfterRender();
  }

  function renderAll() {
    updateTabs();
    updateCounters();
    renderSidebar();
    updateContentHead();
    renderView();
    updateSaveIndicator();
  }

  function setTab(tab) {
    if (!['contracts', 'active', 'resources', 'inventory', 'fabricator', 'loot'].includes(tab)) return;
    if (ui.tab === tab) return;
    closeModal();
    closeDrawer();
    ui.tab = tab;
    saveUiSoon();
    el.workspace.classList.remove('filters-open');
    el.filtersToggle.setAttribute('aria-expanded', 'false');
    updateTabs();
    updateCounters();
    renderSidebar();
    updateContentHead();
    renderView();
    window.scrollTo(0, 0);
  }

  function reqActionsHtml(contract, order, found) {
    const depositLots = contractDepositLots(contract.id, order.name);
    const deposited = lotsTotal(depositLots);
    const quality = lotsAverage(depositLots);
    const lots = inventoryLots(order.name);
    const stock = lotsTotal(lots);
    const capacity = Math.min(contractDepositCapacity(order, lots), Math.max(0, order.qty - found));
    return `<div class="req-actions" data-req-actions data-deposit-scope>
      <span class="req-stock${stock > 0 ? ' has-stock' : ''}" title="${stock > 0 ? 'Доступно на личном складе' : 'Пополните склад во вкладке «Мои ресурсы»'}">${svgIcon('box')} ${stock > 0 ? `В инвентаре: <b>${fmt(stock)}</b> ед.` : 'Нет в инвентаре'}</span>
      ${stock > 0 ? `<span class="req-lots">${qualityLotsChips(lots)}</span>` : ''}
      ${capacity > 0 ? `${qualitySelectHtml(order.name, { includeAll: true })}<button class="req-deposit" type="button" data-action="deposit-inventory-contract" data-resource="${esc(order.name)}" data-contract-id="${esc(contract.id)}">Внести</button>` : ''}
      ${deposited > 0 ? `<span class="req-deposited">Из склада: ${contractDepositLabel(deposited, order)} · Q${fmt(quality)}</span><button class="req-withdraw" type="button" data-action="withdraw-contract-deposit" data-resource="${esc(order.name)}" data-contract-id="${esc(contract.id)}">Вернуть</button>` : ''}
    </div>`;
  }

  function reqRowHtml(contract, order) {
    const found = getFound(contract, order.name);
    const done = found >= order.qty;
    const partial = found > 0 && !done;
    const pct = order.qty > 0 ? Math.round((found / order.qty) * 100) : 0;
    const kind = KIND_META[resourceKind(order.name)] || KIND_META.equipment;
    const kindClass = getResourceKindClass(resourceKind(order.name));
    const art = resourceImage(order);
    return `
      <div class="req-row${done ? ' is-done' : partial ? ' is-partial' : ''}" data-req-row data-contract-id="${contract.id}" data-resource="${esc(order.name)}" data-qty="${order.qty}" data-found="${found}" style="--fill:${pct}%">
        <button class="req-check" type="button" role="checkbox" aria-checked="${done ? 'true' : partial ? 'mixed' : 'false'}" aria-label="${done ? 'Снять отметку' : 'Отметить'} ${esc(order.name)}: ${fmt(found)} из ${qtyLabel(order.qty, order.unit)}" data-action="toggle-req" data-contract-id="${contract.id}" data-resource="${esc(order.name)}">${svgIcon('check')}</button>
        <button class="req-thumb ${kindClass}" type="button" data-action="open-resource" data-key="${esc(`${order.name}|${order.unit}`)}" aria-label="Подробнее о ${esc(order.name)}" title="Подробнее о ${esc(order.name)}">${svgIcon(kind.icon)}${art ? imageTag(art, order.name) : ''}</button>
        <div class="req-main">
          <button class="req-name" type="button" data-action="open-resource" data-key="${esc(`${order.name}|${order.unit}`)}" title="Подробнее о ${esc(order.name)}"><span>${esc(order.name)}</span></button>
          <div class="req-sub">Нужно ${qtyLabel(order.qty, order.unit)}</div>
        </div>
        <div class="req-counter">
          <button class="step-btn" type="button" data-action="dec-req" data-contract-id="${contract.id}" data-resource="${esc(order.name)}" aria-label="Уменьшить количество ${esc(order.name)}"${found <= 0 ? ' disabled' : ''}>${svgIcon('minus')}</button>
          <span class="step-value"><span class="found">${fmt(found)}</span><span class="of"> / ${fmt(order.qty)}</span></span>
          <button class="step-btn" type="button" data-action="inc-req" data-contract-id="${contract.id}" data-resource="${esc(order.name)}" aria-label="Увеличить количество ${esc(order.name)}"${found >= order.qty ? ' disabled' : ''}>${svgIcon('plus')}</button>
        </div>
        ${reqActionsHtml(contract, order, found)}
      </div>`;
  }

  function drawerHtml(contract) {
    const stat = contractStats(contract);
    const category = CATEGORY_META[contract.category] || CATEGORY_META.other;
    const pinned = pinnedSet.has(contract.id);
    const art = contractImage(contract);
    const rewardListClass = contract.rewards.length > 8 ? ' is-scroll' : '';
    const rewardsHtml = contract.rewards.length
      ? contract.rewards.map((reward) => {
        const rewardArt = rewardImage(reward);
        return `<div class="reward-row"><span class="reward-thumb">${svgIcon('trophy')}${rewardArt ? imageTag(rewardArt, reward.name) : ''}</span><span class="qty">${rewardQty(reward.qty, reward.unit)}</span><span class="name">${esc(reward.name)}</span></div>`;
      }).join('')
      : '<div class="modal-hint">Нет данных о награде.</div>';
    const blueprintsHtml = contract.blueprints.length
      ? `<div class="blueprint-list">${contract.blueprints.map((bp) => `<span class="blueprint-tag">${svgIcon('file')} ${esc(bp.name)}</span>`).join('')}</div>`
      : '';
    const statusText = stat.complete ? 'Готово' : stat.started ? 'В работе' : 'Не начат';
    const availability = contract.availability && contract.availability !== 'Available' ? contract.availability : 'Доступен';
    return `
      <button class="btn btn-icon drawer-close" type="button" data-action="close-drawer" aria-label="Закрыть чек-лист">${svgIcon('close')}</button>
      <div class="drawer-head">
        <div class="drawer-breadcrumb">Контракты / ${esc(category.label)}</div>
        <div class="drawer-title-row">
          ${art ? `<div class="drawer-art cat-${contract.category}">${svgIcon(category.icon)}${imageTag(art, contract.name)}</div>` : `<div class="cat-badge cat-${contract.category}">${svgIcon(category.icon)}</div>`}
          <div class="drawer-title-main">
            <h2 id="drawer-title">${esc(contract.name)}</h2>
            <div class="drawer-badges">
              <span class="badge badge--cat">${esc(category.label)}</span>
              ${contract.reputation ? `<span class="badge badge--rep">${svgIcon('star')} ${esc(repLabel(contract.reputation))}</span>` : ''}
              <span class="badge${stat.complete ? ' badge--done' : ''}" data-drawer-status>${statusText}</span>
            </div>
          </div>
          <button class="pin-btn${pinned ? ' is-pinned' : ''}" type="button" data-action="toggle-pin" data-id="${contract.id}" aria-pressed="${pinned}" aria-label="${pinned ? 'Убрать из закреплённых' : 'Закрепить контракт'}" title="${pinned ? 'Убрать из закреплённых' : 'Закрепить контракт'}">${svgIcon('star')}</button>
        </div>
        <div class="drawer-progress" id="drawer-progress">
          <div class="progress-meta"><span id="drawer-progress-label">${stat.done} из ${stat.total} ${plural(stat.total, POSITION_FORMS[0], POSITION_FORMS[1], POSITION_FORMS[2])}</span><span class="pct" id="drawer-progress-pct">${stat.percent}%</span></div>
          <div class="progress-track"><div class="progress-fill" id="drawer-progress-fill" style="width:${stat.percent}%"></div></div>
        </div>
      </div>
      <div class="drawer-body">
        <section class="drawer-section">
          <h3>Награда <span>${contract.rewards.length ? countOf(contract.rewards.length, ['предмет', 'предмета', 'предметов']) : ''}</span></h3>
          <div class="reward-list${rewardListClass}">${rewardsHtml}</div>
          ${blueprintsHtml}
        </section>
        <section class="drawer-section">
          <h3>Что нужно собрать <span>${countOf(contract.orders.length, POSITION_FORMS)}</span></h3>
          <p class="req-quality-note">${svgIcon('info')} Качество влияет только на крафт. В контракте прогресс считается по количеству, но каждая партия сохраняется и вернётся на склад с исходным качеством.</p>
          <div class="req-list" id="drawer-req-list">${contract.orders.map((order) => reqRowHtml(contract, order)).join('')}</div>
        </section>
        ${contractComparisonHtml(contract)}
        <section class="drawer-section">
          <h3>Информация</h3>
          <div class="info-grid">
            <div class="info-cell"><dt>Категория</dt><dd>${esc(category.label)}</dd></div>
            <div class="info-cell"><dt>Репутация</dt><dd>${esc(contract.reputation || 'Не требуется')}</dd></div>
            <div class="info-cell"><dt>Сдача</dt><dd>${esc(contract.pickup || 'Wikelo Emporium')}</dd></div>
            <div class="info-cell"><dt>Доступность</dt><dd>${esc(availability)}</dd></div>
            <div class="info-cell"><dt>Позиций</dt><dd>${fmt(contract.orders.length)}</dd></div>
            <div class="info-cell"><dt>Источник</dt><dd>Star Citizen Wiki</dd></div>
          </div>
          <a class="wiki-link" href="${esc(contract.wiki)}" target="_blank" rel="noopener">Открыть страницу контракта на Wiki ${svgIcon('external')}</a>
        </section>
      </div>
      <div class="drawer-foot">
        <div class="foot-left">
          <span class="foot-pct${stat.complete ? ' is-complete' : ''}" id="drawer-foot-pct">${stat.percent}%</span>
          <span class="foot-label" id="drawer-foot-label">${stat.done} из ${stat.total} ${plural(stat.total, POSITION_FORMS[0], POSITION_FORMS[1], POSITION_FORMS[2])}</span>
        </div>
        <div class="foot-actions">
          <button class="btn btn-outline" type="button" data-action="mark-all" data-id="${contract.id}" id="drawer-mark-all"${stat.complete ? ' disabled' : ''}>${svgIcon('check')} <span class="btn-text-long">Отметить всё</span></button>
          <button class="btn btn-quiet" type="button" data-action="reset-contract" data-id="${contract.id}" id="drawer-reset"${!stat.started ? ' disabled' : ''}>Сбросить</button>
        </div>
      </div>`;
  }

  function openDrawer(id) {
    const contract = CONTRACT_BY_ID.get(id);
    if (!contract) return;
    closeModal();
    capturedFocus = captureFocus();
    drawerContractId = id;
    drawerBpId = null;
    drawerDirty = false;
    el.drawer.innerHTML = drawerHtml(contract);
    el.drawerLayer.classList.add('is-open');
    el.drawerLayer.setAttribute('aria-hidden', 'false');
    updateBodyScroll();
    setTimeout(() => {
      el.drawer.querySelector('.drawer-close')?.focus({ preventScroll: true });
    }, 60);
  }

  function refreshOpenDrawer() {
    if (!el.drawerLayer.classList.contains('is-open')) return;
    const body = el.drawer.querySelector('.drawer-body');
    const scroll = body?.scrollTop || 0;
    const active = document.activeElement instanceof HTMLElement && el.drawer.contains(document.activeElement) ? document.activeElement : null;
    const focusState = active ? {
      role: active.dataset.role || '',
      action: active.dataset.action || '',
      resource: active.dataset.resource || '',
      contractId: active.dataset.contractId || '',
      bpId: active.dataset.bpId || '',
      key: active.dataset.key || '',
      delta: active.dataset.delta || ''
    } : null;
    if (drawerContractId) {
      const contract = CONTRACT_BY_ID.get(drawerContractId);
      if (!contract) return;
      el.drawer.innerHTML = drawerHtml(contract);
    } else if (drawerBpId) {
      const bp = FAB_BP_BY_ID.get(drawerBpId);
      if (!bp) return;
      el.drawer.innerHTML = fabDrawerHtml(bp);
    } else {
      return;
    }
    requestAnimationFrame(() => {
      const nextBody = el.drawer.querySelector('.drawer-body');
      if (nextBody) nextBody.scrollTop = scroll;
      if (!focusState) return;
      const candidates = [...el.drawer.querySelectorAll('[data-action], [data-role]')];
      let target = candidates.find((node) => (
        (node.dataset.role || '') === focusState.role
        && (node.dataset.action || '') === focusState.action
        && (node.dataset.resource || '') === focusState.resource
        && (node.dataset.contractId || '') === focusState.contractId
        && (node.dataset.bpId || '') === focusState.bpId
        && (node.dataset.key || '') === focusState.key
        && (node.dataset.delta || '') === focusState.delta
      ));
      if (!target && focusState.action === 'deposit-inventory-blueprint') {
        target = candidates.find((node) => node.dataset.action === 'withdraw-blueprint-deposit'
          && (node.dataset.bpId || '') === focusState.bpId
          && (node.dataset.key || '') === focusState.key);
      }
      if (!target && focusState.action === 'deposit-inventory-contract') {
        target = candidates.find((node) => node.dataset.action === 'withdraw-contract-deposit'
          && (node.dataset.contractId || '') === focusState.contractId
          && (node.dataset.resource || '') === focusState.resource);
      }
      if (!target && focusState.action === 'deposit-all-blueprint') {
        target = el.drawer.querySelector('[data-action="withdraw-all-blueprint"]');
      }
      target = target || el.drawer.querySelector('.drawer-close');
      target?.focus({ preventScroll: true });
    });
  }

  function closeDrawer(skipRender = false) {
    if (!el.drawerLayer.classList.contains('is-open')) return;
    el.drawerLayer.classList.remove('is-open');
    el.drawerLayer.setAttribute('aria-hidden', 'true');
    drawerContractId = null;
    drawerBpId = null;
    updateBodyScroll();
    if (drawerDirty && !skipRender) {
      renderView();
      updateContentHead();
      updateCounters();
    }
    drawerDirty = false;
    const focusTarget = capturedFocus;
    capturedFocus = null;
    setTimeout(() => {
      if (!el.drawerLayer.classList.contains('is-open')) el.drawer.innerHTML = '';
      restoreCapturedFocus(focusTarget);
    }, 0);
  }

  function captureFocus() {
    const active = document.activeElement;
    if (!(active instanceof Element)) return null;
    const card = active.closest('[data-card-id]');
    if (card) return { type: 'card', id: card.dataset.cardId };
    const fabCard = active.closest('[data-fab-id]');
    if (fabCard) return { type: 'fab-card', id: fabCard.dataset.fabId };
    const lootCard = active.closest('[data-loot-id]');
    if (lootCard) return { type: 'loot-card', id: lootCard.dataset.lootId };
    const quick = active.closest('[data-action="quick-toggle"]');
    if (quick) return { type: 'quick', contractId: quick.dataset.contractId, resource: quick.dataset.resource };
    const resourceRow = active.closest('[data-resource-key]');
    if (resourceRow) return { type: 'resource', key: resourceRow.dataset.resourceKey };
    return { type: 'element', el: active };
  }

  function restoreCapturedFocus(descriptor) {
    if (!descriptor) return;
    let target = null;
    if (descriptor.type === 'card') {
      const card = document.querySelector(`[data-card-id="${cssEscape(descriptor.id)}"]`);
      target = card?.querySelector('.card-open') || null;
    } else if (descriptor.type === 'fab-card') {
      const card = document.querySelector(`[data-fab-id="${cssEscape(descriptor.id)}"]`);
      target = card?.querySelector('.fab-open') || card || null;
    } else if (descriptor.type === 'loot-card') {
      const card = document.querySelector(`[data-loot-id="${cssEscape(descriptor.id)}"]`);
      target = card?.querySelector('.loot-open') || card || null;
    } else if (descriptor.type === 'fab-more') {
      target = document.querySelector('[data-action="show-more-fabricator"]');
    } else if (descriptor.type === 'quick') {
      target = [...document.querySelectorAll('[data-action="quick-toggle"]')].find((btn) => btn.dataset.contractId === descriptor.contractId && btn.dataset.resource === descriptor.resource) || null;
    } else if (descriptor.type === 'resource') {
      const row = [...document.querySelectorAll('[data-resource-key]')].find((node) => node.dataset.resourceKey === descriptor.key);
      target = row?.querySelector('.res-expand') || null;
    } else if (descriptor.type === 'inventory' || descriptor.type === 'inventory-step' || descriptor.type === 'inventory-fav') {
      const card = [...document.querySelectorAll('[data-inventory-name]')].find((node) => node.dataset.inventoryName === descriptor.name);
      if (descriptor.type === 'inventory') {
        target = card?.querySelector('[data-role="inventory-qty"]') || null;
      } else if (descriptor.type === 'inventory-step') {
        target = [...(card?.querySelectorAll('[data-action="inventory-step"]') || [])].find((node) => Number(node.dataset.delta) === Number(descriptor.delta)) || null;
      } else {
        target = card?.querySelector('[data-action="toggle-resource-favorite"]') || null;
      }
    } else if (descriptor.type === 'inventory-sort') {
      target = document.querySelector('[data-role="inventory-sort"]');
    } else if (descriptor.el?.isConnected) {
      target = descriptor.el;
    }
    if (target) {
      target.focus({ preventScroll: true });
      if (target instanceof HTMLInputElement && target.type === 'number') {
        try { target.setSelectionRange(target.value.length, target.value.length); } catch (error) { /* number inputs may not support selection */ }
      }
    } else {
      document.querySelector('.tab.is-active')?.focus({ preventScroll: true });
    }
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return CSS.escape(value);
    return String(value).replace(/["\\]/g, '\\$&');
  }

  function updateBodyScroll() {
    const drawerOpen = el.drawerLayer.classList.contains('is-open');
    document.body.classList.toggle('no-scroll', drawerOpen || modalOpen);
  }

  function updateReqRowElement(rowEl, contract, order) {
    const found = getFound(contract, order.name);
    const done = found >= order.qty;
    const partial = found > 0 && !done;
    const pct = order.qty > 0 ? Math.round((found / order.qty) * 100) : 0;
    rowEl.dataset.found = String(found);
    rowEl.style.setProperty('--fill', `${pct}%`);
    rowEl.classList.toggle('is-done', done);
    rowEl.classList.toggle('is-partial', partial);
    const check = rowEl.querySelector('.req-check');
    if (check) {
      check.setAttribute('aria-checked', done ? 'true' : partial ? 'mixed' : 'false');
      check.setAttribute('aria-label', `${done ? 'Снять отметку' : 'Отметить'} ${order.name}: ${fmt(found)} из ${qtyLabel(order.qty, order.unit)}`);
    }
    const foundEl = rowEl.querySelector('.step-value .found');
    if (foundEl) foundEl.textContent = fmt(found);
    const dec = rowEl.querySelector('[data-action="dec-req"]');
    const inc = rowEl.querySelector('[data-action="inc-req"]');
    if (dec) dec.disabled = found <= 0;
    if (inc) inc.disabled = found >= order.qty;
    const actions = rowEl.querySelector('[data-req-actions]');
    if (actions) actions.outerHTML = reqActionsHtml(contract, order, found);
  }

  function updateDrawerRowsFor(contract, resourceName) {
    if (!el.drawerLayer.classList.contains('is-open')) return;
    const order = contract.orders.find((o) => o.name === resourceName);
    if (!order) return;
    el.drawer.querySelectorAll('.req-row').forEach((rowEl) => {
      if (rowEl.dataset.contractId === contract.id && rowEl.dataset.resource === resourceName) {
        updateReqRowElement(rowEl, contract, order);
      }
    });
  }

  function updateAllDrawerRows(contract) {
    if (!el.drawerLayer.classList.contains('is-open')) return;
    el.drawer.querySelectorAll('.req-row').forEach((rowEl) => {
      if (rowEl.dataset.contractId !== contract.id) return;
      const order = contract.orders.find((o) => o.name === rowEl.dataset.resource);
      if (order) updateReqRowElement(rowEl, contract, order);
    });
  }

  function updateDrawerProgress(contract) {
    if (!el.drawerLayer.classList.contains('is-open')) return;
    const stat = contractStats(contract);
    const fill = document.getElementById('drawer-progress-fill');
    const pct = document.getElementById('drawer-progress-pct');
    const label = document.getElementById('drawer-progress-label');
    const footPct = document.getElementById('drawer-foot-pct');
    const footLabel = document.getElementById('drawer-foot-label');
    if (fill) fill.style.width = `${stat.percent}%`;
    if (pct) pct.textContent = `${stat.percent}%`;
    if (label) label.textContent = `${stat.done} из ${stat.total} ${plural(stat.total, POSITION_FORMS[0], POSITION_FORMS[1], POSITION_FORMS[2])}`;
    if (footPct) {
      footPct.textContent = `${stat.percent}%`;
      footPct.classList.toggle('is-complete', stat.complete);
    }
    if (footLabel) footLabel.textContent = `${stat.done} из ${stat.total} ${plural(stat.total, POSITION_FORMS[0], POSITION_FORMS[1], POSITION_FORMS[2])}`;
    const status = el.drawer.querySelector('[data-drawer-status]');
    if (status) {
      status.textContent = stat.complete ? 'Готово' : stat.started ? 'В работе' : 'Не начат';
      status.classList.toggle('badge--done', stat.complete);
    }
    const markAll = document.getElementById('drawer-mark-all');
    const reset = document.getElementById('drawer-reset');
    if (markAll) markAll.disabled = stat.complete;
    if (reset) reset.disabled = !stat.started;
  }

  function setRequirement(contract, order, value, options = {}) {
    const before = contractStats(contract);
    const beforeFound = getFound(contract, order.name);
    const depositLots = contractDepositLots(contract.id, order.name);
    const beforeDeposited = lotsTotal(depositLots);
    const next = clamp(Math.round(Number(value) || 0), 0, order.qty);
    let nextDepositLots = depositLots;
    let returnedLots = [];
    if (next < beforeFound && next < beforeDeposited) {
      const take = lotsTake(depositLots, beforeDeposited - next, 'lowest');
      nextDepositLots = take.remaining;
      returnedLots = take.taken;
    }
    setFoundValue(contract, order, next);
    if (nextDepositLots.length) {
      if (!state.contractDeposits[contract.id]) state.contractDeposits[contract.id] = {};
      state.contractDeposits[contract.id][order.name] = lotsToObject(nextDepositLots);
    } else if (state.contractDeposits[contract.id]) {
      delete state.contractDeposits[contract.id][order.name];
      if (Object.keys(state.contractDeposits[contract.id]).length === 0) delete state.contractDeposits[contract.id];
    }
    for (const lot of returnedLots) inventoryAddLots(order.name, [{ q: lot.q, n: lot.n * contractUnitFactor(order) }]);
    const returned = lotsTotal(returnedLots);
    persistState();
    updateCounters();
    if (returned > 0) {
      drawerDirty = true;
      refreshStockSurfaces();
    } else if (drawerContractId === contract.id) {
      updateDrawerRowsFor(contract, order.name);
      updateDrawerProgress(contract);
      drawerDirty = true;
    }
    const after = contractStats(contract);
    if (!options.silentToast && !before.complete && after.complete) {
      toast(`Контракт собран: ${contract.name}`, 'success');
    }
    if (ui.tab === 'resources' && !drawerContractId) {
      renderView();
      updateContentHead();
    }
  }

  function markAllProgress(contractId) {
    const contract = CONTRACT_BY_ID.get(contractId);
    if (!contract) return;
    if (!state.progress[contract.id]) state.progress[contract.id] = {};
    for (const order of contract.orders) state.progress[contract.id][order.name] = order.qty;
    persistState();
    updateCounters();
    if (drawerContractId === contract.id) {
      updateAllDrawerRows(contract);
      updateDrawerProgress(contract);
      drawerDirty = true;
    }
    toast('Все ресурсы отмечены как собранные', 'success');
  }

  function resetContractProgress(contractId) {
    const contract = CONTRACT_BY_ID.get(contractId);
    if (!contract) return;
    const stat = contractStats(contract);
    if (!stat.started) {
      toast('В этом контракте ещё нет отметок');
      return;
    }
    openConfirm({
      title: 'Сбросить прогресс контракта?',
      message: `Будут удалены все отметки для контракта «${esc(contract.name)}». Ресурсы, внесённые из личного склада, вернутся в «Мои ресурсы». Это действие нельзя отменить.`,
      confirmLabel: 'Сбросить',
      danger: true,
      onConfirm: () => {
        for (const [name, value] of Object.entries(state.contractDeposits[contract.id] || {})) {
          const order = contract.orders.find((row) => row.name === name);
          if (!order) continue;
          const lots = lotsFromRaw(value);
          for (const lot of lots) inventoryAddLots(name, [{ q: lot.q, n: lot.n * contractUnitFactor(order) }]);
        }
        delete state.contractDeposits[contract.id];
        delete state.progress[contract.id];
        persistState();
        refreshStockSurfaces();
        toast('Прогресс контракта сброшен, ресурсы возвращены на склад');
      }
    });
  }

  function togglePin(contractId) {
    const contract = CONTRACT_BY_ID.get(contractId);
    if (!contract) return;
    const wasPinned = pinnedSet.has(contract.id);
    if (wasPinned) {
      pinnedSet.delete(contract.id);
    } else {
      pinnedSet.add(contract.id);
    }
    state.pinned = [...pinnedSet];
    persistState();
    updateCounters();
    document.querySelectorAll('[data-action="toggle-pin"]').forEach((button) => {
      if (button.dataset.id !== contract.id) return;
      const pinned = pinnedSet.has(contract.id);
      button.classList.toggle('is-pinned', pinned);
      button.setAttribute('aria-pressed', String(pinned));
      button.setAttribute('aria-label', pinned ? 'Убрать из закреплённых' : 'Закрепить контракт');
      button.title = pinned ? 'Убрать из закреплённых' : 'Закрепить контракт';
    });
    const affectsList = ui.tab === 'active' || ui.tab === 'resources' || ui.pinnedOnly || ui.status === 'active';
    if (affectsList) {
      if (drawerContractId) drawerDirty = true;
      else {
        renderView();
        updateContentHead();
      }
    }
    toast(wasPinned ? 'Контракт убран из закреплённых' : 'Контракт закреплён');
  }

  function toggleResourceExpanded(key) {
    const index = ui.expandedResources.indexOf(key);
    if (index >= 0) ui.expandedResources.splice(index, 1);
    else ui.expandedResources.push(key);
    saveUiSoon();
    focusAfterRender = { type: 'resource', key };
    renderView();
    updateContentHead();
  }

  function quickToggle(contractId, resourceName) {
    const contract = CONTRACT_BY_ID.get(contractId);
    if (!contract) return;
    const order = contract.orders.find((o) => o.name === resourceName);
    if (!order) return;
    const found = getFound(contract, order.name);
    const next = found >= order.qty ? 0 : order.qty;
    focusAfterRender = { type: 'quick', contractId, resource: resourceName };
    setRequirement(contract, order, next);
  }

  function applyFocusAfterRender() {
    if (!focusAfterRender) return;
    const focus = focusAfterRender;
    focusAfterRender = null;
    requestAnimationFrame(() => restoreCapturedFocus(focus));
  }

  // --- Статические иконки -------------------------------------------------

  function fillStaticIcons(root = document) {
    root.querySelectorAll('.icon[data-icon]').forEach((node) => {
      const name = node.getAttribute('data-icon');
      if (!ICON_PATHS[name]) {
        node.remove();
        return;
      }
      node.outerHTML = svgIcon(name);
    });
  }

  // --- Меню ---------------------------------------------------------------

  function setMenu(open) {
    const next = Boolean(open);
    el.mainMenu.hidden = !next;
    el.menuBtn.setAttribute('aria-expanded', String(next));
    if (next) {
      requestAnimationFrame(() => {
        el.mainMenu.querySelector('button:not([disabled])')?.focus({ preventScroll: true });
      });
    }
  }

  function closeMenu(restoreFocus = false) {
    if (el.mainMenu.hidden) return;
    el.mainMenu.hidden = true;
    el.menuBtn.setAttribute('aria-expanded', 'false');
    if (restoreFocus) el.menuBtn.focus({ preventScroll: true });
  }

  function onMenuKeydown(event) {
    const items = [...el.mainMenu.querySelectorAll('button:not([disabled])')];
    if (!items.length) return;
    const current = items.indexOf(document.activeElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      const next = current < 0 ? 0 : (current + step + items.length) % items.length;
      items[next].focus({ preventScroll: true });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      items[event.key === 'Home' ? 0 : items.length - 1].focus({ preventScroll: true });
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeMenu(true);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      closeMenu(true);
    }
  }

  // --- Модальные окна -----------------------------------------------------

  function openModal(options = {}) {
    const previousFocus = modalOpen ? modalLastFocused : null;
    if (modalOpen) closeModal(true);
    modalLastFocused = previousFocus || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    modalCloseHandler = typeof options.onClose === 'function' ? options.onClose : null;
    pendingConfirm = null;
    modalOpen = true;
    const wideClass = options.wide ? ' modal--wide' : '';
    const kicker = options.kicker ? `<p class="modal-kicker">${esc(options.kicker)}</p>` : '';
    el.modalLayer.innerHTML = `
      <div class="modal-backdrop" data-action="close-modal"></div>
      <div class="modal${wideClass}" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
        <div class="modal-head">
          <div>
            ${kicker}
            <h2 id="modal-title">${esc(options.title || '')}</h2>
          </div>
          <button class="modal-close" type="button" data-action="close-modal" aria-label="Закрыть окно">${svgIcon('close')}</button>
        </div>
        <div class="modal-body">${options.body || ''}</div>
        ${options.actions ? `<div class="modal-actions">${options.actions}</div>` : ''}
      </div>`;
    el.modalLayer.classList.add('is-open');
    el.modalLayer.setAttribute('aria-hidden', 'false');
    updateBodyScroll();
    setTimeout(() => {
      const preferred = options.initialFocus ? el.modalLayer.querySelector(options.initialFocus) : null;
      const target = preferred || el.modalLayer.querySelector('.modal-close') || el.modalLayer.querySelector('.modal');
      target?.focus?.({ preventScroll: true });
    }, 40);
  }

  function closeModal(skipRestore = false) {
    if (!modalOpen) return;
    modalOpen = false;
    inventoryModalName = null;
    imageEditorName = null;
    el.modalLayer.classList.remove('is-open');
    const focusTarget = modalLastFocused;
    const closeHandler = modalCloseHandler;
    if (el.modalLayer.contains(document.activeElement)) {
      if (!skipRestore) {
        if (focusTarget?.isConnected) focusTarget.focus({ preventScroll: true });
        if (el.modalLayer.contains(document.activeElement)) document.querySelector('.tab.is-active')?.focus({ preventScroll: true });
      }
      if (el.modalLayer.contains(document.activeElement)) document.activeElement.blur();
    }
    el.modalLayer.setAttribute('aria-hidden', 'true');
    modalLastFocused = null;
    modalCloseHandler = null;
    pendingConfirm = null;
    updateBodyScroll();
    setTimeout(() => {
      if (!modalOpen) el.modalLayer.innerHTML = '';
      if (!skipRestore) {
        if (focusTarget?.isConnected) focusTarget.focus({ preventScroll: true });
        else document.querySelector('.tab.is-active')?.focus({ preventScroll: true });
      }
      if (typeof closeHandler === 'function') closeHandler();
    }, 0);
  }

  function openConfirm(options = {}) {
    openModal({
      kicker: 'Подтверждение',
      title: options.title || 'Подтвердите действие',
      body: `<p>${options.message || ''}</p>`,
      actions: `
        <button class="btn btn-outline" type="button" data-action="close-modal">${esc(options.cancelLabel || 'Отмена')}</button>
        <button class="btn ${options.danger ? 'btn-danger' : 'btn-primary'}" type="button" data-action="confirm-modal">${esc(options.confirmLabel || 'Подтвердить')}</button>`
    });
    pendingConfirm = typeof options.onConfirm === 'function' ? options.onConfirm : null;
  }

  function confirmModalAction() {
    const action = pendingConfirm;
    pendingConfirm = null;
    closeModal();
    if (typeof action !== 'function') return;
    try {
      action();
    } catch (error) {
      console.error(error);
      toast('Не удалось выполнить действие', 'error');
    }
  }

  // --- Импорт и экспорт ---------------------------------------------------

  function readFileText(file) {
    if (typeof file.text === 'function') return file.text();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Не удалось прочитать файл.'));
      reader.readAsText(file, 'utf-8');
    });
  }

  function parseImportPayload(text) {
    let raw;
    try {
      raw = JSON.parse(text);
    } catch (error) {
      throw new Error('Файл не является корректным JSON. Выберите файл, созданный кнопкой «Экспорт».');
    }
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      throw new Error('В файле нет объекта с данными прогресса.');
    }
    const source = raw.state && typeof raw.state === 'object' && !Array.isArray(raw.state) ? raw.state : raw;
    const hasSignature = raw.app === APP_ID
      || Object.prototype.hasOwnProperty.call(source, 'progress')
      || Object.prototype.hasOwnProperty.call(source, 'pinned')
      || Object.prototype.hasOwnProperty.call(source, 'inventory');
    if (!hasSignature) {
      throw new Error('Файл не похож на резервную копию Wikelo Tracker: в нём нет полей progress, pinned или inventory.');
    }
    if (source.progress != null && (typeof source.progress !== 'object' || Array.isArray(source.progress))) {
      throw new Error('Поле progress в файле повреждено.');
    }
    if (source.pinned != null && !Array.isArray(source.pinned)) {
      throw new Error('Поле pinned в файле повреждено.');
    }
    if (source.favorites != null && !Array.isArray(source.favorites)) {
      throw new Error('Поле favorites в файле повреждено.');
    }
    if (source.resourceFavorites != null && !Array.isArray(source.resourceFavorites)) {
      throw new Error('Поле resourceFavorites в файле повреждено.');
    }
    if (source.inventory != null && (typeof source.inventory !== 'object' || Array.isArray(source.inventory))) {
      throw new Error('Поле inventory в файле повреждено.');
    }
    const normalized = normalizeState(source);
    const positions = Object.values(normalized.progress).reduce((sum, resources) => sum + Object.keys(resources).length, 0);
    const inventoryPositions = Object.keys(normalized.inventory).length;
    const blueprintPositions = Object.values(normalized.blueprintProgress).reduce((sum, rows) => sum + Object.keys(rows).length, 0);
    const customImages = Object.keys(normalized.customImages).length;
    if (positions === 0 && inventoryPositions === 0 && blueprintPositions === 0 && customImages === 0
      && normalized.pinned.length === 0 && normalized.favorites.length === 0 && normalized.resourceFavorites.length === 0) {
      throw new Error('В файле нет известных отметок ресурсов, склада, закреплённых контрактов, избранного или своих фото.');
    }
    return {
      state: normalized,
      stats: {
        contracts: Object.keys(normalized.progress).length,
        positions,
        pinned: normalized.pinned.length,
        favorites: normalized.favorites.length,
        inventoryPositions,
        inventoryUnits: Object.values(normalized.inventory).reduce((sum, value) => sum + lotsTotal(lotsFromRaw(value)), 0),
        resourceFavorites: normalized.resourceFavorites.length,
        customImages,
        exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : null,
        gameVersion: raw.meta && typeof raw.meta === 'object' ? raw.meta.gameVersion || null : null
      }
    };
  }

  async function handleImportFile(file) {
    if (!file) return;
    if (file.size > 16 * 1024 * 1024) {
      openImportError('Файл слишком большой (больше 16 МБ). Проверьте, что выбран JSON-экспорт трекера.');
      el.importFile.value = '';
      return;
    }
    try {
      const text = await readFileText(file);
      const parsed = parseImportPayload(text);
      pendingImport = { ...parsed, fileName: file.name };
      openImportModal();
    } catch (error) {
      pendingImport = null;
      openImportError(error instanceof Error ? error.message : 'Не удалось прочитать файл.');
    } finally {
      el.importFile.value = '';
    }
  }

  function openImportError(message) {
    openModal({
      kicker: 'Импорт',
      title: 'Не удалось импортировать',
      body: `
        <div class="import-error">${esc(message)}</div>
        <div class="modal-hint">Нужен JSON-файл, созданный кнопкой «Экспорт» в этом приложении. Импорт не изменяет текущий прогресс до подтверждения.</div>`,
      actions: '<button class="btn btn-primary" type="button" data-action="close-modal">Понятно</button>'
    });
  }

  function openImportModal() {
    if (!pendingImport) return;
    const { stats } = pendingImport;
    const exportedLine = stats.exportedAt
      ? `Файл создан ${esc(fmtDate(stats.exportedAt))}${stats.gameVersion ? ` · ${esc(stats.gameVersion)}` : ''}.`
      : 'Дата создания файла не указана.';
    openModal({
      kicker: 'Импорт',
      title: 'Импорт прогресса и склада',
      wide: true,
      initialFocus: 'input[name="import-mode"]:checked',
      onClose: () => {
        pendingImport = null;
      },
      body: `
        <div class="import-file">${svgIcon('file')}<span>${esc(pendingImport.fileName)}</span></div>
        <div class="import-stats">
          <div class="import-stat"><b>${fmt(stats.contracts)}</b><span>${plural(stats.contracts, CONTRACT_FORMS[0], CONTRACT_FORMS[1], CONTRACT_FORMS[2])}</span></div>
          <div class="import-stat"><b>${fmt(stats.positions)}</b><span>${plural(stats.positions, POSITION_FORMS[0], POSITION_FORMS[1], POSITION_FORMS[2])}</span></div>
          <div class="import-stat"><b>${fmt(stats.inventoryPositions || 0)}</b><span>позиций на складе</span></div>
          <div class="import-stat"><b>${fmt(stats.inventoryUnits || 0)}</b><span>единиц на складе</span></div>
          <div class="import-stat"><b>${fmt(stats.pinned)}</b><span>${plural(stats.pinned, PINNED_FORMS[0], PINNED_FORMS[1], PINNED_FORMS[2])}</span></div>
          <div class="import-stat"><b>${fmt((stats.favorites || 0) + (stats.resourceFavorites || 0))}</b><span>избранных</span></div>
          <div class="import-stat"><b>${fmt(stats.customImages || 0)}</b><span>своих фото</span></div>
        </div>
        <p class="modal-hint">${exportedLine}</p>
        <div class="mode-group" role="radiogroup" aria-label="Режим импорта">
          <label class="mode-option is-selected">
            <input type="radio" name="import-mode" value="merge" checked>
            <span><b>Объединить</b><small>Сохранить текущие отметки и добавить данные из файла. Для совпадающих ресурсов берётся большее количество.</small></span>
          </label>
          <label class="mode-option">
            <input type="radio" name="import-mode" value="replace">
            <span><b>Заменить</b><small>Удалить текущий прогресс и закрепы, затем загрузить данные из файла.</small></span>
          </label>
        </div>
        <div class="modal-hint"><strong>Совет.</strong> Перед заменой можно закрыть окно и сохранить текущий прогресс через «Экспорт».</div>`,
      actions: `
        <button class="btn btn-outline" type="button" data-action="close-modal">Отмена</button>
        <button class="btn btn-primary" type="button" data-action="confirm-import">Импортировать</button>`
    });
  }

  function confirmImport() {
    if (!pendingImport) return;
    const imported = pendingImport.state;
    const modeInput = el.modalLayer.querySelector('input[name="import-mode"]:checked');
    const mode = modeInput && modeInput.value === 'replace' ? 'replace' : 'merge';
    const stats = pendingImport.stats;
    closeModal();
    applyImportedState(imported, mode);
    const pinNote = stats.pinned > 0 ? ` Закреплено ${countOf(stats.pinned, CONTRACT_FORMS)}.` : '';
    const stockNote = stats.inventoryPositions > 0 ? ` На складе ${countOf(stats.inventoryPositions, POSITION_FORMS)}.` : '';
    toast(
      `${mode === 'replace' ? 'Данные заменены' : 'Данные объединены'}: ${countOf(stats.positions, POSITION_FORMS)}.${stockNote}${pinNote}`,
      'success'
    );
  }

  function mergeNestedMax(target, source) {
    for (const [outerKey, rows] of Object.entries(source || {})) {
      if (!rows || typeof rows !== 'object' || Array.isArray(rows)) continue;
      if (!target[outerKey]) target[outerKey] = {};
      for (const [key, value] of Object.entries(rows)) {
        target[outerKey][key] = Math.max(Number(target[outerKey][key]) || 0, Number(value) || 0);
      }
    }
  }

  function mergeLotObjects(a, b) {
    const map = new Map();
    for (const lot of [...lotsFromRaw(a), ...lotsFromRaw(b)]) {
      map.set(lot.q, Math.max(map.get(lot.q) || 0, lot.n));
    }
    return lotsToObject([...map.entries()].map(([q, n]) => ({ q, n })).sort((x, y) => x.q - y.q));
  }

  function mergeLotNested(target, source) {
    for (const [outerKey, rows] of Object.entries(source || {})) {
      if (!rows || typeof rows !== 'object' || Array.isArray(rows)) continue;
      if (!target[outerKey]) target[outerKey] = {};
      for (const [key, value] of Object.entries(rows)) {
        target[outerKey][key] = mergeLotObjects(target[outerKey][key], value);
      }
    }
  }

  function mergeFlatLots(target, source) {
    for (const [key, value] of Object.entries(source || {})) {
      target[key] = mergeLotObjects(target[key], value);
    }
  }

  function applyImportedState(imported, mode) {
    if (mode === 'replace') {
      state = normalizeState({
        progress: imported.progress || {},
        inventory: imported.inventory || {},
        contractDeposits: imported.contractDeposits || {},
        blueprintProgress: imported.blueprintProgress || {},
        blueprintDeposits: imported.blueprintDeposits || {},
        pinned: imported.pinned || [],
        favorites: imported.favorites || [],
        resourceFavorites: imported.resourceFavorites || [],
        customImages: imported.customImages || {},
        updatedAt: null
      });
    } else {
      const merged = {
        progress: state.progress,
        inventory: state.inventory,
        contractDeposits: state.contractDeposits,
        blueprintProgress: state.blueprintProgress,
        blueprintDeposits: state.blueprintDeposits,
        pinned: state.pinned,
        favorites: state.favorites,
        resourceFavorites: state.resourceFavorites,
        customImages: state.customImages
      };
      merged.customImages = { ...(imported.customImages || {}), ...(state.customImages || {}) };
      mergeNestedMax(merged.progress, imported.progress);
      mergeFlatLots(merged.inventory, imported.inventory);
      mergeLotNested(merged.contractDeposits, imported.contractDeposits);
      mergeNestedMax(merged.blueprintProgress, imported.blueprintProgress);
      mergeLotNested(merged.blueprintDeposits, imported.blueprintDeposits);
      merged.pinned = [...new Set([...pinnedSet, ...(imported.pinned || [])])];
      merged.favorites = [...new Set([...favoriteSet, ...(imported.favorites || [])])];
      merged.resourceFavorites = [...new Set([...resourceFavoriteSet, ...(imported.resourceFavorites || [])])];
      state = normalizeState(merged);
    }
    pinnedSet = new Set(state.pinned);
    favoriteSet = new Set(state.favorites);
    resourceFavoriteSet = new Set(state.resourceFavorites);
    closeDrawer(true);
    persistState();
    renderAll();
  }

  function exportJson() {
    const payload = {
      app: APP_ID,
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      meta: {
        source: DATA.meta?.source || 'https://starcitizen.tools/Wikelo',
        snapshot: DATA.meta?.fetchedAt || null,
        gameVersion: DATA.meta?.gameVersion || null,
        contracts: TOTAL_CONTRACTS
      },
      progress: state.progress,
      inventory: state.inventory,
      contractDeposits: state.contractDeposits,
      blueprintProgress: state.blueprintProgress,
      blueprintDeposits: state.blueprintDeposits,
      pinned: [...pinnedSet],
      favorites: [...favoriteSet],
      resourceFavorites: [...resourceFavoriteSet],
      customImages: state.customImages
    };
    downloadBlob(JSON.stringify(payload, null, 2), `wikelo-tracker-${dateStamp()}.json`, 'application/json;charset=utf-8');
    toast('Резервная копия сохранена в JSON', 'success');
  }

  function allResourceRowsForExport() {
    const map = new Map();
    for (const contract of CONTRACTS) {
      for (const order of contract.orders) {
        const key = `${order.name}|${order.unit}`;
        let row = map.get(key);
        if (!row) {
          row = { name: order.name, unit: order.unit, required: 0, found: 0, contracts: [] };
          map.set(key, row);
        }
        const found = Math.min(getFound(contract, order.name), order.qty);
        row.required += order.qty;
        row.found += found;
        row.contracts.push(contract.name);
      }
    }
    return [...map.values()].map((row) => {
      row.remaining = Math.max(0, row.required - row.found);
      row.kind = resourceKind(row.name);
      row.contracts.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
      return row;
    }).sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  }

  function csvCell(value) {
    const text = String(value ?? '');
    return /[";\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function exportCsv() {
    const rows = allResourceRowsForExport();
    const header = ['Ресурс', 'Тип', 'Ед. изм.', 'Нужно', 'Найдено', 'Осталось', 'На складе, ед.', 'Среднее качество', 'Контрактов', 'Контракты'];
    const lines = [header.join(';')];
    for (const row of rows) {
      lines.push([
        row.name,
        KIND_META[row.kind]?.label || 'Снаряжение',
        unitShort(row.unit),
        row.required,
        row.found,
        row.remaining,
        inventoryQty(row.name),
        inventoryQty(row.name) > 0 ? `Q${inventoryQuality(row.name)}` : '',
        row.contracts.length,
        row.contracts.join(', ')
      ].map(csvCell).join(';'));
    }
    const csv = `\uFEFF${lines.join('\r\n')}`;
    downloadBlob(csv, `wikelo-resources-${dateStamp()}.csv`, 'text/csv;charset=utf-8');
    toast(`CSV сохранён: ${countOf(rows.length, RESOURCE_FORMS)}`, 'success');
  }

  // --- Сброс и информация -------------------------------------------------

  function openReset() {
    let active = 0;
    let foundLines = 0;
    for (const contract of CONTRACTS) {
      const stat = contractStats(contract);
      if (stat.started || pinnedSet.has(contract.id)) active += 1;
      foundLines += stat.foundLines;
    }
    const blueprintPositions = Object.values(state.blueprintProgress || {}).reduce((sum, rows) => sum + Object.keys(rows || {}).length, 0);
    const removal = foundLines > 0 || blueprintPositions > 0
      ? `Будут удалены все отметки ресурсов: ${countOf(foundLines, POSITION_FORMS)}${blueprintPositions > 0 ? ` и ${countOf(blueprintPositions, ['материал', 'материала', 'материалов'])} в чертежах` : ''}.`
      : 'Отметок ресурсов пока нет.';
    const scopeNote = active > 0 ? ` Это затронет ${countOf(active, CONTRACT_FORMS)}.` : '';
    const stockNote = inventoryStockCount() > 0 ? ` Склад (${fmt(inventoryStockCount())} поз.) сохранится.` : '';
    openConfirm({
      title: 'Сбросить весь прогресс?',
      message: `${removal}${scopeNote} Ресурсы, внесённые из склада в контракты и чертежи, вернутся на склад.${stockNote} Закреплённые контракты и избранное останутся. Это действие нельзя отменить.`,
      confirmLabel: 'Сбросить всё',
      danger: true,
      onConfirm: () => {
        const keepPinned = [...pinnedSet];
        const keepFavorites = [...favoriteSet];
        const keepResourceFavorites = [...resourceFavoriteSet];
        const keepCustomImages = { ...(state.customImages || {}) };
        const keepInventory = Object.fromEntries(Object.entries(state.inventory || {}).map(([name, value]) => [name, lotsFromRaw(value)]));
        const returnToStock = (name, lots, factor = 1) => {
          if (!INVENTORY_RESOURCE_NAMES.has(name)) return;
          if (!keepInventory[name]) keepInventory[name] = [];
          for (const lot of lots) keepInventory[name] = lotsAdd(keepInventory[name], lot.q, lot.n * factor);
        };
        for (const [contractId, rows] of Object.entries(state.contractDeposits || {})) {
          const contract = CONTRACT_BY_ID.get(contractId);
          if (!contract) continue;
          for (const [name, value] of Object.entries(rows || {})) {
            const order = contract.orders.find((row) => row.name === name);
            if (order) returnToStock(name, lotsFromRaw(value), contractUnitFactor(order));
          }
        }
        for (const [bpId, rows] of Object.entries(state.blueprintDeposits || {})) {
          if (!FAB_BP_BY_ID.has(bpId)) continue;
          for (const [key, value] of Object.entries(rows || {})) {
            returnToStock(key.slice(0, key.lastIndexOf('|')), lotsFromRaw(value));
          }
        }
        state = freshState();
        state.pinned = keepPinned;
        state.favorites = keepFavorites;
        state.resourceFavorites = keepResourceFavorites;
        state.customImages = sanitizeCustomImages(keepCustomImages);
        state.inventory = sanitizeInventory(keepInventory);
        pinnedSet = new Set(keepPinned);
        favoriteSet = new Set(keepFavorites);
        resourceFavoriteSet = new Set(keepResourceFavorites);
        closeDrawer(true);
        persistState();
        renderAll();
        toast('Прогресс сброшен, ресурсы возвращены на склад', 'success');
      }
    });
  }

  function openClearInventory() {
    if (inventoryStockCount() === 0) {
      toast('Склад уже пуст', 'info');
      return;
    }
    openConfirm({
      title: 'Очистить склад?',
      message: `Будут удалены все свободные ресурсы: ${countOf(inventoryStockCount(), POSITION_FORMS)}, ${countOf(inventoryTotalUnits(), INVENTORY_UNIT_FORMS)}. Ресурсы, уже внесённые в контракты и чертежи, останутся там. Это действие нельзя отменить.`,
      confirmLabel: 'Очистить склад',
      danger: true,
      onConfirm: () => {
        state.inventory = {};
        persistState();
        refreshStockSurfaces();
        toast('Склад очищен', 'success');
      }
    });
  }

  function openAbout() {
    const done = CONTRACTS.filter((contract) => contractStats(contract).complete).length;
    const meta = DATA.meta || {};
    openModal({
      kicker: 'О приложении',
      title: 'Wikelo Tracker',
      wide: true,
      body: `
        <p>Локальный трекер ресурсов для контрактов Викело и фабрикатора в Star Citizen. Помогает понять, что уже найдено, чего не хватает, что лежит на личном складе и какие контракты готовы к сдаче.</p>
        <div class="import-stats">
          <div class="import-stat"><b>${fmt(TOTAL_CONTRACTS)}</b><span>контрактов</span></div>
          <div class="import-stat"><b>${fmt(TOTAL_RESOURCES)}</b><span>ресурсов</span></div>
          <div class="import-stat"><b>${fmt(done)}</b><span>готово</span></div>
        </div>
        <div class="import-card">
          <div class="import-file">${svgIcon('info')}<span>Снимок данных: ${esc(meta.fetchedAt ? fmtDate(meta.fetchedAt) : '—')} · ${esc(meta.gameVersion || '—')}</span></div>
          <div class="source-note">
            <a href="${esc(meta.source || 'https://starcitizen.tools/Wikelo')}" target="_blank" rel="noopener">Star Citizen Wiki · Wikelo</a>
            <span class="snap">Проверяйте актуальность после обновлений игры.</span>
          </div>
        </div>
        <ul class="guide">
          <li>Найдите нужный контракт во вкладке «Контракты» и откройте чек-лист.</li>
          <li>Во вкладке «Мои ресурсы» добавляйте партии с качеством Q0–Q1000. Q500 — базовое качество; поиск ищет по ресурсу, контракту и чертежу.</li>
          <li>Иконка камеры на фото материала позволяет добавить своё фото из файла или буфера обмена; «Вернуть оригинал» восстанавливает исходное изображение.</li>
          <li>Кнопка «Внести» списывает выбранную партию со склада в контракт или чертёж; «Вернуть» возвращает те же партии с исходным качеством.</li>
          <li>Отмечайте найденные ресурсы целиком или кнопками «+» и «−» указывайте количество.</li>
          <li>Вкладка «Ресурсы» по умолчанию показывает все ресурсы Викело и фабрикатора; фильтры — «Все ресурсы», «Викело», «Избранные / в работе».</li>
          <li>В панели чертежа блок «Качество крафта» показывает предварительное итоговое Q, качество слотов и модификаторы от Q500.</li>
          <li>В контракте и чертеже блок «Сравнение и покупка» показывает отличия от обычной версии и минимальную цену за aUEC, если она известна.</li>
          <li>Активные фильтры показаны чипами под заголовком раздела — чип можно снять одним нажатием.</li>
          <li>На длинных страницах справа снизу появляется кнопка возврата наверх.</li>
          <li>Прогресс сохраняется автоматически в этом браузере. Закрытие страницы его не сбрасывает.</li>
          <li>Для переноса или резервной копии используйте «Экспорт» и «Импорт».</li>
        </ul>
        <div class="modal-hint"><strong>Горячие клавиши.</strong> «/» — перейти к поиску, «Esc» — закрыть окно, чек-лист или меню. Текущая версия приложения: <b>v${APP_VERSION}</b>. Кнопка «Проверить обновления» сверяет версию с репозиторием на GitHub.</div>`,
      actions: `
        <button class="btn btn-quiet" type="button" data-action="check-updates">${svgIcon('refresh')} Проверить обновления</button>
        <button class="btn btn-quiet" type="button" data-action="open-reset">${svgIcon('trash')} Сбросить прогресс</button>
        <button class="btn btn-outline" type="button" data-action="close-modal">Закрыть</button>
        <button class="btn btn-primary" type="button" data-action="export-json">${svgIcon('download')} Экспорт JSON</button>`
    });
  }

  // --- Фильтры и навигация ------------------------------------------------

  function setCategory(category) {
    if (category !== 'all' && !CATEGORY_ORDER.includes(category)) return;
    ui.category = category;
    saveUiSoon();
    document.querySelectorAll('[data-action="set-category"]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.category === category);
    });
    renderView();
    updateContentHead();
  }

  function setResourceScope(scope) {
    if (!['all', 'wikelo', 'active'].includes(scope) || ui.resourceScope === scope) return;
    ui.resourceScope = scope;
    saveUiSoon();
    document.querySelectorAll('[data-action="set-resource-scope"]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.scope === scope);
    });
    renderView();
    updateContentHead();
  }

  function setFabricatorMode(mode) {
    if (!['blueprints', 'materials'].includes(mode) || ui.fabricatorMode === mode) return;
    ui.fabricatorMode = mode;
    ui.fabricatorSearch = '';
    ui.fabricatorShown = FAB_PAGE_SIZE;
    saveUiSoon();
    renderSidebar();
    renderView();
    updateContentHead();
    requestAnimationFrame(() => {
      document.querySelector(`[data-action="set-fabricator-mode"][data-mode="${mode}"]`)?.focus({ preventScroll: true });
    });
  }

  function setFabricatorCategory(category) {
    if (category !== 'all' && !FAB_CATEGORY_ORDER.includes(category)) return;
    if (category !== 'all' && ui.fabricatorSubcategory !== 'all' && !FAB_BLUEPRINTS.some((bp) => bp.c === category && bp.t === ui.fabricatorSubcategory)) {
      ui.fabricatorSubcategory = 'all';
      renderSidebar();
    }
    ui.fabricatorCategory = category;
    ui.fabricatorMode = 'blueprints';
    ui.fabricatorShown = FAB_PAGE_SIZE;
    saveUiSoon();
    document.querySelectorAll('[data-action="set-fabricator-category"]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.category === category);
    });
    renderView();
    updateContentHead();
  }

  function setFabricatorSource(source) {
    if (!['all', 'default', 'mission', 'none'].includes(source)) return;
    ui.fabricatorSource = source;
    ui.fabricatorMode = 'blueprints';
    ui.fabricatorShown = FAB_PAGE_SIZE;
    saveUiSoon();
    document.querySelectorAll('[data-action="set-fabricator-source"]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.source === source);
    });
    renderView();
    updateContentHead();
  }

  function setFabricatorResource(name) {
    if (name !== 'all' && !FAB_RESOURCE_ROWS.some((row) => row.name === name)) return;
    ui.fabricatorResource = name;
    ui.fabricatorMode = 'blueprints';
    ui.fabricatorShown = FAB_PAGE_SIZE;
    saveUiSoon();
    renderView();
    updateContentHead();
  }

  function applyFabricatorResource(name) {
    if (!FAB_RESOURCE_ROWS.some((row) => row.name === name)) return;
    closeModal(true);
    closeDrawer(true);
    ui.fabricatorSearch = '';
    ui.fabricatorCategory = 'all';
    ui.fabricatorSubcategory = 'all';
    ui.fabricatorFavoritesOnly = false;
    ui.fabricatorSource = 'all';
    ui.fabricatorResource = name;
    ui.fabricatorSystem = 'all';
    ui.fabricatorFaction = 'all';
    ui.fabricatorMissionType = 'all';
    ui.fabricatorMode = 'blueprints';
    ui.fabricatorShown = FAB_PAGE_SIZE;
    saveUiSoon();
    renderSidebar();
    updateContentHead();
    renderView();
    requestAnimationFrame(() => {
      document.getElementById('content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function resetFabricatorFilters(source) {
    ui.fabricatorSearch = '';
    ui.fabricatorCategory = 'all';
    ui.fabricatorSubcategory = 'all';
    ui.fabricatorFavoritesOnly = false;
    ui.fabricatorSource = 'all';
    ui.fabricatorResource = 'all';
    ui.fabricatorSystem = 'all';
    ui.fabricatorFaction = 'all';
    ui.fabricatorMissionType = 'all';
    ui.fabricatorSort = 'source-asc';
    ui.fabricatorShown = FAB_PAGE_SIZE;
    saveUiSoon();
    renderSidebar();
    updateContentHead();
    renderView();
    requestAnimationFrame(() => {
      if (source === el.resetFilters) document.querySelector('.tab.is-active')?.focus({ preventScroll: true });
      else document.querySelector('[data-role="fabricator-search"]')?.focus({ preventScroll: true });
    });
  }

  function showMoreFabricator() {
    const list = fabSortBlueprints(fabFilteredBlueprints());
    const before = Math.min(ui.fabricatorShown, list.length);
    if (before >= list.length) return;
    ui.fabricatorShown = Math.min(list.length, before + FAB_PAGE_SIZE);
    focusAfterRender = list[before] ? { type: 'fab-card', id: list[before].id } : { type: 'fab-more' };
    saveUiSoon();
    renderView();
    updateContentHead();
  }

  function resetContractFilters(source) {
    ui.contractSearch = '';
    ui.category = 'all';
    ui.reputation = 'all';
    ui.status = 'all';
    ui.pinnedOnly = false;
    saveUiSoon();
    renderSidebar();
    updateContentHead();
    renderView();
    requestAnimationFrame(() => {
      if (source === el.resetFilters) document.querySelector('.tab.is-active')?.focus({ preventScroll: true });
      else document.querySelector('[data-role="contract-search"]')?.focus({ preventScroll: true });
    });
  }

  function resetResourceFilters(source) {
    ui.resourceSearch = '';
    ui.resourceScope = 'all';
    ui.resourceHideDone = false;
    ui.resourceSort = 'name-asc';
    saveUiSoon();
    renderSidebar();
    updateContentHead();
    renderView();
    requestAnimationFrame(() => {
      if (source === el.resetFilters) document.querySelector('.tab.is-active')?.focus({ preventScroll: true });
      else document.querySelector('[data-role="resource-search"]')?.focus({ preventScroll: true });
    });
  }

  function setInventoryFilter(filter) {
    if (!['all', 'stock', 'committed', 'favorites', 'needed'].includes(filter) || ui.inventoryFilter === filter) return;
    ui.inventoryFilter = filter;
    ui.inventoryShown = INV_PAGE_SIZE;
    saveUiSoon();
    document.querySelectorAll('[data-action="set-inventory-filter"]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.filter === filter);
    });
    renderView();
    updateContentHead();
  }

  function resetInventoryFilters(source) {
    ui.inventorySearch = '';
    ui.inventoryFilter = 'all';
    ui.inventoryKind = 'all';
    ui.inventorySort = 'name-asc';
    ui.inventoryShown = INV_PAGE_SIZE;
    saveUiSoon();
    renderSidebar();
    updateContentHead();
    renderView();
    requestAnimationFrame(() => {
      if (source === el.resetFilters) document.querySelector('.tab.is-active')?.focus({ preventScroll: true });
      else document.querySelector('[data-role="inventory-search"]')?.focus({ preventScroll: true });
    });
  }

  function showCompletedResources() {
    ui.resourceHideDone = false;
    saveUiSoon();
    renderSidebar();
    renderView();
    updateContentHead();
    requestAnimationFrame(() => document.querySelector('[data-role="resource-search"]')?.focus({ preventScroll: true }));
  }

  function openFiltersPanel() {
    if (el.workspace.classList.contains('filters-open')) return;
    el.workspace.classList.add('filters-open');
    el.filtersToggle.setAttribute('aria-expanded', 'true');
  }

  function closeFiltersPanel() {
    if (!el.workspace.classList.contains('filters-open')) return;
    el.workspace.classList.remove('filters-open');
    el.filtersToggle.setAttribute('aria-expanded', 'false');
  }

  function focusSearch() {
    closeMenu();
    openFiltersPanel();
    requestAnimationFrame(() => {
      const input = el.sidebar.querySelector('[data-role="contract-search"], [data-role="resource-search"], [data-role="inventory-search"], [data-role="fabricator-search"], [data-role="loot-search"]');
      if (!input) return;
      input.focus({ preventScroll: true });
      if (typeof input.select === 'function') input.select();
    });
  }

  function scheduleViewRender() {
    clearTimeout(searchRenderTimer);
    searchRenderTimer = setTimeout(() => {
      renderView();
      updateContentHead();
    }, 140);
  }

  // --- События ------------------------------------------------------------

  function onSidebarInput(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.dataset.role === 'contract-search') {
      ui.contractSearch = target.value;
      saveUiSoon();
      scheduleViewRender();
    } else if (target.dataset.role === 'resource-search') {
      ui.resourceSearch = target.value;
      saveUiSoon();
      scheduleViewRender();
    } else if (target.dataset.role === 'inventory-search') {
      ui.inventorySearch = target.value;
      ui.inventoryShown = INV_PAGE_SIZE;
      saveUiSoon();
      scheduleViewRender();
    } else if (target.dataset.role === 'fabricator-search') {
      ui.fabricatorSearch = target.value;
      ui.fabricatorShown = FAB_PAGE_SIZE;
      saveUiSoon();
      scheduleViewRender();
    } else if (target.dataset.role === 'loot-search') {
      ui.lootSearch = target.value;
      saveUiSoon();
      scheduleViewRender();
    }
  }

  function onSidebarChange(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    const role = target.dataset.role;
    if (!role) return;
    if (role === 'rep-filter') ui.reputation = target.value;
    else if (role === 'status-filter') ui.status = target.value;
    else if (role === 'contract-sort') ui.contractSort = target.value;
    else if (role === 'resource-sort') ui.resourceSort = target.value;
    else if (role === 'inventory-kind') {
      ui.inventoryKind = target.value;
      ui.inventoryShown = INV_PAGE_SIZE;
    } else if (role === 'inventory-sort') {
      ui.inventorySort = target.value;
      ui.inventoryShown = INV_PAGE_SIZE;
      focusAfterRender = { type: 'inventory-sort' };
    }
    else if (role === 'pinned-only') ui.pinnedOnly = target.checked;
    else if (role === 'resource-hide-done') ui.resourceHideDone = target.checked;
    else if (role === 'loot-type') ui.lootType = target.value;
    else if (role === 'loot-mode') ui.lootMode = target.value;
    else if (role === 'loot-sort') ui.lootSort = target.value;
    else if (role === 'loot-solo-only') ui.lootSoloOnly = target.checked;
    else if (role === 'fabricator-subcategory') {
      ui.fabricatorSubcategory = target.value;
      ui.fabricatorShown = FAB_PAGE_SIZE;
    } else if (role === 'fabricator-favorites-only') {
      ui.fabricatorFavoritesOnly = target.checked;
      ui.fabricatorShown = FAB_PAGE_SIZE;
    } else if (role === 'fabricator-resource') {
      setFabricatorResource(target.value);
      return;
    } else if (role === 'fabricator-system') {
      ui.fabricatorSystem = target.value;
      ui.fabricatorMode = 'blueprints';
      ui.fabricatorShown = FAB_PAGE_SIZE;
    } else if (role === 'fabricator-faction') {
      ui.fabricatorFaction = target.value;
      ui.fabricatorMode = 'blueprints';
      ui.fabricatorShown = FAB_PAGE_SIZE;
    } else if (role === 'fabricator-mission-type') {
      ui.fabricatorMissionType = target.value;
      ui.fabricatorMode = 'blueprints';
      ui.fabricatorShown = FAB_PAGE_SIZE;
    } else if (role === 'fabricator-sort') {
      ui.fabricatorSort = target.value;
      ui.fabricatorShown = FAB_PAGE_SIZE;
    } else return;
    saveUiSoon();
    renderView();
    updateContentHead();
  }

  function onSidebarKeydown(event) {
    if (event.key !== 'Enter') return;
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.type !== 'search') return;
    clearTimeout(searchRenderTimer);
    renderView();
    updateContentHead();
  }

  function onModalChange(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.name !== 'import-mode') return;
    el.modalLayer.querySelectorAll('.mode-option').forEach((label) => {
      const input = label.querySelector('input[name="import-mode"]');
      label.classList.toggle('is-selected', Boolean(input?.checked));
    });
  }

  function depositQualityFor(node, fallback) {
    const scope = node.closest('[data-deposit-scope]');
    const select = scope?.querySelector('[data-role="deposit-quality"]');
    return select?.value || fallback;
  }

  function addInventoryLotFromForm(node) {
    const form = node.closest('.inv-lot-form');
    if (!form) return;
    const name = node.dataset.resource;
    const qualityInput = form.querySelector('[data-role="inventory-lot-quality"]');
    const qtyInput = form.querySelector('[data-role="inventory-lot-qty"]');
    const qualityText = String(qualityInput?.value ?? '').trim();
    const quality = Number(qualityText);
    const amount = Math.floor(Number(qtyInput?.value));
    if (!qualityText || !Number.isFinite(quality) || quality < QUALITY_MIN || quality > QUALITY_MAX) {
      toast(`Качество должно быть от Q${QUALITY_MIN} до Q${QUALITY_MAX}`, 'error');
      qualityInput?.focus();
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      toast('Количество должно быть больше нуля', 'error');
      qtyInput?.focus();
      return;
    }
    inventoryLotQuality = qualityValue(quality);
    inventoryAddLots(name, [{ q: inventoryLotQuality, n: amount }]);
    persistState();
    refreshStockSurfaces();
    toast(`Добавлено: ${fmt(amount)} ед. ${name} · Q${inventoryLotQuality}`, 'success');
  }

  function removeInventoryLotByQuality(node) {
    const name = node.dataset.resource;
    const quality = qualityValue(node.dataset.quality);
    const lots = inventoryLots(name);
    const lot = lots.find((item) => item.q === quality);
    if (!lot) return;
    removeInventoryLot(name, quality);
    toast(`Партия Q${quality} (${fmt(lot.n)} ед.) удалена`, 'success');
  }

  function onDocumentClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (!el.mainMenu.hidden && !target.closest('.menu-wrap')) closeMenu();
    const node = target.closest('[data-action]');
    if (!node) return;
    const action = node.dataset.action;
    if (node.closest('#main-menu')) closeMenu(true);

    switch (action) {
      case 'switch-tab':
        setTab(node.dataset.tab);
        break;
      case 'clear-active-filter':
        clearActiveFilter(node.dataset.filterKey);
        break;
      case 'open-contract': {
        const card = node.closest('[data-card-id]');
        if (card && document.activeElement !== card.querySelector('.card-open')) {
          card.querySelector('.card-open')?.focus({ preventScroll: true });
        }
        openDrawer(node.dataset.id);
        break;
      }
      case 'open-fabricator': {
        const card = node.closest('[data-fab-id]');
        if (card && document.activeElement !== card.querySelector('.fab-open')) {
          card.querySelector('.fab-open')?.focus({ preventScroll: true });
        }
        openFabricatorDrawer(node.dataset.id || card?.dataset.fabId);
        break;
      }
      case 'set-fabricator-mode':
        setFabricatorMode(node.dataset.mode);
        break;
      case 'set-fabricator-category':
        setFabricatorCategory(node.dataset.category);
        break;
      case 'set-fabricator-source':
        setFabricatorSource(node.dataset.source);
        break;
      case 'filter-fabricator-resource':
        applyFabricatorResource(node.dataset.resource);
        break;
      case 'open-fab-material':
        openFabMaterialModal(node.dataset.resource);
        break;
      case 'toggle-fab-favorite':
        toggleFabFavorite(node.dataset.id);
        break;
      case 'open-image':
        openImageLightbox(node.dataset.src, node.dataset.alt);
        break;
      case 'open-image-editor':
        openImageEditor(node.dataset.resource);
        break;
      case 'pick-custom-image':
        pickCustomImage();
        break;
      case 'paste-custom-image':
        pasteCustomImageFromClipboard();
        break;
      case 'reset-custom-image':
        resetCustomImage();
        break;
      case 'check-updates':
        checkForUpdates(true);
        break;
      case 'hide-update-banner':
        hideUpdateBanner();
        break;
      case 'dismiss-update-banner':
        dismissUpdateBanner(node.dataset.version);
        break;
      case 'open-loot':
        openLootDrawer(node.dataset.id || node.closest('[data-loot-id]')?.dataset.lootId);
        break;
      case 'set-loot-system':
        setLootSystem(node.dataset.system);
        break;
      case 'set-loot-risk':
        setLootRisk(node.dataset.risk);
        break;
      case 'reset-loot-filters':
        resetLootFilters();
        break;
      case 'reset-fabricator-filters':
        resetFabricatorFilters(node);
        break;
      case 'show-more-fabricator':
        showMoreFabricator();
        break;
      case 'toggle-pin':
        togglePin(node.dataset.id);
        break;
      case 'close-drawer':
        closeDrawer();
        break;
      case 'toggle-req':
        toggleRequirement(node.dataset.contractId, node.dataset.resource);
        break;
      case 'dec-req':
        changeRequirement(node.dataset.contractId, node.dataset.resource, -1);
        break;
      case 'inc-req':
        changeRequirement(node.dataset.contractId, node.dataset.resource, 1);
        break;
      case 'mark-all':
        markAllProgress(node.dataset.id);
        break;
      case 'reset-contract':
        resetContractProgress(node.dataset.id);
        break;
      case 'quick-toggle':
        quickToggle(node.dataset.contractId, node.dataset.resource);
        break;
      case 'toggle-resource':
        toggleResourceExpanded(node.dataset.key);
        break;
      case 'open-resource':
        openResourceModal(node.dataset.key);
        break;
      case 'open-inventory-resource':
        openInventoryResourceModal(node.dataset.resource);
        break;
      case 'toggle-resource-favorite':
        toggleResourceFavorite(node.dataset.resource);
        break;
      case 'add-inventory-lot':
        addInventoryLotFromForm(node);
        break;
      case 'remove-inventory-lot':
        removeInventoryLotByQuality(node);
        break;
      case 'set-inventory-filter':
        setInventoryFilter(node.dataset.filter);
        break;
      case 'show-more-inventory':
        showMoreInventory();
        break;
      case 'reset-inventory-filters':
        resetInventoryFilters(node);
        break;
      case 'open-clear-inventory':
        openClearInventory();
        break;
      case 'deposit-inventory-contract':
        depositContractFromInventory(node.dataset.resource, node.dataset.contractId, depositQualityFor(node, 'all'));
        break;
      case 'withdraw-contract-deposit':
        withdrawContractDeposit(node.dataset.resource, node.dataset.contractId);
        break;
      case 'deposit-inventory-blueprint':
        depositBlueprintFromInventory(node.dataset.resource, node.dataset.bpId, node.dataset.key, depositQualityFor(node, 'highest'));
        break;
      case 'withdraw-blueprint-deposit':
        withdrawBlueprintDeposit(node.dataset.bpId, node.dataset.key);
        break;
      case 'deposit-all-blueprint':
        depositAllBlueprintMaterials(node.dataset.id);
        break;
      case 'withdraw-all-blueprint':
        withdrawAllBlueprintMaterials(node.dataset.id);
        break;
      case 'toggle-inventory-usage':
        inventoryUsageShowAll = !inventoryUsageShowAll;
        if (inventoryModalName) openInventoryResourceModal(inventoryModalName, { preserveScroll: true });
        break;
      case 'set-category':
        setCategory(node.dataset.category);
        break;
      case 'set-resource-scope':
        setResourceScope(node.dataset.scope);
        break;
      case 'reset-contract-filters':
        resetContractFilters(node);
        break;
      case 'reset-resource-filters':
        resetResourceFilters(node);
        break;
      case 'show-completed-resources':
        showCompletedResources();
        break;
      case 'export-csv':
        exportCsv();
        break;
      case 'open-reset':
        openReset();
        break;
      case 'open-about':
        openAbout();
        break;
      case 'close-modal':
        closeModal();
        break;
      case 'confirm-modal':
        confirmModalAction();
        break;
      case 'confirm-import':
        confirmImport();
        break;
      case 'export-json':
        exportJson();
        closeModal();
        break;
      default:
        break;
    }
  }

  function toggleRequirement(contractId, resourceName) {
    const contract = CONTRACT_BY_ID.get(contractId);
    if (!contract) return;
    const order = contract.orders.find((o) => o.name === resourceName);
    if (!order) return;
    const found = getFound(contract, order.name);
    setRequirement(contract, order, found >= order.qty ? 0 : order.qty);
  }

  function changeRequirement(contractId, resourceName, delta) {
    const contract = CONTRACT_BY_ID.get(contractId);
    if (!contract) return;
    const order = contract.orders.find((o) => o.name === resourceName);
    if (!order) return;
    setRequirement(contract, order, getFound(contract, order.name) + delta);
  }

  function isEditableTarget(node) {
    if (!(node instanceof HTMLElement)) return false;
    return node.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(node.tagName);
  }

  function trapTab(event) {
    if (event.key !== 'Tab') return;
    const container = modalOpen
      ? el.modalLayer
      : el.drawerLayer.classList.contains('is-open') ? el.drawer : null;
    if (!container) return;
    const items = [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((node) => node.getClientRects().length > 0);
    if (!items.length) {
      event.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (!container.contains(document.activeElement)) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  function onDocumentKeydown(event) {
    if (event.key === 'Tab') {
      trapTab(event);
      return;
    }
    if (event.key === 'Escape') {
      if (modalOpen) {
        event.preventDefault();
        closeModal();
        return;
      }
      if (!el.mainMenu.hidden) {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (el.drawerLayer.classList.contains('is-open')) {
        event.preventDefault();
        closeDrawer();
        return;
      }
      if (el.workspace.classList.contains('filters-open')) {
        event.preventDefault();
        closeFiltersPanel();
      }
      return;
    }
    if ((event.key === '/' || event.code === 'Slash') && !isEditableTarget(document.activeElement) && !modalOpen && !el.drawerLayer.classList.contains('is-open')) {
      event.preventDefault();
      focusSearch();
    }
  }

  function flushUi() {
    if (!storageOk) return;
    try {
      localStorage.setItem(UI_KEY, JSON.stringify(ui));
    } catch (error) {
      // Настройки интерфейса не критичны.
    }
  }

  function bindEvents() {
    el.exportBtn.addEventListener('click', () => {
      closeMenu();
      exportJson();
    });
    el.importBtn.addEventListener('click', () => {
      closeMenu();
      el.importFile.value = '';
      el.importFile.click();
    });
    el.importFile.addEventListener('change', () => {
      const file = el.importFile.files && el.importFile.files[0];
      if (file) handleImportFile(file);
    });
    el.customImageFile?.addEventListener('change', onCustomImageFileChange);
    document.addEventListener('paste', onDocumentPaste);
    el.menuBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      setMenu(el.mainMenu.hidden);
    });
    el.mainMenu.addEventListener('keydown', onMenuKeydown);
    el.filtersToggle.addEventListener('click', () => {
      if (el.workspace.classList.contains('filters-open')) {
        closeFiltersPanel();
      } else {
        openFiltersPanel();
        requestAnimationFrame(() => {
          el.sidebar.querySelector('[data-role="contract-search"], [data-role="resource-search"], [data-role="inventory-search"], [data-role="fabricator-search"], [data-role="loot-search"]')?.focus({ preventScroll: true });
        });
      }
    });
    el.resetFilters.addEventListener('click', () => {
      if (ui.tab === 'resources') resetResourceFilters(el.resetFilters);
      else if (ui.tab === 'inventory') resetInventoryFilters(el.resetFilters);
      else if (ui.tab === 'fabricator') resetFabricatorFilters(el.resetFilters);
      else if (ui.tab === 'loot') resetLootFilters();
      else resetContractFilters(el.resetFilters);
    });
    el.sidebar.addEventListener('input', onSidebarInput);
    el.sidebar.addEventListener('change', onSidebarChange);
    el.sidebar.addEventListener('keydown', onSidebarKeydown);
    el.viewRoot.addEventListener('change', onSidebarChange);
    el.modalLayer.addEventListener('change', onModalChange);
      document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKeydown);
    window.addEventListener('pagehide', flushUi);
    window.addEventListener('beforeunload', flushUi);
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeFiltersPanel();
    });
    if (el.toTop) {
      let scrollFrame = 0;
      const updateToTop = () => {
        el.toTop.classList.toggle('is-visible', (window.scrollY || document.documentElement.scrollTop || 0) > 620);
      };
      window.addEventListener('scroll', () => {
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = 0;
          updateToTop();
        });
      }, { passive: true });
      el.toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.querySelector('.tab.is-active')?.focus({ preventScroll: true });
      });
      updateToTop();
    }
  }

  // --- Проверка обновлений ------------------------------------------------

  function updateBannerNode() {
    let node = document.getElementById('update-banner');
    if (!node) {
      node = document.createElement('div');
      node.id = 'update-banner';
      node.className = 'update-banner';
      node.setAttribute('role', 'status');
      node.hidden = true;
      document.body.appendChild(node);
    }
    return node;
  }

  function showUpdateBanner(info) {
    const version = String(info && info.version != null ? info.version : '').trim();
    if (!version) return;
    let dismissed = '';
    try { dismissed = localStorage.getItem(UPDATE_DISMISS_KEY) || ''; } catch (error) { /* storage unavailable */ }
    if (dismissed === version) return;
    const node = updateBannerNode();
    const url = typeof info.url === 'string' ? info.url : UPDATE_MANIFEST_URL.replace('/version.json', '');
    const title = typeof info.name === 'string' && info.name ? info.name : `Версия ${version}`;
    const notes = typeof info.notes === 'string' && info.notes ? `<span class="update-banner-notes">${esc(info.notes)}</span>` : '';
    node.innerHTML = `
      <div class="update-banner-body">
        <span class="update-banner-icon">${svgIcon('download')}</span>
        <div class="update-banner-copy">
          <b>Доступна новая версия</b>
          <span>${esc(title)}${notes}</span>
        </div>
      </div>
      <div class="update-banner-actions">
        <a class="btn btn-primary btn-xs" href="${esc(url)}" target="_blank" rel="noopener">Обновить</a>
        <button class="btn btn-quiet btn-xs" type="button" data-action="hide-update-banner">Позже</button>
        <button class="btn btn-quiet btn-xs" type="button" data-action="dismiss-update-banner" data-version="${esc(version)}">Скрыть</button>
      </div>`;
    node.hidden = false;
  }

  function hideUpdateBanner() {
    const node = document.getElementById('update-banner');
    if (node) node.hidden = true;
  }

  function dismissUpdateBanner(version) {
    if (!version) return;
    try { localStorage.setItem(UPDATE_DISMISS_KEY, String(version)); } catch (error) { /* storage unavailable */ }
    hideUpdateBanner();
  }

  async function checkForUpdates(manual = false) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), manual ? 10000 : 6000);
    try {
      const response = await fetch(`${UPDATE_MANIFEST_URL}?v=${Date.now()}`, { method: 'GET', cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const remote = Number(data && data.version);
      if (!Number.isFinite(remote)) throw new Error('bad manifest');
      if (remote > Number(APP_VERSION)) showUpdateBanner(data);
      else if (manual) toast(`У вас последняя версия (v${APP_VERSION}).`, 'success');
    } catch (error) {
      if (error?.name === 'AbortError') {
        if (manual) toast('Не удалось проверить обновления: нет ответа от GitHub.', 'error');
        return;
      }
      if (manual) toast('Не удалось проверить обновления. Проверьте интернет и откройте страницу репозитория.', 'error');
    } finally {
      clearTimeout(timer);
    }
  }

  // --- Запуск -------------------------------------------------------------

  function init() {
    fillStaticIcons();
    const meta = DATA.meta || {};
    if (el.dataDate) el.dataDate.textContent = meta.fetchedAt ? fmtDate(meta.fetchedAt) : '—';
    if (el.gameVersion) el.gameVersion.textContent = meta.gameVersion || '—';
    if (el.fabricatorVersion) el.fabricatorVersion.textContent = FAB_DATA.meta?.gameVersion || 'Alpha 4.10.2';
    bindEvents();
    if (!storageOk) {
      showStorageWarning('Браузер не разрешил локальное сохранение. Прогресс будет работать до закрытия страницы — сохраните экспорт, чтобы не потерять данные.');
    }
    updateSaveIndicator();
    renderAll();
    document.body.classList.add('boot');
    setTimeout(() => document.body.classList.remove('boot'), 1200);
    setTimeout(() => {
      if (navigator.onLine !== false) checkForUpdates(false);
    }, 2500);
  }

  init();
})();

