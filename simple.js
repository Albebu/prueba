// Parsear argumentos de línea de comandos
// Uso: node simple.js --action 1 --remote-working 1
const args = process.argv.slice(2);
const getArg = (name) => {
  // Formato: --arg=value o --arg value
  const equalIdx = args.findIndex((a) => a.startsWith(`--${name}=`));
  if (equalIdx !== -1) {
    return args[equalIdx].split('=')[1];
  }
  // Formato: --arg value (siguiente argumento)
  const idx = args.findIndex((a) => a === `--${name}`);
  if (idx !== -1 && args[idx + 1]) {
    return args[idx + 1];
  }
  return null;
};

const action = parseInt(getArg('action') || '1');
const remoteWorking = parseInt(getArg('remote-working') || '0');

console.log(
  `[${new Date().toISOString()}] Ejecutando: action=${action}, remote_working=${remoteWorking}`
);

async function main() {
  const params = new URLSearchParams({
    code: 141,
    action: action, // 0 = salida, 1 = entrada
    organization_id: 'c5d20d35ed436c1ad2c0ffe2bb1025e0e41fc192',
    lang: 'es_ES',
    comments: '',
    geo_latitude: '',
    geo_longitude: '',
    timezone_offset: -60,
    work_centers_id: 2536,
    remote_working: remoteWorking, // 0 = No teletrabajo, 1 = Sí teletrabajo
  });

  const response = await fetch(
    'https://registraentrada.com/registraentrada_worker_log/new-worker-log',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: 'vsession=da8poigk6tjat19bf7jhts8jjk',
      },
      credentials: 'include',
      body: params,
    }
  );

  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
    if (data.result === '0') {
      console.log(`[${new Date().toISOString()}] ✅ ÉXITO: ${data.message}`);
    } else {
      console.log(
        `[${new Date().toISOString()}] ❌ ERROR (result=${data.result}): ${data.message}`
      );
    }
  } else {
    data = await response.text();
    console.log(
      `[${new Date().toISOString()}] ❌ ERROR - Response es HTML (login expirado o parámetros incorrectos)`
    );
  }
}

main().catch((err) => {
  console.error(`[${new Date().toISOString()}] ❌ ERROR CRÍTICO:`, err.message);
  process.exit(1);
});

async function joderARecursosHumanos() {}
