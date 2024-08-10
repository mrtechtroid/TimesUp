"use client";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CircleUser, DeleteIcon, Menu, MoveDown, MoveDownIcon, MoveUp, MoveUpIcon, NotepadText, Package2, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";


const Host = () => {
    const { slug } = useParams();
    const room_id = slug;
    const [players, setPlayers] = useState([]);
    const [buzzes, setBuzzes] = useState([]);
    const [locked, setLocked] = useState(true);
    const supabase = createClient();
    useEffect(() => {
        async function fetchPlayersAndBuzzes() {
            const { data } = await supabase
                .from('buzzes')
                .select('*')
                .eq("id", room_id);
            setPlayers(data.players);
            setBuzzes(data.buzzers);
            setLocked(data.locked);
            console.log(data.players,data.buzzers,data.locked,)
        };
        

        fetchPlayersAndBuzzes();
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
            let res = payload.new.players.filter((obj, index, self) =>
                index === self.findIndex((t) => (
                    t.name == obj.name
                ))
            );
            console.log(payload.new,res)
            setPlayers(res);
                setBuzzes(payload.new.buzzers);
                setLocked(payload.new.locked);
          }
        )
        .subscribe();
    }, []);

    async function handleLockToggle(){
        const { error } = await supabase
            .from('buzzes')
            .update({ locked: !locked })
            .eq("id", room_id)

        if (error) {
            console.error('Error toggling lock:', error.message);
        }
    };

    const handleClearBuzzes = async () => {
        const { error } = await supabase
            .from('buzzes')
            .update({ buzzers: [] })
            .eq("id", room_id)

        if (error) {
            console.error('Error clearing buzzes:', error.message);
        }
    };

    const handleKickPlayer = async (playerName) => {
        const players_ = players;
        for (let i = 0;i<players_.length;i++){
          if (players_[i].name == playerName){
            players_.kicked = true
          }
        }
        const { error } = await supabase
            .from('buzzes')
            .update({ players: players_ })
            .eq("id", room_id)

        if (error) {
            console.error('Error kicking player:', error.message);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Host</h2>
            <div className="mb-4">
                <button
                    onClick={handleLockToggle}
                    className={`bg-red-500 text-white px-4 py-2 rounded-lg ${
                        locked ? '' : 'bg-green-500'
                    }`}
                >
                    {locked ? 'Unlock Buzzer' : 'Lock Buzzer'}
                </button>
                <button
                    onClick={handleClearBuzzes}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg ml-2"
                >
                    Clear Buzzes
                </button>
            </div>
            <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Players</h3>
                <ul>
                    {players?.map((player) => (
                        <li key={player.name} className="flex justify-between items-center">
                            <span>{player.name}</span>
                            <button
                                onClick={() => handleKickPlayer(player)}
                                className="bg-red-500 text-white px-2 py-1 rounded-lg ml-2"
                            >
                                Kick
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">Buzzes</h3>
                <ul>
                    {buzzes?.map((buzz, index) => (
                        <li key={index}>
                            {index + 1}. {buzz.name} - {new Date(buzz.timestamp).toLocaleTimeString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Host;
