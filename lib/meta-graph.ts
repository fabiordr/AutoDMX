/**
 * Meta Graph API helpers for the Facebook (Business) Login flow.
 *
 * Fork adaptation (2026-11-06): Meta no longer offers the "Instagram API
 * with Instagram Login" flow for new apps — only "API setup with Unified
 * login". That flow issues portfolio system-user tokens, which are valid
 * ONLY on graph.facebook.com. The upstream code calls
 * graph.instagram.com, which rejects those tokens with
 * "Invalid OAuth access token - Cannot parse access token". Every Graph
 * call in this fork therefore goes through the Facebook Graph endpoint,
 * which is the documented endpoint for the Facebook Login flow
 * (messages, comment replies, media and user lookup all work there with
 * the instagram_* permissions granted to the app).
 */
export const GRAPH_API_BASE_URL = 'https://graph.facebook.com/v21.0';

export type ResolvedInstagramAccount = {
  id: string;
  username: string;
};

/**
 * Resolves the Instagram account a token belongs to.
 *
 * System-user tokens (Unified Login) answer /me with the system user, not
 * the Instagram account, so when META_IG_USER_ID is set the account is
 * verified directly by that id. Without it, /me is tried (works for user
 * tokens issued by the Instagram Login flow).
 */
export async function resolveInstagramAccount(
  token: string,
  configuredId?: string | null
): Promise<ResolvedInstagramAccount> {
  const igUserId = configuredId?.trim();
  if (igUserId) {
    const res = await fetch(
      `${GRAPH_API_BASE_URL}/${igUserId}?fields=id,username&access_token=${encodeURIComponent(token)}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    if (data?.error) {
      throw new Error(`Instagram API Error: ${data.error.message}`);
    }
    if (data?.id && data?.username) {
      return { id: data.id, username: data.username };
    }
    throw new Error('Instagram verification did not return an id and username.');
  }

  const meRes = await fetch(
    `${GRAPH_API_BASE_URL}/me?fields=id,username&access_token=${encodeURIComponent(token)}`,
    { cache: 'no-store' }
  );
  const meData = await meRes.json();
  if (meData?.error) {
    throw new Error(`Instagram API Error: ${meData.error.message}`);
  }
  if (meData?.id && meData?.username) {
    return { id: meData.id, username: meData.username };
  }
  throw new Error(
    'Instagram verification did not return an id and username. ' +
      'For system-user tokens (Unified Login), set META_IG_USER_ID to the Instagram user id.'
  );
}
