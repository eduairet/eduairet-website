/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */

export type ReCaptcha = {
  render(
    container: string | HTMLElement,
    parameters?: {
      sitekey?: string | undefined;
      theme?: 'light' | 'dark' | undefined;
      type?: 'image' | 'audio' | undefined;
      hl?: string | undefined;
      size?: 'normal' | 'compact' | 'invisible' | undefined;
      tabindex?: number | undefined;
      badge?: 'bottomright' | 'bottomleft' | 'inline' | undefined;
      isolated?: boolean | undefined;
      callback?(response: string): void;
      'expired-callback'?(): void;
      'error-callback'?(): void;
    },
    inherit?: boolean
  ): number;
  reset(opt_widget_id?: number | string): void;
  getResponse(opt_widget_id?: number): string;
  execute(opt_widget_id?: number): PromiseLike<void>;
  execute(siteKey: string, action: { action: string }): PromiseLike<string>;
  ready(callback: () => void): void;
};

declare global {
  interface Window {
    grecaptcha: ReCaptcha;
  }
}
