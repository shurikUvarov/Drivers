const BaseDriver = require('base-driver');

/**
 * Драйвер для аудио устройства Extron
 */
class ExtronAudioDriver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'Tesira',
    manufacturer: 'Tesira',
    version: '1.0.0',
    description: 'Драйвер для управления аудио устройствами Extron'
  };
  
  // Определение команд
  static commands = {
    // Команды для управления уровнем
    setLevel: {
      description: 'Установка уровня звука',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'channel',
          type: 'number',
          description: 'Номер канала (1-32)',
          required: true,
          min: 1,
          max: 32
        },
        {
          name: 'level',
          type: 'number',
          description: 'Уровень звука (-100 до 12)',
          required: true,
          min: -100,
          max: 12
        }
      ]
    },
    StepSetLevel: {
      description: 'Установка уровня звука c шагом',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'channel',
          type: 'number',
          description: 'Номер канала (1-32)',
          required: true,
          min: 1,
          max: 32
        },
        {
          name: 'step',
          type: 'number',
          description: 'Шаг',
          required: true,
          min: 1,
          max: 10
        },
        {
          name: 'stepDirection',
          type: 'string',
          description: 'Направление шага',
          required: true,
          enum: ['decrement', 'increment']
        }
      ]
    },
    getLevel: {
      description: 'Запрос текущего уровня звука',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'channel',
          type: 'number',
          description: 'Номер канала (1-32)',
          required: true,
          min: 1,
          max: 32
        }
      ]
    },
    setFineLevel: {
      description: 'Установка точного уровня звука',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'channel',
          type: 'number',
          description: 'Номер канала (1-32)',
          required: true,
          min: 1,
          max: 32
        },
        {
          name: 'level',
          type: 'number',
          description: 'Точный уровень звука (-100.0 до 12.0)',
          required: true,
          min: -100.0,
          max: 12.0
        }
      ]
    },
    getFineLevel: {
      description: 'Запрос текущего точного уровня звука',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        }
      ]
    },
    
    // Команды для управления отключением звука
    setMute: {
      description: 'Установка состояния отключения звука',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'channel',
          type: 'number',
          description: 'Номер канала (1-32)',
          required: true,
          min: 1,
          max: 32
        },
        {
          name: 'state',
          type: 'boolean',
          description: 'Состояние отключения звука (true=отключено, false=включено)',
          required: true
        }
      ]
    },
    getMute: {
      description: 'Запрос текущего состояния отключения звука',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'channel',
          type: 'number',
          description: 'Номер канала (1-32)',
          required: true,
          min: 1,
          max: 32
        }
      ]
    },
    toggleMute: {
      description: 'Переключение состояния отключения звука',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'channel',
          type: 'number',
          description: 'Номер канала (1-32)',
          required: true,
          min: 1,
          max: 32
        }
      ]
    },
    
    // Команды для управления матрицей
    setRouter: {
      description: 'Установка маршрутизации в матрице',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'output',
          type: 'number',
          description: 'Номер выхода (1-256)',
          required: true,
          min: 1,
          max: 256
        },
        {
          name: 'input',
          type: 'number',
          description: 'Номер входа (0-256)',
          required: true,
          min: 0,
          max: 256
        }
      ]
    },
    getRouter: {
      description: 'Запрос текущей маршрутизации в матрице',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'output',
          type: 'number',
          description: 'Номер выхода (1-256)',
          required: true,
          min: 1,
          max: 256
        }
      ]
    },
    setRoomCombinerSource: {
      description: 'Установка источника для комбайнер комнаты',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'room',
          type: 'number',
          description: 'Номер комнаты (1-32)',
          required: true,
          min: 1,
          max: 32
        },
        {
          name: 'source',
          type: 'number',
          description: 'Номер источника (0-4)',
          required: true,
          min: 0,
          max: 4
        }
      ]
    },
    getRoomCombinerSource: {
      description: 'Запрос текущего источника для комбайнер комнаты',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'room',
          type: 'number',
          description: 'Номер комнаты (1-32)',
          required: true,
          min: 1,
          max: 32
        }
      ]
    },
    
    // Команды для работы с пресетами
    recallPreset: {
      description: 'Вызов пресета',
      parameters: [
        {
          name: 'presetName',
          type: 'string',
          description: 'Имя пресета',
          required: true
        }
      ]
    },
    savePreset: {
      description: 'Сохранение текущего состояния как пресета',
      parameters: [
        {
          name: 'presetName',
          type: 'string',
          description: 'Имя пресета',
          required: true
        }
      ]
    },
    
    // Команды для подписки на изменения
    subscribeLevel: {
      description: 'Подписка на изменения уровня звука',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'channel',
          type: 'number',
          description: 'Номер канала (1-32)',
          required: true,
          min: 1,
          max: 32
        }
      ]
    },
    
    subscribeMute: {
      description: 'Подписка на изменения состояния мьюта',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'channel',
          type: 'number',
          description: 'Номер канала (1-32)',
          required: true,
          min: 1,
          max: 32
        }
      ]
    },
    
    unsubscribeLevel: {
      description: 'Отписка от изменений уровня звука',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'channel',
          type: 'number',
          description: 'Номер канала (1-32)',
          required: true,
          min: 1,
          max: 32
        }
      ]
    },
    
    unsubscribeMute: {
      description: 'Отписка от изменений состояния мьюта',
      parameters: [
        {
          name: 'instanceTag',
          type: 'string',
          description: 'Идентификатор экземпляра',
          required: true
        },
        {
          name: 'channel',
          type: 'number',
          description: 'Номер канала (1-32)',
          required: true,
          min: 1,
          max: 32
        }
      ]
    }
  };
  
  // Определение обработчиков ответов
  static responses = {
    // Обработчики для уровня
    levelResponse: {
      description: 'Ответ с уровнем звука',
      matcher: {
        pattern: /(\S+) get level (\d+)\r\+OK "value":([-\d.]+)\r/
      },
      extract: function(match) {
        return {
          type: 'level',
          instanceTag: match[1],
          channel: parseInt(match[2], 10),
          level: parseFloat(match[3])
        };
      }
    },
    fineLevelResponse: {
      description: 'Ответ с точным уровнем звука',
      matcher: {
        pattern: /(\S+) get levels\r\+OK "value":\[([-\d.,\s]+)\]\r/
      },
      extract: function(match) {
        const levels = match[2].split(',').map(val => parseFloat(val.trim()));
        return {
          type: 'fineLevel',
          instanceTag: match[1],
          levels: levels
        };
      }
    },
    
    // Обработчики для отключения звука
    muteResponse: {
      description: 'Ответ с состоянием отключения звука',
      matcher: {
        pattern: /(\S+) get mute (\d+)\r\+OK "value":(true|false)\r/
      },
      extract: function(match) {
        return {
          type: 'mute',
          instanceTag: match[1],
          channel: parseInt(match[2], 10),
          muted: match[3] === 'true'
        };
      }
    },
    
    // Обработчики для матрицы
    routerResponse: {
      description: 'Ответ с маршрутизацией матрицы',
      matcher: {
        pattern: /(\S+) get input (\d+)\r\+OK "value":(\d+)\r/
      },
      extract: function(match) {
        return {
          type: 'router',
          instanceTag: match[1],
          output: parseInt(match[2], 10),
          input: parseInt(match[3], 10)
        };
      }
    },
    roomCombinerSourceResponse: {
      description: 'Ответ с источником комбайнер комнаты',
      matcher: {
        pattern: /(\S+) get source (\d+)\r\+OK "value":(\d+)\r/
      },
      extract: function(match) {
        return {
          type: 'roomCombinerSource',
          instanceTag: match[1],
          room: parseInt(match[2], 10),
          source: parseInt(match[3], 10)
        };
      }
    },
    
    // Обработчики для пресетов
    presetRecallResponse: {
      description: 'Ответ на вызов пресета',
      matcher: {
        pattern: /Preset recalled: (\S+)/
      },
      extract: function(match) {
        return {
          type: 'presetRecall',
          presetName: match[1]
        };
      }
    },
    presetSaveResponse: {
      description: 'Ответ на сохранение пресета',
      matcher: {
        pattern: /Preset saved: (\S+)/
      },
      extract: function(match) {
        return {
          type: 'presetSave',
          presetName: match[1]
        };
      }
    },
    
    // Обработчики для подписок
    levelNotification: {
      description: 'Уведомление об изменении уровня',
      matcher: {
        pattern: /(\S+) notify level (\d+) ([-\d.]+)/
      },
      extract: function(match) {
        return {
          type: 'levelNotification',
          instanceTag: match[1],
          channel: parseInt(match[2], 10),
          level: parseFloat(match[3])
        };
      }
    },
    
    muteNotification: {
      description: 'Уведомление об изменении состояния мьюта',
      matcher: {
        pattern: /(\S+) notify mute (\d+) (true|false)/
      },
      extract: function(match) {
        return {
          type: 'muteNotification',
          instanceTag: match[1],
          channel: parseInt(match[2], 10),
          muted: match[3] === 'true'
        };
      }
    },
    
    // Обработчик ошибок
    errorResponse: {
      description: 'Ошибка устройства',
      matcher: {
        pattern: /ERROR: (.+)/
      },
      extract: function(match) {
        return {
          type: 'error',
          message: match[1]
        };
      }
    },
    allSubscribeResponse: {
      description: 'Общий обработчик для всех подписок',
      matcher: {
        pattern: /! "publishToken":"([^"]*)"\s+"value":([-\d.]+|true|false|"[\w .-]*")/
      },
      extract: function(match) {
        try {
          let value = match[2].trim();
          let Type = 'number'
          // Обработка числовых значений (включая отрицательные)
          if (/^-?\d+(\.\d+)?$/.test(value)) {
            value = parseFloat(value);
          } 
          // Обработка булевых значений
          else if (value === 'true') {
            value = true;
            Type = 'bool'
          } else if (value === 'false') {
            value = false;
            Type = 'bool'
          } 
          // Обработка строковых значений в кавычках
          else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          }
          
          return {
            type: 'subscribeNotification',
            publishToken: match[1],
            value: value,
            valueType: Type
          };
        } catch (e) {
          return {
            type: 'error',
            message: 'Failed to parse subscribe notification: ' + e.message,
            raw: match[0]
          };
        }
      }
    }
  };
  
  // Вспомогательная функция для обработки тега с пробелами
  _formatInstanceTag(tag) {
    return tag.includes(' ') ? `"${tag}"` : tag;
  }
  
  // Методы команд
  
  // Методы для управления уровнем
  setLevel(params) {
    const { instanceTag, channel, level } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    // Проверка диапазона
    const safeLevel = Math.max(-100, Math.min(12, level));
    // Формирование команды
    const command = `${formattedTag} set level ${channel} ${safeLevel}\r\n`;
    return { payload: command };
  }

  StepSetLevel(params) { 
    const { instanceTag, channel, step,  stepDirection} = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    const safeStep = Math.max(0, Math.min(10, step));
    const command = `${formattedTag} ${stepDirection} level ${channel} ${safeStep}\r\n`;
    return { payload: command };
  }

  getLevel(params) {
    const { instanceTag, channel } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    // Формирование команды
    const command = `${formattedTag} get level ${channel}\r\n`;
    return { payload: command };
  }

  setFineLevel(params) {
    const { instanceTag, channel, level } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    // Проверка диапазона
    const safeLevel = Math.max(-100.0, Math.min(12.0, level));
    // Формирование команды
    const command = `${formattedTag} set level ${channel} ${safeLevel.toFixed(1)}\r\n`;
    return { payload: command };
  }

  getFineLevel(params) {
    const { instanceTag } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    // Формирование команды
    const command = `${formattedTag} get levels\r\n`;
    return { payload: command };
  }
  
  // Методы для управления отключением звука
  setMute(params) {
    const { instanceTag, channel, state } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    // Формирование команды
    const command = `${formattedTag} set mute ${channel} ${state ? 'true' : 'false'}\r\n`;
    return { payload: command };
  }

  getMute(params) {
    const { instanceTag, channel } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    // Формирование команды
    const command = `${formattedTag} get mute ${channel}\r\n`;
    return { payload: command };
  }
  
  toggleMute(params) {
    const { instanceTag, channel } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    // Прямая команда toggle
    return { payload: `${formattedTag} toggle mute ${channel}\r\n` };
  }
  
  // Методы для управления матрицей
  setRouter(params) {
    const { instanceTag, output, input } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    // Проверка диапазона
    const safeInput = Math.max(0, Math.min(256, input));
    const safeOutput = Math.max(1, Math.min(256, output));
    // Формирование команды
    const command = `${formattedTag} set input ${safeOutput} ${safeInput}\r\n`;
    return { payload: command };
  }

  getRouter(params) {
    const { instanceTag, output } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    // Проверка диапазона
    const safeOutput = Math.max(1, Math.min(256, output));
    // Формирование команды
    const command = `${formattedTag} get input ${safeOutput}\r\n`;
    return { payload: command };
  }
  
  setRoomCombinerSource(params) {
    const { instanceTag, room, source } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    // Проверка диапазона
    const safeRoom = Math.max(1, Math.min(32, room));
    const safeSource = Math.max(0, Math.min(4, source));
    // Формирование команды
    const command = `${formattedTag} set source ${safeRoom} ${safeSource}\r\n`;
    return { payload: command };
  }

  getRoomCombinerSource(params) {
    const { instanceTag, room } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    // Проверка диапазона
    const safeRoom = Math.max(1, Math.min(32, room));
    // Формирование команды
    const command = `${formattedTag} get source ${safeRoom}\r\n`;
    return { payload: command };
  }
  
  // Методы для работы с пресетами
  recallPreset(params) {
    const { presetName } = params;
    // Формирование команды
    const command = `DEVICE recallPreset ${presetName}\r`;
    return { payload: command };
  }

  savePreset(params) {
    const { presetName } = params;
    // Формирование команды
    const command = `Preset save ${presetName}\r\n`;
    return { payload: command };
  }
  
  // Методы для подписки
  subscribeLevel(params) {
    const { instanceTag, channel } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    return { payload: `${formattedTag} subscribe level ${channel} ${formattedTag}\r\n` };
  }
  
  subscribeMute(params) {
    const { instanceTag, channel } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    return { payload: `${formattedTag} subscribe mute ${channel} ${formattedTag}\r\n` };
  }
  
  unsubscribeLevel(params) {
    const { instanceTag, channel } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    return { payload: `${formattedTag} unsubscribe level ${channel} ${formattedTag}\r\n` };
  }
  
  unsubscribeMute(params) {
    const { instanceTag, channel } = params;
    const formattedTag = this._formatInstanceTag(instanceTag);
    return { payload: `${formattedTag} unsubscribe mute ${channel} ${formattedTag}\r\n` };
  }
  parseResponse(data){
    
  }
}

module.exports = ExtronAudioDriver;
