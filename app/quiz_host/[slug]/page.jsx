"use client";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesColumn,
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
const Timer = ({ seconds, onComplete,totalTime }) => {
  if (totalTime == undefined){
    totalTime = seconds;
  }
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
        max={totalTime}
        min={0}
        value={Math.ceil(timeLeft)<0?-1:Math.ceil(timeLeft)}
        gaugePrimaryColor="rgb(79 70 229)"
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      />
    </div>
  );
};
const Leaderboard = ({leaderboard}) => {
  if (leaderboard==undefined){
    return
  }
  leaderboard = leaderboard.sort((a,b)=>b.points-a.points);
  // if (leaderboard.length ==0){
    // leaderboard = [
    //   {name:"Tom Chen",points:100},
    //   {name:"John Doe",points:95},
    //   {name:"Jane Smith",points:85},
    //   {name:"Bob Johnson",points:75},
    //   {name:"Sarah Lee",points:65},
    // ];
  // }
  return (<div>
    <Card className="w-[50vw] max-w-md">
    <CardContent className="flex flex-col gap-4 h-[400px] overflow-y-scroll p-4">
      {leaderboard.length ==0 && <div>
        Get at least one question correct to be ranked!
        </div>}
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
          return (<div className="flex items-center justify-between h-[40px]" key={index}>
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
const hostQuiz = () => {
  const [quiz, setQuiz] = useState({});
  const [quiz_instance, setQuiz_instance] = useState([]);
  const [quiz_response, setQuiz_response] = useState([]);
  const { slug } = useParams();
  const [beforeshowtimer, setBeforeshowtimer] = useState(false);
  const [questionshowtimer, setQuestionshowtimer] = useState(false);
  const [loaded, setLoaded] = useState(3);
  const quiz_id = slug;
  const router = useRouter();
  const supabase = createClient();
  // const { theme, setTheme } = useTheme();
  useEffect(() => {
    setLoaded(0);
  },[])
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
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
    async function getQuizResponses() {
      let { data, error } = await supabase
        .from("quiz_instance_responses")
        .select("*")
        .eq("id", quiz_id);
      setQuiz_response(data[0]);
      supabase
        .channel("quiz_host_responses_" + quiz_id)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "quiz_instance_responses",
            filter: "id=eq." + quiz_id,
          },
          function (payload) {
            setQuiz_response(payload.new);
          }
        )
        .subscribe();
    }
    getQuizResponses();
    setLoaded(loaded+1);
  }, []);
  useEffect(() => {
    if (quiz_instance == undefined || quiz_instance?.length == 0) {
      return;
    }
    async function getQuiz() {
      let { data, error } = await supabase
        .from("quiz")
        .select("*")
        .eq("id", quiz_instance.quiz_id);
      setQuiz(data[0] || {});
    }
    getQuiz();
    setLoaded(loaded+1);
  }, [quiz_instance]);
  useEffect(() => {
    console.log(quiz, quiz_instance, quiz_response,loaded);
  }, [quiz, quiz_instance, quiz_response,loaded]);
  const startQuiz = async () => {
    let { data, error } = await supabase
      .from("quiz_instance")
      .update({ status: "started", current_page: 0,quiz_title:quiz.title,total_pages:quiz.pages.length })
      .eq("id", quiz_instance.id);
  };
  const nextQuestion = async () => {
    if (quiz_instance.current_page == quiz?.pages?.length-1){
      let { data, error } = await supabase
      .from("quiz_instance")
      .update({ status: "finished",})
      .eq("id", quiz_instance.id);
    }else{
    let { data, error } = await supabase
      .from("quiz_instance")
      .update({ status: "started", current_page: quiz_instance.current_page+1,answered_teams:[] })
      .eq("id", quiz_instance.id);
    }
  };
  const startTimer = async () => {
    let { data, error } = await supabase
      .from("quiz_instance")
      .update({
        status: "display_q",
        page: {
          ...quiz.pages[quiz_instance.current_page],
          displayOn: Date.now() + 5000,
          correctAnswers:[]
        },
      })
      .eq("id", quiz_instance.id);
    setBeforeshowtimer(true);
    setQuestionshowtimer(false);
  };
  const showQuestion = async (stack) => {
    // let {data,error} = await supabase.from('quiz_instance').update({status:"question",current_page:quiz_instance.current_page+1}).eq("id",quiz_instance.id);
    setBeforeshowtimer(false);
    setQuestionshowtimer(true);
  };
  useEffect(() => {
    if (!isEmpty(quiz_instance) && !isEmpty(quiz_response)&& quiz_response?.responses.filter(item=>item.used==false).length != 0){
      updateLeaderboard();
    }
  },[quiz_response,quiz_instance]);
  const updateLeaderboard = async () => {
    const inLeaderboard = (name) => {
      return quiz_instance.leaderboard.filter(item=>item.name==name).length != 0;
    }
    if (isEmpty(quiz)||isEmpty(quiz_instance)||isEmpty(quiz_response)){
      return;
    }
    let responses = quiz_response.responses;
    let leaderboard = quiz_instance.leaderboard;
    for (let i = 0;i<responses.length;i++){
      if (responses[i].used == false){
        let time_taken = ((new Date(responses[i].timestamp).getTime()-new Date(quiz_instance.page.displayOn).getTime()-5000));
        let points = parseInt(1000*(1-time_taken/(quiz_instance.page.timeLimit*1000)));
        console.log(time_taken,quiz_instance.page.timeLimit*1000)
        if (!(quiz.pages[responses[i].q_id].correctAnswers.includes(responses[i].response)||quiz.pages[responses[i].q_id].correctAnswers.includes(Number(responses[i].response)))){
          points = 0;
        }
        responses[i].used = true;
          if (inLeaderboard(responses[i].teamname)){
            let index = -1;
            for (let j = 0;j<leaderboard.length;j++){
              if (leaderboard[j].name == responses[i].teamname){
                index = j;
                break;
              }
            }
            leaderboard[index].points += points;
          }else{
            leaderboard.push({name:responses[i].teamname,points:points})
          }
      }
    }
    let { data, error } = await supabase
      .from("quiz_instance")
      .update({leaderboard:leaderboard})
      .eq("id", quiz_instance.id);
    console.log(quiz_instance.leaderboard,responses);
    {
      let { data, error } = await supabase
      .from("quiz_instance_responses")
      .update({ responses:responses})
      .eq("id", quiz_instance.id);
    }
  }
  const showQuestionResponses = async (stack) => {

    if (stack == undefined){
      stack = 0;
    }
    // console.log(quiz)
    
    if (isEmpty(quiz)){
      return -1;
    }
    let { data, error } = await supabase
    .from("quiz_instance")
    .update({ status: "show_answer",page:{...quiz_instance?.page, ...quiz?.pages[quiz_instance.current_page]}})
    .eq("id", quiz_instance.id);

    setBeforeshowtimer(false);
    setQuestionshowtimer(false);
    updateLeaderboard();
    
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
        {quiz_instance?.status == "display_q" && <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-4 z-10 rounded-full"
              onClick={showQuestionResponses}
            >
              <ArrowRight className="text-white" />
            </Button>
        }
        {(quiz_instance?.status == "display_q" || quiz_instance?.status == "show_answer") && <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 left-4 z-10 rounded-full text-white" disabled
            >
              {quiz_response?.responses?.filter(item=>item.q_id==quiz_instance.current_page).length}
            </Button>
        }
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
              {/* <Flag className="text-primary" /> */}
              <ChartNoAxesColumn className="text-primary"></ChartNoAxesColumn>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
          <DialogHeader>
              <DialogTitle>Leaderboard</DialogTitle>
              <DialogDescription>
                who's at the top?
              </DialogDescription>
            </DialogHeader>
            <Leaderboard key = {JSON.stringify(quiz_instance)} leaderboard={quiz_instance.leaderboard}></Leaderboard>
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
              <h1>{quiz?.title}</h1>
            </div>
            <span className="text-center text-muted-foreground">
              Start the quiz when you are ready!
            </span>
            <Button onClick={startQuiz}>Start Quiz</Button>
          </>
        )}
        {quiz_instance?.status == "started" && (
          <>
            <div className="max-w-screen-md mx-auto text-center text-2xl md:text-6xl font-bold m-6">
              <h1>
                Question {quiz_instance.current_page + 1} of{" "}
                {quiz?.pages?.length}
              </h1>
            </div>
            <Button onClick={startTimer}>Start Timer</Button>
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
            <Leaderboard key = {JSON.stringify(quiz_instance)} leaderboard={quiz_instance.leaderboard}></Leaderboard>
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
                        //   onClick={() => handleAnswer(index)}
                      >
                        {option}
                      </button>
                    </div>
                  ))}
                </div>
                {quiz_instance.page.type == "type_answer" && (
                  <>
                    <Input className="text-xl center-x" placeholder="Answer" disabled />
                  </>
                )}
                {quiz_instance.page.type == "leaderboard" && (
                  <>
                    <Leaderboard key = {JSON.stringify(quiz_instance)} leaderboard={quiz_instance.leaderboard}></Leaderboard>
                  </>
                )}
              
            </div>
            <div className="fixed center-y right-4">
              <Timer totalTime = {quiz_instance?.page?.timeLimit}
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
                        style={{backgroundColor:(quiz_instance?.page?.correctAnswers?.includes(optionIndex)?"green":"")}}
                        className={"text-lime-200 border-2 text-card hover:bg-primary hover:text-primary-foreground rounded-lg py-3 px-6 transition-colors text-lg md:text-2xl"}
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
                      <Input className="text-xl border-white text-green-300" placeholder="Answer" value = {quiz_instance?.page?.correctAnswers?.toString()} disabled />
                    </div>
                  </>
                )}
                {quiz_instance.page.type == "leaderboard" && (
                  <>
                    <Leaderboard key = {JSON.stringify(quiz_instance)} leaderboard={quiz_instance.leaderboard}></Leaderboard>
                  </>
                )}
            </div>
            <Button onClick={nextQuestion}>Next Question</Button>
          </>
        )}</>}
      </div>
    </>
  );
};

export default hostQuiz;
