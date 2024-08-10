"use server"
import {redirect} from "next/navigation"
import { createClient } from "@/utils/supabase/server"


export default async function CreateQuiz(){
    const supabase = createClient()
      const p = supabase.auth.getUser().then((e) => {
        if (!e.data.user) {
          redirect("/login");
        }
      });
      console.log(p)
    const { data,error } = await supabase
      .from('quiz')
      .insert({ title:"New Quiz", pages:[], require_signin:true,team_info:[],host:p?.data?.user.id})
      .select()
    console.log(data,error)
    redirect("/editquiz/"+data[0]?.id)
}