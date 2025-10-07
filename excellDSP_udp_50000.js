const BaseDriver = require('base-driver');

class ExcellDSPDriver extends BaseDriver {
  static metadata = {
    name: 'Excell DSP',
    manufacturer: 'Excell',
    version: '1.2.1',
    description: 'Драйвер для управления DSP-процессором Excell через RS232 с поддержкой обратной связи'
  };

  static commands = {
    setInputVolume: {
      description: 'Установить уровень громкости на входе (в дБ)',
      parameters: [
        { name: 'channel', type: 'number', description: 'Номер входа (1–12)', required: true, min: 1, max: 12 },
        { name: 'dB', type: 'number', description: 'Уровень в дБ', required: true, min: -72, max: 12 }
      ]
    },
    setMatrix: {
      description: "Матричная коммутация",
      parameters:[
          {
            name: "input",
            type: "number",
            description: 'Номер входа (1–30)',
            required: true,
            min: 1,
            max: 30,
          },
          {
            name: "output",
            type: "number",
            description: 'Номер выхода (1–30)',
            required: true,
            min: 1,
            max: 30,
          },
          {
            name: "setPoint",
            type: "boolean",
            description: 'снять или установить коммутацию',
            required: true,
          }
        ]
    },
    callPreset: {
      description: "Вызов пресета",
      parameters:[
          {
            name: "preset",
            type: "number",
            description: 'Номер пресета (1–30)',
            required: true,
            min: 1,
            max: 30,
          }
        ]
    },
    setInputMute: {
      description: 'Включить/выключить Mute на входе',
      parameters: [
        { name: 'channel', type: 'number', description: 'Номер входа (1–12)', required: true, min: 1, max: 12 },
        { name: 'muted', type: 'boolean', description: 'true = выключить звук (mute ON)', required: true }
      ]
    },
    setOutputVolume: {
      description: 'Установить уровень громкости на выходе (в дБ)',
      parameters: [
        { name: 'channel', type: 'number', description: 'Номер выхода (1–12)', required: true, min: 1, max: 12 },
        { name: 'dB', type: 'number', description: 'Уровень в дБ', required: true, min: -72, max: 12 }
      ]
    },
    setOutputMute: {
      description: 'Включить/выключить Mute на выходе',
      parameters: [
        { name: 'channel', type: 'number', description: 'Номер выхода (1–12)', required: true, min: 1, max: 12 },
        { name: 'muted', type: 'boolean', description: 'true = выключить звук (mute ON)', required: true }
      ]
    }
  };

  // === ОБРАБОТЧИКИ ОТВЕТОВ (по гайду) ===
  static responses = {
    muteStatus: {
      description: 'Статус Mute',
    },
    volumeStatus: {
      description: 'Уровень громкости',
    }
  };

  _createCommand(group, subcmd, channelIndex, valueLow, valueHigh) {
    const cmd = Buffer.from([
      0xB3, 0x21, 0x00, 0x00,
      group, 0x01, subcmd, 0x00,
      channelIndex, 0x00, valueLow, valueHigh
    ]);
    let crc = 0;
    for (let i = 0; i < cmd.length; i++) if (i !== 2) crc += cmd[i];
    cmd[2] = crc & 0xFF;
    return cmd;
  }

  // === Команды ===
  setInputVolume({ channel, dB }) {
    const ch = Math.max(0, Math.min(11, channel - 1));
    const val = Math.round(Math.max(-72, Math.min(12, dB)) * 100);
    return { payload: this._createCommand(0x2B, 0x01, ch, val & 0xFF, (val >> 8) & 0xFF) };
  }

  setInputMute({ channel, muted }) {
    const ch = Math.max(0, Math.min(11, channel - 1));
    return { payload: this._createCommand(0x2B, 0x02, ch, muted ? 0x00 : 0x01, 0x00) };
  }

  setOutputVolume({ channel, dB }) {
    const ch = Math.max(0, Math.min(11, channel - 1));
    const val = Math.round(Math.max(-72, Math.min(12, dB)) * 100);
    return { payload: this._createCommand(0x27, 0x01, ch, val & 0xFF, (val >> 8) & 0xFF) };
  }

  setOutputMute({ channel, muted }) {
    const ch = Math.max(0, Math.min(11, channel - 1));
    return { payload: this._createCommand(0x27, 0x02, ch, muted ? 0x00 : 0x01, 0x00) };
  }
  callPreset({preset}){
    return {payload: Buffer.from([0xB3,0x13,0xC6 + (preset - 1),0x00,preset - 1,0x00])}
  }
  
  setMatrix({input, output, setPoint}){
    //const value = setPoint ? 0x01 : 0x00;
    return {payload: Buffer.from([0xB3,0x21,0x7B + output,0x00,0xA6,0x00,0x01,0x00,input - 1,output - 1,setPoint,0x00])};
  }

  // === Парсинг ответов через static responses ===
  parseResponse(data) {
    // data.data — это строка вида "[driver] b32106e02b01020003000100"
    const rawStr = data.data;
    //if (!rawStr || !rawStr.startsWith('[driver] ')) return null;

    const hexPart = rawStr;
    //if (hexPart.length !== 24) return null; // 12 байт = 24 hex символа
    let buf;
    try {
      buf = Buffer.from(hexPart, 'hex');
    } catch (e) {
      return null;
    }

    if (buf.length !== 12) return null;

    // Проверка: это ответ? (байт[3] === 0xE0)
    if (buf[3] !== 0xE0) return null;

    const group = buf[4];
    const subcmd = buf[6];
    const channelIndex = buf[8];

    // Определяем тип канала
    let channelType;
    if (group === 0x2B) {
      channelType = 'input';
    } else if (group === 0x27) {
      channelType = 'output';
    } else {
      return null; // неизвестная группа
    }

    const channel = channelIndex + 1; // 1-based

    if (subcmd === 0x02) {
      // === MUTE ===
      const muteByte = buf[10];
      const muted = (muteByte === 0x01); // 0x01 = ON, 0x00 = OFF (согласно ответам!)

      // Обновляем внутреннее состояние
      const statePath = `${channelType}s.${channel}.muted`;
      return {
        type: 'muteStatus',
        channelType,
        channel,
        muted
      };
    } else if (subcmd === 0x01) {
      // === VOLUME ===
      const volumeRaw = buf.readInt16LE(10); // signed int16, little-endian
      const volumeDB = volumeRaw / 100;

      // Обновляем внутреннее состояние
      const statePath = `${channelType}s.${channel}.volume`;
      return {
        type: 'volumeStatus',
        channelType,
        channel,
        volumeDB,
        rawValue: volumeRaw
      };
    }

    return null;
  }

  initialize() {
    if (this.debug) {
      console.log('[ExcellDSP] Драйвер инициализирован. Поддержка 12 входов/выходов.');
    }
  }
}

module.exports = ExcellDSPDriver;
