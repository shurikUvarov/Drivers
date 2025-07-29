const BaseDriver = require('base-driver');
class SymetrixRadiusNXDriver extends BaseDriver {
  static metadata = {
    name: 'Symetrix Radius NX',
    manufacturer: 'Symetrix',
    version: '1.0.1',
    description: 'Драйвер для DSP Symetrix Radius NX Series (исправленная версия)'
  };
  static commands = {
    Mute: {
      description: 'Включение/выключение канала',
      parameters: [
        { name: 'controller', type: 'number', min: 1, max: 10000, required: true },
        { name: 'state', type: 'boolean', required: true }
      ]
    },
    Volume: {
      description: 'Установка громкости канала',
      parameters: [
        { name: 'controller', type: 'number', min: 1, max: 10000, required: true },
        { name: 'value', type: 'number', min: 0, max: 100, required: true }
      ]
    },
    PresetRecall: {
      description: 'Вызов пресета',
      parameters: [
        { name: 'preset', type: 'number', min: 1, max: 1000, required: true }
      ]
    },
    GetState: {
      description: 'Запрос состояния контроллера',
      parameters: [
        { name: 'controller', type: 'number', min: 1, max: 10000, required: true }
      ]
    }
  };
  static responses = {
    Mute: {
      description: 'Состояние Mute',
      parameters: [
        { name: 'controller', type: 'number' },
        { name: 'state', type: 'boolean' }
      ]
    },
    Volume: {
      description: 'Уровень громкости',
      parameters: [
        { name: 'controller', type: 'number' },
        { name: 'value', type: 'number' }
      ]
    },
    Preset: {
      description: 'Текущий пресет',
      parameters: [
        { name: 'preset', type: 'number' }
      ]
    },
    Raw: {
      description: 'Нераспознанный ответ',
      parameters: [
        { name: 'value', type: 'string' }
      ]
    }
  };
  static defaultTransport = {
    type: 'tcp',
    port: 48631
  };
  constructor(transport, config, node) {
    super(transport, config, node);
    this._pending = new Map();
  }
  initialize() {
    // Запрос текущего пресета при инициализации
    //this.publishCommand('PresetRecall', { preset: 0 });
  }
  // ================== КОМАНДЫ ==================
  Mute({ controller, state }) {
    const value = state ? 65535 : 0;
    const cmd = `CS ${controller} ${value}\r`;
    this._pending.set(controller, { type: 'Mute', timestamp: Date.now() });
    return { payload: cmd };
  }
  Volume({ controller, value }) {
    // const scaled = Math.round((value / 100) * 65535);
    const cmd = `CS ${controller} ${value}\r`;
    this._pending.set(controller, { type: 'Volume', timestamp: Date.now() });
    return { payload: cmd };
  }
  PresetRecall({ preset }) {
    return { payload: `LP ${preset}\r` };
  }
  GetState({ controller }) {
    const cmd = `GS ${controller}\r`;
    this._pending.set(controller, { type: 'GetState', timestamp: Date.now() });
    return { payload: cmd };
  }
  // ================== ПАРСИНГ ОТВЕТОВ ==================
  parseResponse(data) {
    let raw = data.data?.payload || data.data;
    if (Buffer.isBuffer(raw)) raw = raw.toString();
    if (!raw) return null;
    raw = raw.trim();
    if (!raw) return null;
    // 1. Формат ответа: #00005=00000
    const hashFormat = /^#(\d{5})=(\d{1,5})$/;
    if (hashFormat.test(raw)) {
      const match = raw.match(hashFormat);
      const controller = parseInt(match[1], 10);
      const value = parseInt(match[2], 10);
      return this.parseControllerValue(controller, value);
    }
    // 2. Формат ответа: CS <controller> <value> [succeeded]
    const csFormat = /^CS\s+(\d+)\s+(\d+)(?:\s+succeeded)?$/i;
    if (csFormat.test(raw)) {
      const match = raw.match(csFormat);
      const controller = parseInt(match[1], 10);
      const value = parseInt(match[2], 10);
      return this.parseControllerValue(controller, value);
    }
    // 3. Формат ответа: LP <preset>
    const lpFormat = /^LP\s+(\d+)$/i;
    if (lpFormat.test(raw)) {
      const match = raw.match(lpFormat);
      return {
        type: 'Preset',
        preset: parseInt(match[1], 10)
      };
    }
    // 4. Ответ на GS: просто число
    if (/^\d+$/.test(raw)) {
      const value = parseInt(raw, 10);
      const pendingEntry = this.findPendingByValue(value);
      if (pendingEntry) {
        this._pending.delete(pendingEntry.controller);
        return this.parseControllerValue(pendingEntry.controller, value);
      }
      return { type: 'Raw', value: raw };
    }
    // 5. Неопознанный формат
    return { type: 'Raw', value: raw };
  }
  KeepAlive(){
    this.publishCommand('GetState', {'controller':1});
    this.publishCommand('GetState', {'controller':2});
    this.publishCommand('GetState', {'controller':4});
    this.publishCommand('GetState', {'controller':10});
    this.publishCommand('GetState', {'controller':12});
   }
  // ================== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==================
  parseControllerValue(controller, value) {
    // Определяем тип значения (Mute или Volume)
    const isMuteValue = value === 65535 || value === 0;
    const pending = this._pending.get(controller);
    // Если есть ожидание и тип совпадает
    if (pending && (
        (pending.type === 'Mute' && isMuteValue) ||
        (pending.type === 'Volume' && !isMuteValue) ||
        pending.type === 'GetState'
    )) {
      this._pending.delete(controller);
    }
    // Формируем ответ
    if (isMuteValue) {
      this.publishResponse( {
        type: 'Mute',
        controller,
        state: value === 65535  // 65535 = Mute ON (true), 0 = Mute OFF (false)
      })
    }
    return {
      type: 'Volume',
      controller,
      value: Math.round(((value - 32767) / 32768) * 100)
    };
  }
  findPendingByValue(value) {
    const now = Date.now();
    for (const [controller, entry] of this._pending) {
      // Удаляем устаревшие ожидания (> 5 сек)
      if (now - entry.timestamp > 5000) {
        this._pending.delete(controller);
        continue;
      }
      // Для GetState любое значение подходит
      if (entry.type === 'GetState') {
        return { controller, ...entry };
      }
    }
    return {};
  }
}
module.exports = SymetrixRadiusNXDriver;
