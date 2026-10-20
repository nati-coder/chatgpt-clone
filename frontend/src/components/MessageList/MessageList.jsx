import { Bot } from 'lucide-react';
import ChatMessage from '../ChatMessage/ChatMessage';
import styles from './MessageList.module.css';

export default function MessageList({
  messages = [],
  isLoading,
  messagesEndRef,
}) {
  return (
    <div className={styles.messages}>
      {messages.length === 0 ? (
        <div className={styles.empty}>What are you working on?</div>
      ) : (
        messages.map((msg, index) => (
          <div key={msg.id || index} className={styles.messageItemContainer}>
            <ChatMessage
              role={msg.sender}
              content={msg.text}
            />

          </div>
        ))
      )}

      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingAvatar}>
            <Bot size={18} color='white' />
          </div>
          <div className={styles.loading}>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}