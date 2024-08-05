"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect,useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import RetroGrid from "@/components/magicui/retro-grid";
// import {  } from "next/router"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Ripple from "@/components/magicui/ripple";



export default function Join(){
    const Router = useRouter()
    const supabase = createClient()
    let [code,setCode] = useState(12345678)
    let [user,setUser] = useState({})
    useEffect(() => {
      supabase.auth.getUser().then((e)=>{
        setUser(e?.data?.user)
      })
    },[])
    const join_match = function(code){
      console.log(code)
      console.log(user)
      if (typeof window !== 'undefined') {
          supabase.from('quiz_instance').select("*").eq("id",code).then((e)=>{
              if (!e.error){
                fetch('/api/add_user_quiz_instance', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({quiz_instance:code,name: user?.user_metadata.name, uuid: user?.id, email: user?.email}),
                })
              }
          })
          Router.push("/play/"+code)
      }
  }
    return <>
    <div className="relative flex h-[100vh] w-[100vw] flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
    <Card className="mx-auto max-w-sm z-10 bg-transparent border-none">
      <CardHeader className="flex-col items-center justify-center">
        <CardTitle className="text-2xl">Join</CardTitle>
        <CardDescription>
          Enter Join Code
        </CardDescription>
      </CardHeader>
      <CardContent >
        <div className="grid gap-4">
          <div className="gap-2 flex flex-col justify-center items-center">
            <Input
              id="joincode"
              name = "joincode"
              type="number"
              placeholder="12345678"
              required
              onChange={e => setCode(Number(e.target.value))}
            />
          </div>
          <Button type="submit" className="w-100" onClick={function(){join_match(code)}}>
            Join
          </Button>
          </div>  
      </CardContent>
        
    </Card>
    <Ripple/>
    </div>
    </>
}