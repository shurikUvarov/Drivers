const BaseDriver = require('base-driver');

/**
 * Драйвер для конференц-системы на основе протокола связи
 * Версия 3.2 - Объединены команды управления микрофонами и унифицированы события состояния
 */
class ConferenceSystemDriver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'ConferenceSystem',
    manufacturer: 'Generic',
    version: '3.2.0',
    description: 'Драйвер для управления конференц-системой через последовательный порт (бинарный режим)'
  };
  
  // Определение команд
  static commands = {
    setMicrophoneState: {
      description: 'Установить состояние микрофона участника',
      parameters: [
        {
          name: 'unitId',
          type: 'number',
          description: 'Номер микрофона (1-999)',
          required: true,
          min: 1,
          max: 999
        },
        {
          name: 'unitType',
          type: 'string',
          description: 'Тип микрофона',
          required: false,
          enum: ['delegate', 'chairman'],
          default: 'delegate'
        },
        {
          name: 'state',
          type: 'boolean',
          description: 'Состояние микрофона: true - включен, false - выключен',
          required: true
        }
      ]
    },
    chairmanPriority: {
      description: 'Активировать приоритет председателя (включает микрофон председателя и отключает все микрофоны делегатов)',
      parameters: [
        {
          name: 'unitId',
          type: 'number',
          description: 'Номер микрофона председателя (1-999)',
          required: true,
          min: 1,
          max: 999
        }
      ]
    },
    startRegistration: {
      description: 'Начать регистрацию участников конференции',
      parameters: []
    },
    endRegistration: {
      description: 'Завершить регистрацию участников конференции',
      parameters: []
    },
    setMeetingMode: {
      description: 'Установить режим встречи',
      parameters: [
        {
          name: 'mode',
          type: 'string',
          description: 'Режим встречи',
          required: true,
          enum: ['FIFO', 'LIMIT', 'FREE', 'APPLY', 'VOICE_CONTROL'],
          default: 'FIFO'
        },
        {
          name: 'speakersCount',
          type: 'number',
          description: 'Максимальное количество спикеров',
          required: true,
          min: 1,
          max: 8,
          default: 1
        }
      ]
    },
    setVolume: {
      description: 'Установить громкость системы',
      parameters: [
        {
          name: 'type',
          type: 'string',
          description: 'Тип громкости',
          required: true,
          enum: ['input', 'output'],
          default: 'input'
        },
        {
          name: 'level',
          type: 'number',
          description: 'Уровень громкости (0-20)',
          required: true,
          min: 0,
          max: 20
        }
      ]
    },
    recallCameraPosition: {
      description: 'Вызвать предустановленную позицию камеры для отслеживания',
      parameters: [
        {
          name: 'preset',
          type: 'number',
          description: 'Номер предустановленной позиции (0-225)',
          required: true,
          min: 0,
          max: 225
        }
      ]
    },
    recallPanorama: {
      description: 'Вызвать общую панорамную позицию камеры',
      parameters: []
    },
    requestStatus: {
      description: 'Запросить статус системы',
      parameters: []
    }
  };
  
  // JSON-описание обработчиков ответов
  static responses = {
    chairmanPriorityResponse: {
      description: 'Активирован приоритет председателя',
      matcher: {
        pattern: [0xFE, 0x11, null, null, 0xFC]
      },
      extract: function(data) {
        const param1 = data[2];
        const param2 = data[3];
        
        const highBits = (param1 & 0xF0) >> 4;
        const actionType = param1 & 0x0F;
        
        // Пропускаем другие типы событий
        if (actionType !== 0x0B) {
          return null;
        }
        
        const unitId = (highBits << 8) | param2;
        
        return {
          type: 'chairmanPriority',
          unitId: unitId,
          rawCommand: data.toString('hex').toUpperCase()
        };
      }
    },
    microphoneState: {
      description: 'Состояние микрофона участника',
      matcher: {
        pattern: [0xFE, 0x11, null, null, 0xFC]
      },
      extract: function(data) {
        const param1 = data[2];
        const param2 = data[3];
        
        const highBits = (param1 & 0xF0) >> 4;
        const actionType = param1 & 0x0F;
        
        // Пропускаем chairmanPriority
        if (actionType === 0x0B) {
          return null;
        }
        
        let state, unitType;
        switch(actionType) {
          case 0x00: // Delegate unit Mic On
            state = true;
            unitType = 'delegate';
            break;
          case 0x01: // Delegate unit Mic Off
            state = false;
            unitType = 'delegate';
            break;
          case 0x07: // Chairman unit Mic On
            state = true;
            unitType = 'chairman';
            break;
          case 0x08: // Chairman unit Mic Off
            state = false;
            unitType = 'chairman';
            break;
          default:
            return null;
        }
        
        const unitId = (highBits << 8) | param2;
        
        return {
          type: 'microphoneState',
          unitId: unitId,
          unitType: unitType,
          state: state, // Булево значение состояния
          rawCommand: data.toString('hex').toUpperCase()
        };
      }
    },
    registrationStarted: {
      description: 'Регистрация участников начата',
      matcher: {
        pattern: [0xFE, 0x03, 0x32, 0xDE, 0xFC]
      },
      extract: function(data) {
        return {
          type: 'registrationStarted',
          timestamp: new Date().toISOString(),
          rawCommand: data.toString('hex').toUpperCase()
        };
      }
    },
    registrationEnded: {
      description: 'Регистрация участников завершена',
      matcher: {
        pattern: [0xFE, 0x03, 0x01, 0x00, 0xFC]
      },
      extract: function(data) {
        return {
          type: 'registrationEnded',
          timestamp: new Date().toISOString(),
          rawCommand: data.toString('hex').toUpperCase()
        };
      }
    },
    cameraTracking: {
      description: 'Команда для отслеживания камеры',
      matcher: {
        pattern: [0xFE, 0xC7, null, null, 0xFC]
      },
      extract: function(data) {
        const presetHigh = data[2];
        const presetLow = data[3];
        const preset = (presetHigh << 8) | presetLow;
        
        return {
          type: 'cameraTracking',
          preset: preset,
          timestamp: new Date().toISOString(),
          rawCommand: data.toString('hex').toUpperCase()
        };
      }
    },
    statusResponse: {
      description: 'Ответ со статусом системы',
      matcher: {
        pattern: [0xFE, 0xCA, null, null, 0xFC]
      },
      extract: function(data) {
        const mode = data[2];
        const speakersCount = data[3];
        
        let modeName = 'UNKNOWN';
        switch(mode) {
          case 0x00: modeName = 'FIFO'; break;
          case 0x01: modeName = 'LIMIT'; break;
          case 0x02: modeName = 'FREE'; break;
          case 0x03: modeName = 'APPLY'; break;
          case 0x04: modeName = 'VOICE_CONTROL'; break;
        }
        
        return {
          type: 'status',
          mode: modeName,
          speakersCount: speakersCount,
          timestamp: new Date().toISOString(),
          rawCommand: data.toString('hex').toUpperCase()
        };
      }
    },
    error: {
      description: 'Ошибка системы',
      matcher: {
        pattern: /Error/i
      },
      extract: function(match) {
        return {
          type: 'error',
          message: 'Системная ошибка',
          raw: match[0]
        };
      }
    }
  };
  
  // Инициализация при подключении
  initialize() {
    console.log('Инициализация конференц-системы');
    
    // Запрашиваем статус системы
    this.publishCommand('requestStatus');
  }
  
  // Вспомогательная функция для преобразования номера микрофона в высокие и низкие биты
  _getUnitAddress(unitId) {
    if (unitId < 1 || unitId > 999) {
      throw new Error(`Недопустимый номер микрофона: ${unitId}. Допустимый диапазон: 1-999`);
    }
    
    const hexId = unitId.toString(16).padStart(3, '0');
    const highBits = parseInt(hexId[0], 16);
    const lowBits = parseInt(hexId.substring(1), 16);
    
    return { highBits, lowBits };
  }
  
  // Унифицированная команда управления состоянием микрофона
  setMicrophoneState(params) {
    const { unitId, unitType = 'delegate', state } = params;
    
    // Получаем адрес устройства
    const { highBits, lowBits } = this._getUnitAddress(unitId);
    
    // Определяем код операции в зависимости от состояния и типа
    let actionByte;
    if (state) {
      actionByte = unitType === 'chairman' ? 0x07 : 0x00; // Chairman/Delegate On
    } else {
      actionByte = unitType === 'chairman' ? 0x08 : 0x01; // Chairman/Delegate Off
    }
    
    const param1 = (highBits << 4) | actionByte;
    
    // Создаем буфер с бинарными данными
    const buffer = Buffer.from([
      0xFE, // Заголовок кадра
      0x11, // Тип сообщения
      param1, // Параметр 1
      lowBits, // Параметр 2
      0xFC // Конец кадра
    ]);
    
    if (this.debug) {
      console.log(`[driver] Изменение состояния микрофона: unitId=${unitId}, unitType=${unitType}, state=${state}, команда=${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  chairmanPriority(params) {
    const { unitId } = params;
    
    // Получаем адрес устройства
    const { highBits, lowBits } = this._getUnitAddress(unitId);
    
    // Код операции для приоритета председателя
    const param1 = (highBits << 4) | 0x0B;
    
    const buffer = Buffer.from([
      0xFE, // Заголовок кадра
      0x11, // Тип сообщения
      param1, // Параметр 1
      lowBits, // Параметр 2
      0xFC // Конец кадра
    ]);
    
    if (this.debug) {
      console.log(`[driver] Активация приоритета председателя: unitId=${unitId}, команда=${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  startRegistration() {
    const buffer = Buffer.from([0xFE, 0x03, 0x32, 0xDE, 0xFC]);
    
    if (this.debug) {
      console.log(`[driver] Начало регистрации участников: ${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  endRegistration() {
    const buffer = Buffer.from([0xFE, 0x03, 0x01, 0x00, 0xFC]);
    
    if (this.debug) {
      console.log(`[driver] Завершение регистрации участников: ${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  setMeetingMode(params) {
    const { mode, speakersCount } = params;
    
    let modeValue;
    switch(mode) {
      case 'FIFO': modeValue = 0x00; break;
      case 'LIMIT': modeValue = 0x01; break;
      case 'FREE': modeValue = 0x02; break;
      case 'APPLY': modeValue = 0x03; break;
      case 'VOICE_CONTROL': modeValue = 0x04; break;
      default: modeValue = 0x00;
    }
    
    if (speakersCount < 1 || speakersCount > 8) {
      throw new Error(`Недопустимое количество спикеров: ${speakersCount}. Допустимый диапазон: 1-8`);
    }
    
    const buffer = Buffer.from([
      0xFE, // Заголовок кадра
      0xC1, // Тип сообщения
      modeValue, // Параметр 1 - режим
      speakersCount, // Параметр 2 - количество спикеров
      0xFC // Конец кадра
    ]);
    
    if (this.debug) {
      console.log(`[driver] Установка режима встречи: mode=${mode}, speakersCount=${speakersCount}, команда=${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  setVolume(params) {
    const { type, level } = params;
    
    if (level < 0 || level > 20) {
      throw new Error(`Недопустимый уровень громкости: ${level}. Допустимый диапазон: 0-20`);
    }
    
    const param1 = type === 'input' ? 0x01 : 0x02;
    
    const buffer = Buffer.from([
      0xFE, // Заголовок кадра
      0xC2, // Тип сообщения
      param1, // Параметр 1 - тип громкости
      level, // Параметр 2 - уровень
      0xFC // Конец кадра
    ]);
    
    if (this.debug) {
      console.log(`[driver] Установка громкости: type=${type}, level=${level}, команда=${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  recallCameraPosition(params) {
    const { preset } = params;
    
    if (preset < 0 || preset > 225) {
      throw new Error(`Недопустимый номер предустановки: ${preset}. Допустимый диапазон: 0-225`);
    }
    
    const presetHigh = Math.floor(preset / 256);
    const presetLow = preset % 256;
    
    const buffer = Buffer.from([
      0xFE, // Заголовок кадра
      0xC7, // Тип сообщения
      presetHigh, // Параметр 1 - старший байт
      presetLow, // Параметр 2 - младший байт
      0xFC // Конец кадра
    ]);
    
    if (this.debug) {
      console.log(`[driver] Вызов позиции камеры: preset=${preset}, команда=${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  recallPanorama() {
    const buffer = Buffer.from([0xFE, 0xC7, 0x00, 0x00, 0xFC]);
    
    if (this.debug) {
      console.log(`[driver] Вызов панорамной позиции камеры: ${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  requestStatus() {
    const buffer = Buffer.from([0xFE, 0xCA, 0x00, 0x00, 0xFC]);
    
    if (this.debug) {
      console.log(`[driver] Запрос статуса системы: ${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  // Основной метод обработки ответов
   parseResponse(data) {
    let responseBuffer = data;
    
    // Если получаем объект с полем data, используем его
    if (typeof data === 'object' && data !== null && data.hasOwnProperty('data')) {
      responseBuffer = data.data;
    }
    
    try {
      // Убеждаемся, что responseBuffer является Buffer
      if (!Buffer.isBuffer(responseBuffer)) {
        if (typeof responseBuffer === 'string') {
          // Если строка, преобразуем в буфер
          responseBuffer = Buffer.from(responseBuffer, 'hex');
        } else if (Array.isArray(responseBuffer)) {
          // Если массив, создаем буфер из массива
          responseBuffer = Buffer.from(responseBuffer);
        } else if (typeof responseBuffer === 'object') {
          // Если объект с data, пытаемся получить данные
          if (responseBuffer.data && Buffer.isBuffer(responseBuffer.data)) {
            responseBuffer = responseBuffer.data;
          } else {
            console.error('Неизвестный формат данных:', responseBuffer);
            return null;
          }
        } else {
          console.error('Неизвестный формат данных:', typeof responseBuffer);
          return null;
        }
      }
      
      if (this.debug) {
        console.log(`[driver] Получены данные (hex): ${responseBuffer.toString('hex').toUpperCase()}`);
      }
      
      // Разделяем полученные данные на отдельные кадры
      const frames = this._splitIntoFrames(responseBuffer);
      
      if (frames.length === 0) {
        if (this.debug) {
          console.log('[driver] Не удалось найти валидные кадры в ответе');
        }
        return null;
      }
      
      if (this.debug) {
        console.log(`[driver] Найдено кадров: ${frames.length}`);
        frames.forEach((frame, index) => {
          console.log(`[driver] Кадр ${index + 1}: ${frame.toString('hex').toUpperCase()}`);
        });
      }
      
      // Если кадров несколько, обрабатываем все
      if (frames.length > 1) {
        // Публикуем все кадры как отдельные ответы
        frames.forEach((frame, index) => {
          const parsedFrame = this._parseSingleFrame(frame);
          if (parsedFrame) {
            // Для отладки добавляем информацию о позиции кадра
            parsedFrame.frameIndex = index;
            parsedFrame.totalFrames = frames.length;
            // Помечаем первый и последний кадры
            if (index === 0) parsedFrame.isFirstFrame = true;
            if (index === frames.length - 1) parsedFrame.isLastFrame = true;
            parsedFrame.rawHex = frame.toString('hex').toUpperCase();
            
            this.publishResponse(parsedFrame, { raw: frame });
          }
        });
        
        // Возвращаем null, так как все ответы уже опубликованы
        return null;
      } else if (frames.length === 1) {
        // Обрабатываем единственный кадр
        const result = this._parseSingleFrame(frames[0]);
        if (result) {
          result.rawHex = frames[0].toString('hex').toUpperCase();
        }
        return result;
      }
      
      return null;
      
    } catch (error) {
      console.error('[driver] Ошибка при обработке ответа:', error);
      return {
        type: 'error',
        message: error.message,
        raw: responseBuffer.toString ? responseBuffer.toString('hex').toUpperCase() : JSON.stringify(responseBuffer)
      };
    }
  }
  
  // Разделение данных на отдельные кадры
  _splitIntoFrames(dataBuffer) {
    const frames = [];
    let startPos = 0;
    const dataLength = dataBuffer.length;
    
    // Ищем начало первого кадра (FE)
    while (startPos < dataLength) {
      if (dataBuffer[startPos] !== 0xFE) {
        startPos++;
        continue;
      }
      
      // Проверяем, что осталось достаточно байт для полного кадра (минимум 5 байт)
      if (startPos + 4 >= dataLength) {
        break;
      }
      
      // Проверяем конец кадра (FC)
      if (dataBuffer[startPos + 4] === 0xFC) {
        // Извлекаем кадр (5 байт)
        const frame = dataBuffer.slice(startPos, startPos + 5);
        frames.push(frame);
        startPos += 5; // Переходим к следующему возможному кадру
      } else {
        startPos++;
      }
    }
    
    return frames;
  }
  
  // Парсинг одного кадра данных
  _parseSingleFrame(frameBuffer) {
    // Проверяем размер кадра
    if (frameBuffer.length !== 5) {
      if (this.debug) {
        console.log(`[driver] Неверный размер кадра: ${frameBuffer.length} байт`);
      }
      return null;
    }
    
    // Проверяем заголовок и конец кадра
    if (frameBuffer[0] !== 0xFE || frameBuffer[4] !== 0xFC) {
      if (this.debug) {
        console.log(`[driver] Неверный формат кадра: ${frameBuffer.toString('hex').toUpperCase()}`);
      }
      return null;
    }
    
    // Проверяем известные шаблоны из static.responses
    for (const [key, handler] of Object.entries(ConferenceSystemDriver.responses)) {
      if (handler.matcher) {
        // Проверяем паттерн
        let match = true;
        
        if (Array.isArray(handler.matcher.pattern)) {
          // Бинарный паттерн
          for (let i = 0; i < handler.matcher.pattern.length; i++) {
            const patternValue = handler.matcher.pattern[i];
            // Если null в паттерне, это означает "любое значение"
            if (patternValue !== null && frameBuffer[i] !== patternValue) {
              match = false;
              break;
            }
          }
        } else if (handler.matcher.pattern instanceof RegExp) {
          // Регулярное выражение (для совместимости)
          const hexString = frameBuffer.toString('hex').toUpperCase().match(/.{1,2}/g).join(' ');
          match = handler.matcher.pattern.test(hexString);
        }
        
        if (match && handler.extract) {
          try {
            let extractResult;
            
            if (Array.isArray(handler.matcher.pattern)) {
              // Для бинарных данных передаем буфер
              extractResult = handler.extract(frameBuffer);
            } else {
              // Для регулярных выражений передаем строку
              const hexString = frameBuffer.toString('hex').toUpperCase().match(/.{1,2}/g).join(' ');
              const matchResult = hexString.match(handler.matcher.pattern);
              extractResult = handler.extract(matchResult);
            }
            
            if (extractResult) {
              extractResult.commandType = key;
              return extractResult;
            }
          } catch (error) {
            console.error(`[driver] Ошибка при обработке кадра ${key}:`, error);
            continue;
          }
        }
      }
    }
    
    // Если кадр не распознан, возвращаем общую информацию
    return {
      type: 'unknownFrame',
      raw: frameBuffer,
      rawHex: frameBuffer.toString('hex').toUpperCase()
    };
  }
}

module.exports = ConferenceSystemDriver;
