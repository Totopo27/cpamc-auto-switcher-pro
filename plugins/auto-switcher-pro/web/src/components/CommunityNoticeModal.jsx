import React, { useState } from 'react';
import './CommunityNoticeModal.css';

export const STORAGE_KEY_SUPPORTER = 'asp_is_supporter';
export const STORAGE_KEY_DISMISSED = 'asp_notice_dismissed_until';
export const STORAGE_KEY_TELEMETRY_ONCE_SHOWN = 'asp_telemetry_once_shown';
export const STORAGE_KEY_TELEMETRY_ENABLED = 'telemetry_enabled';

export const PAYPAL_DONATE_URL = 'https://www.paypal.com/donate/?hosted_button_id=WD6GVECN9GTJA';
export const BINANCE_USER_ID = 'User-22f7a';

const SAMPLE_TELEMETRY_PAYLOAD = {
  version: '0.1.1',
  timestamp: 1730070000,
  event: 'preventive_rotation',
  reason: 'fatigue_threshold_exceeded',
  anonymous_account_hash: 'agy_***b4f',
  metrics: {
    rpm_used_ratio: 0.85,
    rpd_used_ratio: 0.42,
    cooldown_seconds: 900,
  },
  privacy_guarantee: 'zero_prompts_zero_code_zero_credentials',
};

export default function CommunityNoticeModal({
  isOpen,
  onClose,
  initialTelemetryEnabled = true,
  onTelemetryChange,
}) {
  const [activeTab, setActiveTab] = useState('paypal'); // 'paypal' | 'binance'
  const [copied, setCopied] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);
  const [supporterFeedback, setSupporterFeedback] = useState(false);
  const [showPayload, setShowPayload] = useState(false);

  // Estado de telemetría (controlado localmente con persistencia)
  const [telemetryActive, setTelemetryActive] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(STORAGE_KEY_TELEMETRY_ENABLED) !== 'false';
      }
    } catch {}
    return initialTelemetryEnabled;
  });

  // Saber si es la primera vez que se informa de la telemetría (2 columnas)
  const [isFirstTelemetryInfo] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(STORAGE_KEY_TELEMETRY_ONCE_SHOWN) !== 'true';
      }
    } catch {}
    return true;
  });

  if (!isOpen) return null;

  const handleCopy = (text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleRegisterSupporter = () => {
    try {
      localStorage.setItem(STORAGE_KEY_SUPPORTER, 'true');
      // Marcar también que ya vio la telemetría
      localStorage.setItem(STORAGE_KEY_TELEMETRY_ONCE_SHOWN, 'true');
    } catch {}
    setSupporterFeedback(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const handleToggleTelemetry = (e) => {
    const val = e.target.checked;
    setTelemetryActive(val);
    try {
      localStorage.setItem(STORAGE_KEY_TELEMETRY_ENABLED, String(val));
    } catch {}
    if (onTelemetryChange) {
      onTelemetryChange(val);
    }
  };

  const handleFreeActionClose = () => {
    try {
      // 1. Marcar que la columna de telemetría ya fue informada 1 vez
      localStorage.setItem(STORAGE_KEY_TELEMETRY_ONCE_SHOWN, 'true');

      // 2. Si marcó no volver a mostrar hoy, silenciar por 24 horas
      if (dontShowToday) {
        const nextDay = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY_DISMISSED, String(nextDay));
      }
    } catch {}
    onClose();
  };

  return (
    <div
      className="community-notice-backdrop"
      data-testid="community-notice-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="community-notice-card">
        {/* Botón cerrar X */}
        <button
          type="button"
          className="btn-notice-close"
          onClick={handleFreeActionClose}
          aria-label="Cerrar comunicado"
          data-testid="btn-notice-close"
        >
          ×
        </button>

        {/* Badge superior: COMUNICADO ESPECIAL */}
        <div className="notice-pill-badge" data-testid="notice-pill-badge">
          <span className="pill-dot"></span>
          COMUNICADO ESPECIAL
        </div>

        {/* Título en gradiente ¡ATENCIÓN! */}
        <h2 className="notice-title" data-testid="notice-title">
          ¡ATENCIÓN!
        </h2>
        <div className="notice-title-divider"></div>

        {/* Subtítulo con badge 100% GRATUITO */}
        <div className="notice-subtitle-row">
          <span className="notice-app-name">cpamc Auto Switcher Pro</span>
          <span className="notice-free-badge">100% GRATUITO</span>
        </div>

        {/* Mensaje de confirmación cuando ya donó */}
        {supporterFeedback ? (
          <div className="notice-supporter-confirmed" data-testid="notice-supporter-feedback">
            ¡Muchísimas gracias por apoyar el proyecto! ❤️
            <br />
            <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.9 }}>
              Tu aporte ha sido registrado en este navegador. Este aviso no volverá a aparecer nunca más.
            </span>
          </div>
        ) : (
          <>
            {/* CONTENEDOR PRINCIPAL VERTICAL DE 1 COLUMNA COMPACTA */}
            <div
              className="notice-vertical-container"
              data-testid="notice-grid-layout"
            >
              {/* CAJA PRINCIPAL: APORTE LIBRE (CAFÉ) */}
              <div className="notice-col-support" data-testid="col-support">
                <div>
                  <div className="notice-col-support-text">
                    Este proyecto es y seguirá siendo{' '}
                    <strong className="highlight-green">totalmente libre y accesible</strong>. Para continuar
                    dedicando tiempo a brindarte soporte continuo, optimización y parches inmediatos ante cada
                    cambio de API, cualquier aporte voluntario hace una gran diferencia.
                    <div className="notice-no-minimum">
                      ✨ Sin monto mínimo: aporta la cantidad que desees y esté en tus posibilidades. ✨
                    </div>
                  </div>

                  {/* Pestañas PayPal vs Binance */}
                  <div className="notice-tabs-row" role="tablist">
                    <button
                      type="button"
                      className={`notice-tab-btn tab-paypal ${activeTab === 'paypal' ? 'active' : ''}`}
                      onClick={() => setActiveTab('paypal')}
                      role="tab"
                      aria-selected={activeTab === 'paypal'}
                      data-testid="tab-paypal"
                    >
                      <span>🔵</span>
                      PayPal
                    </button>

                    <button
                      type="button"
                      className={`notice-tab-btn tab-binance ${activeTab === 'binance' ? 'active' : ''}`}
                      onClick={() => setActiveTab('binance')}
                      role="tab"
                      aria-selected={activeTab === 'binance'}
                      data-testid="tab-binance"
                    >
                      <span>🟡</span>
                      Binance Pay
                    </button>
                  </div>

                  {/* Detalle del método activo */}
                  {activeTab === 'paypal' ? (
                    <div className="notice-payment-detail-card" data-testid="detail-paypal">
                      <div className="notice-payment-icon">💳</div>
                      <div className="notice-payment-info">
                        <div className="notice-payment-label">Aporte PayPal</div>
                        <div className="notice-payment-value" title={PAYPAL_DONATE_URL}>
                          {PAYPAL_DONATE_URL}
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`btn-copy-notice ${copied ? 'copied' : ''}`}
                        onClick={() => handleCopy(PAYPAL_DONATE_URL)}
                        data-testid="btn-copy-paypal"
                      >
                        {copied ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </div>
                  ) : (
                    <div className="notice-payment-detail-card" data-testid="detail-binance">
                      <div className="notice-payment-icon icon-binance">🟡</div>
                      <div className="notice-payment-info">
                        <div className="notice-payment-label">Binance Pay ID</div>
                        <div className="notice-payment-value">{BINANCE_USER_ID}</div>
                      </div>
                      <button
                        type="button"
                        className={`btn-copy-notice ${copied ? 'copied' : ''}`}
                        onClick={() => handleCopy(BINANCE_USER_ID)}
                        data-testid="btn-copy-binance"
                      >
                        {copied ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Botón principal CTA de Donación */}
                {activeTab === 'paypal' ? (
                  <a
                    href={PAYPAL_DONATE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-notice-cta-main"
                    onClick={handleRegisterSupporter}
                    data-testid="btn-cta-paypal"
                  >
                    ☕ Invitar un Café y Desbloquear Sorpresas Dev →
                  </a>
                ) : (
                  <button
                    type="button"
                    className="btn-notice-cta-main"
                    onClick={() => {
                      handleCopy(BINANCE_USER_ID);
                      handleRegisterSupporter();
                    }}
                    data-testid="btn-cta-binance"
                  >
                    ☕ Invitar con Binance y Desbloquear Sorpresas Dev →
                  </button>
                )}
              </div>

              {/* BLOQUE DE TELEMETRÍA HORIZONTAL EN 1 SOLA FILA (Solo 1ª vez) */}
              {isFirstTelemetryInfo && (
                <div className="notice-telemetry-banner" data-testid="col-telemetry">
                  <div className="telemetry-card-header">
                    <label className="telemetry-label-row" htmlFor="chk-notice-telemetry">
                      <input
                        type="checkbox"
                        id="chk-notice-telemetry"
                        checked={telemetryActive}
                        onChange={handleToggleTelemetry}
                        data-testid="chk-telemetry-toggle"
                      />
                      <span>
                        <span style={{ marginRight: 6 }}>📈</span>
                        Telemetría <span className="telemetry-subtag">(Desactivable)</span>
                      </span>
                    </label>
                    <span
                      className={`telemetry-pill-active ${telemetryActive ? 'active' : 'inactive'}`}
                      data-testid="telemetry-pill-status"
                    >
                      {telemetryActive ? '● Habilitada (Recomendado)' : '○ Deshabilitada'}
                    </span>
                  </div>

                  <div className="telemetry-body-text">
                    Apoyar con la telemetría ayuda a mejorar la experiencia y predecir caídas{' '}
                    <span className="badge-429-pill">429</span> sin cortes. Es 100% anónima (cero datos
                    privados, prompts ni código). En caso de que prefieras deshabilitarla, puedes hacerlo
                    desmarcando la casilla aquí mismo.
                  </div>
                </div>
              )}
            </div>

            {/* BOTÓN SECUNDARIO CON DEGRADADO Y ZOOM DE MENOS A MÁS */}
            <button
              type="button"
              className="btn-notice-free-action"
              onClick={handleFreeActionClose}
              data-testid="btn-free-action"
            >
              <span className="free-action-gradient-text">
                Continuar usando gratis por ahora
              </span>
            </button>

            {/* Fila inferior: Checkbox 24h y Desactivar para siempre */}
            <div className="notice-controls-row">
              <label className="notice-checkbox-label">
                <input
                  type="checkbox"
                  checked={dontShowToday}
                  onChange={(e) => setDontShowToday(e.target.checked)}
                  data-testid="chk-dont-show-today"
                />
                <span>No volver a mostrar hoy</span>
              </label>

              <button
                type="button"
                className="btn-silence-forever"
                onClick={handleRegisterSupporter}
                data-testid="btn-silence-forever"
              >
                ¿Ya invitaste un café? Desactivar para siempre
              </button>
            </div>
          </>
        )}

        {/* Divisor inferior */}
        <div className="notice-footer-divider"></div>

        {/* Frase oficial WiloxDev afinada con proyectos clave */}
        <p className="notice-wiloxdev-quote" data-testid="notice-wiloxdev-quote">
          🎁 «¡Invita un café hoy y llévate sorpresas en utilidades exclusivas! Acceso a proyectos de plugins y extensiones de <strong>WiloxDev</strong> como: <em>omniauth-pro</em>, <em>scanner-working-chat</em>, <em>discord-pi</em>, <em>Wellness-Reloj-pi</em>, <em>center-control-manager</em> y más. Con tu café me motivas a seguir creando y liberando más proyectos como este. ☕❤️»
        </p>
      </div>
    </div>
  );
}
