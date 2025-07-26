const socket = io('http://localhost:3000');

socket.on('message', data => {
  const item = document.createElement('li');
  item.textContent = data;
  document.getElementById('messages').appendChild(item);
  // keep scroll at bottom
  document.querySelector('.chat-box').scrollTop = document.querySelector('.chat-box').scrollHeight;
});

document.getElementById('sendBtn').onclick = () => {
  const input = document.getElementById('textInput');
  const msg = input.value.trim();
  if (msg) {
    socket.emit('message', msg);
    input.value = '';
  }
};

// also send on Enter
document.getElementById('textInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') document.getElementById('sendBtn').click();
});