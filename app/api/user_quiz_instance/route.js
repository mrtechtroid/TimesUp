import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  const requestUrl = new URL(request.url);
  const body = await request.json();
  console.log(body)
  try{
    const origin = requestUrl.origin;
  const supabase = createClient();
  let {data,error} = await supabase.from('quiz_instance').select("*").eq("id",body.quiz_instance);
  let team_info = data[0]?.team_info||[];
  for (let i = 0; i < team_info.length; i++) {
    for (let j = 0;j<team_info[i].players.length;j++){
      if (team_info[i].players[j].email == body.email){
        return NextResponse.json({"status":true,"team_name":team_info[i].name,"name":team_info[i].players[j].name})
      }
    }
  }
  team_info.push({"name":body.name,"color":"","players":[{name: body.name, email: body.email}]})
  {
    let {data,error} = await supabase.from('quiz_instance').update({"team_info":team_info}).eq("id",body.quiz_instance).select("*")
    return NextResponse.json({"status":true,"team_name":body.name,"name":body.name});
  }
  }catch(e){
    return NextResponse.json({"status":false,"message":e.message,"reason":"arbitary"})
  }
}
