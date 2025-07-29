const BaseDriver = require('base-driver');

/**
 * Shure P300 Conference DSP
 * Управление: Gain / Mute / Preset
 */
class P300Driver extends BaseDriver {
  /* ── МЕТАДАННЫЕ ───────────────────────────────────────── */
  static metadata = {
    name        : 'Shure-P300',
    manufacturer: 'Shure',
    version     : '1.3.0',
    description : 'Driver: Gain / Mute / Preset for Shure P300 DSP (каналы по номерам)',
  };

  /* ── КОМАНДЫ ──────────────────────────────────────────── */
  static commands = {
    /* Gain */
    setGain: {
      description: 'Установить уровень (дБ)',
      parameters : [
        { name:'channel', type:'number', required:true, min:1, max:28 },
        { name:'gain',    type:'number', required:true, min:-110, max:30 },
      ],
    },
    getGain: {
      description: 'Запрос уровня (дБ)',
      parameters : [{ name:'channel', type:'number', required:false, min:1, max:28 }],
    },

    /* Mute */
    setMute: {
      description: 'Установить mute (0/1)',
      parameters : [
        { name:'channel', type:'number', required:true, min:1, max:28 },
        { name:'state',   type:'number', required:true, min:0, max:1 },
      ],
    },
    getMute: {
      description: 'Запрос mute',
      parameters : [{ name:'channel', type:'number', required:false, min:1, max:28 }],
    },

    /* Preset */
    recallPreset: {
      description: 'Вызвать пресет 1-10',
      parameters : [{ name:'preset', type:'number', required:true, min:1, max:10 }],
    },
    getPreset: {
      description: 'Текущий пресет',
      parameters : [],
    },
  };

  /* ── СПРАВОЧНИК ВОЗВРАТОВ ─────────────────────────────── */
  static responses = {
    Gain: {
      description: 'Текущий уровень канала',
      parameters : [
        { name:'channel', type:'number' },
        { name:'gain',    type:'number' },
      ],
      category:'Audio', recommendedOutput:true,
    },
    Mute: {
      description:'Состояние mute канала',
      parameters : [
        { name:'channel', type:'number' },
        { name:'state',   type:'number' },
      ],
      category:'Audio', recommendedOutput:true,
    },
    Preset: {
      description:'Активный пресет',
      parameters : [{ name:'preset', type:'number' }],
      category:'Presets', recommendedOutput:true,
    },
    Error: {
      description:'Ошибка устройства',
      parameters : [{ name:'message', type:'string' }],
      category:'Errors', recommendedOutput:true,
    },
  };

  /* ── ПАТТЕРНЫ ─────────────────────────────────────────── */
  static patterns = {
    gain  : /^< REP (\d{2}) AUDIO_GAIN_HI_RES (\d{4}) >/i,
    mute  : /^< REP (\d{2}) AUDIO_MUTE (ON|OFF) >/i,
    preset: /^< REP PRESET (0[1-9]|10) >/i,
    error : /^< REP ERR >/i,
  };

  /* ── КОНСТРУКТОР ───────────────────────────────────────── */
  constructor(transport, config = {}, node) {
    super(transport, config, node);
    this.state         = {};  // { <код>: { gain, mute } }
    this.currentPreset = null;
  }

  /* ── INIT ─────────────────────────────────────────────── */
  initialize() { this.getPreset(); }

  /* ══  КОМАНДЫ  ══════════════════════════════════════════ */
  setGain ({ channel, gain }) {
    this.#range(gain,-110,30,'Gain');
    const code  = this.#code(channel);
    const hiRes = ('0000'+Math.round((gain+110)*10)).slice(-4);
    return {payload:`< SET ${code} AUDIO_GAIN_HI_RES ${hiRes} >\r\n`};
  }

  getGain ({ channel }={}) {
    const code = channel ? this.#code(channel) : '00';
    return {payload:`< GET ${code} AUDIO_GAIN_HI_RES >\r\n`};
  }

  setMute ({ channel, state }) {
    if (![0,1].includes(state)) throw new Error('state must be 0/1');
    const code = this.#code(channel);
    return {payload:`< SET ${code} AUDIO_MUTE ${state?'ON':'OFF'} >\r\n`};
  }

  getMute ({ channel }={}) {
    const code = channel ? this.#code(channel) : '00';
    return {payload:`< GET ${code} AUDIO_MUTE >\r\n`};
  }

  recallPreset ({ preset }) {
    this.#range(preset,1,10,'Preset');
    return {payload:`< SET PRESET ${('0'+preset).slice(-2)} >\r\n`};
  }

  getPreset () { return {payload:`< GET PRESET >\r\n`}; }

  /* ── ПАРСЕР ───────────────────────────────────────────── */
  parseResponse(buf) {
    buf = buf.data
    const txt = buf.toString().trim();

    /* error */
    if (P300Driver.patterns.error.test(txt))
      return this.#wrap('Error',{ message:'Device reported ERR' },txt);

    /* gain */
    let m = txt.match(P300Driver.patterns.gain);
    if (m) {
      const value = Number(m[2])/10 - 110;
      const channel = parseInt(m[1],10);
      this.#cache(channel,'gain',value);
      return this.#wrap('Gain',{channel,gain:value},txt);
    }

    /* mute */
    m = txt.match(P300Driver.patterns.mute);
    if (m) {
      const value = m[2]==='ON'?1:0;
      const channel = parseInt(m[1],10);
      this.#cache(channel,'mute',value);
      return this.#wrap('Mute',{channel,state:value},txt);
    }

    /* preset */
    m = txt.match(P300Driver.patterns.preset);
    if (m) {
      const preset = Number(m[1]);
      this.currentPreset = preset;
      return this.#wrap('Preset',{preset},txt);
    }

    /* нераспознано */
    return null;
  }

  /* ── ВСПОМОГАТЕЛЬНОЕ ─────────────────────────────────── */
  #wrap(type,obj,msg){ return {category:'response',response:{type,...obj},msg}; }
  #cache(channel,key,val){ (this.state[channel]??={})[key]=val; }
  #code(num){
    if (typeof num !== 'number' || num < 1 || num > 28) 
      throw new Error(`Channel must be 1…28, got ${num}`);
    return ('0'+num).slice(-2);
  }
  #range(v,min,max,l){ if(typeof v!=='number'||v<min||v>max) throw new Error(`${l} must be ${min}…${max}`); }
}

module.exports = P300Driver;
