const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting MessHub Development Environment...\n');

// Start backend server
console.log('📦 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit for backend to start, then start frontend
setTimeout(() => {
  console.log('\n🌐 Starting frontend server...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Handle frontend process
  frontend.on('close', (code) => {
    console.log(`\n❌ Frontend server exited with code ${code}`);
    backend.kill();
    process.exit(code);
  });

  frontend.on('error', (err) => {
    console.error('❌ Frontend server error:', err);
    backend.kill();
    process.exit(1);
  });
}, 3000);

// Handle backend process
backend.on('close', (code) => {
  console.log(`\n❌ Backend server exited with code ${code}`);
  process.exit(code);
});

backend.on('error', (err) => {
  console.error('❌ Backend server error:', err);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit(0);
}); 