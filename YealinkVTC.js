const BaseDriver = require('base-driver');

class YealinkVTCDriver extends BaseDriver {
  static metadata = {
    name: 'Yealink VTC',
    manufacturer: 'Yealink',
    version: '1.0.0',
    description: 'Драйвер для систем Yealink VC (VC120/VC100/VC400/VC500/VC800/VC880 и др.)'
  };

  static commands = {
    // DND
    setDoNotDisturb: { description: 'Вкл/выкл режим DND', parameters: [ { name: 'value', type: 'string', enum: ['On','Off'], required: true } ] },
    getDoNotDisturb: { description: 'Статус DND', parameters: [] },

    // Mute
    setMute: { description: 'Мьют микрофона near', parameters: [ { name: 'value', type: 'string', enum: ['On','Off'], required: true } ] },
    getMute: { description: 'Статус mute near', parameters: [] },

    // Volume
    setVolume: { description: 'Установить громкость (0..10)', parameters: [ { name: 'level', type: 'number', min: 0, max: 10, required: true } ] },
    getVolume: { description: 'Текущая громкость', parameters: [] },

    // System status
    getSystemStatus: { description: 'Системный статус', parameters: [] },

    // Input source
    setInput: { description: 'Выбор источника', parameters: [ { name: 'source', type: 'string', enum: ['Camera','PC','Camera + PC'], required: true } ] },

    // Camera NEAR move
    cameraNearMove: { description: 'Движение/зум камеры NEAR', parameters: [ { name: 'action', type: 'string', required: true, enum: ['Up','Down','Left','Right','Zoom +','Zoom -','Stop'] }, { name: 'id', type: 'number', required: false } ] },

    // Presets NEAR
    presetNearRecall: { description: 'Вызов пресета 0..9', parameters: [ { name: 'id', type: 'string', required: true, enum: ['0','1','2','3','4','5','6','7','8','9'] } ] },
    presetNearSave: { description: 'Сохранение пресета 0..9', parameters: [ { name: 'id', type: 'string', required: true, enum: ['0','1','2','3','4','5','6','7','8','9'] } ] },

    // Buttons (ИР-эмуляция)
    pressButton: { description: 'Нажатие кнопки пульта', parameters: [ { name: 'key', type: 'string', required: true, enum: ['Power','F1','F2','F3','Volume +','Volume -','Zoom +','Zoom -','Up','Down','Left','Right','Select','Mute','Home','Back','Show','Call','Delete','Hangup','Record Start','Record Stop','Screenshot'] } ] },

    // Dial / Answer
    dialAuto: { description: 'Набор номера (auto)', parameters: [ { name: 'number', type: 'string', required: true } ] },
    answer: { description: 'Ответить на вызов', parameters: [ { name: 'value', type: 'string', enum: ['Yes','No'], required: true } ] },

    // Addressbook (упрощенно)
    addressbookUpdate: { description: 'Обновить адресную книгу', parameters: [ { name: 'type', type: 'string', enum: ['Local','Conference'], required: true }, { name: 'query', type: 'string', required: false } ] },
    addressbookNavigate: { description: 'Навигация по адресной книге', parameters: [ { name: 'direction', type: 'string', required: true, enum: ['Up','Down','Page Up','Page Down'] } ] },

    // Addressbook (расширено)
    getAddressbookLocal: { description: 'Список локальной адресной книги', parameters: [] },
    getAddressbookConference: { description: 'Список адресной книги конференций', parameters: [] },
    searchAddressbook: { description: 'Поиск в адресной книге', parameters: [ { name: 'query', type: 'string', required: true } ] },

    // DTMF и завершение вызова
    sendDtmf: { description: 'Отправить DTMF', parameters: [ { name: 'digit', type: 'string', enum: ['0','1','2','3','4','5','6','7','8','9','*','#'], required: true } ] },
    hangupCall: { description: 'Завершить вызов', parameters: [] }
  };

  static responses = {
    dndStatus: {
      description: 'Статус DND',
      matcher: { pattern: /donotdisturb\s+global\s+get\s+(on|off)/i },
      extract: (m) => ({ type: 'dnd', value: m[1].toLowerCase() === 'on' ? 'On' : 'Off' })
    },
    muteStatus: {
      description: 'Статус mute',
      matcher: { pattern: /mute\s+near\s+get\s+(on|off)/i },
      extract: (m) => ({ type: 'mute', value: m[1].toLowerCase() === 'on' ? 'On' : 'Off' })
    },
    systemStatus: {
      description: 'Системный статус',
      matcher: { pattern: /sysstatus\s+get\s+(idle|sleeping|talking\smax|talking|finished|outgoing|ringing)/i },
      extract: (m) => {
        const map = { sleeping: 'Sleeping', idle: 'Idle', outgoing: 'Outgoing', ringing: 'Ringing', talking: 'Talking', finished: 'Finished', 'talking max': 'Talking Max' };
        const key = m[1].toLowerCase();
        return { type: 'systemStatus', value: map[key] || 'Unknown' };
      }
    },
    volumeStatus: {
      description: 'Громкость',
      matcher: { pattern: /volume\s+get\s+([0-9]{1,2})/i },
      extract: (m) => ({ type: 'volume', level: parseInt(m[1], 10) })
    },
    error: {
      description: 'Ошибка',
      matcher: { pattern: /error:\s*(.*)/i },
      extract: (m) => ({ type: 'error', message: m[1].trim() })
    },

    // Addressbook simple matches (публикуем сырой ответ)
    addressbookChunk: {
      description: 'Фрагмент адресной книги',
      matcher: { pattern: /(addrbook\s.+|local\s"[\s\S]+?"\s(?:"[0-9.]+"\s?)+|conf\s"[\s\S]+?"\s(?:"[0-9.]+"\s?)+)/i },
      extract: (m) => ({ type: 'addressbook', raw: m[0] })
    },

    // Addressbook structured entries
    addressbookLocalEntry: {
      description: 'Строка локальной адресной книги',
      matcher: { pattern: /local\s"([\s\S]+?)"\s((?:"[0-9.]{1,}"\s?)+)/i },
      extract: (m) => {
        const numbers = [];
        const numsPart = m[2];
        const regex = /"([0-9.]{1,})"/g;
        let mm;
        while ((mm = regex.exec(numsPart)) !== null) numbers.push(mm[1]);
        return { type: 'addressbookLocalEntry', name: m[1], numbers };
      }
    },
    addressbookConfEntry: {
      description: 'Строка адресной книги конференций',
      matcher: { pattern: /conf\s"([\s\S]+?)"\s((?:"[0-9.]{1,}"\s?)+)/i },
      extract: (m) => {
        const numbers = [];
        const numsPart = m[2];
        const regex = /"([0-9.]{1,})"/g;
        let mm;
        while ((mm = regex.exec(numsPart)) !== null) numbers.push(mm[1]);
        return { type: 'addressbookConfEntry', name: m[1], numbers };
      }
    },
    addressbookDone: {
      description: 'Окончание вывода адресной книги',
      matcher: { pattern: /all done!/i },
      extract: () => ({ type: 'addressbookDone' })
    }
  };

  initialize() {
    this.publishCommand('getDoNotDisturb');
    this.publishCommand('getMute');
    this.publishCommand('getSystemStatus');
    this.publishCommand('getVolume');
  }

  // DND
  setDoNotDisturb(params) {
    const { value } = params; // On/Off
    return { payload: `donotdisturb global ${value.toLowerCase()}\r\n` };
  }
  getDoNotDisturb() { return { payload: 'donotdisturb global get\r\n' }; }

  // Mute
  setMute(params) {
    const { value } = params; // On/Off
    return { payload: `mute near ${value.toLowerCase()}\r\n` };
  }
  getMute() { return { payload: 'mute near get\r\n' }; }

  // Volume
  setVolume(params) {
    const { level } = params;
    const safe = Math.max(0, Math.min(10, Number(level)));
    return { payload: `volume set ${safe}\r\n` };
  }
  getVolume() { return { payload: 'volume get\r\n' }; }

  // System status
  getSystemStatus() { return { payload: 'sysstatus get\r\n' }; }

  // Input
  setInput(params) {
    const { source } = params;
    const map = { 'Camera': 'camera', 'PC': 'pc', 'Camera + PC': 'share' };
    return { payload: `inputsource ${map[source]}\r\n` };
  }

  // Camera NEAR move (optional ID)
  cameraNearMove(params) {
    const { action, id } = params;
    const simpleMap = {
      'Up': 'camera near move up',
      'Down': 'camera near move down',
      'Left': 'camera near move left',
      'Right': 'camera near move right',
      'Zoom +': 'camera near move zoom+',
      'Zoom -': 'camera near move zoom-',
      'Stop': 'camera near move stop'
    };
    if (id !== undefined && id !== null) {
      const idMap = {
        'Up': 'camera near move_id "id:{0}" "direct:4"',
        'Down': 'camera near move_id "id:{0}" "direct:2"',
        'Left': 'camera near move_id "id:{0}" "direct:8"',
        'Right': 'camera near move_id "id:{0}" "direct:6"',
        'Stop': 'camera near move_id "id:{0}" stop',
        'Zoom +': 'camera near zoom_id "id:{0}" "direct:1"',
        'Zoom -': 'camera near zoom_id "id:{0}" "direct:0"'
      };
      const cmd = idMap[action].replace('{0}', Number(id));
      return { payload: `${cmd}\r\n` };
    }
    return { payload: `${simpleMap[action]}\r\n` };
  }

  // Presets
  presetNearRecall(params) { const { id } = params; return { payload: `preset near go ${id}\r\n` }; }
  presetNearSave(params) { const { id } = params; return { payload: `preset near set ${id}\r\n` }; }

  // Buttons
  pressButton(params) {
    const { key } = params;
    const map = {
      'Power': 'power','F1':'F1','F2':'F2','F3':'F3','Volume +':'volume+','Volume -':'volume-','Zoom +':'zoom+','Zoom -':'zoom-','Up':'up','Down':'down','Left':'left','Right':'right','Select':'select','Mute':'mute','Home':'home','Back':'back','Show':'show','Call':'call','Delete':'delete','Hangup':'hangup','Record Start':'recordstart','Record Stop':'recordstop','Screenshot':'screenshot'
    };
    return { payload: `button ${map[key]}\r\n` };
  }

  // Dial / Answer
  dialAuto(params) {
    const { number } = params;
    if (!number) return { payload: '' };
    // поддержка пробелов как нескольких аргументов
    let payload;
    if (number.includes(' ')) {
      const parts = number.split(' ').filter(Boolean);
      payload = `dial auto "${parts.join('" "')}"\r\n`;
    } else {
      payload = `dial auto "${number}"\r\n`;
    }
    return { payload };
  }
  answer(params) {
    const { value } = params; // Yes/No
    return { payload: `answer ${value.toLowerCase()}\r\n` };
  }

  // Addressbook (упрощенно)
  addressbookUpdate(params) {
    const { type, query } = params;
    if (type === 'Local') {
      if (query && query.length > 0) return { payload: `addrbook search "${query}"\r\n` };
      return { payload: 'addrbook local get all\r\n' };
    }
    if (type === 'Conference') {
      if (query && query.length > 0) return { payload: `addrbook search "${query}"\r\n` };
      return { payload: 'addrbook conf get all\r\n' };
    }
    return { payload: '' };
  }
  addressbookNavigate(params) {
    const { direction } = params;
    // Локальная навигация реализуется на стороне UI через ответы addressbookChunk
    return { payload: `#NAV ${direction}` }; // служебная заглушка
  }

  // Addressbook (расширено)
  getAddressbookLocal() { return { payload: 'addrbook local get all\r\n' }; }
  getAddressbookConference() { return { payload: 'addrbook conf get all\r\n' }; }
  searchAddressbook(params) { const { query } = params; return { payload: `addrbook search "${query}"\r\n` }; }

  // DTMF и завершение вызова
  sendDtmf(params) { const { digit } = params; return { payload: `gendial ${digit}\r\n` }; }
  hangupCall() { return { payload: 'button hangup\r\n' }; }

  parseResponse(data) {
    try {
      let raw = data && data.payload !== undefined ? data.payload : data;
      if (Buffer.isBuffer(raw)) raw = raw.toString();
      if (typeof raw !== 'string') raw = String(raw ?? '');

      const results = [];
      const defs = this.constructor.responses || {};

      const tryMatch = (text) => {
        for (const [name, def] of Object.entries(defs)) {
          if (!def || !def.matcher || !def.matcher.pattern) continue;
          const pattern = def.matcher.pattern;
          const rx = new RegExp(pattern.source, pattern.flags);
          const match = text.match(rx);
          if (match) {
            const payload = def.extract ? def.extract(match) : { type: name, raw: match[0] };
            results.push(payload);
          }
        }
      };

      // В некоторых случаях устройство возвращает большие блоки – попробуем целиком и построчно
      tryMatch(raw);
      raw.split(/\r?\n/).filter(Boolean).forEach(tryMatch);

      if (results.length === 0) return null;
      if (results.length === 1) return results[0];
      return results;
    } catch (e) {
      return { type: 'error', message: e.message, raw: data };
    }
  }
}

module.exports = YealinkVTCDriver;


