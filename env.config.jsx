import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import React from 'react';

const config = {
  pluginSlots: {
    'org.openedx.frontend.layout.footer.v1': {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Hide,
          widgetId: 'default_contents',
        },
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'custom_pharmacy_footer',
            type: DIRECT_PLUGIN,
            RenderWidget: () => (
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
                    src="/static/images/logo.png"
                    alt="ProfilUp logo"
                    style={{ height: '40px', width: 'auto' }}
                  />
                  <span style={{ color: '#6c757d', fontSize: '12px' }}>
                    Зарегистрированный товарный знак ®{new Date().getFullYear()}
                  </span>
                </div>

                <div></div>
              </footer>
            ),
          },
        },
      ]
    }
  },
}

export default config;