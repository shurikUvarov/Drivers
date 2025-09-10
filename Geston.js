const BaseDriver = require('base-driver');

/**
 * Драйвер для контроллера EG-7230 (конгресс-система)
 * Протокол: Modbus ASCII
 * Документация: EG-7230 Commands (1).docx
 */
class EG7230Driver extends BaseDriver {
  // ========= МЕТАДАННЫЕ =========
  static metadata = {
    name: 'EG-7230 Controller',
    manufacturer: 'Generic (Modbus ASCII)',
    version: '1.0.0',
    description: 'Драйвер для управления камерами и микрофонами через контроллер EG-7230 по протоколу Modbus ASCII.'
  };

  // ========= КОМАНДЫ =========
  static commands = {
    // Управление камерой
    setCameraType: {
      description: 'Установить тип камеры (00-Pelco-D, 01-Pelco-D, 02-D70, 03-Yaan)',
      parameters: [
        {
          name: 'cameraType',
          type: 'number',
          description: 'Код типа камеры',
          required: true,
          min: 0,
          max: 3
        }
      ]
    },
    setCameraNumber: {
      description: 'Выбрать номер камеры (01-04)',
      parameters: [
        {
          name: 'cameraNumber',
          type: 'number',
          description: 'Номер камеры (1-4)',
          required: true,
          min: 1,
          max: 4
        }
      ]
    },
    cameraMoveUp: {
      description: 'Двигать камеру вверх',
      parameters: []
    },
    cameraMoveDown: {
      description: 'Двигать камеру вниз',
      parameters: []
    },
    cameraMoveLeft: {
      description: 'Двигать камеру влево',
      parameters: []
    },
    cameraMoveRight: {
      description: 'Двигать камеру вправо',
      parameters: []
    },
    cameraZoomIn: {
      description: 'Приблизить камеру',
      parameters: []
    },
    cameraZoomOut: {
      description: 'Отдалить камеру',
      parameters: []
    },
    cameraIrisOpen: {
      description: 'Открыть диафрагму',
      parameters: []
    },
    cameraIrisClose: {
      description: 'Закрыть диафрагму',
      parameters: []
    },
    cameraSpeedIncrease: {
      description: 'Увеличить скорость движения',
      parameters: []
    },
    cameraSpeedDecrease: {
      description: 'Уменьшить скорость движения',
      parameters: []
    },
    cameraStop: {
      description: 'Остановить текущее действие камеры',
      parameters: []
    },
    cameraGotoPreset: {
      description: 'Перейти к предустановленной позиции',
      parameters: [
        {
          name: 'presetNumber',
          type: 'number',
          description: 'Номер предустановки',
          required: true,
          min: 0,
          max: 255
        }
      ]
    },

    // Управление микрофонами
    turnOnUnit: {
      description: 'Включить один микрофонный блок',
      parameters: [
        {
          name: 'unitNumber',
          type: 'number',
          description: 'Номер блока (представителя)',
          required: true,
          min: 1,
          max: 255
        }
      ]
    },
    turnOffUnit: {
      description: 'Выключить один микрофонный блок',
      parameters: [
        {
          name: 'unitNumber',
          type: 'number',
          description: 'Номер блока (представителя)',
          required: true,
          min: 1,
          max: 255
        }
      ]
    },
    turnOffAllUnits: {
      description: 'Выключить все микрофонные блоки (одной кнопкой)',
      parameters: []
    },

    // Запрос статуса
    getStatus: {
      description: 'Запросить статус хоста (режим, время, количество говорящих)',
      parameters: []
    }
  };

  // ========= ОБРАБОТЧИКИ ОТВЕТОВ =========
  static responses = {
    // Ответ на запрос статуса
    hostStatus: {
      description: 'Статус хоста системы',
      matcher: {
        pattern: /^:([0-9A-F]{2})10([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})\r\n$/i
      },
      extract: function (match) {
        return {
          type: 'hostStatus',
          deviceAddress: parseInt(match[1], 16),
          workingMode: parseInt(match[2], 16),
          speakingTime: parseInt(match[3], 16),
          numberOfSpeakers: parseInt(match[4], 16)
        };
      }
    },

    // Ответ на сохранение пресета (успешно/неуспешно)
    presetSaveStatus: {
      description: 'Статус сохранения пресета камеры',
      matcher: {
        pattern: /^:([0-9A-F]{2})64(00|01)([0-9A-F]{2})\r\n$/i
      },
      extract: function (match) {
        return {
          type: 'presetSaveStatus',
          deviceAddress: parseInt(match[1], 16),
          success: match[2] === '00',
          message: match[2] === '00' ? 'Success' : 'Failure'
        };
      }
    },

    // Общий обработчик для всех команд без ответа (или с подтверждением, которое не описано)
    // Многие команды EG-7230 не возвращают ответ, поэтому мы просто логируем факт отправки.
    commandSent: {
      description: 'Команда принята к исполнению (нет данных в ответе)',
      matcher: {
        pattern: /^:([0-9A-F]{2})[0-9A-F]{2}[0-9A-F]*([0-9A-F]{2})\r\n$/i
      },
      extract: function (match) {
        return {
          type: 'ack',
          deviceAddress: parseInt(match[1], 16),
          raw: match[0]
        };
      }
    }
  };

  // ========= ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ =========
  /**
   * Рассчитывает LRC чек-сумму для Modbus ASCII строки.
   * @param {string} dataString - Строка данных (без ':' в начале и CRLF в конце), например "010200000001"
   * @returns {string} - Двухсимвольная строка с LRC в HEX (верхний регистр).
   */
  _calculateLRC(dataString) {
    let lrc = 0;
    // Берем строку по 2 символа (каждый символ HEX = 1 байт)
    for (let i = 0; i < dataString.length; i += 2) {
      const byteStr = dataString.substr(i, 2);
      const byteVal = parseInt(byteStr, 16);
      lrc += byteVal;
    }
    // Берем младший байт суммы
    lrc = lrc & 0xFF;
    // Вычисляем дополнение до 0x100
    lrc = 0x100 - lrc;
    // Берем младший байт результата (на случай переполнения)
    lrc = lrc & 0xFF;
    // Возвращаем строку в HEX, в верхнем регистре, с ведущим нулем если нужно
    return lrc.toString(16).toUpperCase().padStart(2, '0');
  }

  /**
   * Формирует полную командную строку Modbus ASCII.
   * @param {string} deviceAddress - Адрес устройства (1 байт в HEX, например "01")
   * @param {string} functionCode - Код функции (1 байт в HEX, например "22")
   * @param {string} data - Данные команды (в HEX, может быть пустой строкой)
   * @returns {string} - Полная строка команды, например ":0122FC\r\n"
   */
  _buildCommandString(deviceAddress, functionCode, data = '') {
    const dataPart = deviceAddress + functionCode + data;
    const lrc = this._calculateLRC(dataPart);
    return `:${dataPart}${lrc}\r\n`;
  }

  // ========= РЕАЛИЗАЦИЯ КОМАНД =========
  // --- Камера ---
  setCameraType(params) {
    const { cameraType } = params;
    const hexType = cameraType.toString(16).toUpperCase().padStart(2, '0');
    return { payload: this._buildCommandString('01', '20', hexType) };
  }

  setCameraNumber(params) {
    const { cameraNumber } = params;
    const hexNum = cameraNumber.toString(16).toUpperCase().padStart(2, '0');
    return { payload: this._buildCommandString('01', '21', `0${hexNum}`) }; // Формат "0X" как в доке
  }

  cameraMoveUp() {
    return { payload: this._buildCommandString('01', '22') };
  }

  cameraMoveDown() {
    return { payload: this._buildCommandString('01', '23') };
  }

  cameraMoveLeft() {
    return { payload: this._buildCommandString('01', '24') };
  }

  cameraMoveRight() {
    return { payload: this._buildCommandString('01', '25') };
  }

  cameraZoomIn() {
    return { payload: this._buildCommandString('01', '26') };
  }

  cameraZoomOut() {
    return { payload: this._buildCommandString('01', '27') };
  }

  cameraIrisOpen() {
    return { payload: this._buildCommandString('01', '28') };
  }

  cameraIrisClose() {
    return { payload: this._buildCommandString('01', '29') };
  }

  cameraSpeedIncrease() {
    return { payload: this._buildCommandString('01', '2A') };
  }

  cameraSpeedDecrease() {
    return { payload: this._buildCommandString('01', '2B') };
  }

  cameraStop() {
    return { payload: this._buildCommandString('01', '2E') };
  }

  cameraGotoPreset(params) {
    const { presetNumber } = params;
    const hexPreset = presetNumber.toString(16).toUpperCase().padStart(2, '0');
    return { payload: this._buildCommandString('01', '2F', hexPreset) };
  }

  // --- Микрофоны ---
  turnOnUnit(params) {
    const { unitNumber } = params;
    const hexUnit = unitNumber.toString(16).toUpperCase().padStart(2, '0');
    return { payload: this._buildCommandString('01', '11', hexUnit) };
  }

  turnOffUnit(params) {
    const { unitNumber } = params;
    const hexUnit = unitNumber.toString(16).toUpperCase().padStart(2, '0');
    return { payload: this._buildCommandString('01', '12', hexUnit) };
  }

  turnOffAllUnits() {
    return { payload: this._buildCommandString('01', '13') };
  }

  // --- Статус ---
  getStatus() {
    return { payload: this._buildCommandString('01', '0F') };
  }

  // ========= ИНИЦИАЛИЗАЦИЯ =========
  initialize() {
    if (this.debug) {
      console.log('[EG7230Driver] Инициализация завершена. Драйвер готов к работе.');
    }
    // Можно запросить статус при подключении, если нужно
    // this.publishCommand('getStatus');
  }

  // ========= ОБРАБОТКА ОТВЕТА (если нужна кастомная логика) =========
  // В данном случае, все ответы обрабатываются через static.responses.
  // parseResponse можно не переопределять, если шаблонов достаточно.
  parseResponse(data) {
    // Если нужно добавить логику, не предусмотренную в responses, делайте это здесь.
    // Пока оставим как есть.
    return null;
  }
}

module.exports = EG7230Driver;
