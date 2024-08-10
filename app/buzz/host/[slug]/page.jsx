"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
// import { useRouter } from "next/navigation";

const Host = () => {
  const supabase = createClient();
  const { slug } = useParams();
  const room_id = slug;
  let room;
  const [userStates, setUserStates] = useState({});
  const [myState, setMyState] = useState({});
  console.log(1)
  const [players, setPlayers] = useState([]);
  const [playSound, setPlaySound] = useState(false);
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    setMyState({...myState,noBuzzers:locked})
  },[locked])
  useEffect(() => {
    let players = []
    for (let key in userStates){
        players.push({...userStates[key]});
        if (userStates[key].user == "host"){
            setLocked(userStates[key].noBuzzers);
        }
    }
    setPlayers(players)
    },[userStates]);
  useEffect(() => {
    room = supabase.channel("buzz_" + room_id);
    setMyState({
      user: "host",
      online_at: new Date().toISOString(),
      buzz: false,
      buzzedAt: Date.now(),
      noBuzzers: false,
    });
    room
      .on("presence", { event: "sync" }, () => {
        const newState = room.presenceState();
        setUserStates(newState)
        console.log("sync", newState);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("join", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
      })
      .subscribe(async (status) => {
        console.log(status);
        const presenceTrackStatus = await room.track(myState);
        console.log(presenceTrackStatus);
      });
      return () =>{
        room.unsubscribe();
      };
  }, []);
  useEffect(() => {
    console.log(players)
  },[players]);
  return (
    <div className="host-container">{JSON.stringify(players)}
      <h2>Host Panel</h2>
      <div className="host-section">
        <h3>Players</h3>
        <ul className="player-list">
          {players.map((player) => (
            <li key={player.id} className="player-item">
              {player.name}
              <button
                className="kick-button"
                onClick={() => {
                  /* Handle kick */
                }}
              >
                Kick
              </button>
            </li>
          ))}
        </ul>
      </div>
      {JSON.stringify(userStates)}
      <div className="host-section">
        <h3>Buzzes</h3>
        <ul className="buzz-list">
        {players.sort((a, b) => a.buzzedAt - b.buzzedAt).map((buzz, index) => (
                        <li key={index} className="buzz-item">
                            {buzz.name} - {new Date(buzz.buzzedAt).toLocaleTimeString()}
                        </li>
                    ))}
        </ul>
        <button
          className="clear-button"
          onClick={() => {
            /* Handle clear */
          }}
        >
          Clear All Buzzes
        </button>
      </div>
      <div className="host-controls">
        <label>
          <input
            type="checkbox"
            checked={playSound}
            onChange={() => setPlaySound(!playSound)}
          />
          Play Sound on Buzz
        </label>
        <label>
          <input
            type="checkbox"
            checked={locked}
            onChange={() => setLocked(!locked)}
          />
          Lock Buzzes
        </label>
      </div>
    </div>
  );
};

export default Host;
