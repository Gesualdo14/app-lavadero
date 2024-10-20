import { getStore } from "@netlify/blobs";
import { defineAction } from "astro:actions";
import { z } from "zod";

const blobs = {
  upload: defineAction({
    input: z.object({ avatar: z.instanceof(File), blob_id: z.number() }),
    handler: async ({ avatar, blob_id }) => {
      try {
        // Load the Netlify Blobs store called `UserUpload`
        console.log({ avatar });
        const avatarsStore = getStore({
          name: "avatars",
          consistency: "strong",
          siteID: "c6718187-6f7d-49c4-b9d9-154f3a6d310c",
          token: "nfp_ZFydxi2H55R76t41vPX6H7b3r5wX7sbD0584", // lavapp token
        });
        // Set the file in the store. Replace `<key>` with a unique key for the file.
        const response = await avatarsStore.set(`${blob_id}`, avatar);
        console.log({ response });
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
};

export default blobs;
