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
    description: 'Драйвер для матричных HDMI-коммутаторов Aten VM0404HB / VM0808HB TCP port 23'
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
    },
    routeStatus: {
      description: 'Строка состояния выхода',
      matcher: { pattern: /^o(\d+)\s+i(\d+)/i },
      extract: function(match) {
        return {
          type: 'routeStatus',
          output: parseInt(match[1], 10),
          input: parseInt(match[2], 10)
        };
      }
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
   * Кастомный парсер ответов. Обрабатывает:
   *  - строку "Command OK" → объект { type: 'command', status: 'ok' }
   *  - строки вида "o01 i02 …" → публикует через publishResponse
   */
  parseResponse(raw) {
    const str = typeof raw === 'string' ? raw : (raw && raw.data) ? raw.data : '';
    if (!str) return null;

    const lines = str.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    let cmdOkEmitted = false;
    lines.forEach(line => {
      // 1) Command OK
      if (/^Command\s+OK/i.test(line)) {
        this.publishResponse({ type: 'command', status: 'ok' }, { raw: line });
        cmdOkEmitted = true;
        return;
      }

      // 2) Ошибка команды (оставляем старый статический matcher на всякий случай)

      // 3) Строки маршрутизации oNN iMM ...
      const m = line.match(/^o(\d+)\s+i(\d+)/i);
      if (m) {
        const output = parseInt(m[1], 10);
        const input = parseInt(m[2], 10);
        this.publishResponse({ type: 'routeStatus', output, input }, { raw: line });
        return;
      }
    });

    // Если всё обработано publishResponse, возвращаем null
    return null;
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
