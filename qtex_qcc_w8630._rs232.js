const BaseDriver = require('base-driver');

/**
 * Драйвер для конференц-системы на основе протокола связи
 * Версия 3.0 - Полностью исправленная версия с использованием Buffer
 */
class ConferenceSystemDriver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'ConferenceSystem',
    manufacturer: 'Generic',
    version: '3.0.0',
    description: 'Драйвер для управления конференц-системой через последовательный порт (бинарный режим)'
  };
  
  // Определение команд
  static commands = {
    micOn: {
      description: 'Включить микрофон участника',
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
        }
      ]
    },
    micOff: {
      description: 'Выключить микрофон участника',
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
  
  // Обработчики для отдельных кадров
  static frameHandlers = {
    micControl: {
      matcher: {
        length: 5,
        pattern: [0xFE, 0x11, null, null, 0xFC]
      },
      extract: function(data) {
        const param1 = data[2];
        const param2 = data[3];
        
        // Извлекаем старшие 4 бита и тип действия
        const highBits = (param1 & 0xF0) >> 4;
        const actionType = param1 & 0x0F;
        
        // Собираем полный адрес устройства
        const unitId = (highBits << 8) | param2;
        
        let unitType = 'delegate';
        let action = 'unknown';
        
        // Согласно документации:
        // 00 - Delegate unit Mic On
        // 01 - Delegate unit Mic Off
        // 07 - Chairman unit Mic On
        // 08 - Chairman unit Mic Off
        // 0B - Chairman unit Priority
        switch(actionType) {
          case 0x00: 
            action = 'micOn';
            break;
          case 0x01: 
            action = 'micOff';
            break;
          case 0x07: 
            unitType = 'chairman';
            action = 'micOn';
            break;
          case 0x08: 
            unitType = 'chairman';
            action = 'micOff';
            break;
          case 0x0B: 
            unitType = 'chairman';
            action = 'priority';
            break;
        }
        
        return {
          type: action,
          unitId: unitId,
          unitType: unitType,
          actionType: actionType,
          raw: data
        };
      }
    },
    registrationStart: {
      matcher: {
        length: 5,
        pattern: [0xFE, 0x03, 0x32, 0xDE, 0xFC]
      },
      extract: function() {
        return {
          type: 'registrationStarted',
          timestamp: new Date().toISOString()
        };
      }
    },
    registrationEnd: {
      matcher: {
        length: 5,
        pattern: [0xFE, 0x03, 0x01, 0x00, 0xFC]
      },
      extract: function() {
        return {
          type: 'registrationEnded',
          timestamp: new Date().toISOString()
        };
      }
    },
    cameraTracking: {
      matcher: {
        length: 5,
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
          raw: data
        };
      }
    },
    statusResponse: {
      matcher: {
        length: 5,
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
          raw: data
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
    // Проверяем диапазон номера
    if (unitId < 1 || unitId > 999) {
      throw new Error(`Недопустимый номер микрофона: ${unitId}. Допустимый диапазон: 1-999`);
    }
    
    // Преобразуем десятичный номер в шестнадцатеричный
    const hexId = unitId.toString(16).padStart(3, '0');
    // Старшие 4 бита (первый символ)
    const highBits = parseInt(hexId[0], 16);
    // Младшие 8 бит (последние два символа)
    const lowBits = parseInt(hexId.substring(1), 16);
    
    return { highBits, lowBits };
  }
  
  // Методы команд (теперь используем Buffer)
  micOn(params) {
    const { unitId, unitType = 'delegate' } = params;
    
    // Получаем адрес устройства
    const { highBits, lowBits } = this._getUnitAddress(unitId);
    
    // Определяем тип микрофона для параметра 1
    let param1;
    if (unitType === 'chairman') {
      // Согласно документации: Chairman unit Mic On - 07
      param1 = (highBits << 4) | 0x07;
    } else {
      // Согласно документации: Delegate unit Mic On - 00
      param1 = (highBits << 4) | 0x00;
    }
    
    // Создаем буфер с бинарными данными
    const buffer = Buffer.from([
      0xFE, // Заголовок кадра
      0x11, // Тип сообщения
      param1, // Параметр 1
      lowBits, // Параметр 2
      0xFC // Конец кадра
    ]);
    
    if (this.debug) {
      console.log(`[driver] Включение микрофона: unitId=${unitId}, unitType=${unitType}, команда=${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  micOff(params) {
    const { unitId, unitType = 'delegate' } = params;
    
    // Получаем адрес устройства
    const { highBits, lowBits } = this._getUnitAddress(unitId);
    
    // Определяем тип микрофона для параметра 1
    let param1;
    if (unitType === 'chairman') {
      // Согласно документации: Chairman unit Mic Off - 08
      param1 = (highBits << 4) | 0x08;
    } else {
      // Согласно документации: Delegate unit Mic Off - 01
      param1 = (highBits << 4) | 0x01;
    }
    
    // Создаем буфер с бинарными данными
    const buffer = Buffer.from([
      0xFE, // Заголовок кадра
      0x11, // Тип сообщения
      param1, // Параметр 1
      lowBits, // Параметр 2
      0xFC // Конец кадра
    ]);
    
    if (this.debug) {
      console.log(`[driver] Выключение микрофона: unitId=${unitId}, unitType=${unitType}, команда=${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  chairmanPriority(params) {
    const { unitId } = params;
    
    // Получаем адрес устройства
    const { highBits, lowBits } = this._getUnitAddress(unitId);
    
    // Для функции приоритета председателя используем 0B (согласно документации)
    const param1 = (highBits << 4) | 0x0B;
    
    // Создаем буфер с бинарными данными
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
    // Создаем буфер с бинарными данными
    const buffer = Buffer.from([0xFE, 0x03, 0x32, 0xDE, 0xFC]);
    
    if (this.debug) {
      console.log(`[driver] Начало регистрации участников: ${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  endRegistration() {
    // Создаем буфер с бинарными данными
    const buffer = Buffer.from([0xFE, 0x03, 0x01, 0x00, 0xFC]);
    
    if (this.debug) {
      console.log(`[driver] Завершение регистрации участников: ${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  setMeetingMode(params) {
    const { mode, speakersCount } = params;
    
    // Преобразуем режим в числовое значение
    let modeValue;
    switch(mode) {
      case 'FIFO': modeValue = 0x00; break;
      case 'LIMIT': modeValue = 0x01; break;
      case 'FREE': modeValue = 0x02; break;
      case 'APPLY': modeValue = 0x03; break;
      case 'VOICE_CONTROL': modeValue = 0x04; break;
      default: modeValue = 0x00;
    }
    
    // Проверяем количество спикеров
    if (speakersCount < 1 || speakersCount > 8) {
      throw new Error(`Недопустимое количество спикеров: ${speakersCount}. Допустимый диапазон: 1-8`);
    }
    
    // Создаем буфер с бинарными данными
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
    
    // Проверяем уровень громкости
    if (level < 0 || level > 20) {
      throw new Error(`Недопустимый уровень громкости: ${level}. Допустимый диапазон: 0-20`);
    }
    
    // Определяем тип громкости
    const param1 = type === 'input' ? 0x01 : 0x02;
    
    // Создаем буфер с бинарными данными
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
    
    // Проверяем диапазон предустановки
    if (preset < 0 || preset > 225) {
      throw new Error(`Недопустимый номер предустановки: ${preset}. Допустимый диапазон: 0-225`);
    }
    
    // Вычисляем высокий и низкий байты
    const presetHigh = Math.floor(preset / 256);
    const presetLow = preset % 256;
    
    // Создаем буфер с бинарными данными
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
    // Создаем буфер с бинарными данными для общей панорамной позиции
    const buffer = Buffer.from([0xFE, 0xC7, 0x00, 0x00, 0xFC]);
    
    if (this.debug) {
      console.log(`[driver] Вызов панорамной позиции камеры: ${buffer.toString('hex').toUpperCase()}`);
    }
    
    return { payload: buffer };
  }
  
  requestStatus() {
    // Команда для запроса статуса системы
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
    
    // Проверяем известные шаблоны
    for (const [key, handler] of Object.entries(ConferenceSystemDriver.frameHandlers)) {
      if (handler.matcher) {
        // Проверяем длину
        if (handler.matcher.length && frameBuffer.length !== handler.matcher.length) {
          continue;
        }
        
        // Проверяем паттерн
        let match = true;
        for (let i = 0; i < handler.matcher.pattern.length; i++) {
          const patternValue = handler.matcher.pattern[i];
          // Если null в паттерне, это означает "любое значение"
          if (patternValue !== null && frameBuffer[i] !== patternValue) {
            match = false;
            break;
          }
        }
        
        if (match && handler.extract) {
          try {
            const result = handler.extract(frameBuffer);
            result.commandType = key;
            return result;
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
