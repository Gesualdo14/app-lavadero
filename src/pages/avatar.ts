import { getStore } from "@netlify/blobs";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
  // Load the Netlify Blobs store called `UserUpload`
  const avatarsStore = getStore({
    name: "avatars",
    consistency: "strong",
    siteID: "c6718187-6f7d-49c4-b9d9-154f3a6d310c",
    token: "nfp_ZFydxi2H55R76t41vPX6H7b3r5wX7sbD0584",
  });
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const id = (searchParams.get("id") || locals.user?.id) as string;
  console.log({ id });
  const userAvatar = await avatarsStore.get(id, {
    type: "stream",
  });
  // Make sure you throw a 404 if the blob is not found.
  if (!userAvatar) {
    return new Response("Upload not found", { status: 404 });
  }
  // Return the blob
  return new Response(userAvatar);
};
