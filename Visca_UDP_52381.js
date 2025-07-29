const BaseDriver = require('base-driver');

/**
 * Драйвер для VISCA-совместимых PTZ-камер
 */
class ViscaDriver extends BaseDriver {

  // Метаданные
  static metadata = {
    name: 'ViscaCamera',
    manufacturer: 'Generic',
    version: '1.0.1',
    description: 'PTZ камера по протоколу VISCA (Serial/RS232)'
  };

  // Команды
  static commands = {
    power: {
      description: 'Включить/выключить питание',
      parameters: [
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off'] }
      ]
    },
    panTilt: {
      description: 'Управление поворотом/наклоном',
      parameters: [
        { name: 'direction', type: 'string', required: true, enum: ['Up','Down','Left','Right','Up Left','Up Right','Down Left','Down Right','Stop'] },
        { name: 'panSpeed', type: 'number', required: true, min: 1, max: 24 },
        { name: 'tiltSpeed', type: 'number', required: true, min: 1, max: 24 }
      ]
    },
    zoom: {
      description: 'Зум камеры',
      parameters: [
        { name: 'direction', type: 'string', required: true, enum: ['Tele','Wide','Stop'] },
        { name: 'speed', type: 'number', required: true, min: 0, max: 7 }
      ]
    },
    focus: {
      description: 'Фокусировка',
      parameters: [
        { name: 'direction', type: 'string', required: true, enum: ['Near','Far','Stop'] },
        { name: 'speed', type: 'number', required: true, min: 0, max: 7 }
      ]
    },
    autoFocus: {
      description: 'Включение/выключение автофокуса',
      parameters: [
        { name: 'mode', type: 'string', required: true, enum: ['Auto','Manual'] }
      ]
    },
    recallPreset: {
      description: 'Вызов пресета',
      parameters: [{ name: 'preset', type: 'number', required: true, min: 1, max: 16 }]
    },
    savePreset: {
      description: 'Сохранение пресета',
      parameters: [{ name: 'preset', type: 'number', required: true, min: 1, max: 16 }]
    },
    autoExposure: {
      description: 'Режим автоэкспозиции',
      parameters: [
        { name: 'mode', type: 'string', required: true, enum: ['Automatic Exposure Mode','Manual Control Mode','Shutter Priority Mode','Iris Priority Mode','Bright Mode'] }
      ]
    },
    backlightMode: {
      description: 'Компенсация задней подсветки',
      parameters: [
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    setDeviceId: {
      description: 'Установка ID устройства',
      parameters: [{ name: 'id', type: 'number', required: true, min: 1, max: 7 }]
    }
  };

  // Ответы
  static responses = {
    powerStatus: {
      description: 'Состояние питания',
      matcher: { pattern: /81 90 40 (02|03)/ },
      extract: m => ({ type:'Power', state: m[1] === '02' ? 'On' : 'Off' })
    },
    autoFocusStatus: {
      description: 'Режим автофокуса',
      matcher: { pattern: /81 90 40 38 (02|03)/ },
      extract: m => ({ type:'AutoFocus', mode: m[1] === '02' ? 'Auto' : 'Manual' })
    },
    exposureStatus: {
      description: 'Режим экспозиции',
      matcher: { pattern: /81 90 40 39 ([0-9A-F]{2})/ },
      extract: m => {
        const map = { '00':'Automatic Exposure Mode','03':'Manual Control Mode','0A':'Shutter Priority Mode','0B':'Iris Priority Mode','0D':'Bright Mode' };
        return { type:'AutoExposure', mode: map[m[1]] || 'Unknown' };
      }
    },
    backlightStatus: {
      description: 'Режим задней подсветки',
      matcher: { pattern: /81 90 40 33 (02|03)/ },
      extract: m => ({ type:'BacklightMode', state: m[1] === '02' ? 'On' : 'Off' })
    },
    error: {
      description: 'Ошибка устройства',
      matcher: { pattern: /81 90 60 ([0-9A-F]{2})/ },
      extract: m => {
        const errs = { '02':'Syntax Error','03':'Command Buffer Full','04':'Command Cancelled','05':'No Socket','41':'Command Not Executable' };
        return { type:'Error', code: m[1], message: errs[m[1]] || 'Unknown Error' };
      }
    }
  };

  // Конструктор
  constructor(transport, config = {}, node) {
    super(transport, config, node);
    this.deviceId = config.deviceId || 1;
  }

  initialize() {
    console.log('Инициализация VISCA камеры');
  }

  // Методы команд
  power({ state }) {
    const cmd = Buffer.from([this._dev(), 0x01,0x04,0x00, state === 'On' ? 0x02 : 0x03, 0xFF]);
    return { payload: cmd };
  }

  panTilt({ direction, panSpeed, tiltSpeed }) {
    const map = { 'Up':[0x03,0x01], 'Down':[0x03,0x02], 'Left':[0x01,0x03], 'Right':[0x02,0x03],
      'Up Left':[0x01,0x01], 'Up Right':[0x02,0x01], 'Down Left':[0x01,0x02], 'Down Right':[0x02,0x02], 'Stop':[0x03,0x03]};
    const [pan, tilt] = map[direction];
    return { payload: Buffer.from([this._dev(),0x01,0x06,0x01,panSpeed,tiltSpeed,pan,tilt,0xFF]) };
  }

  zoom({ direction, speed }) {
    const map = { 'Tele':0x20, 'Wide':0x30, 'Stop':0x00 };
    let val = direction === 'Stop' ? 0x00 : speed + map[direction];
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x07,val,0xFF]) };
  }

  focus({ direction, speed }) {
    const map = { 'Far':0x20, 'Near':0x30, 'Stop':0x00 };
    let val = direction === 'Stop' ? 0x00 : speed + map[direction];
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x08,val,0xFF]) };
  }

  autoFocus({ mode }) {
    const val = mode === 'Auto' ? 0x02 : 0x03;
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x38,val,0xFF]) };
  }

  recallPreset({ preset }) {
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x3F,0x02,preset-1,0xFF]) };
  }

  savePreset({ preset }) {
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x3F,0x01,preset-1,0xFF]) };
  }

  autoExposure({ mode }) {
    const map = { 'Automatic Exposure Mode':0x00,'Manual Control Mode':0x03,'Shutter Priority Mode':0x0A,'Iris Priority Mode':0x0B,'Bright Mode':0x0D };
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x39,map[mode],0xFF]) };
  }

  backlightMode({ state }) {
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x33,state === 'On' ? 0x02 : 0x03,0xFF]) };
  }

  setDeviceId({ id }) {
    this.deviceId = id;
    return { payload: null };
  }

  // Парсер
  parseResponse(data) {
    const hex = data.toString('hex').match(/.{1,2}/g).map(b => b.toUpperCase()).join(' ');
    for (const [key, resp] of Object.entries(ViscaDriver.responses)) {
      const regex = new RegExp(resp.matcher.pattern);
      const m = hex.match(regex);
      if (m) return resp.extract(m);
    }
    return null;
  }

  _dev() { return 0x80 + this.deviceId; }
}

module.exports = ViscaDriver;
