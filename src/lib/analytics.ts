export type AnalyticsEvent =
  | "dress_detail_opened"
  | "dress_info_expanded"
  | "hero_viewed"
  | "hero_cta_clicked"
  | "hero_image_loaded"
  | "variant_selected"
  | "order_summary_viewed"
  | "whatsapp_cta_clicked"
  | "whatsapp_handoff_failed"
  | "product_shared"
  | "concierge_viewed"
  | "concierge_cta_clicked";

type AnalyticsProps = Record<string, string | number | boolean | undefined>;

/**
 * No analytics platform is wired up yet — this stub logs events to the
 * console in development so the event contract is visible and easy to
 * connect to a real provider (GA4, Segment, etc.) later without touching
 * call sites.
 */
export function trackEvent(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${event}`, props);
  }
}
