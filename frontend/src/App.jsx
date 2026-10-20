import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Auth from './components/Auth/Auth';
import Sidebar from './components/Sidebar/Sidebar';
import ChatHeader from './components/ChatHeader/ChatHeader';
import MessageList from './components/MessageList/MessageList';
import ChatInput from './components/ChatInput/ChatInput';
import './App.css';

const API_BASE_URL = 'https://gptapi.natnial.com/api';

function App() {
  // 1. Auth & Session States
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // 2. Chat & Message States
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Setup Axios auth headers helper
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` }
  });

  // Load chat list when user logs in or token refreshes
  useEffect(() => {
    if (token) {
      fetchChats();
    }
  }, [token]);

  // Load messages when current selected chat changes
  useEffect(() => {
    if (token && currentChatId) {
      fetchMessages(currentChatId);
    }
  }, [currentChatId]);

  // Scroll to bottom on message update
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auth Handlers
  const handleLoginSuccess = (authToken, userData) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setChats([]);
    setMessages([]);
    setCurrentChatId(null);
  };

  // API Call: Get all user chat sessions
  const fetchChats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chats`, getAuthHeaders());
      const chatData = response.data;
      setChats(chatData);

      // Auto-select the most recent chat if none is selected
      if (chatData.length > 0 && !currentChatId) {
        setCurrentChatId(chatData[0].id);
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    }
  };

  // API Call: Create a new chat session
  const handleCreateChat = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/chats`,
        { title: `Chat ${chats.length + 1}` },
        getAuthHeaders()
      );
      const newChat = response.data;
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setMessages([]);
    } catch (error) {
      console.error('Error creating chat session:', error);
    }
  };

  // API Call: Get messages for selected chat session
  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/chats/${chatId}/messages`,
        getAuthHeaders()
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // API Call: Send prompt message to Gemini backend
  const handleSendMessage = async (promptText) => {
    if (!promptText.trim() || !currentChatId || isLoading) return;

    // Optimistically push user prompt to UI
    const tempUserMessage = {
      id: Date.now(),
      sender: 'user',
      text: promptText,
    };

    setMessages(prev => [...prev, tempUserMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/chats/${currentChatId}/messages`,
        { message: promptText },
        getAuthHeaders()
      );

      const { botMessage } = response.data;

      // Replace state with server output
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending prompt:', error);
      const errorMessage =
        error.response?.data?.error ||
        'There was an error generating a response.';

      const errorBotMessage = {
        id: Date.now() + 1,
        sender: 'model',
        text: errorMessage,
        total_tokens: 0
      };

      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render Auth screen if unauthenticated
  if (!token) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={handleCreateChat}
        onLogout={handleLogout}
        user={user}
      />

      <main className="chat">
        <ChatHeader user={user} currentChatId={currentChatId} />

        <MessageList
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!currentChatId}
        />
      </main>
    </div>
  );
}

export default App;