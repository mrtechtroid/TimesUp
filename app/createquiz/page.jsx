"use server"
import {redirect} from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { useEffect } from "react"


export default async function CreateQuiz(){
    const supabase = createClient()
    useEffect(() => {
      const p = supabase.auth.getUser().then((e) => {
        if (!e.data.user) {
          redirect("/login");
        }
      });
    },[])
    const { data,error } = await supabase
      .from('quiz')
      .insert({ title:"New Quiz", pages:{}, require_signin:true,team_info:{}})
      .select()
    console.log(data,error)
    redirect("/editquiz/"+data[0]?.id)
}