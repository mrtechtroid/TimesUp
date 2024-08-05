import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const body = await request.json();
  console.log(body)

  const origin = requestUrl.origin;
  const supabase = createClient();
  let {data,error} = await supabase.from('quiz_instance').select("*").eq("id",body.quiz_instance);
  let team_info = data[0]?.team_info||[];
  for (let i = 0; i < team_info.length; i++) {
    for (let j = 0;j<team_info[i].players.length;j++){
      if (team_info[i].players[j].email == body.email){
        return NextResponse.json({"response":true})
      }
    }
  }
  team_info.push({"name":body.name,"color":"","players":[{name: body.name, email: body.email}]})
  let error2 = await supabase.from('quiz_instance').update({"team_info":team_info}).eq("id",body.quiz_instance)
  // URL to redirect to after sign up process completes
  console.log(error2)
  return NextResponse.json({"response":true});
}
