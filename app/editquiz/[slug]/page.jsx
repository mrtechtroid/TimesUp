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

const editQuiz = () => {
  const [pages, setPages] = useState([]);
  const [quiz, setQuiz] = useState({});
  const [enableTeams, setEnableTeams] = useState(false);
  const [teams, setTeams] = useState([]);
  const [quiz_instance, setQuiz_instance] = useState([]);
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getSession().then((e)=>{
      console.log(e.data)
      if (!e.data.session) {
          router.push("/login");
      }
    })
  },[])
  useEffect(() => {
    console.log(1)
    supabase.auth.getSession().then((e)=>{  
      supabase.from('quiz_instance').select("*").eq("quiz_id",quiz_id).then((e)=>{
        let quiz_server = e.data
        let quizzes_ = quiz_server?.map(quiz => {
          return (
            <Link key={quiz.id} href={`/quiz_host/${quiz.id}`} className="w-full">
            <Alert className="m-4 w-full">
              <NotepadText className="h-4 w-4" />
              <AlertTitle>{quiz.id}</AlertTitle>
              <AlertDescription>
                Created on: {new Date(quiz.created_at).toLocaleString()}
                </AlertDescription>
            </Alert>
            </Link>)
        })
        setQuiz_instance(quizzes_)
        // setTeams(e.data.team_info)
      })
    })
  },[])
  const { slug } = useParams();
  const quiz_id = slug;
  const supabase = createClient();
  useEffect(() => {
    supabase
      .from("quiz")
      .select("*")
      .eq("id", quiz_id)
      .then((e) => {
        console.log(e.data);
        setQuiz(e.data[0]);
        setPages(e.data[0].pages);
        setTeams(e.data[0].team_info);
      });
  }, []);

  const toggleEnableTeams = () => {
    setEnableTeams(!enableTeams);
    if (!enableTeams) {
      setTeams([]);
    }
  };

  const addTeam = () => {
    setTeams([
      ...teams,
      { name: "", color: "", players: [{ name: "", email: "" }] },
    ]);
  };
  const startQuiz =  () => {
    const { data,error } = supabase.from('quiz_instance')
    .insert({ quiz_id: quiz_id, host: quiz.host,quiz_title:quiz.title,total_pages:quiz.pages.length,leaderboard:[],page:{},answered_teams:[],team_info:quiz.team_info,require_signin:quiz.require_signin  })
    .select().then((e)=>{
      console.log(e.data)
      const { data,error } = supabase.from('quiz_instance_responses')
      .insert({ id:e.data[0].id,quiz_id: quiz_id, host: quiz.host,responses:[], }).select("*").then((e)=>{
        router.push('/quiz_host/' + e.data[0].id)
      })
      
    })

  };

  const deleteTeam = (index) => {
    const newTeams = teams.filter((_, i) => i !== index);
    setTeams(newTeams);
  };

  const handleTeamChange = (index, key, value) => {
    const newTeams = [...teams];
    newTeams[index][key] = value;
    setTeams(newTeams);
  };

  const addPlayer = (teamIndex) => {
    const newTeams = [...teams];
    newTeams[teamIndex].players.push({ name: "", email: "" });
    setTeams(newTeams);
  };

  const removePlayer = (teamIndex, playerIndex) => {
    const newTeams = [...teams];
    newTeams[teamIndex].players = newTeams[teamIndex].players.filter(
      (_, i) => i !== playerIndex
    );
    setTeams(newTeams);
  };

  const handlePlayerChange = (teamIndex, playerIndex, key, value) => {
    const newTeams = [...teams];
    newTeams[teamIndex].players[playerIndex][key] = value;
    setTeams(newTeams);
  };
  useEffect(() => {
    setQuiz({ ...quiz, pages:pages });
  }, [pages]);
  useEffect(() => {
    setQuiz({ ...quiz, team_info:teams });
  }, [teams]);
  useEffect(() => {
    if (!enableTeams) {
      setTeams([]);
    }
  }, [enableTeams]);
  useEffect(() => {
    console.log(quiz)
  }, [JSON.stringify(quiz)]);
  const addPage = () => {
    setPages([
      ...pages,
      { type: "", question: "", options: [], correctAnswers: [], timeLimit: 0 },
    ]);
  };
  const changeTitle = (title) => {
    setQuiz({ ...quiz, title: title });
  };
  const changeSignIn = (signin) => {
    console.log(signin)
    setQuiz({ ...quiz, require_signin: signin });
  };
  const deletePage = (index) => {
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
  };

  const movePageUp = (index) => {
    if (index === 0) return;
    const newPages = [...pages];
    [newPages[index - 1], newPages[index]] = [
      newPages[index],
      newPages[index - 1],
    ];
    setPages(newPages);
  };

  const movePageDown = (index) => {
    if (index === pages.length - 1) return;
    const newPages = [...pages];
    [newPages[index + 1], newPages[index]] = [
      newPages[index],
      newPages[index + 1],
    ];
    setPages(newPages);
  };

  const handleTypeChange = (index, type) => {
    const newPages = [...pages];
    newPages[index].type = type;
    newPages[index].options = type === "select_answer" ? [""] : [];
    newPages[index].correctAnswers = [];
    setPages(newPages);
  };

  const handleQuestionChange = (index, question) => {
    const newPages = [...pages];
    newPages[index].question = question;
    setPages(newPages);
  };

  const handleOptionChange = (pageIndex, optionIndex, option) => {
    const newPages = [...pages];
    newPages[pageIndex].options[optionIndex] = option;
    setPages(newPages);
  };

  const handleCorrectOptionChange = (pageIndex, optionIndex) => {
    const newPages = [...pages];
    const correctAnswers = newPages[pageIndex].correctAnswers;
    if (correctAnswers.includes(optionIndex)) {
      newPages[pageIndex].correctAnswers = correctAnswers.filter(
        (i) => i !== optionIndex
      );
    } else {
      newPages[pageIndex].correctAnswers.push(optionIndex);
    }
    setPages(newPages);
  };

  const addOption = (pageIndex) => {
    const newPages = [...pages];
    newPages[pageIndex].options.push("");
    setPages(newPages);
  };

  const removeOption = (pageIndex, optionIndex) => {
    const newPages = [...pages];
    newPages[pageIndex].options = newPages[pageIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setPages(newPages);
  };

  const handleCorrectAnswerChange = (pageIndex, answerIndex, answer) => {
    const newPages = [...pages];
    newPages[pageIndex].correctAnswers[answerIndex] = answer;
    setPages(newPages);
  };

  const addCorrectAnswer = (pageIndex) => {
    const newPages = [...pages];
    newPages[pageIndex].correctAnswers.push("");
    setPages(newPages);
  };

  const removeCorrectAnswer = (pageIndex, answerIndex) => {
    const newPages = [...pages];
    newPages[pageIndex].correctAnswers = newPages[
      pageIndex
    ].correctAnswers.filter((_, i) => i !== answerIndex);
    setPages(newPages);
  };

  const handleTimeLimitChange = (pageIndex, timeLimit) => {
    const newPages = [...pages];
    newPages[pageIndex].timeLimit = timeLimit;
    setPages(newPages);
  };
  const saveForm = async () => {
    console.log(quiz)
    await supabase.from('quiz')
    .update({ title: quiz.title, pages:quiz.pages, require_signin: quiz.require_signin, team_info: quiz.team_info})
    .eq('id', quiz_id).then((e)=>{
      if (e.error!=null){
        alert("Error updating quiz")
      }else{
        alert("Quiz updated successfully")
      }
    })
  };
  return (
    <>
    <div className="flex min-h-screen w-full flex-col">
      
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[130px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
          >
            <Link href="#basic-quiz-info">Basic Quiz Info</Link>
            <Link href="#team-info">Team Info</Link>
            <Link href="#">Quiz Instances</Link>
            <Link href="#">Pages</Link>
            <Button onClick={startQuiz}>Start Quiz</Button>
            <Button onClick={saveForm}>Save</Button>
          </nav>
          <div className="grid gap-6">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Edit Quiz</h1>
            <span className="text-xs grey-text">
              Quiz ID: {quiz.id} &nbsp; &nbsp; Created At:{" "}
              {new Date(quiz.created_at).toLocaleString()}
            </span>
          </div>
          <div id = "basic-quiz-info" className="grid grid-gap-5  gap-6 row-gap-[12px] h-full">
            <Card className="m-4">
              <CardHeader>
                <CardTitle>Basic Quiz Info</CardTitle>
                <CardDescription>
                  Some basic info about the quiz.
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-4 flex flex-col">
                <Label className="text-lg">Quiz Title</Label>
                <Input
                  placeholder="Store Name"
                  onChange={(e) => changeTitle(e.target.value)}
                  value={quiz.title}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include"
                    // disabled
                    key = {JSON.stringify(quiz)}
                    onClick={(e) => changeSignIn(e.target.checked)}
                    defaultChecked={quiz?.require_signin}
                  />
                  <label
                    htmlFor="include"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Deny Guest Access
                  </label>
                </div>
              </CardContent>
            </Card>
            <Card className="m-4">
              <CardHeader>
                <CardTitle>Quiz Instances</CardTitle>
                <CardDescription>
                  Some previously created quiz instances.
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-4 flex flex-col max-h-[400px] overflow-scroll">
                {quiz_instance?.length == 0 &&
                  <div className="flex items-center justify-center">
                    <h1>No quiz instances found</h1>
                  </div>
                }
                {quiz_instance}
              </CardContent>
            </Card>
            <Card id = "team-info" className="m-4">
              <CardHeader>
                <CardTitle>Teams</CardTitle>
                <CardDescription>
                  Add or remove teams which can participate in the quiz. Only these members can answer questions if enabled.
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-4 flex flex-col">
                <div>
                  <div >
                    <input
                      type="checkbox"
                      id="teams_check"
                      checked={enableTeams || false}
                      onChange={function (e) {
                        changeTitle(setEnableTeams(e.target.checked));
                      }}
                    />
                    <Label
                      htmlFor="team_check"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable Teams
                    </Label>
                  </div>

                  {enableTeams && 
                  (<><Button onClick={addTeam}>Add Team</Button>
                      <ScrollArea className="w-[50rem] whitespace-nowrap rounded-md border">
                      <div className="flex w-max space-x-4 p-4 flex-grow flex-row">
                      
                      {teams.map((team, teamIndex) => (
                        <div className="flex flex-col m-4 border-2 border-gray-800 w-[300px] min-w-[300px] h-[500px] max-h-[500px] overflow-scroll"
                          key={teamIndex}
                        >
                          <CardHeader>Team {teamIndex + 1}</CardHeader>
                          <CardContent className="gap-4 flex flex-col">
                          <div>
                            <Label>
                              Team Name:
                              <Input
                                type="text"
                                value={team.name}
                                onChange={(e) =>
                                  handleTeamChange(
                                    teamIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                            </Label>
                          </div>
                          <div>
                            <Label>
                              Team Color:
                              <Input
                                type="text"
                                value={team.color}
                                onChange={(e) =>
                                  handleTeamChange(
                                    teamIndex,
                                    "color",
                                    e.target.value
                                  )
                                }
                              />
                            </Label>
                          </div>
                          <div>
                            <h3>Players</h3>
                            <Button onClick={() => addPlayer(teamIndex)}>
                              Add Player
                            </Button>
                            {team.players.map((player, playerIndex) => (
                              <div
                                key={playerIndex}
                                style={{ margin: "10px 0" }}
                              >
                                <Label>
                                  Player Name:
                                  <Input
                                    type="text"
                                    value={player.name}
                                    onChange={(e) =>
                                      handlePlayerChange(
                                        teamIndex,
                                        playerIndex,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Label>
                                <Label>
                                  Player Email:
                                  <Input
                                    type="email"
                                    value={player.email}
                                    onChange={(e) =>
                                      handlePlayerChange(
                                        teamIndex,
                                        playerIndex,
                                        "email",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Label>
                                <Button
                                  onClick={() =>
                                    removePlayer(teamIndex, playerIndex)
                                  }
                                >
                                  Remove Player
                                </Button>
                              </div>
                            ))}
                          </div>
                          </CardContent>
                          <CardFooter className="border-t px-6 py-4">
                          <Button onClick={() => deleteTeam(teamIndex)}>
                            Delete Team
                          </Button>
                          </CardFooter>
                          
                          
                        </div>
                        
                      ))}
                    </div><ScrollBar orientation="horizontal" />
                    </ScrollArea></>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-04-chunk-2" className="m-4">
              <CardHeader>
                <CardTitle>Pages</CardTitle>
                <CardDescription>
                  Add pages to your quiz.
                </CardDescription>
              </CardHeader>
              <CardContent>
              <Button onClick={addPage}>Add Page</Button>
              <ScrollArea className="flex flex-col gap-4 max-h-[400px]">
              <div >
      {pages.map((page, pageIndex) => (
        <div key={pageIndex} style={{ border: '1px solid white', margin: '10px', padding: '10px', display: 'flex', flexDirection: 'column' }}>
          <div className = "flex flex-row flex-wrap">
          <span className = "flex flex-row h-10 cursor-pointer">Page {pageIndex + 1} &nbsp; &nbsp;</span>
          <span onClick={() => movePageUp(pageIndex)} className = "flex flex-row h-10 cursor-pointer"><MoveUp/>Move Up</span>
          <span onClick={() => movePageDown(pageIndex)} className = "flex flex-row h-10 cursor-pointer"><MoveDown/>Move Down</span>
          <span onClick={() => deletePage(pageIndex)} className = "flex flex-row h-10 cursor-pointer"><Trash/>Delete</span>
          </div>
          <div className="flex flex-col gap-4">
            <Label className = "text-base">
              <input
                type="radio"
                value="select_answer"
                checked={page.type === 'select_answer'}
                onChange={() => handleTypeChange(pageIndex, 'select_answer')}
              />
              Select Answer
            </Label>
            <Label className = "text-base">
              <input
                type="radio"
                value="type_answer"
                checked={page.type === 'type_answer'}
                onChange={() => handleTypeChange(pageIndex, 'type_answer')}
              />
              Type Answer
            </Label>
            {/* <Label className = "text-base">
              <input
                type="radio"
                value="leaderboard"
                checked={page.type === 'leaderboard'}
                onChange={() => handleTypeChange(pageIndex, 'leaderboard')}
              />
              Leaderboard
            </Label> */}
            <Textarea
              placeholder="Enter question"
              value={page.question}
              onChange={(e) => handleQuestionChange(pageIndex, e.target.value)}
            />
          </div>
          {page.type === 'select_answer' && (
            <div>
              Options:
              {page.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex flex-row w-full">
                  <Input
                    type="text"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(pageIndex, optionIndex, e.target.value)}
                  />
                  <Label>
                    <Input
                      type="checkbox"
                      checked={page.correctAnswers.includes(optionIndex)}
                      onChange={() => handleCorrectOptionChange(pageIndex, optionIndex)}
                    />
                    Correct
                  </Label>
                  <Button onClick={() => removeOption(pageIndex, optionIndex)}>Remove Option</Button>
                </div>
              ))}
              <Button onClick={() => addOption(pageIndex)}>Add Option</Button>
            </div>
          )}
          {page.type === 'type_answer' && (
            <div>
              Correct Answers:
              {page.correctAnswers.map((answer, answerIndex) => (
                <div key={answerIndex} className="flex flex-row w-full">
                  <Input
                    type="text"
                    placeholder={`Correct Answer ${answerIndex + 1}`}
                    value={answer}
                    onChange={(e) => handleCorrectAnswerChange(pageIndex, answerIndex, e.target.value)}
                  />
                  <Button onClick={() => removeCorrectAnswer(pageIndex, answerIndex)}>Remove Answer</Button>
                </div>
              ))}
              <Button onClick={() => addCorrectAnswer(pageIndex)}>Add Correct Answer</Button>
            </div>
          )}
          <div>
            <Label>
              Time to answer (seconds):
              <Input
                type="number"
                value={page.timeLimit}
                onChange={(e) => handleTimeLimitChange(pageIndex, e.target.value)}
              />
            </Label>
          </div>
        </div>
      ))}
    </div>
    <ScrollBar orientation="vertical" />
    </ScrollArea>
              </CardContent>
            </Card>
            </div>
          </div>
          </div>
        </main>
      </div>
      {/*  */}
      {/* <pre>{JSON.stringify(quiz, null, 2)}</pre> */}
    </>
  );
};

export default editQuiz;
