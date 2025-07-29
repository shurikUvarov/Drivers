const BaseDriver = require('base-driver');

/**
 * Драйвер для гибридной матрицы HMX2-E
 */
class HMX2EDriver extends BaseDriver {
  
  // Метаданные
  static metadata = {
    name: 'HMX2-E',
    manufacturer: 'Beijing Xiaoniao Technology',
    version: '1.0.0',
    description: 'Драйвер для гибридной матрицы HMX2-E (UDP протокол, порт 5000)'
  };

  // Команды
  static commands = {
    switchVideo: {
      description: 'Переключение видео входа на выход',
      parameters: [
        { name: 'input', type: 'number', required: true },
        { name: 'output', type: 'number', required: true }
      ]
    },
    switchAudio: {
      description: 'Переключение аудио входа на выход',
      parameters: [
        { name: 'input', type: 'number', required: true },
        { name: 'output', type: 'number', required: true }
      ]
    },
    switchAV: {
      description: 'Переключение аудио+видео',
      parameters: [
        { name: 'input', type: 'number', required: true },
        { name: 'output', type: 'number', required: true }
      ]
    },
    switchAllVideo: {
      description: 'Вход на все выходы (только видео)',
      parameters: [{ name: 'input', type: 'number', required: true }]
    },
    switchAllAV: {
      description: 'Вход на все выходы (аудио+видео)',
      parameters: [{ name: 'input', type: 'number', required: true }]
    },
    queryStatus: {
      description: 'Запрос статуса конкретного выхода',
      parameters: [{ name: 'output', type: 'number', required: true }]
    },
    queryDeviceInfo: {
      description: 'Запрос информации об устройстве',
      parameters: []
    },
    saveScene: {
      description: 'Сохранение сцены',
      parameters: [{ name: 'scene', type: 'number', min: 1, max: 50, required: true }]
    },
    recallScene: {
      description: 'Вызов сцены',
      parameters: [{ name: 'scene', type: 'number', min: 1, max: 50, required: true }]
    }
  };

  // Обработчики ответов
  static responses = {
    ok: {
      description: 'Успешное выполнение',
      matcher: { pattern: /\(OK,(\d+),D,([A-Z])\)/ },
      extract: match => ({
        type: 'ok',
        addr: parseInt(match[1], 10),
        code: match[2]
      })
    },
    error: {
      description: 'Ошибка выполнения',
      matcher: { pattern: /\(Err,(\d+),D,([A-Z])\)/ },
      extract: match => ({
        type: 'error',
        addr: parseInt(match[1], 10),
        code: match[2]
      })
    },
    status: {
      description: 'Статус выхода',
      matcher: { pattern: /\((\d+),V,(\d+),D,O\)/ },
      extract: match => ({
        type: 'status',
        input: parseInt(match[1], 10),
        addr: parseInt(match[2], 10)
      })
    },
    deviceInfo: {
      description: 'Информация об устройстве',
      matcher: { pattern: /\(System type: (.+?)\s+Compile: (.+?)\s+Software version:(.+?)\s+Hardware version:(.+?)\s+Equipment address: (\d+)/ },
      extract: match => ({
        type: 'deviceInfo',
        system: match[1],
        compileDate: match[2],
        swVersion: match[3],
        hwVersion: match[4],
        address: parseInt(match[5], 10)
      })
    }
  };

  // Команды
  switchVideo({ input, output, address = 1 }) {
    return { payload: `(${input},${output},${address},D,V)` };
  }

  switchAudio({ input, output, address = 1 }) {
    return { payload: `(${input},${output},${address},D,A)` };
  }

  switchAV({ input, output, address = 1 }) {
    return { payload: `(${input},${output},${address},D,B)` };
  }

  switchAllVideo({ input, address = 1 }) {
    return { payload: `(${input},${address},D,V)` };
  }

  switchAllAV({ input, address = 1 }) {
    return { payload: `(${input},${address},D,B)` };
  }

  queryStatus({ output, address = 1 }) {
    return { payload: `(${output},${address},D,O)` };
  }

  queryDeviceInfo({ address = 1 }) {
    return { payload: `(${address},D,Q)` };
  }

  saveScene({ scene, address = 1 }) {
    return { payload: `(${scene},${address},D,S)` };
  }

  recallScene({ scene, address = 1 }) {
    return { payload: `(${scene},${address},D,R)` };
  }

  // Инициализация
  initialize() {
    // Запрашиваем информацию об устройстве при старте
    this.publishCommand('queryDeviceInfo');
  }
}

module.exports = HMX2EDriver;
