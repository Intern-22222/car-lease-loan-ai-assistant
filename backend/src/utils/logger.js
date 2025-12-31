const formatTime = ()=>new Date().toISOString();

exports.info = (msg) => console.log(`ℹ️ [INFO] ${formatTime()} — ${msg}`);

exports.warn = (msg) => console.warn(`⚠️ [WARN] ${formatTime()} — ${msg}`);

exports.error = (msg) => console.error(`❌ [ERROR] ${formatTime()} — ${msg}`);

