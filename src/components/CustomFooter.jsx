import React, { useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { Hyperlink } from '@openedx/paragon';

const CustomFooter = () => {
  const { config } = useContext(AppContext);

  return (
    <footer style={{
      padding: '16px 48px',
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #dee2e6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      minHeight: '80px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
        <img
          src={config.LMS_BASE_URL + "/static/images/logo.png"}
          alt="ProfilUp logo"
          style={{ height: '40px', width: 'auto' }}
        />
        <span style={{ color: '#6c757d', fontSize: '12px' }}>
          Зарегистрированный товарный знак ®{new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};

export default CustomFooter;