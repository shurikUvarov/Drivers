const BaseDriver = require('base-driver');

/**
 * Драйвер для проектора/устройства Lumien
 */
class LumienDriver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'Lumien',
    manufacturer: 'Lumien',
    version: '1.0.0',
    description: 'Драйвер для устройства Lumien (поддержка Power и Mute)'
  };

  // Список команд
  static commands = {
    setPower: {
      description: 'Включить/выключить питание',
      parameters: [
        {
          name: 'value',
          type: 'boolean',
          description: 'true – ON, false – OFF',
          required: true
        },
        {
          name: 'version',
          type: 'number',
          description: 'Версия протокола 1 или 2 (по умолчанию 1)',
          required: false,
          min: 1,
          max: 2
        }
      ]
    },
    setMute: {
      description: 'Включить/выключить Mute',
      parameters: [
        {
          name: 'value',
          type: 'boolean',
          description: 'true – Mute ON, false – Mute OFF',
          required: true
        },
        {
          name: 'version',
          type: 'number',
          description: 'Версия протокола 1 или 2 (по умолчанию 1)',
          required: false,
          min: 1,
          max: 2
        }
      ]
    },
    setInput: {
      description: 'Выбор входного источника',
      parameters: [
        {
          name: 'source',
          type: 'string',
          description: 'HDMI1 | HDMI2 | HDMI3 | ANDROID',
          required: true,
          enum: ['HDMI1', 'HDMI2', 'HDMI3', 'ANDROID']
        }
      ]
    },
    setVolume: {
      description: 'Установка громкости (0-100)',
      parameters: [
        {
          name: 'level',
          type: 'number',
          description: 'Громкость 0-100',
          required: true,
          min: 0,
          max: 100
        }
      ]
    },
    getMute: {
      description: 'Запрос статуса Mute',
      parameters: []
    }
  };

  // Обработчики ответов
  static responses = {
    powerStatusV1: {
      description: 'Статус питания (протокол 1)',
      matcher: { pattern: /:01S000([01])/ },
      extract: function (match) {
        return {
          type: 'powerStatus',
          power: match[1] === '1'
        };
      }
    },
    powerStatusV2: {
      description: 'Статус питания (протокол 2)',
      matcher: { pattern: /k01su00([01])/ },
      extract: function (match) {
        return {
          type: 'powerStatus',
          power: match[1] === '1'
        };
      }
    },
    muteStatusV1: {
      description: 'Статус Mute (протокол 1)',
      matcher: { pattern: /:01S900([01])/ },
      extract: function (match) {
        return {
          type: 'muteStatus',
          mute: match[1] === '1'
        };
      }
    },
    muteStatusV2: {
      description: 'Статус Mute (протокол 2)',
      matcher: { pattern: /k01sv00([23])/ },
      extract: function (match) {
        return {
          type: 'muteStatus',
          mute: match[1] === '2' // 002 – ON, 003 – OFF
        };
      }
    }
  };

  /**
   * Команда питания
   * @param {{ value: boolean, version?: number }} params
   */
  setPower(params) {
    const { value, version = 1 } = params;

    let cmd;
    if (version === 2) {
      cmd = value ? 'k01su001' : 'k01su000';
    } else {
      cmd = value ? ':01S0001' : ':01S0000';
    }

    this.state.power = value;
    return { payload: `${cmd}\r` };
  }

  /**
   * Команда Mute
   * @param {{ value: boolean, version?: number }} params
   */
  setMute(params) {
    const { value, version = 1 } = params;

    let cmd;
    if (version === 2) {
      cmd = value ? 'k01sv002' : 'k01sv003';
    } else {
      cmd = value ? ':01S9001' : ':01S9000';
    }

    this.state.mute = value;
    return { payload: `${cmd}\r` };
  }

  /**
   * Переключение входа
   * @param {{ source: string }} params
   */
  setInput(params) {
    const { source } = params;
    const mapping = {
      HDMI1: 'B014',
      HDMI2: 'B024',
      HDMI3: 'B034',
      ANDROID: 'B00A'
    };

    const code = mapping[source.toUpperCase()];
    if (!code) {
      throw new Error(`Неизвестный источник: ${source}`);
    }

    this.state.input = source;
    return { payload: `k01s${code}\r` };
  }

  /**
   * Установка громкости
   * @param {{ level: number }} params
   */
  setVolume(params) {
    let { level } = params;
    level = Math.max(0, Math.min(100, level));
    const code = level.toString().padStart(3, '0');
    this.state.volume = level;
    return { payload: `k01sP${code}\r` };
  }

  /**
   * Запрос статуса Mute
   */
  getMute() {
    return { payload: 'k01gg000\r' };
  }

  initialize() {
    if (this.debug) {
      console.log('LumienDriver инициализирован');
    }
  }
}

module.exports = LumienDriver; 
