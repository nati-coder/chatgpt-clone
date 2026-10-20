import { useState } from 'react';
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import styles from './ChatHeader.module.css';

export default function ChatHeader({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Generate initials from the user's username or email
  const getInitials = () => {
    if (!user) return 'U';
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span>ChatGPT</span>
        <ChevronDown size={16} />
      </div>

      <div className={styles.right}>
        <div className={styles.userContainer}>
          <button
            className={styles.avatarBtn}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title={user?.username || user?.email || 'User Menu'}
          >
            <div className={styles.avatar}>{getInitials()}</div>
          </button>

          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.userInfo}>
                <UserIcon size={16} />
                <span className={styles.username}>{user?.username || 'User'}</span>
              </div>
              <div className={styles.divider} />
              <button className={styles.logoutBtn} onClick={onLogout}>
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
