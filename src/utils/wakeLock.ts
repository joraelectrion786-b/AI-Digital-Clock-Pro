class WakeLockService {
  private sentinel: any = null;
  private isEnabled: boolean = true;

  async requestWakeLock(): Promise<boolean> {
    if (!this.isEnabled) return false;
    if ('wakeLock' in navigator) {
      try {
        this.sentinel = await (navigator as any).wakeLock.request('screen');
        this.sentinel.addEventListener('release', () => {
          this.sentinel = null;
        });
        return true;
      } catch (err) {
        console.warn('Wake Lock request error:', err);
        return false;
      }
    }
    return false;
  }

  async releaseWakeLock(): Promise<void> {
    if (this.sentinel) {
      try {
        await this.sentinel.release();
        this.sentinel = null;
      } catch (err) {
        console.warn('Wake Lock release error:', err);
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled) {
      this.requestWakeLock();
    } else {
      this.releaseWakeLock();
    }
  }

  init() {
    // Re-request when page gains visibility
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isEnabled && !this.sentinel) {
        this.requestWakeLock();
      }
    });
  }
}

export const wakeLockService = new WakeLockService();
wakeLockService.init();
