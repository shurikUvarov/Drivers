const BaseDriver = require('base-driver');

/**
 * Shure MXA – управление Mute
 * Команды: setMute / getMute
 */
class MyDeviceDriver extends BaseDriver {
  /* ── МЕТАДАННЫЕ ───────────────────────────────────────── */
  static metadata = {
    name        : 'SHURE-MXA',
    manufacturer: 'Shure',
    version     : '1.1.0',
    description : 'Driver: Mute control (device / button / LED)',
  };

  /* ── КОМАНДЫ ──────────────────────────────────────────── */
  static commands = {
    /* Mute */
    setMute: {
      description: 'Установить mute (0=OFF / 1=ON)',
      parameters : [
        { name:'state', type:'number', required:true, min:0, max:1 },
      ],
    },
    getMute: {
      description: 'Запрос mute (DEVICE_AUDIO_MUTE)',
      parameters : [],
    },
  };

  /* ── СПРАВОЧНИК ВОЗВРАТОВ ────────────────────────────── */
  static responses = {
    DeviceMute: {                         // < REP DEVICE_AUDIO_MUTE … >
      description:'Аудио - mute устройства',
      parameters : [{ name:'state', type:'number' }],
      category   :'Audio', recommendedOutput:true,
    },
    MuteButton: {                         // < REP MUTE_BUTTON_STATUS … >
      description:'Состояние кнопки mute',
      parameters : [{ name:'state', type:'number' }],
      category   :'Hardware', recommendedOutput:true,
    },
    MuteLed: {                            // < REP DEV_MUTE_STATUS_LED_STATE … >
      description:'Состояние LED mute',
      parameters : [{ name:'state', type:'number' }],
      category   :'Hardware', recommendedOutput:true,
    },
    Error: {
      description:'Ошибка устройства',
      parameters : [{ name:'message', type:'string' }],
      category   :'Errors', recommendedOutput:true,
    },
  };

  /* ── ПАТТЕРНЫ ─────────────────────────────────────────── */
  static patterns = {
    deviceMute : /^REP\s+DEVICE_AUDIO_MUTE\s+(ON|OFF)$/i,
    buttonMute : /^REP\s+MUTE_BUTTON_STATUS\s+(ON|OFF)$/i,
    ledMute    : /^REP\s+DEV_MUTE_STATUS_LED_STATE\s+(ON|OFF)$/i,
    error      : /^REP\s+ERR$/i,
  };

  /* ── КОНСТРУКТОР ──────────────────────────────────────── */
  constructor(transport, config = {}, node) {
    super(transport, config, node);
    this.muteState = null;     // 0/1 – DEVICE_AUDIO_MUTE
  }

  /* ── INIT ─────────────────────────────────────────────── */
  initialize() { this.getMute(); }

  /* ══  КОМАНДЫ  ══════════════════════════════════════════ */
  setMute ({ state }) {
    if (![0,1].includes(state))
      throw new Error('state must be 0 (OFF) or 1 (ON)');
    return { payload:`< SET DEVICE_AUDIO_MUTE ${state ? 'ON' : 'OFF'} >\r\n` };
  }

  getMute () { return { payload:'< GET DEVICE_AUDIO_MUTE >\r\n' }; }

  /* ── ПАРСЕР ───────────────────────────────────────────── */
  parseResponse (buf) {
    const txt = buf.data.toString();         // как пришло от транспорта
    const chunks = txt
      .replace(/[<>]/g, '')                  // убираем угловые скобки
      .split(/\s*REP\s+/i)                   // режем на отдельные REP
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => 'REP ' + s);                 // возвращаем префикс для регэкспов

    const results = [];

    for (const c of chunks) {
      /* error */
      if (MyDeviceDriver.patterns.error.test(c)) {
        results.push(this.#wrap('Error', { message:'Device ERR', value:'ERR' }, c));
        continue;
      }

      /* DEVICE_AUDIO_MUTE */
      let m = c.match(MyDeviceDriver.patterns.deviceMute);
      if (m) {
        const value = m[1] === 'ON' ? 1 : 0;
        this.muteState = value;
        results.push(this.#wrap('DeviceMute', { state:value, value }, c));
        continue;
      }

      // /* MUTE_BUTTON_STATUS */
      // m = c.match(MyDeviceDriver.patterns.buttonMute);
      // if (m) {
      //   results.push(this.#wrap('MuteButton', { state:m[1]==='ON'?1:0 }, c));
      //   continue;
      // }

      // /* DEV_MUTE_STATUS_LED_STATE */
      // m = c.match(MyDeviceDriver.patterns.ledMute);
      // if (m) {
      //   results.push(this.#wrap('MuteLed', { state:m[1]==='ON'?1:0 }, c));
      //   continue;
      // }
    }

    if (!results.length) return null;
    return results.length === 1 ? results[0] : results[0];
  }

  /* ── ВСПОМОГАТЕЛЬНОЕ ─────────────────────────────────── */
  #wrap (type, obj, msg) { return { category:'response', response:{ type, ...obj }, msg }; }
}

module.exports = MyDeviceDriver;
