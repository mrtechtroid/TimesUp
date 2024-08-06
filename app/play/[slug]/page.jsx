"use client";
import { createClient } from "@/utils/supabase/client";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CircleUser,
  DeleteIcon,
  Flag,
  Menu,
  MoveDown,
  MoveDownIcon,
  MoveUp,
  MoveUpIcon,
  NotepadText,
  Package2,
  Search,
  Share,
  Trash,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import DotPattern from "@/components/magicui/dot-pattern";
import QRCode from "react-qr-code";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import { Moon, Sun } from "lucide-react";
function CrownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      // fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  )
}
const Timer = ({ seconds, onComplete }) => {
  // initialize timeLeft with the seconds prop
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    // exit early when we reach 0
    async function ge_(){
      if (timeLeft < 0) {
        let r = onComplete();
        let t = 0;
        while (t<5){
          await setTimeout(3000);
          onComplete(t+1);
          t++
          console.log(t)
        }
        return;
    }
    }
    ge_();
    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  return (
    <div>
      <AnimatedCircularProgressBar
        max={Math.ceil(seconds)}
        min={0}
        value={Math.ceil(timeLeft)<0?-1:Math.ceil(timeLeft)}
        gaugePrimaryColor="rgb(79 70 229)"
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      />
    </div>
  );
};
const Leaderboard = (leaderboard) => {
  // if (leaderboard.length ==0){
    leaderboard = [
      {name:"Tom Chen",points:100},
      {name:"John Doe",points:95},
      {name:"Jane Smith",points:85},
      {name:"Bob Johnson",points:75},
      {name:"Sarah Lee",points:65},
    ];
  // }
  return (<div>
    <Card className="w-[50vw] max-w-md">
    <CardContent className="grid gap-4 h-[400px] overflow-y-scroll p-4">
        {leaderboard.length>=1 && 
        <div className="flex items-center justify-between h-[40px]">
        <div className="flex items-center gap-2">
          <CrownIcon className="h-8 w-8 text-primary" fill={"#00ff00"}/>
          <div className="text-sm font-medium">1st Place</div>
          <div className="text-muted-foreground">{leaderboard[0].name}</div>
        </div>
        <div className="text-sm font-medium">{leaderboard[0].points}</div>
      </div>
        }
        {leaderboard.length>=2 && 
        <div className="flex items-center justify-between h-[40px]">
        <div className="flex items-center gap-2">
          <CrownIcon className="h-8 w-8 text-primary" fill={"#ff0000"}/>
          <div className="text-sm font-medium">2nd Place</div>
          <div className="text-muted-foreground">{leaderboard[1].name}</div>
        </div>
        <div className="text-sm font-medium">{leaderboard[1].points}</div>
      </div>
        }
        {leaderboard.length>=3 && 
        <div className="flex items-center justify-between h-[40px]">
        <div className="flex items-center gap-2">
          <CrownIcon className="h-8 w-8 text-primary" fill={"#0000ff"}/>
          <div className="text-sm font-medium">3rd Place</div>
          <div className="text-muted-foreground">{leaderboard[2].name}</div>
        </div>
        <div className="text-sm font-medium">{leaderboard[2].points}</div>
      </div>
        }
        {leaderboard.length>=4 && leaderboard.slice(3).map((item,index)=>{
          return (<div className="flex items-center justify-between h-[40px]">
            <div className="flex items-center gap-2">
              <CrownIcon className="h-8 w-8 text-primary" fill={"transparent"} visibility={"hidden"} />
              <div className="text-sm font-medium">{index+4}th Place</div>
              <div className="text-muted-foreground">{item.name}</div>
            </div>
            <div className="text-sm font-medium">{item.points}</div>
          </div>)
        })}
    </CardContent>
  </Card>
  </div>);
}
const playQuiz = () => {
  const [quiz_instance, setQuiz_instance] = useState([]);
  const [user, setUser] = useState({});
  const [user_,setUser_] = useState({});
  const { slug } = useParams();
  const [beforeshowtimer, setBeforeshowtimer] = useState(false);
  const [questionshowtimer, setQuestionshowtimer] = useState(false);
  const [loaded, setLoaded] = useState(3);
  const quiz_id = slug;
  const router = useRouter();
  const supabase = createClient();
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // const { theme, setTheme } = useTheme();
  useEffect(() => {
    setLoaded(0);
  },[])
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  useEffect(() => {
    supabase.auth.getUser().then((e)=>{
      setUser_(e?.data?.user)
    })
  },[])
  useEffect(() => {
    if (user_==undefined || user_==null){
      return;
    }
    fetch('/api/user_quiz_instance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({quiz_instance:quiz_id,name: user_?.user_metadata?.name, uuid: user?.id, email: user?.email}),
    }).then(response => response.json())
    .then(data => {
      if (data.status == false){
        redirect("/error/?message="+data.message)
        return;
      }
      setUser(data)
    });
  },[user_])
  const send_question_response = async(response) =>{
    let {data,error} = await supabase.rpc('add_response_to_quiz_instance',{p_name:user.name,p_teamname:user.team_name,response:response,p_qIndex:quiz_instance.current_page,p_quiz_instance_id:quiz_id});
    if (error != undefined){
      console.log(error)
      return;
    }
  }
  useEffect(() => {
    supabase.auth.getSession().then((e) => {
      console.log(e.data);
      if (!e.data.session) {
        router.push("/login");
      }
    });
  }, []);
  useEffect(() => {
    if (quiz_instance.status == "display_q"){
      startTimer()
    }
  },[quiz_instance.status])
  useEffect(() => {
    async function getQuizInstance() {
      let { data, error } = await supabase
        .from("quiz_instance")
        .select("*")
        .eq("id", quiz_id);
      setQuiz_instance(data[0]);
      supabase
        .channel("quiz_host_" + quiz_id)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "quiz_instance",
            filter: "id=eq." + quiz_id,
          },
          function (payload) {
            setQuiz_instance(payload.new);
          }
        )
        .subscribe();
    }
    getQuizInstance();
    setLoaded(loaded+1);
  }, []);
  useEffect(() => {
    console.log(quiz_instance,loaded,user_,user);
  }, [quiz_instance,loaded,user_,user]);
  
  const startTimer = async () => {
    setBeforeshowtimer(true);
    setQuestionshowtimer(false);
  };
  const showQuestion = async (stack) => {
    setBeforeshowtimer(false);
    setQuestionshowtimer(true);
  };
  const showQuestionResponses = async (stack) => {
    if (stack == undefined){
      stack = 0;
    }
    // console.log(quiz)
    setBeforeshowtimer(false);
    setQuestionshowtimer(false);
  };
  return (
    <>   
      <div className="flex flex-col items-center justify-center w-[100vw] h-[100vh] ">
        <div className="fixed top-4 center-x z-10 rounded-full">
          Join this quiz at <b>timesup.mtt.one/join</b> and use code{" "}
          <b>{quiz_id}</b>
        </div>
        {/* <div>
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-10 rounded-full overflow-hidden" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </Button>
        </div> */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 right-4 z-10 rounded-full"
            >
              <Share className="text-primary" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 flex-col">
              <QRCode
                size={256}
                value={"https://timesup.mtt.one/join/?code=" + quiz_id}
              />
              <div className="flex flex-row gap-2">
                <Input
                  id="link"
                  defaultValue="https://timesup.mtt.one/join/"
                  readOnly
                />
                <Button type="submit" size="sm" className="px-3">
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-10 rounded-full"
            >
              <Flag className="text-primary" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
          <DialogHeader>
              <DialogTitle>Leaderboard</DialogTitle>
              <DialogDescription>
                who's at the top?
              </DialogDescription>
            </DialogHeader>
            <Leaderboard leaderboard={quiz_instance.leaderboard}></Leaderboard>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DotPattern className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] z-0" />
        {loaded>=3 && <>
        {quiz_instance?.status == "not_started" && (
          <>
            <div className="max-w-screen-md mx-auto text-center text-2xl md:text-6xl font-bold m-6">
              <h1>{quiz_instance?.quiz_title}</h1>
            </div>
            <span className="text-center text-muted-foreground">
              Waiting for the host to start the quiz...
            </span>
          </>
        )}
        {quiz_instance?.status == "started" && (
          <>
            <div className="max-w-screen-md mx-auto text-center text-2xl md:text-6xl font-bold m-6">
              <h1>
                Question {quiz_instance.current_page + 1} of{" "}
                {quiz_instance?.total_pages}
              </h1>
            </div>
          </>
        )}
        {quiz_instance?.status == "finished" && (
          <>
            <div className="max-w-screen-md mx-auto text-center text-2xl md:text-6xl font-bold m-6">
              <h1>
                Quiz Ended!
              </h1>
            </div>
            <span className="text-center text-muted-foreground text-lg">Leaderboard</span>
            <Leaderboard leaderboard={quiz_instance.leaderboard}></Leaderboard>
          </>
        )}
        {quiz_instance?.status == "display_q" && beforeshowtimer == true && (
          <>
            <Timer
              seconds={(quiz_instance.page.displayOn - Date.now()) / 1000}
              onComplete={showQuestion}
            />
            <h2 className="text-xl">Get Ready!</h2>
          </>
        )}
        {quiz_instance?.status == "display_q" && beforeshowtimer == false && (
          <>
            <div className="max-w-screen-md mx-auto text-center text-xl md:text-4xl font-bold m-6">
              <h1>{quiz_instance.page.question}</h1>
              <div className="grid grid-cols-2 gap-4">
                {quiz_instance.page.type == "select_answer" &&
                  quiz_instance.page.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <button
                        key={optionIndex}
                        className="bg-card-foreground text-card hover:bg-primary hover:text-primary-foreground rounded-lg py-3 px-6 transition-colors text-lg md:text-2xl"
                          onClick={() => setResponse(option)}
                      >
                        {option}
                      </button>
                    </div>
                  ))}
                </div>
                {quiz_instance.page.type == "type_answer" && (
                  <>
                    <Input className="text-xl center-x" placeholder="Answer" onChange={(e)=>setResponse(e.target.value)} />
                  </>
                )}
                <Button onClick={()=>send_question_response(response)}>Submit</Button>
                {quiz_instance.page.type == "leaderboard" && (
                  <>
                    <Leaderboard leaderboard={quiz_instance.page.leaderboard}></Leaderboard>
                  </>
                )}
              
            </div>
            <div className="fixed center-y right-4">
              <Timer
                seconds={
                  (quiz_instance.page.displayOn -
                    Date.now() +
                    quiz_instance.page.timeLimit * 1000) /
                  1000
                }
                onComplete={showQuestionResponses}
                className="fixed center-y z-10 rounded-full"
              />
            </div>
          </>
        )}
        {quiz_instance?.status == "show_answer" && beforeshowtimer == false && (
          <>
            <div className="max-w-screen-md mx-auto text-center text-xl md:text-4xl font-bold m-6">
              <h1>{quiz_instance.page.question}</h1>
              <div className="grid grid-cols-2 gap-4">
                {quiz_instance?.page?.type == "select_answer" &&
                  quiz_instance.page.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <button
                        key={optionIndex}
                        style={{backgroundColor:(quiz_instance?.page?.correctAnswers?.includes(optionIndex)?"green":!quiz_instance?.page?.correctAnswers?.includes(response) && optionIndex==response?"red":"")}}
                        className={"bg-card-foreground text-card hover:bg-primary hover:text-primary-foreground rounded-lg py-3 px-6 transition-colors text-lg md:text-2xl"}
                        //   onClick={() => handleAnswer(index)}
                      >
                        {option}
                      </button>
                    </div>
                  ))}
              </div>
              {quiz_instance?.page?.type == "type_answer" && (
                  <>
                    <div className="flex flex-col items-center justify-center">
                      <Input className="text-xl border-white" placeholder="Answer" value = {response} disabled />
                      {quiz_instance?.page?.correct_answer?.includes(response) && <span className="text-green-500">Correct!</span>}
                    </div>
                  </>
                )}
                {quiz_instance.page.type == "leaderboard" && (
                  <>
                    <Leaderboard leaderboard={quiz_instance.page.leaderboard}></Leaderboard>
                  </>
                )}
            </div>
          </>
        )}</>}
      </div>
    </>
  );
};

export default playQuiz;
