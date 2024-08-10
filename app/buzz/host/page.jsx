"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
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

export default function Join({searchParams,}){
    const Router = useRouter()
    const supabase = createClient()
    const [buzzCode, setBuzzCode] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const handleCreateRoom = async () => {
      setError(null);
      setSuccess(null);

      const { error } = await supabase.rpc('host_match', { buzz_code: buzzCode });

      if (error) {
          setError(error.message);
      } else {
          setSuccess('Room created successfully!');
          Router.push(`/buzz/host/${buzzCode}`);
      }
  };
    // useEffect(() => {
    //   supabase.auth.getUser().then((e)=>{
    //     setUser(e?.data?.user)
    //   })
    // },[])
    const host_match = function(code){
      
      }
    return <>
    <div className="relative flex h-[100vh] w-[100vw] flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
    <Card className="mx-auto max-w-sm z-10 bg-transparent border-none">
      <CardHeader className="flex-col items-center justify-center">
        <CardTitle className="text-2xl">Create a Room</CardTitle>
        <CardDescription>
          Enter Room Name
        </CardDescription>
      </CardHeader>
      <CardContent >
        <div className="grid gap-4">
          <div className="gap-2 flex flex-col justify-center items-center">
            <Input
              id="roomname"
              name = "roomname"
              type="text"
              placeholder="quiz_app"
              value={buzzCode}
              required
              onChange={e => setBuzzCode(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-100" onClick={handleCreateRoom}>
            Join
          </Button>
          </div>  
      </CardContent>
        
    </Card>
    <Ripple/>
    </div>
    </>
}