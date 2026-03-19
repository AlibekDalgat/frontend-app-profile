import React, { useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { Hyperlink } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';

const CustomFooter = () => {
  const { config } = useContext(AppContext);
  const mfeConfig = getConfig();

  const logoSrc = mfeConfig.WIDGET_MODE && mfeConfig.WIDGET_LOGO_URL
    ? mfeConfig.WIDGET_LOGO_URL
    : `${config.LMS_BASE_URL}/static/images/logo.png`;

  const logoAlt = `${mfeConfig.SITE_NAME} logo`

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
          src={logoSrc}
          alt={logoAlt}
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