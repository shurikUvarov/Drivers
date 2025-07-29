const BaseDriver = require('base-driver');

/**
 * Biamp Tesira DSP Driver
 * Базовые функции: InputLevel, OutputLevel, Mute, PresetRecall, PresetSave, MatrixTie
 */
class TesiraDriver extends BaseDriver {

  /* ── МЕТАДАННЫЕ ───────────────────────────────────────── */
  static metadata = {
    name        : 'Biamp-Tesira',
    manufacturer: 'Biamp',
    version     : '1.0.0',
    description : 'Driver for Biamp Tesira DSP (InputLevel, OutputLevel, Mute, PresetRecall, PresetSave, MatrixTie)',
  };

  /* ── КОМАНДЫ ──────────────────────────────────────────── */
  static commands = {
    inputLevel: {
      description: 'Установить уровень входа (дБ)',
      parameters : [
        { name:'block',   type:'string', required:true },
        { name:'channel', type:'number', required:true },
        { name:'level',   type:'number', required:true, min:-100, max:12 },
      ],
    },
    outputLevel: {
      description: 'Установить уровень выхода (дБ)',
      parameters : [
        { name:'block',   type:'string', required:true },
        { name:'channel', type:'number', required:true },
        { name:'level',   type:'number', required:true, min:-100, max:12 },
      ],
    },
    mute: {
      description: 'Mute канала',
      parameters : [
        { name:'block',   type:'string', required:true },
        { name:'channel', type:'number', required:true },
        { name:'state',   type:'string', required:true, enum:['On','Off'] },
      ],
    },
    presetRecall: {
      description: 'Вызвать пресет',
      parameters : [
        { name:'number', type:'number', required:true },
      ],
    },
    presetSave: {
      description: 'Сохранить пресет',
      parameters : [
        { name:'number', type:'number', required:true },
      ],
    },
    matrixTie: {
      description: 'Связать вход с выходом',
      parameters : [
        { name:'matrix', type:'string', required:true },
        { name:'input',  type:'number', required:true },
        { name:'output', type:'number', required:true },
        { name:'state',  type:'string', required:true, enum:['On','Off'] },
      ],
    },
  };

  /* ── ОТВЕТЫ ──────────────────────────────────────────── */
  static responses = {
    InputLevel: {
      description:'Текущий уровень входа',
      parameters : [
        { name:'block',   type:'string' },
        { name:'channel', type:'number' },
        { name:'value',   type:'number' },
      ],
      category:'Audio', recommendedOutput:true,
    },
    OutputLevel: {
      description:'Текущий уровень выхода',
      parameters : [
        { name:'block',   type:'string' },
        { name:'channel', type:'number' },
        { name:'value',   type:'number' },
      ],
      category:'Audio', recommendedOutput:true,
    },
    Mute: {
      description:'Состояние mute',
      parameters : [
        { name:'block',   type:'string' },
        { name:'channel', type:'number' },
        { name:'state',   type:'string' },
      ],
      category:'Audio', recommendedOutput:true,
    },
    Preset: {
      description:'Активный пресет',
      parameters : [
        { name:'number', type:'number' },
      ],
      category:'Presets', recommendedOutput:true,
    },
    MatrixTie: {
      description:'Состояние матричной коммутации',
      parameters : [
        { name:'matrix', type:'string' },
        { name:'input',  type:'number' },
        { name:'output', type:'number' },
        { name:'state',  type:'string' },
      ],
      category:'Routing', recommendedOutput:true,
    },
    Error: {
      description:'Ошибка устройства',
      parameters : [
        { name:'message', type:'string' },
      ],
      category:'Errors', recommendedOutput:true,
    },
  };

  /* ── КОНСТРУКТОР ─────────────────────────────────────── */
  constructor(transport, config = {}, node) {
    super(transport, config, node);
  }

  /* ── INIT ───────────────────────────────────────────── */
  initialize() {
    // можно отправить тестовый запрос или статус
  }

  /* ── КОМАНДЫ ─────────────────────────────────────────── */
  inputLevel({ block, channel, level }) {
    return { payload: `set level ${block} ${channel} ${level}\r\n` };
  }

  outputLevel({ block, channel, level }) {
    return { payload: `set level ${block} ${channel} ${level}\r\n` };
  }

  mute({ block, channel, state }) {
    return { payload: `set mute ${block} ${channel} ${state.toLowerCase()}\r\n` };
  }

  presetRecall({ number }) {
    return { payload: `preset recall ${number}\r\n` };
  }

  presetSave({ number }) {
    return { payload: `preset save ${number}\r\n` };
  }

  matrixTie({ matrix, input, output, state }) {
    return { payload: `set tie ${matrix} ${input} ${output} ${state.toLowerCase()}\r\n` };
  }
}

module.exports = TesiraDriver;
