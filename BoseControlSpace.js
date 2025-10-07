const BaseDriver = require('base-driver');

class BoseControlSpaceDriver extends BaseDriver {
  static metadata = {
    name: 'Bose ControlSpace / PowerMatch',
    manufacturer: 'Bose',
    version: '1.0.0',
    description: 'Драйвер Bose ControlSpace ESP/EX и PowerMatch по TCP (ASCII, \\r окончания команд)'
  };

  static commands = {
    // Сервисные/общие
    clearFaultAlarms: {
      description: 'Сброс сигналов неисправности',
      parameters: []
    },
    getFaultStatus: {
      description: 'Статус неисправностей устройства',
      parameters: []
    },
    setParameterRecall: {
      description: 'Вызов пресета параметров по номеру (1..255)',
      parameters: [
        { name: 'number', type: 'number', required: true, min: 1, max: 255, description: 'Номер пресета' }
      ]
    },
    getParameterRecall: {
      description: 'Текущий активный пресет',
      parameters: []
    },

    // Группы
    setGroupLevel: {
      description: 'Уровень группы (1..64)',
      parameters: [
        { name: 'group', type: 'number', required: true, min: 1, max: 64 },
        { name: 'value', type: 'number', required: true, min: -60, max: 12, description: 'дБ' }
      ]
    },
    getGroupLevel: {
      description: 'Текущий уровень группы (1..64)',
      parameters: [
        { name: 'group', type: 'number', required: true, min: 1, max: 64 }
      ]
    },
    setGroupMute: {
      description: 'Мьют группы (1..64)',
      parameters: [
        { name: 'group', type: 'number', required: true, min: 1, max: 64 },
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off', 'Toggle'] }
      ]
    },
    getGroupMute: {
      description: 'Статус мьюта группы (1..64)',
      parameters: [
        { name: 'group', type: 'number', required: true, min: 1, max: 64 }
      ]
    },

    // Общие Gain/Level/Mute (по имени узла)
    setGain: {
      description: 'Установка Gain по имени',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: -60.5, max: 12 }
      ]
    },
    getGain: {
      description: 'Чтение Gain по имени',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setGainMute: {
      description: 'Мьют Gain по имени',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off', 'Toggle'] }
      ]
    },
    getGainMute: {
      description: 'Статус мьюта Gain по имени',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setLevel: {
      description: 'Установка Level по имени и модулю',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input', 'Output', 'ESPLink', 'AMPLink'] },
        { name: 'value', type: 'number', required: true, min: -60.5, max: 12 }
      ]
    },
    getLevel: {
      description: 'Чтение Level по имени и модулю',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input', 'Output', 'ESPLink', 'AMPLink'] }
      ]
    },
    setMute: {
      description: 'Мьют по имени и модулю',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input', 'Output', 'ESPLink', 'AMPLink'] },
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off', 'Toggle'] }
      ]
    },
    getMute: {
      description: 'Статус мьюта по имени и модулю',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input', 'Output', 'ESPLink', 'AMPLink'] }
      ]
    },

    // Router / Matrix
    setRouterInputSelect: {
      description: 'Маршрутизация входа на выход',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'output', type: 'number', required: true, min: 1, max: 32 },
        { name: 'value', type: 'number', required: true, min: 0, max: 32 }
      ]
    },
    getRouterInputSelect: {
      description: 'Текущая маршрутизация на выходе',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'output', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setMatrixMixerLevel: {
      description: 'Уровень точки в матрице',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'input', type: 'number', required: true, min: 1, max: 32 },
        { name: 'output', type: 'number', required: true, min: 1, max: 32 },
        { name: 'matrixSize', type: 'number', required: true, min: 1, max: 32 },
        { name: 'value', type: 'number', required: true, min: -60.5, max: 0 }
      ]
    },
    getMatrixMixerLevel: {
      description: 'Чтение уровня точки в матрице',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'input', type: 'number', required: true, min: 1, max: 32 },
        { name: 'output', type: 'number', required: true, min: 1, max: 32 },
        { name: 'matrixSize', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setMatrixMixerState: {
      description: 'Состояние точки в матрице (вкл/выкл)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'input', type: 'number', required: true, min: 1, max: 32 },
        { name: 'output', type: 'number', required: true, min: 1, max: 32 },
        { name: 'matrixSize', type: 'number', required: true, min: 1, max: 32 },
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off'] }
      ]
    },
    getMatrixMixerState: {
      description: 'Чтение состояния точки матрицы',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'input', type: 'number', required: true, min: 1, max: 32 },
        { name: 'output', type: 'number', required: true, min: 1, max: 32 },
        { name: 'matrixSize', type: 'number', required: true, min: 1, max: 32 }
      ]
    },

    // AEC (1..12)
    setAECCNEnable: {
      description: 'AEC Comfort Noise Enable',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 12 },
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off'] }
      ]
    },
    getAECCNEnable: {
      description: 'Статус AEC CN Enable',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 12 }
      ]
    },
    setAECEnable: {
      description: 'AEC Enable',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 12 },
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off'] }
      ]
    },
    getAECEnable: {
      description: 'Статус AEC Enable',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 12 }
      ]
    },
    setAECInternalMute: {
      description: 'AEC Internal Mute',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 12 },
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off'] }
      ]
    },
    getAECInternalMute: {
      description: 'Статус AEC Internal Mute',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 12 }
      ]
    },
    setAECNLPControl: {
      description: 'AEC NLP Control',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 12 },
        { name: 'mode', type: 'string', required: true, enum: ['Light', 'Medium', 'Strong'] }
      ]
    },
    getAECNLPControl: {
      description: 'Статус AEC NLP Control',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 12 }
      ]
    },
    setAECNRLevel: {
      description: 'AEC Noise Reduction Level',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 12 },
        { name: 'value', type: 'number', required: true, min: 0, max: 32 }
      ]
    },
    getAECNRLevel: {
      description: 'Статус AEC NR Level',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 12 }
      ]
    },
    getAECReference: {
      description: 'AEC Reference',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 12 }
      ]
    },

    // Array EQ
    setArrayEQAdvanced: {
      description: 'Array EQ Advanced On/Off',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off'] }
      ]
    },
    getArrayEQAdvanced: {
      description: 'Статус Array EQ Advanced',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setArrayEQCenterFrequency: {
      description: 'Array EQ Center Frequency (Гц)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 220, max: 700 }
      ]
    },
    getArrayEQCenterFrequency: {
      description: 'Чтение Array EQ Center Frequency',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setArrayEQTilt: {
      description: 'Array EQ Tilt (0..10)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 0, max: 10 }
      ]
    },
    getArrayEQTilt: {
      description: 'Чтение Array EQ Tilt',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setArrayEQVerticalAngle: {
      description: 'Array EQ Vertical Angle (20..100)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 20, max: 100 }
      ]
    },
    getArrayEQVerticalAngle: {
      description: 'Чтение Array EQ Vertical Angle',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },

    // Crossover
    setCrossoverFilter: {
      description: 'Тип фильтра кроссовера',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 4 },
        { name: 'type', type: 'string', required: true, enum: ['Low/High', 'Mid HPF', 'Mid LPF'] },
        { name: 'filter', type: 'string', required: true, enum: ['Butterworth 6dB/oct','Butterworth 12dB/oct','Butterworth 18dB/oct','Butterworth 24dB/oct','Butterworth 36dB/oct','Butterworth 48dB/oct','Bessel 12dB/oct','Bessel 18dB/oct','Bessel 24dB/oct','Bessel 36dB/oct','Bessel 48dB/oct','Linkwitz-Reilly 12dB/oct','Linkwitz-Reilly 24dB/oct','Linkwitz-Reilly 36dB/oct','Linkwitz-Reilly 48dB/oct'] }
      ]
    },
    getCrossoverFilter: {
      description: 'Чтение типа фильтра кроссовера',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 4 },
        { name: 'type', type: 'string', required: true, enum: ['Low/High', 'Mid HPF', 'Mid LPF'] }
      ]
    },
    setCrossoverFrequency: {
      description: 'Частота среза кроссовера (Гц)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 4 },
        { name: 'type', type: 'string', required: true, enum: ['Low/High', 'Mid HPF', 'Mid LPF'] },
        { name: 'value', type: 'number', required: true, min: 20, max: 20000 }
      ]
    },
    getCrossoverFrequency: {
      description: 'Чтение частоты среза кроссовера',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 4 },
        { name: 'type', type: 'string', required: true, enum: ['Low/High', 'Mid HPF', 'Mid LPF'] }
      ]
    },
    setCrossoverMute: {
      description: 'Мьют полос кроссовера',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 4 },
        { name: 'type', type: 'string', required: true, enum: ['Low/High', 'Mid'] },
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off'] }
      ]
    },
    getCrossoverMute: {
      description: 'Статус мьюта полос кроссовера',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 4 },
        { name: 'type', type: 'string', required: true, enum: ['Low/High', 'Mid'] }
      ]
    },
    setCrossoverPolarity: {
      description: 'Полярность полос кроссовера',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 4 },
        { name: 'type', type: 'string', required: true, enum: ['Low/High', 'Mid'] },
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off'] }
      ]
    },
    getCrossoverPolarity: {
      description: 'Статус полярности полос кроссовера',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 4 },
        { name: 'type', type: 'string', required: true, enum: ['Low/High', 'Mid'] }
      ]
    },

    // Delay
    setDelayBypass: {
      description: 'Bypass Delay для выхода (1..8)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'output', type: 'number', required: true, min: 1, max: 8 },
        { name: 'state', type: 'string', required: true, enum: ['On', 'Off'] }
      ]
    },
    getDelayBypass: {
      description: 'Статус Bypass Delay для выхода (1..8)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'output', type: 'number', required: true, min: 1, max: 8 }
      ]
    },
    setDelayTime: {
      description: 'Delay Time для выхода (мс, ESP до 144000, EX до 48000)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'output', type: 'number', required: true, min: 1, max: 8 },
        { name: 'value', type: 'number', required: true, min: 0, max: 144000 }
      ]
    },
    getDelayTime: {
      description: 'Чтение Delay Time для выхода',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'output', type: 'number', required: true, min: 1, max: 8 }
      ]
    },

    // Ducker
    setDuckerDecay: {
      description: 'Ducker Decay (5..50000 мс)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 5, max: 50000 }
      ]
    },
    getDuckerDecay: {
      description: 'Чтение Ducker Decay',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setDuckerHold: {
      description: 'Ducker Hold (0..1000 мс)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 0, max: 1000 }
      ]
    },
    getDuckerHold: {
      description: 'Чтение Ducker Hold',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setDuckerRange: {
      description: 'Ducker Range (-70..0 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: -70, max: 0 }
      ]
    },
    getDuckerRange: {
      description: 'Чтение Ducker Range',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },

    // Gate / Compressor/Limiter
    setGateDecay: {
      description: 'Gate Decay (5..50000 мс)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 5, max: 50000 }
      ]
    },
    getGateDecay: {
      description: 'Чтение Gate Decay',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setGateDetector: {
      description: 'Gate Detector вход',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'mode', type: 'string', required: true, enum: ['Left','Right','Mix','Sidechain'] }
      ]
    },
    getGateDetector: {
      description: 'Чтение Gate Detector входа',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setGateHold: {
      description: 'Gate Hold (0..1000 мс)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 0, max: 1000 }
      ]
    },
    getGateHold: {
      description: 'Чтение Gate Hold',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setGateRange: {
      description: 'Gate Range (-70..0 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: -70, max: 0 }
      ]
    },
    getGateRange: {
      description: 'Чтение Gate Range',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setCompressorLimiterInputDetect: {
      description: 'Compressor/Limiter Input Detect (L/R/M/S)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'mode', type: 'string', required: true, enum: ['Left','Right','Mix','Sidechain'] }
      ]
    },
    getCompressorLimiterInputDetect: {
      description: 'Статус Compressor/Limiter Input Detect',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setCompressorLimiterRatio: {
      description: 'Compressor/Limiter Ratio (1..20)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 1, max: 20 }
      ]
    },
    getCompressorLimiterRatio: {
      description: 'Чтение Compressor/Limiter Ratio',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setCompressorLimiterRelease: {
      description: 'Compressor/Limiter Release (1..1000 мс)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 1, max: 1000 }
      ]
    },
    getCompressorLimiterRelease: {
      description: 'Чтение Compressor/Limiter Release',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },

    // Parametric EQ
    setParametricEQFrequency: {
      description: 'Parametric EQ Frequency (Гц)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'band', type: 'number', required: true, min: 1, max: 16 },
        { name: 'value', type: 'number', required: true, min: 20, max: 20000 }
      ]
    },
    getParametricEQFrequency: {
      description: 'Чтение Parametric EQ Frequency',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'band', type: 'number', required: true, min: 1, max: 16 }
      ]
    },
    setParametricEQGain: {
      description: 'Parametric EQ Gain (-20..20 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'band', type: 'number', required: true, min: 1, max: 16 },
        { name: 'value', type: 'number', required: true, min: -20, max: 20 }
      ]
    },
    getParametricEQGain: {
      description: 'Чтение Parametric EQ Gain',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'band', type: 'number', required: true, min: 1, max: 16 }
      ]
    },
    setParametricEQQ: {
      description: 'Parametric EQ Q (0.1..10.0)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'band', type: 'number', required: true, min: 1, max: 16 },
        { name: 'value', type: 'number', required: true, min: 0.1, max: 10.0 }
      ]
    },
    getParametricEQQ: {
      description: 'Чтение Parametric EQ Q',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'band', type: 'number', required: true, min: 1, max: 16 }
      ]
    },
    setParametricEQSlope: {
      description: 'Parametric EQ Slope (0/-6/-12 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'band', type: 'number', required: true, min: 1, max: 16 },
        { name: 'slope', type: 'string', required: true, enum: ['0','-6','-12'] }
      ]
    },
    getParametricEQSlope: {
      description: 'Чтение Parametric EQ Slope',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'band', type: 'number', required: true, min: 1, max: 16 }
      ]
    },
    setParametricEQType: {
      description: 'Parametric EQ Type',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'band', type: 'number', required: true, min: 1, max: 16 },
        { name: 'type', type: 'string', required: true, enum: ['Band','High Shelf','Low Shelf','High Cut','Low Cut','Notch'] }
      ]
    },
    getParametricEQType: {
      description: 'Чтение Parametric EQ Type',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'band', type: 'number', required: true, min: 1, max: 16 }
      ]
    },

    // Tone Control
    setToneControlGain: {
      description: 'Tone Control Gain Low/Mid/High (-15..15 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'type', type: 'string', required: true, enum: ['Low','Mid','High'] },
        { name: 'value', type: 'number', required: true, min: -15, max: 15 }
      ]
    },
    getToneControlGain: {
      description: 'Чтение Tone Control Gain',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'type', type: 'string', required: true, enum: ['Low','Mid','High'] }
      ]
    },

    // Speaker Parametric
    setSpeakerParametricAlignDelay: {
      description: 'Speaker Parametric Align Delay (0..480 мс)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 0, max: 480 }
      ]
    },
    getSpeakerParametricAlignDelay: {
      description: 'Чтение Speaker Parametric Align Delay',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setSpeakerParametricBypass: {
      description: 'Speaker Parametric Bypass High/Low',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'type', type: 'string', required: true, enum: ['High','Low'] },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getSpeakerParametricBypass: {
      description: 'Чтение Speaker Parametric Bypass',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'type', type: 'string', required: true, enum: ['High','Low'] }
      ]
    },
    setSpeakerParametricFilter: {
      description: 'Speaker Parametric фильтр High/Low',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'type', type: 'string', required: true, enum: ['High','Low'] },
        { name: 'filter', type: 'string', required: true, enum: ['Butterworth 6dB/oct','Butterworth 12dB/oct','Butterworth 18dB/oct','Butterworth 24dB/oct','Butterworth 36dB/oct','Butterworth 48dB/oct','Bessel 12dB/oct','Bessel 18dB/oct','Bessel 24dB/oct','Bessel 36dB/oct','Bessel 48dB/oct','Linkwitz-Reilly 12dB/oct','Linkwitz-Reilly 24dB/oct','Linkwitz-Reilly 36dB/oct','Linkwitz-Reilly 48dB/oct'] }
      ]
    },
    getSpeakerParametricFilter: {
      description: 'Чтение Speaker Parametric фильтра',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'type', type: 'string', required: true, enum: ['High','Low'] }
      ]
    },
    setSpeakerParametricFrequency: {
      description: 'Speaker Parametric Frequency (Гц)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'type', type: 'string', required: true, enum: ['High','Low'] },
        { name: 'value', type: 'number', required: true, min: 20, max: 20000 }
      ]
    },
    getSpeakerParametricFrequency: {
      description: 'Чтение Speaker Parametric Frequency',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'type', type: 'string', required: true, enum: ['High','Low'] }
      ]
    },
    setSpeakerParametricGain: {
      description: 'Speaker Parametric Gain (-15..15 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: -15, max: 15 }
      ]
    },
    getSpeakerParametricGain: {
      description: 'Чтение Speaker Parametric Gain',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },

    // Speaker Parametric EQ Band (1..9)
    setSpeakerParametricEQBandBypass: {
      description: 'SPK Param EQ Band Bypass (1..9)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 9 },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getSpeakerParametricEQBandBypass: {
      description: 'Чтение SPK Param EQ Band Bypass',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 9 }
      ]
    },
    setSpeakerParametricEQBandFilter: {
      description: 'SPK Param EQ Band Filter (1..9)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 9 },
        { name: 'filter', type: 'string', required: true, enum: ['Band/PEQ','High Shelf','Low Shelf','Notch'] }
      ]
    },
    getSpeakerParametricEQBandFilter: {
      description: 'Чтение SPK Param EQ Band Filter',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 9 }
      ]
    },
    setSpeakerParametricEQBandFrequency: {
      description: 'SPK Param EQ Band Frequency (Гц, 200..20000)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 9 },
        { name: 'value', type: 'number', required: true, min: 200, max: 20000 }
      ]
    },
    getSpeakerParametricEQBandFrequency: {
      description: 'Чтение SPK Param EQ Band Frequency',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 9 }
      ]
    },
    setSpeakerParametricEQBandGain: {
      description: 'SPK Param EQ Band Gain (-20..20 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 9 },
        { name: 'value', type: 'number', required: true, min: -20, max: 20 }
      ]
    },
    getSpeakerParametricEQBandGain: {
      description: 'Чтение SPK Param EQ Band Gain',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 9 }
      ]
    },
    setSpeakerParametricEQBandQ: {
      description: 'SPK Param EQ Band Q (0.1..10.0)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 9 },
        { name: 'value', type: 'number', required: true, min: 0.1, max: 10.0 }
      ]
    },
    getSpeakerParametricEQBandQ: {
      description: 'Чтение SPK Param EQ Band Q',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 9 }
      ]
    },

    // Graphic EQ (пример одной команды)
    setGraphicEQLevel: {
      description: 'Graphic EQ Level (-15..15 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'frequency', type: 'string', required: true, enum: ['20Hz','25Hz','31.5Hz','40Hz','50Hz','63Hz','80Hz','100Hz','125Hz','160Hz','200Hz','250Hz','315Hz','400Hz','500Hz','630Hz','800Hz','1kHz','1.25kHz','1.6kHz','2kHz','2.5kHz','3.15kHz','4kHz','5kHz','6.3kHz','8kHz','10kHz','12.5kHz','16kHz','20kHz'] },
        { name: 'value', type: 'number', required: true, min: -15, max: 15 }
      ]
    },
    getGraphicEQLevel: {
      description: 'Чтение Graphic EQ Level',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'frequency', type: 'string', required: true, enum: ['20Hz','25Hz','31.5Hz','40Hz','50Hz','63Hz','80Hz','100Hz','125Hz','160Hz','200Hz','250Hz','315Hz','400Hz','500Hz','630Hz','800Hz','1kHz','1.25kHz','1.6kHz','2kHz','2.5kHz','3.15kHz','4kHz','5kHz','6.3kHz','8kHz','10kHz','12.5kHz','16kHz','20kHz'] }
      ]
    },

    // Standard Mixer
    setStandardMixerLevel: {
      description: 'Standard Mixer Level (-60.5..12 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'io', type: 'string', required: true, enum: ['Input','Output'] },
        { name: 'index2', type: 'number', required: true, min: 1, max: 100 },
        { name: 'value', type: 'number', required: true, min: -60.5, max: 12 }
      ]
    },
    getStandardMixerLevel: {
      description: 'Чтение Standard Mixer Level',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'io', type: 'string', required: true, enum: ['Input','Output'] },
        { name: 'index2', type: 'number', required: true, min: 1, max: 100 }
      ]
    },
    setStandardMixerMute: {
      description: 'Standard Mixer Mute On/Off/Toggle',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'io', type: 'string', required: true, enum: ['Input','Output'] },
        { name: 'index2', type: 'number', required: true, min: 0, max: 100 },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getStandardMixerMute: {
      description: 'Чтение Standard Mixer Mute',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'io', type: 'string', required: true, enum: ['Input','Output'] },
        { name: 'index2', type: 'number', required: true, min: 1, max: 100 }
      ]
    },
    setStandardMixerRouting: {
      description: 'Маршрутизация в Standard Mixer (вход->выход, Route/Unroute)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'input', type: 'number', required: true, min: 1, max: 100 },
        { name: 'output', type: 'number', required: true, min: 1, max: 100 },
        { name: 'state', type: 'string', required: true, enum: ['Route','Unroute'] }
      ]
    },
    getStandardMixerRouting: {
      description: 'Чтение маршрутизации в Standard Mixer',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'input', type: 'number', required: true, min: 1, max: 100 },
        { name: 'output', type: 'number', required: true, min: 1, max: 100 }
      ]
    },

    // Signal Generator
    setSignalGeneratorGain: {
      description: 'Гейн генератора (Sine/White/Pink/Sweep)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'wave', type: 'string', required: true, enum: ['Sine','White','Pink','Sweep'] },
        { name: 'value', type: 'number', required: true, min: -60.5, max: 12 }
      ]
    },
    getSignalGeneratorGain: {
      description: 'Чтение гейна генератора сигнала',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'wave', type: 'string', required: true, enum: ['Sine','White','Pink','Sweep'] }
      ]
    },
    setSignalGeneratorMute: {
      description: 'Мьют генератора сигнала (Sine/White/Pink)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'wave', type: 'string', required: true, enum: ['Sine','White','Pink'] },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getSignalGeneratorMute: {
      description: 'Статус мьюта генератора сигнала',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'wave', type: 'string', required: true, enum: ['Sine','White','Pink'] }
      ]
    },

    // Source Select
    setSourceSelect: {
      description: 'Выбор источника (1..16)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 1, max: 16 }
      ]
    },
    getSourceSelect: {
      description: 'Чтение выбранного источника',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },

    // USB
    setUSBLevel: {
      description: 'USB Level (-60.5..12 дБ) по каналу',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'channel', type: 'string', required: true, enum: ['Left','Right'] },
        { name: 'value', type: 'number', required: true, min: -60.5, max: 12 }
      ]
    },
    getUSBLevel: {
      description: 'Чтение USB Level по каналу',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'channel', type: 'string', required: true, enum: ['Left','Right'] }
      ]
    },
    setUSBMute: {
      description: 'USB Mute по каналу',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'channel', type: 'string', required: true, enum: ['Left','Right'] },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getUSBMute: {
      description: 'Статус USB Mute по каналу',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'channel', type: 'string', required: true, enum: ['Left','Right'] }
      ]
    },

    // VoIP
    setVoIPAction: {
      description: 'VoIP действие (Make/End/Answer/Transfer)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'action', type: 'string', required: true, enum: ['Make Call','End Call','Answer Call','Transfer Call'] },
        { name: 'number', type: 'string', required: false, description: 'Номер для Make/Transfer' }
      ]
    },
    getVoIPCallActive: {
      description: 'VoIP Call Active',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    getVoIPCallStatus: {
      description: 'VoIP Call Status',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    getVoIPCallerID: {
      description: 'VoIP Caller ID',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setVoIPDialKey: {
      description: 'VoIP DTMF клавиша (0-9,* ,#)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'key', type: 'string', required: true }
      ]
    },
    setVoIPLevel: {
      description: 'VoIP Level (-60.5..12 дБ) на Input/Output',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input','Output'] },
        { name: 'value', type: 'number', required: true, min: -60.5, max: 12 }
      ]
    },
    getVoIPLevel: {
      description: 'Чтение VoIP Level',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input','Output'] }
      ]
    },
    setVoIPMute: {
      description: 'VoIP Mute на Input/Output',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input','Output'] },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getVoIPMute: {
      description: 'Статус VoIP Mute',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input','Output'] }
      ]
    },

    // PTSN (аналогично VoIP)
    setPTSNAction: {
      description: 'PTSN действие (Make/End/Answer)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'action', type: 'string', required: true, enum: ['Make Call','End Call','Answer Call'] },
        { name: 'number', type: 'string', required: false }
      ]
    },
    getPTSNCallActive: {
      description: 'PTSN Call Active',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    getPTSNCallStatus: {
      description: 'PTSN Call Status',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    getPTSNCallerID: {
      description: 'PTSN Caller ID',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setPTSNDialKey: {
      description: 'PTSN DTMF клавиша (0-9,* ,# ,!)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'key', type: 'string', required: true }
      ]
    },
    setPTSNHook: {
      description: 'PTSN Hook On/Off',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    setPTSNLevel: {
      description: 'PTSN Level (-60.5..12 дБ) Input/Output',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input','Output'] },
        { name: 'value', type: 'number', required: true, min: -60.5, max: 12 }
      ]
    },
    getPTSNLevel: {
      description: 'Чтение PTSN Level',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input','Output'] }
      ]
    },
    setPTSNMute: {
      description: 'PTSN Mute Input/Output',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input','Output'] },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getPTSNMute: {
      description: 'Статус PTSN Mute',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['Input','Output'] }
      ]
    },

    // AMM Gain Sharing (основное)
    setAMMGainSharingAttack: {
      description: 'AMM Gain Sharing Attack (0.5..100 мс)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 0.5, max: 100.0 }
      ]
    },
    getAMMGainSharingAttack: {
      description: 'Чтение AMM Gain Sharing Attack',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setAMMGainSharingDecay: {
      description: 'AMM Gain Sharing Decay (5..50000 мс)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 5, max: 50000 }
      ]
    },
    getAMMGainSharingDecay: {
      description: 'Чтение AMM Gain Sharing Decay',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setAMMGainSharingHold: {
      description: 'AMM Gain Sharing Hold (0..1000 мс)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 0, max: 1000 }
      ]
    },
    getAMMGainSharingHold: {
      description: 'Чтение AMM Gain Sharing Hold',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setAMMGainSharingSlope: {
      description: 'AMM Gain Sharing Slope (0.01..2.00)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: true, min: 0.01, max: 2.0 }
      ]
    },
    getAMMGainSharingSlope: {
      description: 'Чтение AMM Gain Sharing Slope',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setAMMGainSharingBypass: {
      description: 'AMM Gain Sharing Bypass для канала (1..32)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getAMMGainSharingBypass: {
      description: 'Статус AMM Gain Sharing Bypass для канала',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setAMMGainSharingGain: {
      description: 'AMM Gain Sharing Gain канала (0..32, -60.5..12 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 0, max: 32 },
        { name: 'value', type: 'number', required: true, min: -60.5, max: 12 }
      ]
    },
    getAMMGainSharingGain: {
      description: 'Чтение AMM Gain Sharing Gain канала',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 0, max: 32 }
      ]
    },
    setAMMGainSharingMute: {
      description: 'AMM Gain Sharing Mute канала (0..32)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 0, max: 32 },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getAMMGainSharingMute: {
      description: 'Статус AMM Gain Sharing Mute канала (0..32)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 0, max: 32 }
      ]
    },
    setAMMGainSharingPriority: {
      description: 'AMM Gain Sharing Priority (1..5) для канала (1..32)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'priority', type: 'string', required: true, enum: ['1','2','3','4','5'] }
      ]
    },
    getAMMGainSharingPriority: {
      description: 'Чтение AMM Gain Sharing Priority канала',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setAMMGainSharingRMSAverage: {
      description: 'AMM Gain Sharing RMS Average (1..500) Input/Output',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'ioType', type: 'string', required: true, enum: ['Input','Output'] },
        { name: 'value', type: 'number', required: true, min: 1, max: 500 }
      ]
    },
    getAMMGainSharingRMSAverage: {
      description: 'Чтение AMM Gain Sharing RMS Average',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'ioType', type: 'string', required: true, enum: ['Input','Output'] }
      ]
    },

    // AMM Gated (выборочно основные)
    setAMMGatedAttack: {
      description: 'AMM Gated Attack (зависит от модели, до 500 мс EX)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'value', type: 'number', required: true, min: 0.5, max: 500.0 }
      ]
    },
    getAMMGatedAttack: {
      description: 'Чтение AMM Gated Attack',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setAMMGatedDecay: {
      description: 'AMM Gated Decay (1..50000 мс EX / 5..50000 ESP)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'value', type: 'number', required: true, min: 1, max: 50000 }
      ]
    },
    getAMMGatedDecay: {
      description: 'Чтение AMM Gated Decay',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setAMMGatedDetection: {
      description: 'AMM Gated Detection (1..8 канал) режим',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 8 },
        { name: 'mode', type: 'string', required: true, enum: ['Threshold','LastOn','PushToTalk','Bypass'] }
      ]
    },
    getAMMGatedDetection: {
      description: 'Чтение AMM Gated Detection режима канала (1..8)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 8 }
      ]
    },
    setAMMGatedDuckingDepth: {
      description: 'AMM Gated Ducking Depth (-60..0 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'value', type: 'number', required: true, min: -60, max: 0 }
      ]
    },
    getAMMGatedDuckingDepth: {
      description: 'Чтение AMM Gated Ducking Depth',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setAMMGatedGain: {
      description: 'AMM Gated Gain (index1 0=Master, 1..32=канал)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 0, max: 32 },
        { name: 'value', type: 'number', required: true, min: -60.5, max: 12 }
      ]
    },
    getAMMGatedGain: {
      description: 'Чтение AMM Gated Gain (master/канал)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 0, max: 32 }
      ]
    },
    setAMMGatedGateDepth: {
      description: 'AMM Gated Gate Depth (-70..0 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'value', type: 'number', required: true, min: -70, max: 0 }
      ]
    },
    getAMMGatedGateDepth: {
      description: 'Чтение AMM Gated Gate Depth',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setAMMGatedHighPass: {
      description: 'AMM Gated High Pass (Гц, ESP<=1000, EX<=20000)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'value', type: 'number', required: true, min: 20, max: 20000 }
      ]
    },
    getAMMGatedHighPass: {
      description: 'Чтение AMM Gated High Pass',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setAMMGatedHold: {
      description: 'AMM Gated Hold (1..50000 мс)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'value', type: 'number', required: true, min: 1, max: 50000 }
      ]
    },
    getAMMGatedHold: {
      description: 'Чтение AMM Gated Hold',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setAMMGatedLowPass: {
      description: 'AMM Gated Low Pass (Гц)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'value', type: 'number', required: true, min: 20, max: 20000 }
      ]
    },
    getAMMGatedLowPass: {
      description: 'Чтение AMM Gated Low Pass',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setAMMGatedMute: {
      description: 'AMM Gated Mute (index1 0=Master, 1..32=канал)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 0, max: 32 },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getAMMGatedMute: {
      description: 'Чтение AMM Gated Mute (master/канал)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 0, max: 32 }
      ]
    },
    setAMMGatedNOM: {
      description: 'AMM Gated NOM On/Off',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getAMMGatedNOM: {
      description: 'Чтение AMM Gated NOM',
      parameters: [
        { name: 'name', type: 'string', required: true }
      ]
    },
    setAMMGatedPriority: {
      description: 'AMM Gated Priority (On/Off/1..5) для канала',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'priority', type: 'string', required: true, enum: ['On','Off','1','2','3','4','5'] }
      ]
    },
    getAMMGatedPriority: {
      description: 'Чтение AMM Gated Priority канала',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setAMMGatedPushToTalk: {
      description: 'AMM Gated Push-To-Talk (1..8) On/Off',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 8 },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] }
      ]
    },
    getAMMGatedPushToTalk: {
      description: 'Статус AMM Gated Push-To-Talk канала (1..8)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 8 }
      ]
    },
    setAMMGatedRMSAvg: {
      description: 'AMM Gated RMS Avg (1..1000 мс)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'value', type: 'number', required: true, min: 1, max: 1000 }
      ]
    },
    getAMMGatedRMSAvg: {
      description: 'Чтение AMM Gated RMS Avg',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },
    setAMMGatedThreshold: {
      description: 'AMM Gated Threshold (-80..0 дБ)',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 },
        { name: 'value', type: 'number', required: true, min: -80, max: 0 }
      ]
    },
    getAMMGatedThreshold: {
      description: 'Чтение AMM Gated Threshold',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'index1', type: 'number', required: true, min: 1, max: 32 }
      ]
    },

    // Bypass (общий)
    setBypass: {
      description: 'Bypass модуля по имени',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['AGC','Array EQ','Compressor/Limiter','Ducker','Gate','Graphic EQ','Peak/RMS Limiter','Tone Control EQ L','Tone Control EQ M','Tone Control EQ H'] },
        { name: 'state', type: 'string', required: true, enum: ['On','Off'] },
        { name: 'index1', type: 'number', required: false, min: 1, max: 32, description: 'Только для AGC в EX' }
      ]
    },
    getBypass: {
      description: 'Чтение Bypass модуля по имени',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'module', type: 'string', required: true, enum: ['AGC','Array EQ','Compressor/Limiter','Ducker','Gate','Graphic EQ','Peak/RMS Limiter','Tone Control EQ L','Tone Control EQ M','Tone Control EQ H'] },
        { name: 'index1', type: 'number', required: false, min: 1, max: 32, description: 'Только для AGC в EX' }
      ]
    }
  };

  static responses = {
    ack: {
      description: 'Подтверждение команды',
      matcher: { pattern: /\x06/ },
      extract: () => ({ type: 'ack', ok: true })
    },
    deviceError: {
      description: 'Ошибка устройства (NAK)',
      matcher: { pattern: /\x15(01|02|03|99)/ },
      extract: (m) => {
        const map = {
          '01': 'Invalid Module Name',
          '02': 'Illegal Index',
          '03': 'Value out-of-range',
          '99': 'Unknown error'
        };
        return { type: 'error', code: m[1], message: map[m[1]] || 'Error' };
      }
    },
    faultStatus: {
      description: 'GF - Fault Status',
      matcher: { pattern: /^GF\s+([FC])\r?$/ },
      extract: (m) => ({ type: 'faultStatus', status: m[1] === 'F' ? 'Fault' : 'No Fault' })
    },
    parameterRecall: {
      description: 'GS - Active preset',
      matcher: { pattern: /^GS\s+([0-9A-Fa-f]+)\r?$/ },
      extract: (m) => {
        const num = parseInt(m[1], 16);
        return { type: 'parameterRecall', preset: num === 0 ? 'None' : num };
      }
    },
    groupLevel: {
      description: 'GG - Group Level',
      matcher: { pattern: /^GG\s+([0-9A-Fa-f]+)\s*,\s*([0-9A-Fa-f]+)\r?$/ },
      extract: (m) => {
        const group = parseInt(m[1], 16);
        const raw = parseInt(m[2], 16);
        const value = raw / 2 - 60;
        return { type: 'groupLevel', group, value };
      }
    },
    groupMute: {
      description: 'GN - Group Mute',
      matcher: { pattern: /^GN\s+([0-9A-Fa-f]+)\s*,\s*([MU])\r?$/ },
      extract: (m) => {
        const group = parseInt(m[1], 16);
        const state = m[2] === 'M' ? 'On' : 'Off';
        return { type: 'groupMute', group, state };
      }
    },
    genericGA: {
      description: 'GA"<name">...=<value>',
      matcher: { pattern: /^GA"([^"]+)"(?:>([^=\r]+))?=(.+)\r?$/ },
      extract: (m) => {
        const name = m[1];
        const path = (m[2] || '').trim();
        const rawValue = (m[3] || '').trim();
        let value = rawValue;
        if (rawValue === 'O') value = 'On';
        else if (rawValue === 'F') value = 'Off';
        else if (!isNaN(parseFloat(rawValue)) && isFinite(rawValue)) value = parseFloat(rawValue);
        return { type: 'ga', name, path, value, raw: rawValue };
      }
    },
    standardMixerRouting: {
      description: 'GA"<name">4>(i,o)=O/F',
      matcher: { pattern: /^GA"([^"]+)">4>\((\d+),(\d+)\)=(O|F)\r?$/ },
      extract: (m) => ({
        type: 'standardMixerRouting',
        name: m[1],
        input: parseInt(m[2], 10),
        output: parseInt(m[3], 10),
        state: m[4] === 'O' ? 'Route' : 'Unroute'
      })
    },
    graphicEqLevel: {
      description: 'GA"<name">freqIndex=<value>',
      matcher: { pattern: /^GA"([^"]+)">(\d+)=(-?\d+(?:\.\d+)?)\r?$/ },
      extract: (m) => ({
        type: 'graphicEQLevel',
        name: m[1],
        frequencyIndex: parseInt(m[2], 10),
        value: parseFloat(m[3])
      })
    },
    voipCallerId: {
      description: 'VoIP CallerID: GA"<name">0>2=Name<Host>',
      matcher: { pattern: /^GA"([^"]+)">0>2=(.+)\r?$/ },
      extract: (m) => {
        const name = m[1];
        const payload = m[2] || '';
        const parts = payload.split('<');
        const displayName = parts[0]?.replace(/^"/, '') || '';
        const host = (parts[1] || '').replace(/">?;?$/, '').replace(/>$/, '').trim();
        return { type: 'voipCallerID', name, displayName, host };
      }
    },
    ptsnCallerId: {
      description: 'PTSN CallerID: GA"<name">0>2=YYYY/MM/DD&Number&Name',
      matcher: { pattern: /^GA"([^"]+)">0>2=(.+)\r?$/ },
      extract: (m) => {
        const name = m[1];
        const payload = m[2] || '';
        const parts = payload.split('&');
        return {
          type: 'ptsnCallerID',
          name,
          dateTime: (parts[0] || '').replace(/"/g, '').trim(),
          number: (parts[1] || '').trim(),
          callerName: (parts[2] || '').replace(/;?$/, '').trim()
        };
      }
    }
  };

  initialize() {
    // Первичные статусы
    this.publishCommand('getFaultStatus');
    this.publishCommand('getParameterRecall');
  }

  parseResponse(data) {
    try {
      // HTTP транспорт не используется для этого драйвера
      const raw = Buffer.isBuffer(data) ? data.toString('ascii') : String(data || '');
      if (!raw) return null;

      // Выделим ACK/NAK из общего потока
      const results = [];

      // ACK
      if (/\x06/.test(raw)) {
        const matches = raw.match(/\x06/g) || [];
        matches.forEach(() => results.push({ type: 'ack', ok: true }));
      }
      // NAK
      const nakRegex = /\x15(01|02|03|99)/g;
      let nakMatch;
      while ((nakMatch = nakRegex.exec(raw)) !== null) {
        const map = {
          '01': 'Invalid Module Name',
          '02': 'Illegal Index',
          '03': 'Value out-of-range',
          '99': 'Unknown error'
        };
        results.push({ type: 'error', code: nakMatch[1], message: map[nakMatch[1]] || 'Error' });
      }

      // Разбиваем по \r; некоторые ответы содержат \r без \n
      const parts = raw.split('\r').map(s => s.trim()).filter(Boolean);

      const patterns = [
        { key: 'faultStatus', rx: BoseControlSpaceDriver.responses.faultStatus.matcher.pattern, extract: BoseControlSpaceDriver.responses.faultStatus.extract },
        { key: 'parameterRecall', rx: BoseControlSpaceDriver.responses.parameterRecall.matcher.pattern, extract: BoseControlSpaceDriver.responses.parameterRecall.extract },
        { key: 'groupLevel', rx: BoseControlSpaceDriver.responses.groupLevel.matcher.pattern, extract: BoseControlSpaceDriver.responses.groupLevel.extract },
        { key: 'groupMute', rx: BoseControlSpaceDriver.responses.groupMute.matcher.pattern, extract: BoseControlSpaceDriver.responses.groupMute.extract },
        { key: 'standardMixerRouting', rx: BoseControlSpaceDriver.responses.standardMixerRouting.matcher.pattern, extract: BoseControlSpaceDriver.responses.standardMixerRouting.extract },
        { key: 'graphicEqLevel', rx: BoseControlSpaceDriver.responses.graphicEqLevel.matcher.pattern, extract: BoseControlSpaceDriver.responses.graphicEqLevel.extract },
        { key: 'voipCallerId', rx: BoseControlSpaceDriver.responses.voipCallerId.matcher.pattern, extract: BoseControlSpaceDriver.responses.voipCallerId.extract },
        { key: 'ptsnCallerId', rx: BoseControlSpaceDriver.responses.ptsnCallerId.matcher.pattern, extract: BoseControlSpaceDriver.responses.ptsnCallerId.extract },
        { key: 'genericGA', rx: BoseControlSpaceDriver.responses.genericGA.matcher.pattern, extract: BoseControlSpaceDriver.responses.genericGA.extract }
      ];

      for (const line of parts) {
        let matched = false;

        // Пропускаем чистые ACK/NAK строки, они уже добавлены
        if (/^\x06$/.test(line) || /^\x15/.test(line)) continue;

        for (const p of patterns) {
          const m = line.match(p.rx);
          if (m) {
            const payload = p.extract(m);
            // Обеспечим наличие типа
            if (payload && !payload.type) payload.type = p.key;
            results.push(payload);
            matched = true;
            break;
          }
        }

        if (!matched && line) {
          results.push({ type: 'raw', raw: line });
        }
      }

      if (results.length === 0) return null;
      if (results.length === 1) return results[0];
      return results;
    } catch (err) {
      return { type: 'parseError', message: err.message };
    }
  }

  // ========================
  // Команды (формирование)
  // ========================

  // Сервис
  clearFaultAlarms() { return { payload: 'CF\r' }; }
  getFaultStatus() { return { payload: 'GF\r' }; }
  setParameterRecall({ number }) {
    const hex = this._toHex(number);
    return { payload: `SS ${hex}\r` };
  }
  getParameterRecall() { return { payload: 'GS\r' }; }

  // Группы
  setGroupLevel({ group, value }) {
    const g = this._toHex(group);
    const scaled = Math.round((value + 60) * 2);
    const valHex = this._toHex(scaled);
    return { payload: `SG ${g},${valHex}\r` };
  }
  getGroupLevel({ group }) {
    const g = this._toHex(group);
    return { payload: `GG ${g}\r` };
  }
  setGroupMute({ group, state }) {
    const g = this._toHex(group);
    const map = { On: 'M', Off: 'U', Toggle: 'T' };
    return { payload: `SN ${g},${map[state]}\r` };
  }
  getGroupMute({ group }) {
    const g = this._toHex(group);
    return { payload: `GN ${g}\r` };
  }

  // Общие Gain/Level/Mute
  setGain({ name, value }) { return { payload: `SA"${name}">1=${this._fmt1(value)}\r` }; }
  getGain({ name }) { return { payload: `GA"${name}">1\r` }; }

  setGainMute({ name, state }) {
    const map = { On: 'O', Off: 'F', Toggle: 'T' };
    return { payload: `SA"${name}">2=${map[state]}\r` };
  }
  getGainMute({ name }) { return { payload: `GA"${name}">2\r` }; }

  setLevel({ name, module, value }) {
    const mod = this._levelModule(module); // Input->3, Output->1, ESPLink/AMPLink->1
    return { payload: `SA"${name}">${mod}=${this._fmt1(value)}\r` };
  }
  getLevel({ name, module }) {
    const mod = this._levelModule(module);
    return { payload: `GA"${name}">${mod}\r` };
  }

  setMute({ name, module, state }) {
    const muteMap = this._muteModule(module); // Input->4, Output->2, Link->2
    const val = state === 'On' ? 'O' : state === 'Off' ? 'F' : 'T';
    return { payload: `SA"${name}">${muteMap}=${val}\r` };
  }
  getMute({ name, module }) {
    const muteMap = this._muteModule(module);
    return { payload: `GA"${name}">${muteMap}\r` };
  }

  // Router / Matrix
  setRouterInputSelect({ name, output, value }) {
    return { payload: `SA"${name}">${output}=${value}\r` };
  }
  getRouterInputSelect({ name, output }) { return { payload: `GA"${name}">${output}\r` }; }

  setMatrixMixerLevel({ name, input, output, matrixSize, value }) {
    const index2 = ((input - 1) * matrixSize) + output;
    return { payload: `SA"${name}">2>${index2}=${this._fmt1(value)}\r` };
  }
  getMatrixMixerLevel({ name, input, output, matrixSize }) {
    const index2 = ((input - 1) * matrixSize) + output;
    return { payload: `GA"${name}">2>${index2}\r` };
  }
  setMatrixMixerState({ name, input, output, matrixSize, state }) {
    const index2 = ((input - 1) * matrixSize) + output;
    const val = state === 'On' ? 'O' : 'F';
    return { payload: `SA"${name}">1>${index2}=${val}\r` };
  }
  getMatrixMixerState({ name, input, output, matrixSize }) {
    const index2 = ((input - 1) * matrixSize) + output;
    return { payload: `GA"${name}">1>${index2}\r` };
  }

  // AEC
  setAECCNEnable({ name, index1, state }) { return { payload: `SA"${name}">${index1}>8=${state === 'On' ? 'O' : 'F'}\r` }; }
  getAECCNEnable({ name, index1 }) { return { payload: `GA"${name}">${index1}>8\r` }; }

  setAECEnable({ name, index1, state }) { return { payload: `SA"${name}">${index1}>6=${state === 'On' ? 'O' : 'F'}\r` }; }
  getAECEnable({ name, index1 }) { return { payload: `GA"${name}">${index1}>6\r` }; }

  setAECInternalMute({ name, index1, state }) { return { payload: `SA"${name}">${index1}>5=${state === 'On' ? 'O' : 'F'}\r` }; }
  getAECInternalMute({ name, index1 }) { return { payload: `GA"${name}">${index1}>5\r` }; }

  setAECNLPControl({ name, index1, mode }) {
    const map = { Light: '1', Medium: '2', Strong: '3' };
    return { payload: `SA"${name}">${index1}>7=${map[mode]}\r` };
  }
  getAECNLPControl({ name, index1 }) { return { payload: `GA"${name}">${index1}>7\r` }; }

  setAECNRLevel({ name, index1, value }) { return { payload: `SA"${name}">${index1}>9=${value}\r` }; }
  getAECNRLevel({ name, index1 }) { return { payload: `GA"${name}">${index1}>9\r` }; }
  getAECReference({ name, index1 }) { return { payload: `GA"${name}">${index1}>10\r` }; }

  // Array EQ
  setArrayEQAdvanced({ name, state }) { return { payload: `SA"${name}">1>6=${state === 'On' ? 'O' : 'F'}\r` }; }
  getArrayEQAdvanced({ name }) { return { payload: `GA"${name}">1>6\r` }; }
  setArrayEQCenterFrequency({ name, value }) { return { payload: `SA"${name}">1>1=${value}\r` }; }
  getArrayEQCenterFrequency({ name }) { return { payload: `GA"${name}">1>1\r` }; }
  setArrayEQTilt({ name, value }) { return { payload: `SA"${name}">1>2=${this._fmt1(value)}\r` }; }
  getArrayEQTilt({ name }) { return { payload: `GA"${name}">1>2\r` }; }
  setArrayEQVerticalAngle({ name, value }) { return { payload: `SA"${name}">1>8=${value}\r` }; }
  getArrayEQVerticalAngle({ name }) { return { payload: `GA"${name}">1>8\r` }; }

  // Crossover
  setCrossoverFilter({ name, index1, type, filter }) {
    const typeStates = { 'Low/High': '1', 'Mid HPF': '1', 'Mid LPF': '3' };
    const filterMap = {
      'Butterworth 6dB/oct':'But6','Butterworth 12dB/oct':'But12','Butterworth 18dB/oct':'But18','Butterworth 24dB/oct':'But24','Butterworth 36dB/oct':'But36','Butterworth 48dB/oct':'But48',
      'Bessel 12dB/oct':'Bes12','Bessel 18dB/oct':'Bes18','Bessel 24dB/oct':'Bes24','Bessel 36dB/oct':'Bes36','Bessel 48dB/oct':'Bes48',
      'Linkwitz-Reilly 12dB/oct':'Lin12','Linkwitz-Reilly 24dB/oct':'Lin24','Linkwitz-Reilly 36dB/oct':'Lin36','Linkwitz-Reilly 48dB/oct':'Lin48'
    };
    return { payload: `SA"${name}">${index1}>${typeStates[type]}=${filterMap[filter]}\r` };
  }
  getCrossoverFilter({ name, index1, type }) {
    const typeStates = { 'Low/High': '1', 'Mid HPF': '1', 'Mid LPF': '3' };
    return { payload: `GA"${name}">${index1}>${typeStates[type]}\r` };
  }
  setCrossoverFrequency({ name, index1, type, value }) {
    const typeStates = { 'Low/High': '2', 'Mid HPF': '2', 'Mid LPF': '4' };
    return { payload: `SA"${name}">${index1}>${typeStates[type]}=${value}\r` };
  }
  getCrossoverFrequency({ name, index1, type }) {
    const typeStates = { 'Low/High': '2', 'Mid HPF': '2', 'Mid LPF': '4' };
    return { payload: `GA"${name}">${index1}>${typeStates[type]}\r` };
  }
  setCrossoverMute({ name, index1, type, state }) {
    const typeStates = { 'Low/High': '5', 'Mid': '7' };
    return { payload: `SA"${name}">${index1}>${typeStates[type]}=${state === 'On' ? 'O' : 'F'}\r` };
  }
  getCrossoverMute({ name, index1, type }) {
    const typeStates = { 'Low/High': '5', 'Mid': '7' };
    return { payload: `GA"${name}">${index1}>${typeStates[type]}\r` };
  }
  setCrossoverPolarity({ name, index1, type, state }) {
    const typeStates = { 'Low/High': '4', 'Mid': '6' };
    return { payload: `SA"${name}">${index1}>${typeStates[type]}=${state === 'On' ? 'O' : 'F'}\r` };
  }
  getCrossoverPolarity({ name, index1, type }) {
    const typeStates = { 'Low/High': '4', 'Mid': '6' };
    return { payload: `GA"${name}">${index1}>${typeStates[type]}\r` };
  }

  // Delay
  setDelayBypass({ name, output, state }) { return { payload: `SA"${name}">${output}>2=${state === 'On' ? 'O' : 'F'}\r` }; }
  getDelayBypass({ name, output }) { return { payload: `GA"${name}">${output}>2\r` }; }
  setDelayTime({ name, output, value }) { return { payload: `SA"${name}">${output}>1=${value}\r` }; }
  getDelayTime({ name, output }) { return { payload: `GA"${name}">${output}>1\r` }; }

  // Ducker
  setDuckerDecay({ name, value }) { return { payload: `SA"${name}">6=${value}\r` }; }
  getDuckerDecay({ name }) { return { payload: `GA"${name}">6\r` }; }
  setDuckerHold({ name, value }) { return { payload: `SA"${name}">5=${value}\r` }; }
  getDuckerHold({ name }) { return { payload: `GA"${name}">5\r` }; }
  setDuckerRange({ name, value }) { return { payload: `SA"${name}">3=${this._fmt1(value)}\r` }; }
  getDuckerRange({ name }) { return { payload: `GA"${name}">3\r` }; }

  // Gate / Compressor-Limiter
  setGateDecay({ name, value }) { return { payload: `SA"${name}">6=${value}\r` }; }
  getGateDecay({ name }) { return { payload: `GA"${name}">6\r` }; }
  setGateDetector({ name, mode }) {
    const map = { Left: 'L', Right: 'R', Mix: 'M', Sidechain: 'S' };
    return { payload: `SA"${name}">1=${map[mode]}\r` };
  }
  getGateDetector({ name }) { return { payload: `GA"${name}">1\r` }; }
  setGateHold({ name, value }) { return { payload: `SA"${name}">5=${value}\r` }; }
  getGateHold({ name }) { return { payload: `GA"${name}">5\r` }; }
  setGateRange({ name, value }) { return { payload: `SA"${name}">3=${this._fmt1(value)}\r` }; }
  getGateRange({ name }) { return { payload: `GA"${name}">3\r` }; }

  setCompressorLimiterInputDetect({ name, mode }) {
    const map = { Left: 'L', Right: 'R', Mix: 'M', Sidechain: 'S' };
    return { payload: `SA"${name}">1=${map[mode]}\r` };
  }
  getCompressorLimiterInputDetect({ name }) { return { payload: `GA"${name}">1\r` }; }
  setCompressorLimiterRatio({ name, value }) { return { payload: `SA"${name}">3=${this._fmt1(value)}\r` }; }
  getCompressorLimiterRatio({ name }) { return { payload: `GA"${name}">3\r` }; }
  setCompressorLimiterRelease({ name, value }) { return { payload: `SA"${name}">5=${this._fmt1(value)}\r` }; }
  getCompressorLimiterRelease({ name }) { return { payload: `GA"${name}">5\r` }; }

  // Parametric EQ
  setParametricEQFrequency({ name, band, value }) { return { payload: `SA"${name}">${band}>1=${value}\r` }; }
  getParametricEQFrequency({ name, band }) { return { payload: `GA"${name}">${band}>1\r` }; }
  setParametricEQGain({ name, band, value }) { return { payload: `SA"${name}">${band}>3=${this._fmt1(value)}\r` }; }
  getParametricEQGain({ name, band }) { return { payload: `GA"${name}">${band}>3\r` }; }
  setParametricEQQ({ name, band, value }) { return { payload: `SA"${name}">${band}>2=${this._fmt1(value)}\r` }; }
  getParametricEQQ({ name, band }) { return { payload: `GA"${name}">${band}>2\r` }; }
  setParametricEQSlope({ name, band, slope }) { return { payload: `SA"${name}">${band}>4=${slope}\r` }; }
  getParametricEQSlope({ name, band }) { return { payload: `GA"${name}">${band}>4\r` }; }
  setParametricEQType({ name, band, type }) {
    const map = { 'Band':'B', 'High Shelf':'HS', 'Low Shelf':'LS', 'High Cut':'HC', 'Low Cut':'LC', 'Notch':'N' };
    return { payload: `SA"${name}">${band}>5=${map[type]}\r` };
  }
  getParametricEQType({ name, band }) { return { payload: `GA"${name}">${band}>5\r` }; }

  // Tone Control
  setToneControlGain({ name, type, value }) {
    const map = { Low: '1', Mid: '3', High: '5' };
    return { payload: `SA"${name}">${map[type]}=${this._fmt1(value)}\r` };
  }
  getToneControlGain({ name, type }) {
    const map = { Low: '1', Mid: '3', High: '5' };
    return { payload: `GA"${name}">${map[type]}\r` };
  }

  // Speaker Parametric
  setSpeakerParametricAlignDelay({ name, value }) { return { payload: `SA"${name}">0>4=${value}\r` }; }
  getSpeakerParametricAlignDelay({ name }) { return { payload: `GA"${name}">0>4\r` }; }

  setSpeakerParametricBypass({ name, type, state }) {
    const typeMap = { High: '10', Low: '9' };
    return { payload: `SA"${name}">0>${typeMap[type]}=${state === 'On' ? 'O' : 'F'}\r` };
  }
  getSpeakerParametricBypass({ name, type }) {
    const typeMap = { High: '10', Low: '9' };
    return { payload: `GA"${name}">0>${typeMap[type]}\r` };
  }

  setSpeakerParametricFilter({ name, type, filter }) {
    const typeMap = { High: '5', Low: '7' };
    const fMap = {
      'Butterworth 6dB/oct':'But6','Butterworth 12dB/oct':'But12','Butterworth 18dB/oct':'But18','Butterworth 24dB/oct':'But24','Butterworth 36dB/oct':'But36','Butterworth 48dB/oct':'But48',
      'Bessel 12dB/oct':'Bes12','Bessel 18dB/oct':'Bes18','Bessel 24dB/oct':'Bes24','Bessel 36dB/oct':'Bes36','Bessel 48dB/oct':'Bes48',
      'Linkwitz-Reilly 12dB/oct':'Lin12','Linkwitz-Reilly 24dB/oct':'Lin24','Linkwitz-Reilly 36dB/oct':'Lin36','Linkwitz-Reilly 48dB/oct':'Lin48'
    };
    return { payload: `SA"${name}">0>${typeMap[type]}=${fMap[filter]}\r` };
  }
  getSpeakerParametricFilter({ name, type }) {
    const typeMap = { High: '5', Low: '7' };
    return { payload: `GA"${name}">0>${typeMap[type]}\r` };
  }

  setSpeakerParametricFrequency({ name, type, value }) {
    const typeMap = { High: '6', Low: '8' };
    return { payload: `SA"${name}">0>${typeMap[type]}=${value}\r` };
  }
  getSpeakerParametricFrequency({ name, type }) {
    const typeMap = { High: '6', Low: '8' };
    return { payload: `GA"${name}">0>${typeMap[type]}\r` };
  }

  setSpeakerParametricGain({ name, value }) { return { payload: `SA"${name}">0>3=${this._fmt1(value)}\r` }; }
  getSpeakerParametricGain({ name }) { return { payload: `GA"${name}">0>3\r` }; }

  setSpeakerParametricEQBandBypass({ name, index1, state }) { return { payload: `SA"${name}">${index1}>6=${state === 'On' ? 'O' : 'F'}\r` }; }
  getSpeakerParametricEQBandBypass({ name, index1 }) { return { payload: `GA"${name}">${index1}>6\r` }; }

  setSpeakerParametricEQBandFilter({ name, index1, filter }) {
    const map = { 'Band/PEQ':'B', 'High Shelf':'HS', 'Low Shelf':'LS', 'Notch':'N' };
    return { payload: `SA"${name}">${index1}>5=${map[filter]}\r` };
  }
  getSpeakerParametricEQBandFilter({ name, index1 }) { return { payload: `GA"${name}">${index1}>5\r` }; }

  setSpeakerParametricEQBandFrequency({ name, index1, value }) { return { payload: `SA"${name}">${index1}>1=${value}\r` }; }
  getSpeakerParametricEQBandFrequency({ name, index1 }) { return { payload: `GA"${name}">${index1}>1\r` }; }

  setSpeakerParametricEQBandGain({ name, index1, value }) { return { payload: `SA"${name}">${index1}>3=${this._fmt1(value)}\r` }; }
  getSpeakerParametricEQBandGain({ name, index1 }) { return { payload: `GA"${name}">${index1}>3\r` }; }

  setSpeakerParametricEQBandQ({ name, index1, value }) { return { payload: `SA"${name}">${index1}>2=${this._fmt1(value)}\r` }; }
  getSpeakerParametricEQBandQ({ name, index1 }) { return { payload: `GA"${name}">${index1}>2\r` }; }

  // Graphic EQ
  setGraphicEQLevel({ name, frequency, value }) {
    const freqIndex = this._graphicEqIndex(frequency);
    return { payload: `SA"${name}">${freqIndex}=${this._fmt1(value)}\r` };
  }
  getGraphicEQLevel({ name, frequency }) {
    const freqIndex = this._graphicEqIndex(frequency);
    return { payload: `GA"${name}">${freqIndex}\r` };
  }

  // Standard Mixer
  setStandardMixerLevel({ name, io, index2, value }) {
    const ioMap = { Input: '1', Output: '2' };
    return { payload: `SA"${name}">${ioMap[io]}>${index2}=${this._fmt1(value)}\r` };
  }
  getStandardMixerLevel({ name, io, index2 }) {
    const ioMap = { Input: '1', Output: '2' };
    return { payload: `GA"${name}">${ioMap[io]}>${index2}\r` };
  }
  setStandardMixerMute({ name, io, index2, state }) {
    const ioMap = { Input: '1', Output: '2' };
    return { payload: `SA"${name}">${ioMap[io]}>${index2}=${state === 'On' ? 'O' : 'F'}\r` };
  }
  getStandardMixerMute({ name, io, index2 }) {
    const ioMap = { Input: '1', Output: '2' };
    return { payload: `GA"${name}">${ioMap[io]}>${index2}\r` };
  }
  setStandardMixerRouting({ name, input, output, state }) {
    const val = state === 'Route' ? 'O' : 'F';
    return { payload: `SA"${name}">4>(${input},${output})=${val}\r` };
  }
  getStandardMixerRouting({ name, input, output }) {
    return { payload: `GA"${name}">4>(${input},${output})\r` };
  }

  // Signal Generator
  setSignalGeneratorGain({ name, wave, value }) {
    const w = { Sine: '1', White: '2', Pink: '3', Sweep: '4' }[wave];
    const i2 = { Sine: '2', White: '1', Pink: '1', Sweep: '1' }[wave];
    return { payload: `SA"${name}">${w}>${i2}=${this._fmt1(value)}\r` };
  }
  getSignalGeneratorGain({ name, wave }) {
    const w = { Sine: '1', White: '2', Pink: '3', Sweep: '4' }[wave];
    const i2 = { Sine: '2', White: '1', Pink: '1', Sweep: '1' }[wave];
    return { payload: `GA"${name}">${w}>${i2}\r` };
  }
  setSignalGeneratorMute({ name, wave, state }) {
    const w = { Sine: '1', White: '2', Pink: '3' }[wave];
    const i2 = { Sine: '3', White: '2', Pink: '2' }[wave];
    return { payload: `SA"${name}">${w}>${i2}=${state === 'On' ? 'O' : 'F'}\r` };
  }
  getSignalGeneratorMute({ name, wave }) {
    const w = { Sine: '1', White: '2', Pink: '3' }[wave];
    const i2 = { Sine: '3', White: '2', Pink: '2' }[wave];
    return { payload: `GA"${name}">${w}>${i2}\r` };
  }

  // Source Select
  setSourceSelect({ name, value }) { return { payload: `SA"${name}">1=${value}\r` }; }
  getSourceSelect({ name }) { return { payload: `GA"${name}">1\r` }; }

  // USB
  setUSBLevel({ name, channel, value }) {
    const ch = { Left: '1', Right: '2' }[channel];
    return { payload: `SA"${name}">${ch}>1=${value}\r` };
  }
  getUSBLevel({ name, channel }) {
    const ch = { Left: '1', Right: '2' }[channel];
    return { payload: `GA"${name}">${ch}>1\r` };
  }
  setUSBMute({ name, channel, state }) {
    const ch = { Left: '1', Right: '2' }[channel];
    return { payload: `SA"${name}">${ch}>2=${state === 'On' ? 'O' : 'F'}\r` };
  }
  getUSBMute({ name, channel }) {
    const ch = { Left: '1', Right: '2' }[channel];
    return { payload: `GA"${name}">${ch}>2\r` };
  }

  // VoIP
  setVoIPAction({ name, action, number }) {
    const map = { 'Make Call': '2', 'End Call': '3', 'Answer Call': '4', 'Transfer Call': '5' };
    if (action === 'Make Call' || action === 'Transfer Call') {
      return { payload: `MA"${name}">${map[action]}="${number || ''}"\r` };
    }
    return { payload: `MA"${name}">${map[action]}\r` };
  }
  getVoIPCallActive({ name }) { return { payload: `GA"${name}">0>6\r` }; }
  getVoIPCallStatus({ name }) { return { payload: `GA"${name}">0>1\r` }; }
  getVoIPCallerID({ name }) { return { payload: `GA"${name}">0>2\r` }; }
  setVoIPDialKey({ name, key }) { return { payload: `MA"${name}">1=${key}\r` }; }
  setVoIPLevel({ name, module, value }) {
    const mod = { Input: '1>1', Output: '1' }[module];
    return { payload: `SA"${name}">${mod}=${value}\r` };
  }
  getVoIPLevel({ name, module }) {
    const mod = { Input: '1>1', Output: '1' }[module];
    return { payload: `GA"${name}">${mod}\r` };
  }
  setVoIPMute({ name, module, state }) {
    const mod = { Input: '1>2', Output: '2' }[module];
    return { payload: `SA"${name}">${mod}=${state === 'On' ? 'O' : 'F'}\r` };
  }
  getVoIPMute({ name, module }) {
    const mod = { Input: '1>2', Output: '2' }[module];
    return { payload: `GA"${name}">${mod}\r` };
  }

  // PTSN
  setPTSNAction({ name, action, number }) {
    const map = { 'Make Call': '2', 'End Call': '3', 'Answer Call': '4' };
    if (action === 'Make Call') {
      return { payload: `MA"${name}">${map[action]}="${number || ''}"\r` };
    }
    return { payload: `MA"${name}">${map[action]}\r` };
  }
  getPTSNCallActive({ name }) { return { payload: `GA"${name}">0>8\r` }; }
  getPTSNCallStatus({ name }) { return { payload: `GA"${name}">0>1\r` }; }
  getPTSNCallerID({ name }) { return { payload: `GA"${name}">0>2\r` }; }
  setPTSNDialKey({ name, key }) { return { payload: `MA"${name}">1="${key}"\r` }; }
  setPTSNHook({ name, state }) { return { payload: `SA"${name}">0>9=${state === 'On' ? 'O' : 'F'}\r` }; }
  setPTSNLevel({ name, module, value }) {
    const mod = { Input: '1>1', Output: '1' }[module];
    return { payload: `SA"${name}">${mod}=${value}\r` };
  }
  getPTSNLevel({ name, module }) {
    const mod = { Input: '1>1', Output: '1' }[module];
    return { payload: `GA"${name}">${mod}\r` };
  }
  setPTSNMute({ name, module, state }) {
    const mod = { Input: '1>2', Output: '2' }[module];
    return { payload: `SA"${name}">${mod}=${state === 'On' ? 'O' : 'F'}\r` };
  }
  getPTSNMute({ name, module }) {
    const mod = { Input: '1>2', Output: '2' }[module];
    return { payload: `GA"${name}">${mod}\r` };
  }

  // Bypass
  setBypass({ name, module, state, index1 }) {
    const moduleStates = {
      'AGC': index1 ? `${index1}>10` : '6',
      'Array EQ': '1>5',
      'Compressor/Limiter': '6',
      'Ducker': '7',
      'Gate': '7',
      'Graphic EQ': '32',
      'Peak/RMS Limiter': '6',
      'Tone Control EQ L': '2',
      'Tone Control EQ M': '4',
      'Tone Control EQ H': '6'
    };
    const addr = moduleStates[module];
    return { payload: `SA"${name}">${addr}=${state === 'On' ? 'O' : 'F'}\r` };
  }
  getBypass({ name, module, index1 }) {
    const moduleStates = {
      'AGC': index1 ? `${index1}>10` : '6',
      'Array EQ': '1>5',
      'Compressor/Limiter': '6',
      'Ducker': '7',
      'Gate': '7',
      'Graphic EQ': '32',
      'Peak/RMS Limiter': '6',
      'Tone Control EQ L': '2',
      'Tone Control EQ M': '4',
      'Tone Control EQ H': '6'
    };
    const addr = moduleStates[module];
    return { payload: `GA"${name}">${addr}\r` };
  }

  // ================
  // Вспомогательные
  // ================
  _toHex(n) {
    const v = Math.max(0, Number(n) || 0);
    return v.toString(16).toUpperCase();
  }
  _fmt1(v) {
    const num = Number(v);
    if (!isFinite(num)) return String(v);
    return num.toFixed(1);
  }
  _levelModule(module) {
    // Level: Input->3, Output->1, Link->1
    if (module === 'Input') return '3';
    return '1';
  }
  _muteModule(module) {
    // Mute: Input->4, Output->2, Link->2
    if (module === 'Input') return '4';
    return '2';
  }
  _graphicEqIndex(freqLabel) {
    const map = {
      '20Hz':1,'25Hz':2,'31.5Hz':3,'40Hz':4,'50Hz':5,'63Hz':6,'80Hz':7,'100Hz':8,'125Hz':9,'160Hz':10,'200Hz':11,'250Hz':12,'315Hz':13,'400Hz':14,'500Hz':15,'630Hz':16,'800Hz':17,'1kHz':18,'1.25kHz':19,'1.6kHz':20,'2kHz':21,'2.5kHz':22,'3.15kHz':23,'4kHz':24,'5kHz':25,'6.3kHz':26,'8kHz':27,'10kHz':28,'12.5kHz':29,'16kHz':30,'20kHz':31
    };
    return map[freqLabel];
  }
}

module.exports = BoseControlSpaceDriver;
```
