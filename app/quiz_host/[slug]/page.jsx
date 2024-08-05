"use client";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CircleUser,
  DeleteIcon,
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
const Timer = ({ seconds, onComplete }) => {
  // initialize timeLeft with the seconds prop
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    // exit early when we reach 0
    if (timeLeft < 0) {
      onComplete();
      return;
    }

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
        value={Math.ceil(timeLeft)}
        gaugePrimaryColor="rgb(79 70 229)"
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      />
    </div>
  );
};
const hostQuiz = () => {
  const [quiz, setQuiz] = useState({});
  const [quiz_instance, setQuiz_instance] = useState([]);
  const [quiz_response, setQuiz_response] = useState([]);
  const { slug } = useParams();
  const [beforeshowtimer, setBeforeshowtimer] = useState(false);
  const [questionshowtimer, setQuestionshowtimer] = useState(false);
  const quiz_id = slug;
  const router = useRouter();
  const supabase = createClient();
  // const { theme, setTheme } = useTheme();
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
  }, [quiz_instance]);
  useEffect(() => {
    console.log(quiz, quiz_instance, quiz_response);
  }, [quiz, quiz_instance, quiz_response]);
  const startQuiz = async () => {
    let { data, error } = await supabase
      .from("quiz_instance")
      .update({ status: "started", current_page: 0 })
      .eq("id", quiz_instance.id);
  };
  const startTimer = async () => {
    let { data, error } = await supabase
      .from("quiz_instance")
      .update({
        status: "display_q",
        page: {
          ...quiz.pages[quiz_instance.current_page],
          displayOn: Date.now() + 5000,
          correct_answer:[]
        },
      })
      .eq("id", quiz_instance.id);
    setBeforeshowtimer(true);
    setQuestionshowtimer(false);
  };
  const showQuestion = async () => {
    // let {data,error} = await supabase.from('quiz_instance').update({status:"question",current_page:quiz_instance.current_page+1}).eq("id",quiz_instance.id);
    setBeforeshowtimer(false);
    setQuestionshowtimer(true);
  };
  const showQuestionResponses = async (stack) => {
    if (stack == undefined){
      stack = 0;
    }
    console.log(quiz)
    
    if (isEmpty(quiz) && stack < 5){
      return setTimeout(function(){showQuestionResponses(stack+1)},3000);
    }
    setBeforeshowtimer(false);
    setQuestionshowtimer(false);
    let { data, error } = await supabase
      .from("quiz_instance")
      .update({ status: "show_answer",correct_answer:quiz?.pages[quiz_instance.current_page].correct_answer })
      .eq("id", quiz_instance.id);
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
                value={"https://timesup.mtt.one/join/" + quiz_id}
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

        <DotPattern className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] z-0" />
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
                {quiz_instance.page.type == "select_answer" && (
                  <>
                    <Input className="text-xl center-x" placeholder="Answer" disabled />
                  </>
                )}
              </div>
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
                {quiz_instance.page.type == "select_answer" &&
                  quiz_instance.page.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <button
                        key={optionIndex}
                        className={(quiz_instance?.page?.correct_answer?.includes(optionIndex)?"bg-green-400":"bg-card-foreground")+"text-card hover:bg-primary hover:text-primary-foreground rounded-lg py-3 px-6 transition-colors text-lg md:text-2xl"}
                        //   onClick={() => handleAnswer(index)}
                      >
                        {option}
                      </button>
                    </div>
                  ))}
                {quiz_instance.page.type == "type_answer" && (
                  <>
                    <Input className="text-xl" placeholder="Answer" value = {quiz_instance?.page?.correct_answer?.toString()} disabled />
                  </>
                )}
              </div>
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
      </div>
    </>
  );
};

export default hostQuiz;
