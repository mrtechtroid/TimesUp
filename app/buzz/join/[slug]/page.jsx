"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Router } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Player = () => {
    const { slug } = useParams();
    const room_id = slug;
    const supabase = createClient();
    const [user,setUser] = useState({})
    const [playerName,setPlayerName] = useState("");
    const [buzz_instance,setBuzz_instance] = useState({});
    useEffect(() => {
        if (playerName == ""){
          return;
        }
        async function putPlayerInBuzz(){
            const { data, error } = await supabase.rpc('insert_player',{room_id:room_id,player_name:playerName})
            if (error) {
                console.error('Error buzzing:', error.message);
            }
            setPlayerSent(true)
        }
        putPlayerInBuzz()
        
        return ()  => {
          
        };
    },[playerName])
    useEffect(() => {
      supabase.auth.getUser().then((e)=>{
        setUser(e?.data?.user)
        setPlayerName(e?.data?.user?.user_metadata?.name)
      })
    },[])
    
    const [buzzed, setBuzzed] = useState(false);
    const [locked, setLocked] = useState(true);
    const [playerSent, setPlayerSent] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const fetchLockedStatus = async () => {
            const { data,error } = await supabase
                .from('buzzes')
                .select('*')
                .eq("id", room_id);
            setLocked(data.locked);
        };

        fetchLockedStatus();

        supabase
        .channel("buzz_host_" + room_id)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "buzzes",
            filter: "id=eq." + room_id,
          },
          function (payload) {
                setLocked(payload.new.locked);
                setBuzz_instance(payload.new)
          }).subscribe()

    }, []);
    useEffect(() => {
      console.log(playerName,user)
    },[user])
    useEffect(() => {
        console.log(buzz_instance)
    setBuzzed(false)
      for (let i = 0;i<buzz_instance?.buzzers?.length;i++){
        if (buzz_instance.buzzers[i].name == playerName){
          setBuzzed(true)
          if (buzz_instance.buzzers[i].kick == true){
            router.push("/error?message=You are kicked from the room")
          }
        }
      }
      },[buzz_instance])
    const handleBuzz = async () => {
        if (!locked && !buzzed) {
            const { data, error } = await supabase.rpc('insert_buzz', {
                player_name: playerName,
                room_id: room_id,
            });


            if (error) {
                console.error('Error buzzing:', error.message);
            } else {
                setBuzzed(true);
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Player: {playerName}</h2>
            <Button
                onClick={handleBuzz}
                disabled={locked || buzzed}
                className={`bg-blue-500 text-white w-[300px] h-[300px] he px-4 py-2 rounded-lg ${
                    locked || buzzed ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {locked?"Locked":buzzed?"Buzzed":"Buzz!"}
            </Button>
        </div>
    );
};

export default Player;
