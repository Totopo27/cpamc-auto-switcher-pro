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

describe('CommunityNoticeModal Component - 1 Columna Vertical con Telemetría previa única', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders in vertical layout on first run and displays horizontal telemetry banner', () => {
    render(<CommunityNoticeModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByTestId('col-support')).toBeTruthy();
    expect(screen.getByTestId('col-telemetry')).toBeTruthy();
    expect(screen.getByTestId('btn-cta-paypal').textContent).toContain('☕ Invitar un Café y Desbloquear Sorpresas Dev →');
    expect(screen.getByTestId('notice-wiloxdev-quote').textContent).toContain(
      '¡Invita un café hoy y llévate sorpresas en utilidades exclusivas!'
    );
    expect(screen.getByTestId('notice-wiloxdev-quote').textContent).toContain('omniauth-pro');
    expect(screen.getByTestId('notice-wiloxdev-quote').textContent).toContain('discord-pi');
    expect(screen.getByTestId('notice-wiloxdev-quote').textContent).toContain('scanner-working-chat');
  });

  it('hides telemetry banner if telemetry was already shown once', () => {
    localStorage.setItem(STORAGE_KEY_TELEMETRY_ONCE_SHOWN, 'true');
    render(<CommunityNoticeModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByTestId('col-support')).toBeTruthy();
    expect(screen.queryByTestId('col-telemetry')).toBeNull();
  });

  it('allows toggling telemetry', () => {
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
