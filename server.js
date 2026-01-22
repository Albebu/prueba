import cron from 'node-cron';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🚀 Servidor de marcajes iniciado...');
console.log('⏰ Horarios configurados:');
console.log('   07:03 - Entrada (Teletrabajo SÍ)');
console.log('   12:58 - Salida');
console.log('   13:28 - Entrada (Teletrabajo NO)');
console.log('   15:33 - Salida');
console.log('');

// Función para ejecutar el script de marcaje
async function ejecutarMarcaje(action, remoteWorking, descripcion) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ⏱️  ${descripcion}`);
  console.log(`[${timestamp}] 📋 Parámetros: action=${action}, remote_working=${remoteWorking}`);

  try {
    const { stdout, stderr } = await execAsync(
      `node simple.js --action ${action} --remote-working ${remoteWorking}`,
      { cwd: '/Users/alex/Work/vunkers' }
    );

    if (stdout) console.log(`[${timestamp}] ${stdout}`);
    if (stderr) console.log(`[${timestamp}] ⚠️  ${stderr}`);

    console.log(`[${timestamp}] ✅ ${descripcion} completado`);
  } catch (error) {
    console.error(`[${timestamp}] ❌ ERROR al ejecutar ${descripcion}:`, error.message);
  }
}

// 07:03 - Entrada (Teletrabajo SÍ)
cron.schedule('3 7 * * *', async () => {
  await ejecutarMarcaje(1, 1, 'Entrada - Teletrabajo SÍ');
}, { timezone: 'Europe/Madrid' });

// 12:58 - Salida
cron.schedule('58 12 * * *', async () => {
  await ejecutarMarcaje(0, 0, 'Salida');
}, { timezone: 'Europe/Madrid' });

// 13:28 - Entrada (Teletrabajo NO)
cron.schedule('28 13 * * *', async () => {
  await ejecutarMarcaje(1, 0, 'Entrada - Teletrabajo NO');
}, { timezone: 'Europe/Madrid' });

// 15:33 - Salida
cron.schedule('33 15 * * *', async () => {
  await ejecutarMarcaje(0, 0, 'Salida');
}, { timezone: 'Europe/Madrid' });

console.log('✅ Todas las tareas programadas correctamente');
console.log('📝 Presiona Ctrl+C para detener el servidor\n');

// Mantener el servidor corriendo
// (no es necesario llamar a process.stdin.resume() en Node.js moderno)
