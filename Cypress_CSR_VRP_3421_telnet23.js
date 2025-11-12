const BaseDriver = require('base-driver');

/**
 * Драйвер для управления матричным коммутатором CSC-VPR-3421
 */
class CSCVPR3421Driver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'CSC-VPR-3421 Matrix Switcher',
    manufacturer: 'CSC',
    version: '1.0.0',
    description: 'Драйвер для управления матричным коммутатором CSC-VPR-3421'
  };

  // Определение команд
  static commands = {
    // Пресеты
    setRoutePreset: {
      description: 'Сохранить текущую маршрутизацию в пресет',
      parameters: [
        {
          name: 'preset',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер пресета (1-4)',
          required: true
        }
      ]
    },
    activatePreset: {
      description: 'Активировать пресет',
      parameters: [
        {
          name: 'preset',
          type: 'number',
          min: 1,
          max: 8,
          description: 'Номер пресета (1-8)',
          required: true
        }
      ]
    },

    // Управление окнами
    setWindowRoute: {
      description: 'Назначить источник на окно',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        },
        {
          name: 'input',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер входа (1-4)',
          required: true
        }
      ]
    },
    getWindowRoute: {
      description: 'Получить текущий источник для окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },
    setWindowMute: {
      description: 'Включить/выключить окно',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        },
        {
          name: 'mute',
          type: 'string',
          enum: ['ON', 'OFF'],
          description: 'Состояние мута',
          required: true
        }
      ]
    },
    getWindowMute: {
      description: 'Получить состояние мута окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },
    setWindowHPosition: {
      description: 'Установить горизонтальное положение окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        },
        {
          name: 'position',
          type: 'number',
          description: 'Горизонтальная позиция',
          required: true
        }
      ]
    },
    getWindowHPosition: {
      description: 'Получить горизонтальное положение окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },
    setWindowVPosition: {
      description: 'Установить вертикальное положение окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        },
        {
          name: 'position',
          type: 'number',
          description: 'Вертикальная позиция',
          required: true
        }
      ]
    },
    getWindowVPosition: {
      description: 'Получить вертикальное положение окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },
    setWindowHSize: {
      description: 'Установить горизонтальный размер окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        },
        {
          name: 'size',
          type: 'number',
          description: 'Горизонтальный размер',
          required: true
        }
      ]
    },
    getWindowHSize: {
      description: 'Получить горизонтальный размер окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },
    setWindowVSize: {
      description: 'Установить вертикальный размер окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        },
        {
          name: 'size',
          type: 'number',
          description: 'Вертикальный размер',
          required: true
        }
      ]
    },
    getWindowVSize: {
      description: 'Получить вертикальный размер окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },
    setWindowPriority: {
      description: 'Установить приоритет окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        },
        {
          name: 'priority',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Приоритет (1-4)',
          required: true
        }
      ]
    },
    getWindowPriority: {
      description: 'Получить приоритет окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },
    setWindowAspect: {
      description: 'Установить соотношение сторон окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        },
        {
          name: 'aspect',
          type: 'number',
          min: 1,
          max: 6,
          description: 'Соотношение сторон (1-6)',
          required: true
        }
      ]
    },
    getWindowAspect: {
      description: 'Получить соотношение сторон окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },
    setWindowMirror: {
      description: 'Включить/выключить зеркальное отображение окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        },
        {
          name: 'mirror',
          type: 'string',
          enum: ['ON', 'OFF'],
          description: 'Состояние зеркала',
          required: true
        }
      ]
    },
    getWindowMirror: {
      description: 'Получить состояние зеркального отображения окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },
    setWindowBorderMode: {
      description: 'Включить/выключить границу окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        },
        {
          name: 'mode',
          type: 'string',
          enum: ['ON', 'OFF'],
          description: 'Режим границы',
          required: true
        }
      ]
    },
    getWindowBorderMode: {
      description: 'Получить состояние границы окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },
    setWindowBorderColor: {
      description: 'Установить цвет границы окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        },
        {
          name: 'color',
          type: 'number',
          min: 1,
          max: 15,
          description: 'Цвет границы (1-15)',
          required: true
        }
      ]
    },
    getWindowBorderColor: {
      description: 'Получить цвет границы окна',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },
    resetWindow: {
      description: 'Сбросить окно к настройкам по умолчанию',
      parameters: [
        {
          name: 'window',
          type: 'number',
          min: 1,
          max: 4,
          description: 'Номер окна (1-4)',
          required: true
        }
      ]
    },

    // Управление аудио
    setAudioOutMute: {
      description: 'Включить/выключить мут для аудиовыхода',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        },
        {
          name: 'mute',
          type: 'string',
          enum: ['ON', 'OFF'],
          description: 'Состояние мута',
          required: true
        }
      ]
    },
    getAudioOutMute: {
      description: 'Получить состояние мута аудиовыхода',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        }
      ]
    },
    setAudioOutVolume: {
      description: 'Установить громкость аудиовыхода',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        },
        {
          name: 'volume',
          type: 'number',
          min: 0,
          max: 100,
          description: 'Уровень громкости (0-100)',
          required: true
        }
      ]
    },
    getAudioOutVolume: {
      description: 'Получить уровень громкости аудиовыхода',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        }
      ]
    },
    setAudioOutRoute: {
      description: 'Маршрутизация аудиовхода на аудиовыход',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        },
        {
          name: 'source',
          type: 'number',
          min: 1,
          max: 10,
          description: 'Источник аудио (1-10)',
          required: true
        }
      ]
    },
    getAudioOutRoute: {
      description: 'Получить маршрутизацию аудиовыхода',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        }
      ]
    },
    setAudioAGCMode: {
      description: 'Включить/выключить автоматическую регулировку громкости',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        },
        {
          name: 'mode',
          type: 'string',
          enum: ['ON', 'OFF'],
          description: 'Состояние AGC',
          required: true
        }
      ]
    },
    getAudioAGCMode: {
      description: 'Получить состояние AGC',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        }
      ]
    },
    setAudioAGCLevel: {
      description: 'Установить уровень AGC',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        },
        {
          name: 'level',
          type: 'number',
          min: 1,
          max: 3,
          description: 'Уровень AGC (1-3)',
          required: true
        }
      ]
    },
    getAudioAGCLevel: {
      description: 'Получить уровень AGC',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        }
      ]
    },
    setAudioMixerSource: {
      description: 'Включить/выключить источник в микшере',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        },
        {
          name: 'source',
          type: 'number',
          min: 1,
          max: 9,
          description: 'Источник (1-9)',
          required: true
        },
        {
          name: 'enable',
          type: 'string',
          enum: ['ON', 'OFF'],
          description: 'Включить/выключить',
          required: true
        }
      ]
    },
    getAudioMixerSource: {
      description: 'Получить состояние источника в микшере',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        },
        {
          name: 'source',
          type: 'number',
          min: 1,
          max: 9,
          description: 'Источник (1-9)',
          required: true
        }
      ]
    },
    setAudioMixerVolume: {
      description: 'Установить громкость источника в микшере',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        },
        {
          name: 'source',
          type: 'number',
          min: 1,
          max: 9,
          description: 'Источник (1-9)',
          required: true
        },
        {
          name: 'volume',
          type: 'number',
          min: 0,
          max: 100,
          description: 'Уровень громкости (0-100)',
          required: true
        }
      ]
    },
    getAudioMixerVolume: {
      description: 'Получить громкость источника в микшере',
      parameters: [
        {
          name: 'output',
          type: 'string',
          enum: ['A', 'B', 'C', 'D'],
          description: 'Аудиовыход (A, B, C, D)',
          required: true
        },
        {
          name: 'source',
          type: 'number',
          min: 1,
          max: 9,
          description: 'Источник (1-9)',
          required: true
        }
      ]
    }
  };

  // Обработчики ответов
  static responses = {
    // Пресеты
    presetSaved: {
      description: 'Пресет сохранен',
      matcher: {
        pattern: /current route to preset (\d+)/
      },
      extract: (match) => ({
        preset: parseInt(match[1]),
        action: 'saved'
      })
    },
    presetActivated: {
      description: 'Пресет активирован',
      matcher: {
        pattern: /route preset (\d+)/
      },
      extract: (match) => ({
        preset: parseInt(match[1]),
        action: 'activated'
      })
    },

    // Окна
    windowRoute: {
      description: 'Получен маршрут окна',
      matcher: {
        pattern: /window (\d+) route: (\d+)/
      },
      extract: (match) => ({
        window: parseInt(match[1]),
        input: parseInt(match[2])
      })
    },
    windowMute: {
      description: 'Получено состояние мута окна',
      matcher: {
        pattern: /window (\d+) mute: (ON|OFF)/
      },
      extract: (match) => ({
        window: parseInt(match[1]),
        mute: match[2] === 'ON'
      })
    },
    windowHPosition: {
      description: 'Получено горизонтальное положение окна',
      matcher: {
        pattern: /window (\d+) hposition: (\d+)/
      },
      extract: (match) => ({
        window: parseInt(match[1]),
        position: parseInt(match[2])
      })
    },
    windowVPosition: {
      description: 'Получено вертикальное положение окна',
      matcher: {
        pattern: /window (\d+) vposition: (\d+)/
      },
      extract: (match) => ({
        window: parseInt(match[1]),
        position: parseInt(match[2])
      })
    },
    windowHSize: {
      description: 'Получен горизонтальный размер окна',
      matcher: {
        pattern: /window (\d+) hsize: (\d+)/
      },
      extract: (match) => ({
        window: parseInt(match[1]),
        size: parseInt(match[2])
      })
    },
    windowVSize: {
      description: 'Получен вертикальный размер окна',
      matcher: {
        pattern: /window (\d+) vsize: (\d+)/
      },
      extract: (match) => ({
        window: parseInt(match[1]),
        size: parseInt(match[2])
      })
    },
    windowPriority: {
      description: 'Получен приоритет окна',
      matcher: {
        pattern: /window (\d+) priority: (\d+)/
      },
      extract: (match) => ({
        window: parseInt(match[1]),
        priority: parseInt(match[2])
      })
    },
    windowAspect: {
      description: 'Получено соотношение сторон окна',
      matcher: {
        pattern: /window (\d+) aspect: (\d+)/
      },
      extract: (match) => ({
        window: parseInt(match[1]),
        aspect: parseInt(match[2])
      })
    },
    windowMirror: {
      description: 'Получено состояние зеркала окна',
      matcher: {
        pattern: /window (\d+) mirror: (ON|OFF)/
      },
      extract: (match) => ({
        window: parseInt(match[1]),
        mirror: match[2] === 'ON'
      })
    },
    windowBorderMode: {
      description: 'Получено состояние границы окна',
      matcher: {
        pattern: /window (\d+) border mode: (ON|OFF)/
      },
      extract: (match) => ({
        window: parseInt(match[1]),
        mode: match[2] === 'ON'
      })
    },
    windowBorderColor: {
      description: 'Получен цвет границы окна',
      matcher: {
        pattern: /window (\d+) border color: (\d+)/
      },
      extract: (match) => ({
        window: parseInt(match[1]),
        color: parseInt(match[2])
      })
    },

    // Аудио
    audioOutMute: {
      description: 'Получено состояние мута аудиовыхода',
      matcher: {
        pattern: /audio out ([ABCD]) mute: (ON|OFF)/
      },
      extract: (match) => ({
        output: match[1],
        mute: match[2] === 'ON'
      })
    },
    audioOutVolume: {
      description: 'Получен уровень громкости аудиовыхода',
      matcher: {
        pattern: /audio out ([ABCD]) volume: (\d+)/
      },
      extract: (match) => ({
        output: match[1],
        volume: parseInt(match[2])
      })
    },
    audioOutRoute: {
      description: 'Получена маршрутизация аудиовыхода',
      matcher: {
        pattern: /audio out ([ABCD]) route: (\d+)/
      },
      extract: (match) => ({
        output: match[1],
        source: parseInt(match[2])
      })
    },
    audioAGCMode: {
      description: 'Получено состояние AGC',
      matcher: {
        pattern: /audio agc in ([ABCD]) mode: (ON|OFF)/
      },
      extract: (match) => ({
        output: match[1],
        mode: match[2] === 'ON'
      })
    },
    audioAGCLevel: {
      description: 'Получен уровень AGC',
      matcher: {
        pattern: /audio agc in ([ABCD]) level: (\d+)/
      },
      extract: (match) => ({
        output: match[1],
        level: parseInt(match[2])
      })
    },
    audioMixerSource: {
      description: 'Получено состояние источника в микшере',
      matcher: {
        pattern: /audio mixer out ([ABCD]) source (\d+) (ON|OFF)/
      },
      extract: (match) => ({
        output: match[1],
        source: parseInt(match[2]),
        enabled: match[3] === 'ON'
      })
    },
    audioMixerVolume: {
      description: 'Получена громкость источника в микшере',
      matcher: {
        pattern: /audio mixer out ([ABCD]) source (\d+) volume (\d+)/
      },
      extract: (match) => ({
        output: match[1],
        source: parseInt(match[2]),
        volume: parseInt(match[3])
      })
    }
  };

  // Методы команд
  // Пресеты
  setRoutePreset(params) {
    const { preset } = params;
    return { payload: `set current route to preset ${preset}\r\n` };
  }

  activatePreset(params) {
    const { preset } = params;
    return { payload: `set window layout mode ${preset}\r\n` };
  }

  // Окна
  setWindowRoute(params) {
    const { window, input } = params;
    return { payload: `set window ${window} route ${input}\r\n` };
  }

  getWindowRoute(params) {
    const { window } = params;
    return { payload: `get window ${window} route\r\n` };
  }

  setWindowMute(params) {
    const { window, mute } = params;
    return { payload: `set window ${window} mute ${mute}\r\n` };
  }

  getWindowMute(params) {
    const { window } = params;
    return { payload: `get window ${window} mute\r\n` };
  }

  setWindowHPosition(params) {
    const { window, position } = params;
    return { payload: `set window ${window} hposition ${position}\r\n` };
  }

  getWindowHPosition(params) {
    const { window } = params;
    return { payload: `get window ${window} hposition\r\n` };
  }

  setWindowVPosition(params) {
    const { window, position } = params;
    return { payload: `set window ${window} vposition ${position}\r\n` };
  }

  getWindowVPosition(params) {
    const { window } = params;
    return { payload: `get window ${window} vposition\r\n` };
  }

  setWindowHSize(params) {
    const { window, size } = params;
    return { payload: `set window ${window} hsize ${size}\r\n` };
  }

  getWindowHSize(params) {
    const { window } = params;
    return { payload: `get window ${window} hsize\r\n` };
  }

  setWindowVSize(params) {
    const { window, size } = params;
    return { payload: `set window ${window} vsize ${size}\r\n` };
  }

  getWindowVSize(params) {
    const { window } = params;
    return { payload: `get window ${window} vsize\r\n` };
  }

  setWindowPriority(params) {
    const { window, priority } = params;
    return { payload: `set window ${window} priority ${priority}\r\n` };
  }

  getWindowPriority(params) {
    const { window } = params;
    return { payload: `get window ${window} priority\r\n` };
  }

  setWindowAspect(params) {
    const { window, aspect } = params;
    return { payload: `set window ${window} aspect ${aspect}\r\n` };
  }

  getWindowAspect(params) {
    const { window } = params;
    return { payload: `get window ${window} aspect\r\n` };
  }

  setWindowMirror(params) {
    const { window, mirror } = params;
    return { payload: `set window ${window} mirror ${mirror}\r\n` };
  }

  getWindowMirror(params) {
    const { window } = params;
    return { payload: `get window ${window} mirror\r\n` };
  }

  setWindowBorderMode(params) {
    const { window, mode } = params;
    return { payload: `set window ${window} border mode ${mode}\r\n` };
  }

  getWindowBorderMode(params) {
    const { window } = params;
    return { payload: `get window ${window} border mode\r\n` };
  }

  setWindowBorderColor(params) {
    const { window, color } = params;
    return { payload: `set window ${window} border color ${color}\r\n` };
  }

  getWindowBorderColor(params) {
    const { window } = params;
    return { payload: `get window ${window} border color\r\n` };
  }

  resetWindow(params) {
    const { window } = params;
    return { payload: `set window ${window} default\r\n` };
  }

  // Аудио
  setAudioOutMute(params) {
    const { output, mute } = params;
    return { payload: `set audio out ${output} mute ${mute}\r\n` };
  }

  getAudioOutMute(params) {
    const { output } = params;
    return { payload: `get audio out ${output} mute\r\n` };
  }

  setAudioOutVolume(params) {
    const { output, volume } = params;
    return { payload: `set audio out ${output} volume ${volume}\r\n` };
  }

  getAudioOutVolume(params) {
    const { output } = params;
    return { payload: `get audio out ${output} volume\r\n` };
  }

  setAudioOutRoute(params) {
    const { output, source } = params;
    return { payload: `set audio out ${output} route ${source}\r\n` };
  }

  getAudioOutRoute(params) {
    const { output } = params;
    return { payload: `get audio out ${output} route\r\n` };
  }

  setAudioAGCMode(params) {
    const { output, mode } = params;
    return { payload: `set audio agc in ${output} mode ${mode}\r\n` };
  }

  getAudioAGCMode(params) {
    const { output } = params;
    return { payload: `get audio agc in ${output} mode\r\n` };
  }

  setAudioAGCLevel(params) {
    const { output, level } = params;
    return { payload: `set audio agc in ${output} level ${level}\r\n` };
  }

  getAudioAGCLevel(params) {
    const { output } = params;
    return { payload: `get audio agc in ${output} level\r\n` };
  }

  setAudioMixerSource(params) {
    const { output, source, enable } = params;
    return { payload: `set audio mixer out ${output} source ${source} ${enable}\r\n` };
  }

  getAudioMixerSource(params) {
    const { output, source } = params;
    return { payload: `get audio mixer out ${output} source ${source}\r\n` };
  }

  setAudioMixerVolume(params) {
    const { output, source, volume } = params;
    return { payload: `set audio mixer out ${output} source ${source} volume ${volume}\r\n` };
  }

  getAudioMixerVolume(params) {
    const { output, source } = params;
    return { payload: `get audio mixer out ${output} source ${source} volume\r\n` };
  }

  // Инициализация
  initialize() {
    //console.log('Инициализация CSC-VPR-3421 Matrix Switcher');
    
    // Запрос текущих состояний для всех окон
    // for (let window = 1; window <= 4; window++) {
    //   this.publishCommand('getWindowRoute', { window });
    //   this.publishCommand('getWindowMute', { window });
    //   this.publishCommand('getWindowHPosition', { window });
    //   this.publishCommand('getWindowVPosition', { window });
    //   this.publishCommand('getWindowHSize', { window });
    //   this.publishCommand('getWindowVSize', { window });
    //   this.publishCommand('getWindowPriority', { window });
    //   this.publishCommand('getWindowAspect', { window });
    //   this.publishCommand('getWindowMirror', { window });
    //   this.publishCommand('getWindowBorderMode', { window });
    //   this.publishCommand('getWindowBorderColor', { window });
    // }
    
    // // Запрос текущих состояний для аудиовыходов
    // for (const output of ['A', 'B', 'C', 'D']) {
    //   this.publishCommand('getAudioOutMute', { output });
    //   this.publishCommand('getAudioOutVolume', { output });
    //   this.publishCommand('getAudioOutRoute', { output });
    //   this.publishCommand('getAudioAGCMode', { output });
    //   this.publishCommand('getAudioAGCLevel', { output });
      
    //   // Запрос состояний для всех источников в микшере
    //   for (let source = 1; source <= 9; source++) {
    //     this.publishCommand('getAudioMixerSource', { output, source });
    //     this.publishCommand('getAudioMixerVolume', { output, source });
    //   }
    // }
  }
}

module.exports = CSCVPR3421Driver;
