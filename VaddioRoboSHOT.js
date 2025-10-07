const BaseDriver = require('base-driver');

class VaddioRoboSHOTDriver extends BaseDriver {
  static metadata = {
    name: 'Vaddio RoboSHOT',
    manufacturer: 'Vaddio',
    version: '1.0.0',
    description: 'Драйвер для камер Vaddio RoboSHOT (VISCA по RS-232 и ASCII по IP)'
  };

  static commands = {
    // Аутентификация (по запросу login:)
    sendUsername: { description: 'Отправить логин', parameters: [ { name: 'username', type: 'string', required: true } ] },
    sendPassword: { description: 'Отправить пароль', parameters: [ { name: 'password', type: 'string', required: true } ] },

    // Питание (ASCII IP)
    setPower: { description: 'Питание камеры', parameters: [ { name: 'value', type: 'string', enum: ['On','Off'], required: true } ] },

    // Автофокус (ASCII IP)
    setAutoFocus: { description: 'Автофокус On/Off', parameters: [ { name: 'value', type: 'string', enum: ['On','Off'], required: true } ] },

    // Фокус (ASCII IP)
    setFocus: { description: 'Фокус Near/Far/Stop', parameters: [ { name: 'value', type: 'string', enum: ['Near','Far','Stop'], required: true }, { name: 'speed', type: 'number', description: '1..8', required: false, min: 1, max: 8 } ] },

    // Пан/Тилт/Зум (ASCII IP)
    pan: { description: 'Поворот', parameters: [ { name: 'direction', type: 'string', enum: ['Left','Right','Stop'], required: true }, { name: 'speed', type: 'number', description: '1..24', required: false, min: 1, max: 24 } ] },
    tilt: { description: 'Наклон', parameters: [ { name: 'direction', type: 'string', enum: ['Up','Down','Stop'], required: true }, { name: 'speed', type: 'number', description: '1..20', required: false, min: 1, max: 20 } ] },
    zoom: { description: 'Зум', parameters: [ { name: 'direction', type: 'string', enum: ['In','Out','Stop'], required: true }, { name: 'speed', type: 'number', description: '1..7', required: false, min: 1, max: 7 } ] },

    // Iris / AutoIris (ASCII IP)
    setIris: { description: 'Установка диафрагмы', parameters: [ { name: 'value', type: 'number', required: true } ] },
    getIris: { description: 'Чтение диафрагмы', parameters: [] },
    setAutoIris: { description: 'Авто-ирис', parameters: [ { name: 'value', type: 'string', enum: ['On','Off'], required: true } ] },
    getAutoIris: { description: 'Статус авто-ириса', parameters: [] },

    // Прошивка (ASCII IP)
    getFirmware: { description: 'Версия прошивки', parameters: [] },

    // Пресеты (ASCII IP)
    presetRecall: { description: 'Вызов пресета 1..16', parameters: [ { name: 'id', type: 'number', min: 1, max: 16, required: true } ] },
    presetSave: { description: 'Сохранить пресет 1..16', parameters: [ { name: 'id', type: 'number', min: 1, max: 16, required: true } ] }
  };

  static responses = {
    // ASCII IP
    loginPrompt: { matcher: { pattern: /login:/i }, extract: () => ({ type: 'loginPrompt' }) },
    autoIrisStatus: { matcher: { pattern: /auto_iris\s+(on|off)/i }, extract: m => ({ type: 'autoIris', value: m[1].toLowerCase() === 'on' ? 'On' : 'Off' }) },
    firmwareVersion: { matcher: { pattern: /System Version:\s*RoboSHOT UHD\s*(\d+\.\d+\.\d+)/i }, extract: m => ({ type: 'firmware', version: m[1] }) },
    irisStatus: { matcher: { pattern: /iris\s+([0-9]|1[0-3])/i }, extract: m => ({ type: 'iris', value: parseInt(m[1],10) }) },
    error: { matcher: { pattern: /ERROR/i }, extract: () => ({ type: 'error', message: 'Device error' }) }
  };

  initialize() {
    // Для IP (ASCII) попытаемся получить версию и авто-ирис
    this.publishCommand('getFirmware');
    this.publishCommand('getAutoIris');
    this.publishCommand('getIris');
  }


  // Аутентификация
  sendUsername(params) { const { username } = params; return { payload: `${username}\r\n` }; }
  sendPassword(params) { const { password } = params; return { payload: `${password}\r\n` }; }

  // Питание
  setPower(params) { const { value } = params; return { payload: value === 'On' ? 'camera standby off\r\n' : 'camera standby on\r\n' }; }

  // Автофокус
  setAutoFocus(params) { const { value } = params; return { payload: value === 'On' ? 'camera focus mode auto\r\n' : 'camera focus mode manual\r\n' }; }

  // Фокус
  setFocus(params) {
    const { value, speed } = params;
    const sp = speed ? ` ${Math.max(1, Math.min(8, speed))}\r\n` : '\r\n';
    if (value === 'Stop') return { payload: 'camera focus stop\r\n' };
    if (value === 'Near') return { payload: `camera focus near${sp}` };
    if (value === 'Far') return { payload: `camera focus far${sp}` };
    return { payload: '' };
  }

  // Пан/Тилт/Зум
  pan(params) {
    const { direction, speed } = params;
    const sp = speed ? ` ${Math.max(1, Math.min(24, speed))}\r\n` : '\r\n';
    if (direction === 'Stop') return { payload: 'camera pan stop\r\n' };
    if (direction === 'Left') return { payload: `camera pan left${sp}` };
    if (direction === 'Right') return { payload: `camera pan right${sp}` };
    return { payload: '' };
  }
  tilt(params) {
    const { direction, speed } = params;
    const sp = speed ? ` ${Math.max(1, Math.min(20, speed))}\r\n` : '\r\n';
    if (direction === 'Stop') return { payload: 'camera tilt stop\r\n' };
    if (direction === 'Up') return { payload: `camera tilt up${sp}` };
    if (direction === 'Down') return { payload: `camera tilt down${sp}` };
    return { payload: '' };
  }
  zoom(params) {
    const { direction, speed } = params;
    const sp = speed ? ` ${Math.max(1, Math.min(7, speed))}\r\n` : '\r\n';
    if (direction === 'Stop') return { payload: 'camera zoom stop\r\n' };
    if (direction === 'In') return { payload: `camera zoom in${sp}` };
    if (direction === 'Out') return { payload: `camera zoom out${sp}` };
    return { payload: '' };
  }

  // ASCII IP methods
  setIris(params) { const { value } = params; return { payload: `camera ccu set iris ${value}\r\n` }; }
  getIris() { return { payload: 'camera ccu get iris\r\n' }; }
  setAutoIris(params) { const { value } = params; return { payload: `camera ccu set auto_iris ${value.toLowerCase()}\r\n` }; }
  getAutoIris() { return { payload: 'camera ccu get auto_iris\r\n' }; }
  getFirmware() { return { payload: 'version\r\n' }; }

  // Пресеты (ASCII)
  presetRecall(params) { const { id } = params; return { payload: `camera preset recall ${id}\r\n` }; }
  presetSave(params) { const { id } = params; return { payload: `camera preset store ${id}\r\n` }; }

  parseResponse(data) {
    try {
      let raw = data && data.payload !== undefined ? data.payload : data;
      if (Buffer.isBuffer(raw)) {
        // Для VISCA можно при необходимости распознавать ответы, пока оставим как есть
        return null;
      }
      if (typeof raw !== 'string') raw = String(raw ?? '');

      const results = [];
      const defs = this.constructor.responses || {};
      const tryMatch = (text) => {
        for (const [name, def] of Object.entries(defs)) {
          if (!def || !def.matcher || !def.matcher.pattern) continue;
          const rx = new RegExp(def.matcher.pattern.source, def.matcher.pattern.flags);
          const match = text.match(rx);
          if (match) {
            const payload = def.extract ? def.extract(match) : { type: name, raw: match[0] };
            results.push(payload);
          }
        }
      };

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

module.exports = VaddioRoboSHOTDriver;


