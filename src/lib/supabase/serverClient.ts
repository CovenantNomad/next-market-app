import { GetServerSidePropsContext } from "next";
import { createServerClient, CookieOptions, serialize } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "../constants";

function getServerSupabase(context: GetServerSidePropsContext) {
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return context.req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          context.res.appendHeader(
            "Set-Cookie",
            serialize(name, value, options)
          );
        },
        remove(name: string, options: CookieOptions) {
          context.res.appendHeader("Set-Cookie", serialize(name, "", options));
        },
      },
    }
  )

  return supabase
}

export default getServerSupabase