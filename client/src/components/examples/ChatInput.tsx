import ChatInput from '../ChatInput';

export default function ChatInputExample() {
  return (
    <div>
      <ChatInput
        onSendMessage={(msg) => console.log('Send:', msg)}
      />
    </div>
  );
}
