/* Star Citizen Alpha 4.10.2 — курируемый справочник мест для лута.
   Источники: Star Citizen Wiki, LootingPower (stoppingpower.io), Manifest,
   ExpCarry, GGWTB, Elyxir, SC Quick Guides, MMOEXP.
   Таблицы лута и доступность меняются между патчами: проверяйте перед вылетом. */
window.LOOT_DATA = {
  meta: {
    version: '4.10.2-LIVE.12881860',
    snapshot: '2026-10-29',
    title: 'Лут',
    count: 23,
    disclaimer: 'Лут-таблицы, доступ и поведение AI меняются между патчами. Это курируемый список проверенных направлений, а не гарантированный дроп-лист каждого ящика.',
    sources: [
      { label: 'Star Citizen Wiki', url: 'https://starcitizen.tools/' },
      { label: 'LootingPower', url: 'https://stoppingpower.io/loot/' },
      { label: 'Manifest — Sites', url: 'https://sc-manifest.com/sites' }
    ]
  },
  types: {
    distribution: { label: 'Distribution Center', icon: 'crate' },
    onyx: { label: 'Onyx Facility', icon: 'tech' },
    paf: { label: 'PAF / OLP', icon: 'ore' },
    bunker: { label: 'Bunker (UGF)', icon: 'armor' },
    druglab: { label: 'Drug Lab', icon: 'consumable' },
    security: { label: 'Security Post', icon: 'star' },
    event: { label: 'Событие', icon: 'star' },
    contested: { label: 'Contested Zone', icon: 'weapon' },
    hangar: { label: 'Executive Hangar', icon: 'ship' },
    lazarus: { label: 'Lazarus Facility', icon: 'tech' },
    derelict: { label: 'Derelict / Wreck', icon: 'salvage' },
    asteroid: { label: 'Asteroid Base', icon: 'ore' },
    outpost: { label: 'Outpost / Settlement', icon: 'box' },
    qv: { label: 'QV Station', icon: 'ore' },
    junk: { label: 'Junk Site', icon: 'salvage' }
  },
  risks: {
    medium: { label: 'Средний', level: 2 },
    high: { label: 'Высокий', level: 3 },
    extreme: { label: 'Экстремальный', level: 4 }
  },
  locations: [
    {
      id: 'greycat-dc',
      rank: 2,
      top: true,
      name: 'Greycat Distribution Center',
      type: 'distribution',
      system: 'Stanton',
      location: 'Hurston',
      risk: 'high',
      mode: 'PvPvE',
      group: '2–4',
      solo: false,
      summary: 'Крупный логистический хаб UEE на Hurston с семью точками оранжевых ящиков и редкой тяжёлой бронёй Palatino.',
      why: 'Один из самых плотных источников высокоуровневой брони и оружия в Stanton. Внутри много охраны, но шаблон лута запоминается быстро: часть ящиков снаружи, часть в рабочей зоне, часть за security checkpoint, один — на верхнем этаже лобби.',
      loot: ['Palatino heavy armor', 'Снайперские винтовки и LMG', 'Оружие высокого уровня', 'Обвесы и компоненты'],
      access: [
        'Летите к Greycat Distribution Center на Hurston и садитесь на площадку или у главного входа.',
        'Сначала зачистите внешнюю охрану и не оставляйте турели за спиной.',
        'Войдите через главный вход, ангар или сервисные коридоры.',
        'Проверьте две точки снаружи, две в рабочей зоне, две у security checkpoint и одну между VIP-комнатами.',
        'Осмотрите вентиляционные проходы: в некоторых вариантах DC есть скрытые комнаты.',
        'Вынесите добычу до того, как начнёте проверять оставшиеся ящики.'
      ],
      tips: [
        'Идите группой: внутри узкие коридоры и много AI.',
        'Сначала откройте security checkpoint, затем проверяйте прилегающие комнаты.',
        'Не задерживайтесь у входа после стрельбы — сюда часто приходят другие игроки.',
        'Если ищете именно Palatino, начинайте с оранжевых ящиков, а не с обычных шкафчиков.'
      ],
      risks: ['UEE security AI', 'Игроки и bounty hunters', 'Закрытые двери и узкие коридоры'],
      sources: [
        { label: 'Manifest — Distribution Centers', url: 'https://sc-manifest.com/sites/distribution-centers' },
        { label: 'Star Citizen Wiki — Distribution centers', url: 'https://starcitizen.tools/Distribution_centers' }
      ]
    },
    {
      id: 'microtech-dc',
      rank: 3,
      top: true,
      name: 'MicroTech Distribution Centers',
      type: 'distribution',
      system: 'Stanton',
      location: 'microTech · Covalex S4DC05, MicroTech Logistics Depot S4LD01/S4LD13, Sakura Sun Goldenrod',
      risk: 'high',
      mode: 'PvPvE',
      group: '2–4',
      solo: false,
      summary: 'Снежные логистические центры microTech с тем же шаблоном, что и Hurston DC: Palatino, оружие и секретные комнаты.',
      why: 'Здесь проще выбрать менее людный DC и зайти по погоде: снег и низкая видимость дают укрытие на подходе. Внутри — та же структура с security checkpoint и оранжевыми ящиками.',
      loot: ['Palatino heavy armor', 'Оружие высокого уровня', 'Снайперские винтовки и LMG', 'Обвесы'],
      access: [
        'Выберите один из DC на microTech: Covalex Distribution Centre S4DC05, MicroTech Logistics Depot S4LD01/S4LD13 или Sakura Sun Goldenrod Workcenter.',
        'В MobiGlas/F2 попробуйте поиск по «Sakura», чтобы подсветить нужный вариант.',
        'Садитесь с наветренной стороны и подходите к комплексу пешком или на транспорте.',
        'Зачистите внешний периметр, затем внутренние security checkpoint.',
        'Проверьте семь стандартных точек оранжевых ящиков и вентиляционные комнаты.',
        'Уходите при появлении чужих кораблей: на snowfield подходе легко оказаться в ловушке.'
      ],
      tips: [
        'Возьмите холодостойкую броню и запас медицины.',
        'Снег скрывает не только вас, но и подходящих игроков — держите сканер активным.',
        'Не паркуйтесь вплотную к фасаду: оставляйте вектор для быстрого взлёта.',
        'Проверяйте не только оранжевые контейнеры, но и верхние VIP-комнаты.'
      ],
      risks: ['UEE security AI', 'Холод и плохая видимость', 'PvP у популярных DC'],
      sources: [
        { label: 'Manifest — Distribution Centers', url: 'https://sc-manifest.com/sites/distribution-centers' },
        { label: 'Star Citizen Wiki — Ghost Hollow / microTech locations', url: 'https://starcitizen.tools/Ghost_Hollow' }
      ]
    },
    {
      id: 'ghost-hollow',
      rank: 4,
      top: true,
      name: 'Ghost Hollow',
      type: 'outpost',
      system: 'Stanton',
      location: 'microTech',
      risk: 'extreme',
      mode: 'PvPvE',
      group: '2–4',
      solo: false,
      summary: 'Неотмеченное поселение в обломках Aegis Reclaimer на microTech; здесь бывают Nine Tails и охотники за игроками.',
      why: 'Ghost Hollow давно известен как PvP-хотспот за редкий лут. Сюда ведут миссии Remove Illegal Occupants и bounty hunting, но опытные игроки находят точку и без маркера.',
      loot: ['Редкая броня', 'Оружие и обвесы', 'Лут Nine Tails', 'Контейнеры в обломках Reclaimer'],
      access: [
        'Если есть миссия на Ghost Hollow — используйте её quantum marker.',
        'Без маркера летите к OM3 microTech и смотрите на север (примерно вектор 352 за пределами атмосферы).',
        'Ищите участок без снега у снежной горы: рядом будет кратер и обломки Aegis Reclaimer.',
        'Садитесь на расстоянии, чтобы не блокировать себе вылет.',
        'Зачищайте сверху вниз: сначала высоты и подходы, затем внутренние помещения.',
        'После первого хорошего дропа уходите, не пытаясь проверить каждый ящик.'
      ],
      tips: [
        'Сканируйте периметр на чужие корабли до снижения.',
        'Держите ship engines hot и нос в сторону открытого неба.',
        'Не заходите в одиночку без запаса medpen и боеприпасов.',
        'Если слышите чужие двигатели — считайте, что точка уже contested.'
      ],
      risks: ['PvP и засады', 'Nine Tails AI', 'Холод microTech', 'Ограниченный обзор в обломках'],
      sources: [
        { label: 'Star Citizen Wiki — Ghost Hollow', url: 'https://starcitizen.tools/Ghost_Hollow' },
        { label: 'LootingPower — Ghost Hollow', url: 'https://stoppingpower.io/loot/' }
      ]
    },
    {
      id: 'jumptown',
      rank: 7,
      name: 'Jumptown',
      type: 'druglab',
      system: 'Stanton',
      location: 'Daymar',
      risk: 'extreme',
      mode: 'PvP',
      group: '2–4',
      solo: false,
      summary: 'Легендарная нарколаборатория на Daymar: оружейные обвесы, броня и постоянные PvP-стычки.',
      why: 'Jumptown — быстрый вход и высокая плотность добычи, но сюда едут не только за лутом. Две лаборатории и два диспенсера делают точку удобной для коротких рейдов, если вы готовы к PvP.',
      loot: ['Оружейные обвесы и оптика', 'Броня', 'Altruciatoxin / SLAM / WiDoW', 'Медикаменты и расходники'],
      access: [
        'Летите к Jumptown на Daymar: quantum marker отсутствует, используйте карту или маркер на поверхности.',
        'Садитесь на поверхности, не на площадку: посадочных пэдов здесь нет.',
        'Проверьте периметр на чужие корабли и активные сигнатуры.',
        'Внутри есть два входа и две лабораторные комнаты с диспенсерами.',
        'Сначала зачистите оба входа, затем собирайте обвесы и броню.',
        'Уходите сразу после получения нужного предмета, не ждите полного лута.'
      ],
      tips: [
        'Держите двигатели включёнными, а нос — в сторону выхода.',
        'Не считайте точку безопасной: даже пустой на вид лагерь может быть засадой.',
        'Проверяйте совместимость прицелов и стволов до того, как занимать инвентарь.',
        'Если цель — только обвесы, заходите с одной стороны и не светитесь у диспенсеров.'
      ],
      risks: ['PvP-кемпинг', 'Экстремальный холод Daymar', 'Отсутствие посадочных пэдов', 'Мало места для манёвра'],
      sources: [
        { label: 'Star Citizen Wiki — Jumptown', url: 'https://starcitizen.tools/Jumptown' },
        { label: 'GGWTB — Stanton Drug Labs', url: 'https://ggwtb.com/blog/star-citizen-best-loot-spots-for-weapons-armor--and-ship-components' }
      ]
    },
    {
      id: 'kareah',
      rank: 11,
      name: 'Security Post Kareah',
      type: 'security',
      system: 'Stanton',
      location: 'Cellin orbit',
      risk: 'extreme',
      mode: 'PvPvE',
      group: '2–4',
      solo: false,
      summary: 'Орбитальная станция Crusader Security с конфискатом, evidence storage и боссом, который открывает контрабандный диспенсер.',
      why: 'Kareah даёт редкое оружие и контрабанду, но это одна из самых опасных точек Stanton: турели, охрана, CrimeStat и охотники за головами. Сюда идут за конкретными предметами, а не за спокойным фармом.',
      loot: ['Конфискованное оружие', 'Контрабанда из evidence storage', 'Редкие marksman rifles и crossbow', 'Crusader Security gear'],
      access: [
        'Подходите к Kareah в orbit Cellin с низкой сигнатурой: станция активно defended.',
        'Пристыкуйтесь, зачистите охрану и не трогайте CrimeStat-терминал без плана.',
        'Для evidence room убейте несколько AI, чтобы вызвать босса; если уже идёт изъятие — отмените его на терминале напротив.',
        'Снимите код с тела босса и откройте терминал в evidence storage.',
        'Активируйте контрабандный диспенсер: он выдаст 15–20 предметов, после чего заблокируется.',
        'Покиньте станцию до прибытия подкрепления или bounty hunters.'
      ],
      tips: [
        'Отключение Comm Array не делает Kareah безопасной: турели и охрана остаются.',
        'Не начинайте взлом CrimeStat, если не готовы к полному PvP-циклу.',
        'Берите с собой медицину и запас патронов: внутри тесно и много AI.',
        'Если нужна только контрабанда, не задерживайтесь после опустошения диспенсера.'
      ],
      risks: ['Станционные турели', 'Crusader Security AI', 'CrimeStat и bounty hunters', 'PvP в узких коридорах'],
      sources: [
        { label: 'Star Citizen Wiki — Security Post Kareah', url: 'https://starcitizen.tools/Security_Post_Kareah' },
        { label: 'GGWTB — Kareah loot and escape', url: 'https://ggwtb.com/blog/star-citizen-crusader-security-heavy-armor-kareah-loot-and-escape-guide' }
      ]
    },
    {
      id: 'onyx',
      rank: 9,
      name: 'Onyx Facility (ASD)',
      type: 'onyx',
      system: 'Stanton',
      location: 'remote underground sites',
      risk: 'high',
      mode: 'PvPvE',
      group: '2–4',
      solo: false,
      summary: 'Заброшенный подземный research-комплекс ASD: Kopion, радиационные импульсы и высокая концентрация редкого FPS-лута.',
      why: 'Onyx — один из лучших PvE-источников Palatino и редкого оружия. Комплекс большой, с медицинским отсеком и несколькими секторами, поэтому сюда лучше идти группой.',
      loot: ['Palatino heavy armor', 'Редкое FPS-оружие', 'Обвесы', 'Медицинские расходники'],
      access: [
        'Используйте mission quantum marker: напрямую комплекс найти сложно.',
        'Садитесь в один из двух больших ангаров и запомните выход.',
        'В лобби есть медстанция с T1-кроватями — используйте её как точку восстановления.',
        'Слева находится Sector A (Engineering), справа — Sector B (Research).',
        'В Engineering держитесь подальше от радиационных импульсов power core.',
        'В Research проверьте лаборатории, medical lab и animal testing: там водятся Kopion.'
      ],
      tips: [
        'Берите medpen и decon-средства, если идёте вглубь.',
        'Не спускайтесь в подземелье без запасного выхода и запаса патронов.',
        'Kopion опасны вблизи — не давайте им окружить вас в коридоре.',
        'Проверяйте ящики в лабораториях и административных комнатах, а не только в лобби.'
      ],
      risks: ['Kopion и AI', 'Радиация power core', 'PvP на маркере', 'Сложная навигация без карты'],
      sources: [
        { label: 'Star Citizen Wiki — Onyx Facility (ASD)', url: 'https://starcitizen.tools/Onyx_Facility_(ASD)' },
        { label: 'Manifest — Onyx Facilities', url: 'https://sc-manifest.com/sites' }
      ]
    },
    {
      id: 'paf',
      rank: 1,
      top: true,
      name: 'PAF Sites — Lamina, Attritus, Ruptura',
      type: 'paf',
      system: 'Stanton',
      location: 'Daymar и Aberdeen',
      risk: 'high',
      mode: 'PvPvE',
      group: '1–2',
      solo: true,
      summary: 'Наземные станции, которые питают Orbital Laser Platforms: Antium armor, редкие пушки и компоненты.',
      why: 'PAF — один из лучших solo-фармов редкой брони в Stanton. Схема синяя карта → красная карта → закрытые комнаты понятна, а на Daymar есть пары Lamina PAF-I/II для двойного захода.',
      loot: ['Antium armor', 'S71 "Justified" Rifle', 'C54 "Luckbringer" SMG', 'Karna "Rager" Rifle', 'Ship components'],
      access: [
        'Летите к одному из PAF на Daymar (Lamina, Attritus) или Aberdeen (Ruptura).',
        'Зачистите внешних NPC и турели, затем найдите синий keycard printer снаружи.',
        'Напечатайте синюю карту и используйте её, чтобы открыть доступ к красному принтеру внутри.',
        'Напечатайте красную карту и откройте основные interior rooms.',
        'Проверяйте оранжевые ящики Antium и бежевые armor-контейнеры.',
        'Для второго захода перелетите на соседний PAF по тому же шаблону.'
      ],
      tips: [
        'PAF лучше проходить соло или вдвоём: меньше шума и проще делить карты.',
        'Сначала печатайте карты, потом заходите в комнаты — не тратьте время на пустые ящики.',
        'Красные комнаты могут содержать компоненты; проверяйте их, если собираете корабельный лут.',
        'На Aberdeen и Daymar разная погода — берите подходящую броню.'
      ],
      risks: ['AI и турели', 'PvP у популярных PAF', 'PvE-боссы в отдельных комнатах', 'Потеря карт при смерти'],
      sources: [
        { label: 'Star Citizen Wiki — Planetary alignment facilities', url: 'https://starcitizen.tools/Planetary_alignment_facilities' },
        { label: 'Manifest — PAF', url: 'https://sc-manifest.com/sites/paf' }
      ]
    },
    {
      id: 'bunkers',
      rank: 8,
      name: 'Stanton Bunkers (UGF)',
      type: 'bunker',
      system: 'Stanton',
      location: 'Hurston, Crusader, microTech',
      risk: 'medium',
      mode: 'PvE',
      group: '1–2',
      solo: true,
      summary: 'Меркари-бункеры UGF — быстрый PvE-лут: оружие, броня, обвесы и медицина без сложных ключей.',
      why: 'Хороший старт для новичка: понятная зачистка, низкий порог входа и стабильный поток базового лута. Награда ниже, чем в CZ или DC, зато риск потерять всё заметно меньше.',
      loot: ['Оружие', 'Броня', 'Обвесы', 'Медицина и расходники'],
      access: [
        'Возьмите контракт на зачистку бункера или аналогичную mercenary mission.',
        'Садитесь вне зоны турелей и подходите к входу пешком.',
        'Зачистите поверхность, затем спуститесь в бункер.',
        'Проверяйте lockers, ящики и комнаты с боссом.',
        'Соберите лут и выходите тем же путём, которым пришли.'
      ],
      tips: [
        'Не стреляйте по нейтральным NPC: это может сорвать контракт.',
        'Сначала зачищайте углы и коридоры, потом открывайте инвентарь.',
        'Берите только совместимые обвесы, чтобы не перегружать рюкзак.',
        'Если бункер уже зачищен другим игроком, не тратьте время — летите к следующему.'
      ],
      risks: ['AI внутри', 'Турели снаружи', 'Случайные игроки', 'Низкий, но нестабильный дроп'],
      sources: [
        { label: 'LootingPower — Bunkers (UGF)', url: 'https://stoppingpower.io/loot/' },
        { label: 'Star Citizen Wiki — Guides', url: 'https://starcitizen.tools/Guides' }
      ]
    },
    {
      id: 'shipwrecks',
      rank: 10,
      name: 'Derelicts / Ship in Distress',
      type: 'derelict',
      system: 'Stanton · Nyx',
      location: 'distress contracts и derelict sites',
      risk: 'high',
      mode: 'PvPvE',
      group: '1–3',
      solo: true,
      summary: 'Аварийные корабли и дерelict-поселения: корабельные компоненты, броня и оружие без похода в магазин.',
      why: 'Ship in Distress — один из немногих способов добыть Grade B/C military или stealth components бесплатно. Плюс можно найти личное снаряжение и обвесы.',
      loot: ['Military / stealth ship components', 'Броня', 'Оружие', 'Обвесы'],
      access: [
        'Примите контракт Ship in Distress или найдите derelict marker.',
        'Осмотрите wreck снаружи: рядом могут быть hostile fighters или мины.',
        'Пристыкуйтесь или войдите через EVA, проверьте maintenance bays.',
        'Снимайте компоненты tractor beam и проверяйте размер/слот.',
        'Переносите добычу в cargo grid или freight bay.',
        'Завершите контракт и уходите в безопасный порт.'
      ],
      tips: [
        'Tractor beam обязателен: без него крупные компоненты не вытащить.',
        'Проверяйте size class детали до того, как тащить её.',
        'Не заходите на wreck, если рядом висит чужой корабль.',
        'Лучше вылететь с одним хорошим компонентом, чем потерять всё при перегрузе.'
      ],
      risks: ['PvP у distress-маркеров', 'Мины и hostile fighters', 'EVA и перегруз', 'Несовместимые компоненты'],
      sources: [
        { label: 'GGWTB — Derelict Ship in Distress', url: 'https://ggwtb.com/blog/star-citizen-best-loot-spots-for-weapons-armor--and-ship-components' },
        { label: 'LootingPower — Derelicts', url: 'https://stoppingpower.io/loot/' }
      ]
    },
    {
      id: 'siege-orison',
      rank: 18,
      name: 'Siege of Orison',
      type: 'event',
      system: 'Stanton',
      location: 'Orison, Crusader',
      risk: 'high',
      mode: 'PvE',
      group: '2–4',
      solo: false,
      summary: 'Кооперативное инстанс-событие на платформах Orison: Nine Tails, IFF-инверторы и редкая event-броня.',
      why: 'В Alpha 4.10 Siege of Orison переработали: это структурированный кооперативный сценарий с Nine Tails armor sets и Arlington Rifle. Хороший способ получить уникальный комплект без PvP-хаоса CZ.',
      loot: ['Nine Tails armor sets', 'Arlington Rifle', 'Event-награды', 'Медицина и расходники'],
      access: [
        'Прибывайте на Inspiration Station на крыше Crusader Industries Showroom в Orison.',
        'Возьмите контракт «Orison Platforms Under Attack» или сразу идите к шаттлу.',
        'Шаттл доставит вас на Solanki Platform; контракт выдаётся автоматически.',
        'Зачистите платформу и восстановите два fuse box, чтобы открыть лифт.',
        'На следующей платформе уничтожьте IFF-инверторы и продолжайте по цепочке.',
        'После финальной платформы соберите награды и покиньте инстанс.'
      ],
      tips: [
        'Играйте группой: событие рассчитано на кооператив.',
        'Используйте медблоки на платформах как точки восстановления.',
        'Сначала убивайте гранатомётчиков и тяжёлую пехоту, затем лутайте.',
        'Проверяйте Nine Tails armor на телах и в event-контейнерах.'
      ],
      risks: ['Nine Tails AI', 'Mortar fire', 'Долгий инстанс', 'Срыв по таймеру/смертям'],
      sources: [
        { label: 'Star Citizen Wiki — Siege of Orison', url: 'https://starcitizen.tools/Siege_of_Orison' },
        { label: 'MMOEXP — Nine Tails armors / Arlington Rifle', url: 'https://www.mmoexp.com/News/star-citizen-alpha-4-10-guide-how-to-get-all-4-new-nine-tails-armors-arlington-rifle.html' }
      ]
    },
    {
      id: 'checkmate',
      rank: 6,
      top: true,
      name: 'Checkmate Contested Zone',
      type: 'contested',
      system: 'Pyro',
      location: 'Monox L4',
      risk: 'extreme',
      mode: 'PvPvE',
      group: '2–4',
      solo: false,
      summary: 'PvPvE-зона на станции Rough & Ready: Boards 1–3, синие Security keycards и редкий станционный лут.',
      why: 'Лучший старт цепочки Executive Hangar: здесь больше всего синих принтеров и относительно понятная последовательность fuse → red → blue. Также хороший источник редкого FPS-снаряжения.',
      loot: ['Compboards 1–3', 'Blue Security keycards', 'Редкое FPS-оружие', 'Ship components'],
      access: [
        'Летите к Checkmate Station у Monox L4.',
        'Войдите в Contested Zone и подготовьте fuse для первой двери.',
        'Board 1 находится за fuse door и красной Supervisor-дверью.',
        'Boards 2 и 3 — в contested hangar: либо fuse → red → blue, либо два fuse → две blue.',
        'Соберите синие карты у принтеров и отметьте, кто несёт boards.',
        'Вынесите добычу до перехода на Orbituary.'
      ],
      tips: [
        'Сначала получите красную Supervisor-карту на PYAM-SUPVISR.',
        'Печатайте синие карты заранее: в Checkmate их четыре, это лучший запас.',
        'Закрывайте fuse-двери за собой, чтобы не пустить преследователей.',
        'Не разделяйтесь в hangar: другой группе легко зайти сзади.'
      ],
      risks: ['PvPvE', 'Fuse и keycard-двери', 'Потеря compboards при смерти', 'Сложная навигация'],
      sources: [
        { label: 'Star Citizen Wiki — Contested Zones', url: 'https://starcitizen.tools/Contested_Zones' },
        { label: 'ExpCarry — Contested Zones guide', url: 'https://expcarry.com/star-citizen-contested-zones-guide' }
      ]
    },
    {
      id: 'orbituary',
      rank: 13,
      name: 'Orbituary Contested Zone',
      type: 'contested',
      system: 'Pyro',
      location: 'Bloom orbit',
      risk: 'extreme',
      mode: 'PvPvE',
      group: '2–4',
      solo: false,
      summary: 'Contested Zone на станции Rough & Ready: Boards 4 и 7, красные Supervisor-двери и синие карты за ними.',
      why: 'Без Orbituary не собрать полный набор compboards. Маршруты здесь длиннее и требуют красной карты, зато можно добрать редкий станционный лут и синие карты.',
      loot: ['Compboards 4 и 7', 'Blue Security keycards', 'Редкое оружие', 'Ship components'],
      access: [
        'Летите к Orbituary на орбите Bloom.',
        'Возьмите красную Supervisor-карту: без неё глубокие двери не открыть.',
        'Board 4: fuse door → red door → ещё один fuse door.',
        'Board 7: fuse → red → fuse → две blue-двери в hangar.',
        'Проверьте синие принтеры за красной дверью, если нужен запас карт.',
        'После получения boards 4 и 7 уходите, не пытаясь чистить всю станцию.'
      ],
      tips: [
        'Не начинайте с Orbituary без красной карты.',
        'Берите больше fuse, чем кажется нужным: двери могут закрыться за спиной.',
        'Board 7 — самый длинный маршрут, оставьте его на конец.',
        'Следите за тылом у hangar: это естественная точка встречи других групп.'
      ],
      risks: ['PvPvE', 'Многоуровневые двери', 'Потеря boards', 'Долгий маршрут'],
      sources: [
        { label: 'Star Citizen Wiki — Contested Zones', url: 'https://starcitizen.tools/Contested_Zones' },
        { label: 'ExpCarry — Contested Zones guide', url: 'https://expcarry.com/star-citizen-contested-zones-guide' }
      ]
    },
    {
      id: 'ruin-station',
      rank: 12,
      name: 'Ruin Station — Ghost Arena',
      type: 'contested',
      system: 'Pyro',
      location: 'Terminus orbit',
      risk: 'extreme',
      mode: 'PvPvE',
      group: '3–5',
      solo: false,
      summary: 'Ghost Arena с таймерным vault, Crypt/Wasteland/Last Resort keycards и Boards 5–6.',
      why: 'Самая сложная часть цепочки Executive Hangar: нужно получить Crypt-карту и попасть в vault в минутное окно. Зато здесь же можно найти Grade B components и редкое оружие.',
      loot: ['Compboards 5 и 6', 'Crypt / Wasteland / Last Resort keycards', 'Grade B ship components', 'Редкое оружие'],
      access: [
        'Летите к Ruin Station на орбите Terminus.',
        'В Ghost Arena найдите fuse-двери к The Crypt, Wasteland и Last Resort.',
        'Напечатайте Crypt-карту — она нужна для Board 5.',
        'Следите за индикаторами vault: синий свет предупреждает, белый означает открытие.',
        'Войдите в vault в минутное окно; Board 6 — наверху второй комнаты.',
        'Board 5 — за дополнительной дверью, открываемой Crypt-картой.'
      ],
      tips: [
        'Начинайте с Crypt-карты: без неё Board 5 недоступен.',
        'Vault открыт 1 минуту и закрыт около 20 минут — не опаздывайте.',
        'Оставьте одного игрока у входа в vault, чтобы не потерять группу.',
        'Не ждите полного лута: после boards 5/6 уходите.'
      ],
      risks: ['Таймерный vault', 'PvPvE', 'Потеря keycards', 'Смерть за закрывающейся дверью'],
      sources: [
        { label: 'Star Citizen Wiki — Guide: Executive Hangars', url: 'https://starcitizen.tools/Guide:Executive_Hangars' },
        { label: 'ExpCarry — Contested Zones guide', url: 'https://expcarry.com/star-citizen-contested-zones-guide' }
      ]
    },
    {
      id: 'pyam-supervisor',
      rank: 17,
      name: 'PYAM Supervisor Bases',
      type: 'asteroid',
      system: 'Pyro',
      location: 'Bloom L4 / L5 — PYAM-SUPVISR-3-4 и 3-5',
      risk: 'high',
      mode: 'PvPvE',
      group: '1–2',
      solo: true,
      summary: 'Астероидные базы с принтерами красных Supervisor keycards — обязательный шаг перед Checkmate и Orbituary.',
      why: 'Красные карты нельзя напечатать в основных CZ. Эти две базы — единственный проверенный источник, если вы собираете полную цепочку Executive Hangar.',
      loot: ['Red Supervisor keycards', 'Стандартные ящики', 'Возможный станционный лут'],
      access: [
        'Летите к Bloom (PYR3) L4 или L5; станции не находятся через обычный поиск Starmap.',
        'Вручную панорамируйте карту и ищите asteroid-base marker.',
        'Войдите в базу и найдите комнату с принтерами.',
        'Заберитесь на ящики и пролезьте через короткий проход в потолке.',
        'Напечатайте красную карту; выход — через боковую дверь или crawlspace.',
        'Повторите на второй базе, если принтер на cooldown.'
      ],
      tips: [
        'Принтеры имеют 30-минутный cooldown — планируйте визит заранее.',
        'Не полагайтесь на поиск Starmap: ищите маркер вручную.',
        'В Alpha 4.10.2 бывает баг отображения таймера 00:00; проверяйте взаимодействие.',
        'Заберите карту до вылета в CZ, чтобы не возвращаться.'
      ],
      risks: ['Сложная навигация', 'PvP на астероидах', 'Cooldown принтера', 'Баг таймера 4.10.2'],
      sources: [
        { label: 'Star Citizen Wiki — Guide: Executive Hangars', url: 'https://starcitizen.tools/Guide:Executive_Hangars' },
        { label: 'Star Citizen Wiki — Contested Zones', url: 'https://starcitizen.tools/Contested_Zones' }
      ]
    },
    {
      id: 'executive-hangar',
      rank: 15,
      name: 'Executive Hangar',
      type: 'hangar',
      system: 'Pyro',
      location: 'PYAM-EXHANG-0-1, near Pyro star',
      risk: 'extreme',
      mode: 'PvPvE',
      group: '3–5',
      solo: false,
      summary: 'Финальная точка семи compboards: корабль, railguns/grenade launchers и Grade-A components.',
      why: 'Это главный приз цепочки Contested Zones. Один игрок может забрать reward ship, а в ангаре появляются редкие FPS-пушки и компоненты. Ошибка на финале стоит всего забега.',
      loot: ['Reward ship (8 вариантов)', 'Railguns / grenade launchers', 'Grade-A ship components', 'Grade B components'],
      access: [
        'Соберите все семь compboards (1–7) и проверьте номера.',
        'Летите к PYAM-EXHANG-0-1 юго-западнее Pyro star.',
        'Найдите активную базу из трёх: только одна работает одновременно.',
        'В zero-g комнате проверьте пять индикаторов: нужен хотя бы один зелёный и ни одного красного.',
        'Вставьте семь compboards в соответствующие слоты.',
        'После открытия заберите ship, распределите cargo и уложитесь в 10 минут до закрытия дверей.'
      ],
      tips: [
        'Заранее решите, кто забирает корабль.',
        'Берите cargo ship: в ангаре могут быть компоненты и оружие.',
        'Не оставайтесь внутри при закрытии дверей — это смертельно.',
        'Проверяйте индикаторы в игре, а не только по внешнему таймеру.'
      ],
      risks: ['Семь compboards', 'Таймер дверей', 'PvP у активной базы', 'Потеря всего забега'],
      sources: [
        { label: 'Star Citizen Wiki — Guide: Executive Hangars', url: 'https://starcitizen.tools/Guide:Executive_Hangars' },
        { label: 'ExpCarry — Contested Zones guide', url: 'https://expcarry.com/star-citizen-contested-zones-guide' }
      ]
    },
    {
      id: 'lazarus',
      rank: 14,
      name: 'Lazarus Complex',
      type: 'lazarus',
      system: 'Pyro',
      location: 'Pyro I',
      risk: 'extreme',
      mode: 'PvE',
      group: '3–5',
      solo: false,
      summary: 'ASD-комплекс под distortion field: Stormbreaker, Apex Valakar, ASD-снаряжение и Prism "Bonedust".',
      why: 'Lazarus — отдельная PvE-цепочка с уникальными наградами и боссом. Она требует подготовки, но не зависит от PvP-хаоса Contested Zones.',
      loot: ['Stirling Exploration Suit ASD', 'Prism "Bonedust" Laser Shotgun', 'Apex Valakar fangs / pearls', 'Редкое ASD-снаряжение'],
      access: [
        'Сначала получите ASD Maintenance Key и Lazarus Specimen Card в Faro Data Center на Pyro IV.',
        'Летите к Lazarus Transit Hub на Pyro I: ниже 12 км корабли теряют питание.',
        'Оставьте корабль и используйте автоматический шаттл до комплекса.',
        'Поставьте respawn в лазарете снаружи комплекса.',
        'Для ATLS-RAD откройте гараж ключом и нажмите два терминала вдвоём.',
        'В Specimen Cache наденьте Sterling Suit, приготовьте яйцо и отнесите его вручную к Calling Tower.'
      ],
      tips: [
        'Для ATLS-RAD нужны два игрока у терминалов.',
        'Не используйте tractor beam на яйце — физика может уронить его сквозь геометрию.',
        'Держитесь в 150–750 м от Apex Valakar и стреляйте только по зелёным пустулам.',
        'Возьмите decon pens, если идёте в тяжёлой броне.'
      ],
      risks: ['Distortion field', 'Apex Valakar', 'Радиация', 'Долгая многоэтапная цепочка'],
      sources: [
        { label: 'Star Citizen Wiki — Lazarus Complexes', url: 'https://starcitizen.tools/Lazarus_Complexes' },
        { label: 'SC Quick Guides — Lazarus walkthrough', url: 'https://scquickguides.com/guides/activities/lazarus/' }
      ]
    },
    {
      id: 'faro',
      rank: 16,
      name: 'Faro Data Centers',
      type: 'lazarus',
      system: 'Pyro',
      location: 'Pyro IV',
      risk: 'high',
      mode: 'PvPvE',
      group: '2–4',
      solo: false,
      summary: 'Десять data centers ASD на Pyro IV: ключ-карта, биометрический доступ, код и печать Lazarus Specimen Card.',
      why: 'Это обязательный первый этап Stormbreaker/Lazarus. Здесь же можно найти ASD Maintenance Key и данные, а QRF даёт дополнительный бой.',
      loot: ['ASD Maintenance Key', 'Lazarus Specimen Card', 'Data / access codes', 'Стандартный FPS-лут'],
      access: [
        'Найдите один из десяти Faro Data Centers на Pyro IV.',
        'Уничтожьте турели или подойдите на транспорте с расстояния около 2 км.',
        'Заберите ASD Maintenance Key со стола в emergency shelter.',
        'Для закрытых комнат используйте биометрию учёного: non-lethal takedown или его одежду.',
        'Найдите 5-значный код на ноутбуке в Data Processing и введите его в Tower 01.',
        'Печать карты занимает 3 минуты; на 50% нужно снова взаимодействовать с консолью.'
      ],
      tips: [
        'На 50% печати прилетает QRF — займите укрытие заранее.',
        'Не убивайте учёного, если он нужен для сканера.',
        'Ключ-карта имеет respawn около 2 часов; не теряйте её.',
        'После печати сразу уходите на Lazarus Transit Hub.'
      ],
      risks: ['Турели', 'QRF', 'PvP у data centers', 'Сложная биометрия'],
      sources: [
        { label: 'SC Quick Guides — Lazarus walkthrough', url: 'https://scquickguides.com/guides/activities/lazarus/' },
        { label: 'Star Citizen Wiki — Lazarus Complexes', url: 'https://starcitizen.tools/Lazarus_Complexes' }
      ]
    },
    {
      id: 'pyro-derelicts',
      rank: 5,
      top: true,
      name: 'Pyro Derelict Outposts Route',
      type: 'derelict',
      system: 'Pyro',
      location: 'Fuego, Sears Canyon, Fo Canyon, Pyro IV/5',
      risk: 'high',
      mode: 'PvPvE',
      group: '1–2',
      solo: true,
      summary: 'Пятиточечный маршрут по derelict outposts Pyro за Righteous / Justified armor и оружием.',
      why: 'Один из самых спокойных способов одеться в Pyro: без ключей и таймеров, с понятным микро-обходом. Главное — знать, какие ящики проверять и когда уходить.',
      loot: ['Righteous / Justified armor', 'Оружие', 'Railguns / missile launchers (Fo Canyon)', 'Плюшевые предметы и расходники'],
      access: [
        'Поставьте respawn в Gaslight Station и вылетайте на лёгком/среднем корабле.',
        'Fuego Derelict Outpost: начните с верхней площадки, затем спуститесь к нижним строениям.',
        'Sears Canyon: проверьте main trading building, back room, vent area, крышу и внешние контейнеры.',
        'Fo Canyon Depot на Pharaoh: сначала подавите XenoThreat с корабля или зачистите FPS, затем проверьте radio tower, kiosk и крышу.',
        'Pyro IV derelict: обойдите watchtowers, крыши контейнеров, пространства под скамьями и между статиками.',
        'Завершите микро-обходом: углы → под трапами → контейнеры → полки → высоты → выход.'
      ],
      tips: [
        'Приоритет — маленькие прямоугольные ammo crates: чаще всего именно там Righteous/Justified.',
        'Tractor beam помогает достать ящики из-под обломков.',
        'Не задерживайтесь на уже зачищенной точке: лучше перелететь на следующую.',
        'Если нашли хороший дроп, уходите, а не продолжайте ради ещё одного ящика.'
      ],
      risks: ['XenoThreat NPC', 'PvP на торговых точках', 'Полузакопанные ящики', 'Долгие перелёты между точками'],
      sources: [
        { label: 'Elyxir — Pyro rare armor route', url: 'https://www.elyxir.gg/guide/star-citizen/pyro-rare-armor-loot-run-guide-5-derelict-outposts-for-righteous-justified-sets' },
        { label: 'LootingPower — Pyro Settlements/Derelicts', url: 'https://stoppingpower.io/loot/' }
      ]
    },
    {
      id: 'pyro-asteroids',
      rank: 19,
      name: 'Pyro Asteroid Bases',
      type: 'asteroid',
      system: 'Pyro',
      location: 'RMB / PYAM asteroid clusters',
      risk: 'high',
      mode: 'PvPvE',
      group: '1–2',
      solo: true,
      summary: 'Астероидные базы с турелями и плотными weapon/optic crates: оптика, SMG-обвесы и оружие.',
      why: 'Хороший источник средне- и дальнобойной оптики, которую сложно купить. Если совместить с bounty/mercenary контрактом, полёт не будет пустым даже при слабом дропе.',
      loot: ['Оптика', 'Weapon crates', 'SMG-обвесы', 'Ship components'],
      access: [
        'Подлетайте вне секторов обстрела турелей.',
        'Паркуйтесь в структурной тени или ангарной нише.',
        'Войдите через EVA или стыковку, зачистите внутренние помещения.',
        'Проверьте weapon crates и ящики с оптикой.',
        'Заберите только совместимые обвесы и уходите при перегрузе.',
        'Совместите заход с локальным контрактом, чтобы получить оплату.'
      ],
      tips: [
        'Не подставляйте лёгкий истребитель под турели.',
        'Сканируйте астероид на чужие корабли до EVA.',
        'Проверяйте не только оружейные ящики, но и технические помещения.',
        'Если база уже пустая, не тратьте время на полный обход.'
      ],
      risks: ['Турели', 'EVA', 'PvP', 'Пустые после других игроков ящики'],
      sources: [
        { label: 'GGWTB — Pyro asteroid outposts', url: 'https://ggwtb.com/blog/star-citizen-best-loot-spots-for-weapons-armor--and-ship-components' },
        { label: 'LootingPower — Asteroid bases', url: 'https://stoppingpower.io/loot/' }
      ]
    },
    {
      id: 'pyro-outposts',
      rank: 20,
      name: 'Pyro Settlements / Colonial Outposts',
      type: 'outpost',
      system: 'Pyro',
      location: 'independent / outlaw outposts',
      risk: 'high',
      mode: 'PvPvE',
      group: '1–2',
      solo: true,
      summary: 'Независимые и outlaw-аутпосты Pyro: быстрый общий лут без ключей и таймеров, но без armistice.',
      why: 'Подходит для коротких остановок по пути: меньше охраны, чем в CZ, и проще найти ящики. Однако поток игроков здесь высокий, а помощь может не прийти.',
      loot: ['Броня', 'Оружие', 'Обвесы', 'Компоненты'],
      access: [
        'Сканируйте аутпост с воздуха и ищите чужие корабли.',
        'Садитесь на расстоянии, чтобы не блокировать вылет.',
        'Зачистите периметр и войдите в главное здание.',
        'Проверьте back room, крышу, внешние контейнеры и углы.',
        'Не задерживайтесь после первого хорошего дропа.',
        'Уходите по заранее выбранному вектору.'
      ],
      tips: [
        'В Pyro нет armistice: любой игрок может открыть огонь.',
        'Проверяйте крыши и верхние уровни — там часто стоят ящики.',
        'Не оставляйте корабль с выключенными двигателями у входа.',
        'Совмещайте с контрактом, чтобы компенсировать риск.'
      ],
      risks: ['PvP', 'AI аутпоста', 'Нет armistice', 'Мало укрытий на открытой местности'],
      sources: [
        { label: 'LootingPower — Colonial outposts', url: 'https://stoppingpower.io/loot/' },
        { label: 'SC Manifest — Sites overview', url: 'https://sc-manifest.com/sites' }
      ]
    },
    {
      id: 'qv-breaker',
      rank: 21,
      name: 'QV Breaker Stations',
      type: 'qv',
      system: 'Nyx',
      location: 'Keeger Belt',
      risk: 'high',
      mode: 'PvE',
      group: '2–4',
      solo: false,
      summary: 'Rock Breaker станции в Keeger Belt: восстановление питания, линзы, refractor codes и шахтёрский лут.',
      why: 'Это не просто лут-точка, а полноценный PvE-цикл с восстановлением станции. Заодно можно добыть Sadaryx и компоненты, если совместить с mining-частью.',
      loot: ['FPS-оружие и броня', 'Sadaryx', 'Ship components', 'Mission rewards'],
      access: [
        'Возьмите контракт Rock Breaker в Nyx.',
        'Пристыкуйтесь к QV Breaker Station в Keeger Belt.',
        'Восстановите питание: найдите и установите батареи.',
        'Соберите refractor codes и линзы, выровняйте refractors.',
        'Загрузите катализаторы и запустите лазер.',
        'После завершения проверьте cargo decks и заберите лут.'
      ],
      tips: [
        'Батареи тяжелые — распределите их между игроками.',
        'Сначала зачищайте NPC, потом запускайте этапы.',
        'Проверяйте cargo deck после каждого этапа.',
        'Sadaryx можно добыть вручную внутри станции.'
      ],
      risks: ['AI', 'Многоэтапный цикл', 'Тяжёлые батареи', 'PvP у станции'],
      sources: [
        { label: 'Star Citizen Wiki — QV breaker stations', url: 'https://starcitizen.tools/QV_breaker_stations' },
        { label: 'The Impound — QV Breaker guide', url: 'https://theimpound.com/blogs/guides/star-citizen-qv-breaker-station-guide' }
      ]
    },
    {
      id: 'qv-smuggler',
      rank: 22,
      name: 'QV Smuggler Stations',
      type: 'qv',
      system: 'Nyx',
      location: 'Nyx · QV service stations',
      risk: 'high',
      mode: 'PvPvE',
      group: '2–4',
      solo: false,
      summary: 'Vanduul Tech Smuggler: данные, encryption keys и Cargo Deck C на QV-станции.',
      why: 'Отдельная миссия с уникальным доступом к cargo deck. Меньше людей, чем в Pyro CZ, но станция всё равно опасна.',
      loot: ['Data / encryption keys', 'Cargo Deck C', 'Оружие и броня', 'Компоненты'],
      access: [
        'Возьмите контракт Vanduul Tech Smuggler в Nyx.',
        'Пристыкуйтесь к QV station и зачистите охрану.',
        'Соберите data и encryption keys.',
        'Откройте Cargo Deck C по полученным данным.',
        'Заберите груз и проверьте прилегающие комнаты.',
        'Уходите до появления подкрепления.'
      ],
      tips: [
        'Сначала соберите все ключи, потом открывайте cargo deck.',
        'Не разделяйтесь: станция компактная, но опасная.',
        'Проверяйте ящики в cargo deck C, а не только главный груз.',
        'Совместите с QV Breaker, если уже в Nyx.'
      ],
      risks: ['AI', 'PvP', 'Сложный доступ', 'Потеря ключей при смерти'],
      sources: [
        { label: 'RSI Community Hub — Vanduul Tech Smuggler', url: 'https://robertsspaceindustries.com/community-hub/post/vanduul-tech-smuggler-guide-lENK4M1PLFp0j' },
        { label: 'LimitLoot — QV Service Stations', url: 'https://limitloot.de/star-citizen/guides/qv-service-stations' }
      ]
    },
    {
      id: 'nyx-derelicts',
      rank: 23,
      name: 'Nyx Derelicts & Asteroid Bases',
      type: 'derelict',
      system: 'Nyx',
      location: 'Glaciem Ring, Keeger Belt',
      risk: 'high',
      mode: 'PvPvE',
      group: '1–2',
      solo: true,
      summary: 'Тихие дерelicts и asteroid bases Nyx: компоненты, броня и обвесы без толпы Pyro.',
      why: 'Nyx — хороший запасной вариант, если Pyro перегружен. Лут менее плотный, но и конкурентов обычно меньше; удобно совмещать с QV-циклом.',
      loot: ['Ship components', 'Броня', 'Обвесы', 'Оружие'],
      access: [
        'Сканируйте Glaciem Ring или Keeger Belt на derelict/asteroid marker.',
        'Садитесь на расстоянии и проверьте периметр.',
        'Войдите через EVA, зачистите помещения.',
        'Проверьте maintenance bays и ящики в углах.',
        'Снимайте компоненты tractor beam и проверяйте размер.',
        'Уходите при появлении чужих кораблей.'
      ],
      tips: [
        'Берите tractor beam и запас medpen.',
        'Проверяйте не только главный зал, но и технические ответвления.',
        'Не перегружайте корабль компонентами: они занимают много места.',
        'Комбинируйте с QV Breaker/Smuggler, чтобы не летать впустую.'
      ],
      risks: ['PvP', 'EVA', 'Мало маркеров', 'Несовместимые компоненты'],
      sources: [
        { label: 'LootingPower — Nyx derelicts / asteroid bases', url: 'https://stoppingpower.io/loot/' },
        { label: 'Star Citizen Wiki — Glaciem Ring', url: 'https://starcitizen.tools/Glaciem_Ring' }
      ]
    }
  ]
};
