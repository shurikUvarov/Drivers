const BaseDriver = require('base-driver');

/**
 * Драйвер для VISCA-совместимых PTZ-камер
 */
class ViscaDriver extends BaseDriver {

  /* ── МЕТАДАННЫЕ ───────────────────────────────────────── */
  static metadata = {
    name        : 'ViscaCamera',
    manufacturer: 'Generic',
    version     : '1.0.2',
    description : 'PTZ камера по протоколу VISCA (Serial/RS232)',
  };

  /* ── КОМАНДЫ ─────────────────────────────────────────── */
  static commands = {
    power: {
      description: 'Включить/выключить питание',
      parameters : [{ name: 'state', type: 'string', required: true, enum: ['On', 'Off'] }],
    },
    panTilt: {
      description: 'Поворот/наклон камеры',
      parameters : [
        { name: 'direction', type: 'string', required: true, enum: ['Up','Down','Left','Right','Up Left','Up Right','Down Left','Down Right','Stop'] },
        { name: 'panSpeed',  type: 'number', required: true, min: 1, max: 24 },
        { name: 'tiltSpeed', type: 'number', required: true, min: 1, max: 24 },
      ],
    },
    zoom: {
      description: 'Зум камеры',
      parameters : [
        { name: 'direction', type: 'string', required: true, enum: ['Tele','Wide','Stop'] },
        { name: 'speed',     type: 'number', required: true, min: 0, max: 7 },
      ],
    },
    focus: {
      description: 'Фокусировка',
      parameters : [
        { name: 'direction', type: 'string', required: true, enum: ['Near','Far','Stop'] },
        { name: 'speed',     type: 'number', required: true, min: 0, max: 7 },
      ],
    },
    autoFocus: {
      description: 'Автофокус',
      parameters : [{ name: 'mode', type: 'string', required: true, enum: ['Auto','Manual'] }],
    },
    recallPreset: {
      description: 'Вызвать пресет',
      parameters : [{ name: 'preset', type: 'number', required: true, min: 1, max: 16 }],
    },
    savePreset: {
      description: 'Сохранить пресет',
      parameters : [{ name: 'preset', type: 'number', required: true, min: 1, max: 16 }],
    },
    autoExposure: {
      description: 'Режим автоэкспозиции',
      parameters : [
        { name: 'mode', type: 'string', required: true,
          enum: ['Automatic Exposure Mode','Manual Control Mode','Shutter Priority Mode','Iris Priority Mode','Bright Mode'] },
      ],
    },
    backlightMode: {
      description: 'Компенсация задней подсветки',
      parameters : [{ name: 'state', type: 'string', required: true, enum: ['On','Off'] }],
    },
    setDeviceId: {
      description: 'Установить ID камеры',
      parameters : [{ name: 'id', type: 'number', required: true, min: 1, max: 7 }],
    },
  };

  /* ── ОТВЕТЫ ──────────────────────────────────────────── */
  static responses = {
    Power: {
      description:'Состояние питания',
      matcher: { pattern: /81 90 40 (02|03)/ },
      extract: m => ({ state: m[1] === '02' ? 'On' : 'Off' }),
      category:'Power', recommendedOutput:true,
    },
    AutoFocus: {
      description:'Режим автофокуса',
      matcher: { pattern: /81 90 40 38 (02|03)/ },
      extract: m => ({ mode: m[1] === '02' ? 'Auto' : 'Manual' }),
      category:'Focus', recommendedOutput:true,
    },
    AutoExposure: {
      description:'Режим автоэкспозиции',
      matcher: { pattern: /81 90 40 39 ([0-9A-F]{2})/ },
      extract: m => {
        const map = { '00':'Automatic Exposure Mode','03':'Manual Control Mode','0A':'Shutter Priority Mode','0B':'Iris Priority Mode','0D':'Bright Mode' };
        return { mode: map[m[1]] || 'Unknown' };
      },
      category:'Exposure', recommendedOutput:true,
    },
    BacklightMode: {
      description:'Режим задней подсветки',
      matcher: { pattern: /81 90 40 33 (02|03)/ },
      extract: m => ({ state: m[1] === '02' ? 'On' : 'Off' }),
      category:'Image', recommendedOutput:true,
    },
    Error: {
      description:'Ошибка камеры',
      matcher: { pattern: /81 90 60 ([0-9A-F]{2})/ },
      extract: m => {
        const errs = { '02':'Syntax Error','03':'Command Buffer Full','04':'Command Cancelled','05':'No Socket','41':'Command Not Executable' };
        return { code: m[1], message: errs[m[1]] || 'Unknown Error' };
      },
      category:'Errors', recommendedOutput:true,
    },
  };

  /* ── КОНСТРУКТОР ─────────────────────────────────────── */
  constructor(transport, config = {}, node) {
    super(transport, config, node);
    this.deviceId = config.deviceId || 1;
  }

  initialize() {
    this.log('info','VISCA камера инициализирована');
  }

  /* ── КОМАНДЫ ─────────────────────────────────────────── */
  power({ state }) {
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x00,state==='On'?0x02:0x03,0xFF]) };
  }

  panTilt({ direction, panSpeed, tiltSpeed }) {
    const map = { 'Up':[0x03,0x01],'Down':[0x03,0x02],'Left':[0x01,0x03],'Right':[0x02,0x03],
      'Up Left':[0x01,0x01],'Up Right':[0x02,0x01],'Down Left':[0x01,0x02],'Down Right':[0x02,0x02],'Stop':[0x03,0x03]};
    const [pan, tilt] = map[direction];
    return { payload: Buffer.from([this._dev(),0x01,0x06,0x01,panSpeed,tiltSpeed,pan,tilt,0xFF]) };
  }

  zoom({ direction, speed }) {
    const map = { 'Tele':0x20,'Wide':0x30,'Stop':0x00 };
    const val = direction==='Stop'?0x00:speed+map[direction];
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x07,val,0xFF]) };
  }

  focus({ direction, speed }) {
    const map = { 'Far':0x20,'Near':0x30,'Stop':0x00 };
    const val = direction==='Stop'?0x00:speed+map[direction];
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x08,val,0xFF]) };
  }

  autoFocus({ mode }) {
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x38,mode==='Auto'?0x02:0x03,0xFF]) };
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
    return { payload: Buffer.from([this._dev(),0x01,0x04,0x33,state==='On'?0x02:0x03,0xFF]) };
  }

  setDeviceId({ id }) {
    this.deviceId = id;
    return { payload: null };
  }

  /* ── ВСПОМОГАТЕЛЬНОЕ ────────────────────────────────── */
  _dev() { return 0x80 + this.deviceId; }
}

module.exports = ViscaDriver;
