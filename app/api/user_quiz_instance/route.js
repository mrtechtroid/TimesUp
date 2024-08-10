import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { env } from "process";

export async function POST(request) {
  const requestUrl = new URL(request.url);
  const body = await request.json();
  console.log(body)
  try{
    const origin = requestUrl.origin;
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY);
  let {data,error} = await supabase.from('quiz_instance').select("*").eq("id",body.quiz_instance);
  console.log(data,error)
  let team_info = data[0]?.team_info||[];
  for (let i = 0; i < team_info.length; i++) {
    for (let j = 0;j<team_info[i].players.length;j++){
      if (team_info[i].players[j].name == body.name){
        // console.log(user_responses)
          return NextResponse.json({"status":true,"team_name":team_info[i].name,"name":team_info[i].players[j].name})
        }
      }
    }
  console.log(team_info)
  // team_info.push({"name":body.name,"color":"","players":[{name: body.name, email: body.email}]})
  {
    let {data,error} = await supabase.rpc("add_user_to_quiz_instance",{p_name:body.name,p_teamname:body.name,p_quiz_instance_id:body.quiz_instance,p_email:body.email});
    console.log(data,error)
    return NextResponse.json({"status":true,"team_name":body.name,"name":body.name})
    
  }
  }catch(e){
    console.log(e)
    return NextResponse.json({"status":false,"message":e.message,"reason":"arbitary"})
  }
}
