const BaseDriver = require('base-driver');

/**
 * Драйвер для 4-портового RS-422/485 селектора
 * Команды в протоколе (заканчиваются CRLF):
 *   sw              → следующий порт
 *   sw p0x          → конкретный порт (x = 1-4)
 *   usb p0x         → статус порта
 *   info            → текущий активный порт
 */
class PortSelectorDriver extends BaseDriver {
    /* ========== МЕТАДАННЫЕ ========== */
    static metadata = {
        name:         'PortSelector-4',
        manufacturer: 'Aten-US3344I',
        version:      '1.0.0',
        description:  'Драйвер селектора RS-422/485 на 4 порта',
    };

    /* ========== КОМАНДЫ ========== */
    static commands = {
        /** Переключить на следующий порт по кругу */
        nextPort: {
            description: 'Переключить на следующий порт',
            parameters: [],
        },

        /** Переключить на указанный порт (1-4) */
        setPort: {
            description: 'Активировать конкретный порт',
            parameters: [{
                name:        'port',
                type:        'number',
                description: 'Номер порта (1-4)',
                required:    true,
                min: 1,
                max: 4,
            }],
        },

        /** Узнать состояние выбранного порта */
        getPortStatus: {
            description: 'Статус указанного порта',
            parameters: [{
                name:        'port',
                type:        'number',
                description: 'Номер порта (1-4)',
                required:    true,
                min: 1,
                max: 4,
            }],
        },

        /** Запрос общей информации (текущий активный порт) */
        getInfo: {
            description: 'Запрос текущего активного порта',
            parameters: [],
        },
    };

    /* ========== ПАТТЕРНЫ ОТВЕТОВ ========== */
    static responses = {
        /** Подтверждение «Command OK» */
        ok: {
            description: 'Команда принята',
            matcher: { pattern: /^Command OK$/i },
            extract: () => ({ ok: true }),
        },

        /** Ошибка «Command Incorrect» */
        error: {
            description: 'Команда отклонена',
            matcher: { pattern: /^Command Incorrect$/i },
            extract: () => ({ ok: false }),
        },

        /** Ответ от usb p0x: «p02 ACTIVE» или «p03 INACTIVE» */
        portStatus: {
            description: 'Статус указанного порта',
            matcher: { pattern: /^p0([1-4])\s+(ACTIVE|INACTIVE)$/i },
            extract: ([, p, st]) => ({
                port:   Number(p),
                active: st.toUpperCase() === 'ACTIVE' ? 1 : 0, // 1/0
            }),
        },

        /** Ответ info: «CURRENT p01» */
        currentPort: {
            description: 'Текущий активный порт',
            matcher: { pattern: /^CURRENT\s+p0([1-4])$/i },
            extract: ([, p]) => ({ currentPort: Number(p) }),
        },
    };

    /* ========== КОНСТРУКТОР ========== */
    constructor(options = {}) {
        super(options);
        this.currentPort = 1;     // по умолчанию порт 1
    }

    /* ========== ИНИЦИАЛИЗАЦИЯ ========== */
    initialize() {
        console.log('Инициализация RS-422/485 селектора');
        this.getInfo();           // сразу узнаём активный порт
    }

    /* ========== РЕАЛИЗАЦИЯ КОМАНД ========== */
    nextPort() {
        // Команда без параметров
        return { payload: 'sw\r\n' };
    }

    setPort({ port }) {
        const p = Math.max(1, Math.min(4, port));
        this.currentPort = p;
        return { payload: `sw p0${p}\r\n` };
    }

    getPortStatus({ port }) {
        const p = Math.max(1, Math.min(4, port));
        return { payload: `usb p0${p}\r\n` };
    }

    getInfo() {
        return { payload: 'info\r\n' };
    }

    /* ========== ОБЩИЙ ПАРСЕР ========== */
    parseResponse(data) {
        // Проверяем OK / Incorrect
        if (/^Command OK$/i.test(data)) return { type: 'ok' };
        if (/^Command Incorrect$/i.test(data)) return { type: 'error' };

        // «p02 ACTIVE»
        const usb = data.match(/^p0([1-4])\s+(ACTIVE|INACTIVE)$/i);
        if (usb) {
            return {
                type:  'portStatus',
                port:  Number(usb[1]),
                state: usb[2].toUpperCase() === 'ACTIVE' ? 1 : 0,
            };
        }

        // «CURRENT p03»
        const cur = data.match(/^CURRENT\s+p0([1-4])$/i);
        if (cur) {
            this.currentPort = Number(cur[1]);
            return { type: 'current', currentPort: this.currentPort };
        }

        return null; // неизвестный формат
    }
}

module.exports = PortSelectorDriver;
