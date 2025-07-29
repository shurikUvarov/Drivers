const BaseDriver = require('base-driver');

/**
 * Драйвер для матричного коммутатора Aten (серия VM0404HB / VM0808HB)
 * Управление через Telnet / RS-232 согласно командам «sw …»
 */
class AtenMatrixDriver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'AtenMatrix',
    manufacturer: 'ATEN',
    version: '1.0.0',
    description: 'Драйвер для матричных HDMI-коммутаторов Aten VM0404HB / VM0808HB'
  };

  // Список команд
  static commands = {
    setRoute: {
      description: 'Маршрутизация входа на выход',
      parameters: [
        { name: 'input', type: 'number', required: true, min: 1 },
        { name: 'output', type: 'number', required: true, min: 1 }
      ]
    },
    nextInput: {
      description: 'Переключить выход на следующий вход',
      parameters: [
        { name: 'output', type: 'number', required: true, min: 1 }
      ]
    },
    turnOffOutput: {
      description: 'Выключить видео на выходе',
      parameters: [
        { name: 'output', type: 'number', required: true, min: 1 }
      ]
    }
  };

  // Обработчики ответов
  static responses = {
    commandOk: {
      description: 'Команда выполнена успешно',
      matcher: { pattern: /Command\s+OK/i },
      extract: () => ({ type: 'command', status: 'ok' })
    },
    commandError: {
      description: 'Команда отклонена устройством',
      matcher: { pattern: /Command\s+incorrect/i },
      extract: () => ({ type: 'command', status: 'error' })
    }
  };

  // ───────────────────────── Методы команд ──────────────────────────
  /**
   * Маршрутизация входа на выход (sw iNN oMM)\r
   */
  setRoute({ input, output }) {
    const cmd = `sw i${this._pad2(input)} o${this._pad2(output)}`;
    return { payload: `${cmd}\r` };
  }

  /**
   * Переключить выход на следующий вход (sw oNN +)\r
   */
  nextInput({ output }) {
    const cmd = `sw o${this._pad2(output)} +`;
    return { payload: `${cmd}\r` };
  }

  /**
   * Отключить видео на выходе (sw oNN off)\r
   */
  turnOffOutput({ output }) {
    const cmd = `sw o${this._pad2(output)} off`;
    return { payload: `${cmd}\r` };
  }

  /**
   * Вспомогательный метод – дополняем число до 2-х символов нолями
   */
  _pad2(num) {
    return String(num).padStart(2, '0');
  }

  initialize() {
    if (this.debug) {
      console.log('AtenMatrixDriver инициализирован');
    }
  }
}

module.exports = AtenMatrixDriver; 
