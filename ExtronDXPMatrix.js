const BaseDriver = require('base-driver');

class ExtronDXPMatrixDriver extends BaseDriver {
  static metadata = {
    name: 'Extron DXP Matrix',
    manufacturer: 'Extron',
    version: '1.0.0',
    description: 'Драйвер для Extron DXP серия (DVI/HDMI) – матричный коммутатор'
  };

  static commands = {
    // Verbose
    enableVerbose: { description: 'Включить подробный режим (w3cv)', parameters: [] },

    // Matrix tie
    setTie: {
      description: 'Установить связь вход-выход',
      parameters: [
        { name: 'input', type: 'number', required: true },
        { name: 'output', type: 'string', required: true, description: 'Номер выхода или "All"' },
        { name: 'type', type: 'string', required: true, enum: ['Audio/Video', 'Video', 'Audio'] }
      ]
    },
    refreshMatrix: { description: 'Обновить статусы связей', parameters: [] },

    // Mutes
    setVideoMute: {
      description: 'Вкл/выкл видео мьют на выходе',
      parameters: [ { name: 'output', type: 'number', required: true }, { name: 'value', type: 'string', enum: ['On','Off'], required: true } ]
    },
    getVideoMute: { description: 'Получить статус видео мьюта на выходе', parameters: [ { name: 'output', type: 'number', required: true } ] },
    setGlobalVideoMute: { description: 'Глобальный видео мьют', parameters: [ { name: 'value', type: 'string', enum: ['On','Off'], required: true } ] },
    setGlobalAudioMute: { description: 'Глобальный аудио мьют', parameters: [ { name: 'value', type: 'string', enum: ['On','Off'], required: true } ] },

    // HDCP input/output
    setHdcpInputAuthorization: { description: 'HDCP авторизация на входе', parameters: [ { name: 'input', type: 'number', required: true }, { name: 'value', type: 'string', enum: ['On','Off'], required: true } ] },
    getHdcpInputAuthorization: { description: 'Статус HDCP авторизации на входе', parameters: [ { name: 'input', type: 'number', required: true } ] },
    getHdcpInputStatus: { description: 'Статус HDCP на входе', parameters: [ { name: 'input', type: 'number', required: true } ] },
    getHdcpOutputStatus: { description: 'Статус HDCP на выходе', parameters: [ { name: 'output', type: 'number', required: true } ] },

    // EDID
    getEdidAssignment: { description: 'Получить назначение EDID входа', parameters: [ { name: 'input', type: 'number', required: true } ] },

    // Executive mode
    setExecutiveMode: { description: 'Установить Executive Mode', parameters: [ { name: 'mode', type: 'string', enum: ['Off','Mode 1','Mode 2'], required: true } ] },
    getExecutiveMode: { description: 'Получить Executive Mode', parameters: [] },

    // Presets
    recallPreset: { description: 'Вызвать пресет', parameters: [ { name: 'id', type: 'number', required: true } ] },
    savePreset: { description: 'Сохранить пресет', parameters: [ { name: 'id', type: 'number', required: true } ] },

    // Inputs/Temperature
    getInputSignalStatus: { description: 'Статусы наличия сигнала на входах', parameters: [] },
    getTemperature: { description: 'Температура устройства', parameters: [] }
  };

  static responses = {
    verboseAck: { matcher: { pattern: /Vrb3/i }, extract: () => ({ type: 'verbose', value: true }) },

    // Global mute/state echoes trigger refresh in original driver; we emit simple events
    globalMuteChanged: { matcher: { pattern: /(Vmt[01]|Amt[01])/i }, extract: m => ({ type: 'globalMuteChanged', raw: m[0] }) },

    // Audio/Video mute state per output
    videoMuteStatus: { matcher: { pattern: /Vmt(\d)\*(0|1)/i }, extract: m => ({ type: 'videoMute', output: parseInt(m[1],10), value: m[2] === '1' ? 'On' : 'Off' }) },
    audioVideoMutePacked: { matcher: { pattern: /Mut([0-3]+)/i }, extract: m => ({ type: 'mutePacked', raw: m[1] }) },

    // Input signal
    inputSignalStatus: { matcher: { pattern: /In\d\s(\d+)/i }, extract: m => ({ type: 'inputSignals', map: m[1] }) },

    // Temperature
    temperature: { matcher: { pattern: /Sts00\*(\d{1,2}\.\d{2})\s(\d{1,2}\.\d{2})\s(\-|\+)(\d{3}\.\d{2})\s(\d{5})\s([01])/ }, extract: m => ({ type: 'temperature', value: parseInt(parseFloat(`${m[3]}${m[4]}`), 10) }) },

    // EDID assignment
    edidAssignment: { matcher: { pattern: /EdidA(\d+)\*(\d+)/i }, extract: m => ({ type: 'edid', input: parseInt(m[1],10), code: m[2] }) },

    // HDCP
    hdcpInputAuth: { matcher: { pattern: /HdcpE(\d+)\*(0|1)/i }, extract: m => ({ type: 'hdcpInputAuth', input: parseInt(m[1],10), value: m[2] === '1' ? 'On' : 'Off' }) },
    hdcpInputStatus: { matcher: { pattern: /HdcpI(\d+)\*(0|1|2)/i }, extract: m => ({ type: 'hdcpInputStatus', input: parseInt(m[1],10), value: { '0':'No Source Connected','1':'HDCP Content','2':'No HDCP Content' }[m[2]] }) },
    hdcpOutputStatus: { matcher: { pattern: /HdcpO(\d+)\*(0|1|2|3)/i }, extract: m => ({ type: 'hdcpOutputStatus', output: parseInt(m[1],10), value: { '0':'No monitor connected','1':'Monitor connected, HDCP not supported','2':'Monitor connected, not encrypted','3':'Monitor connected, currently encrypted' }[m[2]] }) },

    // Matrix status dumps
    allMatrixTieVideo: { matcher: { pattern: /Vcu(\d{2})\s([0-9 -]*)Vid/i }, extract: m => ({ type: 'matrixDump', outputStart: parseInt(m[1],10), payload: m[2], tieType: 'Video' }) },
    allMatrixTieAudio: { matcher: { pattern: /Vcu(\d{2})\s([0-9 -]*)Aud/i }, extract: m => ({ type: 'matrixDump', outputStart: parseInt(m[1],10), payload: m[2], tieType: 'Audio' }) },
    outputTieStatus: { matcher: { pattern: /(?:Out(\d+) In(\d+) (All|Vid|Aud|RGB))|(?:In(\d+) (All|Vid|Aud|RGB))/ }, extract: m => ({ type: 'outputTieStatus', groups: m.slice(1) }) },

    // Errors
    error: { matcher: { pattern: /E(\d{2})/ }, extract: m => ({ type: 'error', code: m[1] }) }
  };

  initialize() {
    this.publishCommand('enableVerbose');
    this.publishCommand('refreshMatrix');
    this.publishCommand('getInputSignalStatus');
    this.publishCommand('getTemperature');
  }

  // Verbose
  enableVerbose() {
    return { payload: 'w3cv\r\n' };
  }

  // Matrix tie
  setTie(params) {
    const { input, output, type } = params;
    const map = { 'Audio/Video': '!', 'Video': '%', 'Audio': '$' };
    if (String(output).toLowerCase() === 'all') {
      return { payload: `${input}*${map[type]}\r\n` };
    }
    return { payload: `${input}*${parseInt(output,10)}${map[type]}\r\n` };
  }
  refreshMatrix() {
    // Комбинированный запрос как в модуле: w0*1*1VC и w0*1*2VC
    return { payload: 'w0*1*1VC\r\nw0*1*2VC\r\n' };
  }

  // Mutes
  setVideoMute(params) {
    const { output, value } = params;
    const map = { Off: '0', On: '1' };
    return { payload: `${output}*${map[value]}B\r\n` };
  }
  getVideoMute(params) {
    const { output } = params;
    return { payload: `${output}B\r\n` };
  }
  setGlobalVideoMute(params) {
    const { value } = params; // Off/On
    const map = { Off: '0*B', On: '1*B' };
    return { payload: `${map[value]}\r\n` };
  }
  setGlobalAudioMute(params) {
    const { value } = params; // Off/On
    const map = { Off: '0*Z', On: '1*Z' };
    return { payload: `${map[value]}\r\n` };
  }

  // HDCP
  setHdcpInputAuthorization(params) {
    const { input, value } = params;
    const map = { On: '1', Off: '0' };
    return { payload: `wE${input}*${map[value]}HDCP\r\n` };
  }
  getHdcpInputAuthorization(params) {
    const { input } = params;
    return { payload: `wE${input}HDCP\r\n` };
  }
  getHdcpInputStatus(params) {
    const { input } = params;
    return { payload: `wI${input}HDCP\r\n` };
  }
  getHdcpOutputStatus(params) {
    const { output } = params;
    return { payload: `wO${output}HDCP\r\n` };
  }

  // EDID
  getEdidAssignment(params) {
    const { input } = params;
    return { payload: `wA${input}EDID\r\n` };
  }

  // Executive
  setExecutiveMode(params) {
    const { mode } = params; // Off | Mode 1 | Mode 2
    const map = { 'Off': '0', 'Mode 1': '1', 'Mode 2': '2' };
    return { payload: `${map[mode]}X\r\n` };
  }
  getExecutiveMode() {
    return { payload: 'X\r\n' };
  }

  // Presets
  recallPreset(params) {
    const { id } = params;
    return { payload: `${id}.\r\n` };
  }
  savePreset(params) {
    const { id } = params;
    return { payload: `${id},\r\n` };
  }

  // Inputs/Temperature
  getInputSignalStatus() {
    return { payload: '0LS\r\n' };
  }
  getTemperature() {
    return { payload: 'S\r\n' };
  }

  parseResponse(data) {
    try {
      let raw = data && data.payload !== undefined ? data.payload : data;
      if (Buffer.isBuffer(raw)) raw = raw.toString();
      if (typeof raw !== 'string') raw = String(raw ?? '');

      const results = [];
      const defs = this.constructor.responses || {};

      const tryMatch = (text) => {
        for (const [name, def] of Object.entries(defs)) {
          if (!def || !def.matcher || !def.matcher.pattern) continue;
          const pattern = def.matcher.pattern;
          const rx = new RegExp(pattern.source, pattern.flags);
          const match = text.match(rx);
          if (match) {
            const payload = def.extract ? def.extract(match) : { type: name, raw: match[0] };
            results.push(payload);
          }
        }
      };

      // full buffer and per line
      tryMatch(raw);
      raw.split(/\r?\n/).filter(Boolean).forEach(tryMatch);

      if (results.length === 0) return null;
      if (results.length === 1) return results[0];
      return results;
    } catch (e) {
      return { type: 'error', message: e.message, raw: data };
    }
  }
}

module.exports = ExtronDXPMatrixDriver;


