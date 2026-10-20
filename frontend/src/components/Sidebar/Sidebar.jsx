import { useState } from 'react';
import {
  MessageSquare,
  Search,
  Image as ImageIcon,
  LayoutGrid,
  Microscope,
  Code2,
  FolderKanban,
  Plus,
  PanelLeftClose,
  LogOut,
  User as UserIcon,
  Trash2,
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar({
  chats = [],
  currentChatId,
  onSelectChat,
  onNewChat,
  onLogout,
  user,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Filter chat threads based on search term
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className={styles.sidebar}>
      {/* Top action bar */}
      <div className={styles.header}>
        <button className={styles.iconBtn} title="Collapse sidebar">
          <PanelLeftClose size={20} />
        </button>
        <button
          className={styles.newChatHeaderBtn}
          onClick={onNewChat}
          title="New Chat"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Main navigation list */}
      <nav className={styles.nav}>
        <button className={styles.item} onClick={onNewChat}>
          <Plus size={18} />
          <span>New chat</span>
        </button>
        <a href='#' className={styles.item}>
          <Search size={18} />
          <span>Search chats</span>
        </a>
        <a href='#' className={styles.item}>
          <ImageIcon size={18} />
          <span>Images</span>
        </a>
        <a href='#' className={styles.item}>
          <LayoutGrid size={18} />
          <span>Apps</span>
        </a>
        <a href='#' className={styles.item}>
          <Microscope size={18} />
          <span>Deep research</span>
        </a>
        <a href='#' className={styles.item}>
          <Code2 size={18} />
          <span>Codex</span>
        </a>
        <a href='#' className={styles.item}>
          <FolderKanban size={18} />
          <span>Projects</span>
        </a>

        <button
          className={styles.item}
          onClick={() => setShowSearchInput(!showSearchInput)}
        >
          <Search size={18} />
          <span>Search chats</span>
        </button>

        {/* Search input field (toggles on click) */}
        {showSearchInput && (
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>
        )}
      </nav>

      {/* Dynamic database chat history list */}
      <div className={styles.historySection}>
        <div className={styles.sectionTitle}>Your Chats</div>
        <div className={styles.chatList}>
          {filteredChats.length === 0 ? (
            <div className={styles.emptyState}>No conversations found</div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`${styles.chatItem} ${chat.id === currentChatId ? styles.active : ''
                  }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare size={16} />
                <span className={styles.chatTitle}>{chat.title}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom User profile / Logout section */}
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user?.username ? user.username[0].toUpperCase() : 'U'}
          </div>
          <span className={styles.username}>
            {user?.username || user?.email || 'User'}
          </span>
        </div>
        <button
          className={styles.logoutBtn}
          onClick={onLogout}
          title="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}