import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CommunityNoticeModal, {
  STORAGE_KEY_SUPPORTER,
  STORAGE_KEY_DISMISSED,
  STORAGE_KEY_TELEMETRY_ONCE_SHOWN,
  STORAGE_KEY_TELEMETRY_ENABLED,
  PAYPAL_DONATE_URL,
  BINANCE_USER_ID,
} from './CommunityNoticeModal';

describe('CommunityNoticeModal Component - 2 Columnas 1ª vez & Telemetría en Inicio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders in 2 columns on first run and displays telemetry info', () => {
    render(<CommunityNoticeModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByTestId('col-support')).toBeTruthy();
    expect(screen.getByTestId('col-telemetry')).toBeTruthy();
    expect(screen.getByTestId('telemetry-once-note').textContent).toContain(
      'Este panel de telemetría solo te aparecerá esta primera vez aquí'
    );
    expect(screen.getByTestId('notice-wiloxdev-quote').textContent).toContain(
      '«Creado con esmero por WiloxDev como un aporte libre para la comunidad: una herramienta nacida para resolver necesidades reales de alta concurrencia. ❤️»'
    );
  });

  it('renders single column if telemetry was already shown once', () => {
    localStorage.setItem(STORAGE_KEY_TELEMETRY_ONCE_SHOWN, 'true');
    render(<CommunityNoticeModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByTestId('col-support')).toBeTruthy();
    expect(screen.queryByTestId('col-telemetry')).toBeNull();
  });

  it('allows toggling telemetry and toggling payload preview', () => {
    const onTelemetryChangeMock = vi.fn();
    render(
      <CommunityNoticeModal
        isOpen={true}
        onClose={vi.fn()}
        onTelemetryChange={onTelemetryChangeMock}
      />
    );

    const chkTelemetry = screen.getByTestId('chk-telemetry-toggle');
    expect(chkTelemetry.checked).toBe(true);

    // Toggle telemetría a desactivada
    fireEvent.click(chkTelemetry);
    expect(chkTelemetry.checked).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY_TELEMETRY_ENABLED)).toBe('false');
    expect(onTelemetryChangeMock).toHaveBeenCalledWith(false);

    // Desplegar visor de carga JSON
    expect(screen.queryByTestId('telemetry-payload-box')).toBeNull();
    fireEvent.click(screen.getByTestId('btn-toggle-payload'));
    expect(screen.getByTestId('telemetry-payload-box')).toBeTruthy();
  });

  it('marks telemetry once shown upon clicking free action button', () => {
    const onCloseMock = vi.fn();
    render(<CommunityNoticeModal isOpen={true} onClose={onCloseMock} />);

    fireEvent.click(screen.getByTestId('btn-free-action'));
    expect(onCloseMock).toHaveBeenCalled();
    expect(localStorage.getItem(STORAGE_KEY_TELEMETRY_ONCE_SHOWN)).toBe('true');
  });

  it('switches tabs between PayPal and Binance', () => {
    render(<CommunityNoticeModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByTestId('detail-paypal')).toBeTruthy();
    fireEvent.click(screen.getByTestId('tab-binance'));
    expect(screen.getByTestId('detail-binance')).toBeTruthy();
    expect(screen.getByText(BINANCE_USER_ID)).toBeTruthy();
  });

  it('registers permanent supporter benefit', () => {
    render(<CommunityNoticeModal isOpen={true} onClose={vi.fn()} />);

    fireEvent.click(screen.getByTestId('btn-silence-forever'));
    expect(localStorage.getItem(STORAGE_KEY_SUPPORTER)).toBe('true');
    expect(localStorage.getItem(STORAGE_KEY_TELEMETRY_ONCE_SHOWN)).toBe('true');
    expect(screen.getByTestId('notice-supporter-feedback').textContent).toContain(
      '¡Muchísimas gracias por apoyar el proyecto! ❤️'
    );
  });
});
