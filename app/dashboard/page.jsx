"use client";
import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  LogOut,
  NotepadText,
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useRouter, redirect } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
const UserSettings = () => {
  const supabase = createClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
      const fetchUserData = async () => {
          setLoading(true);
          const { data: { user }, error } = await supabase.auth.getUser();

          if (error) {
              setError('Error fetching user data.');
          } else {
              setName(user.user_metadata.name || '');
              setEmail(user.email || '');
          }
          setLoading(false);
      };

      fetchUserData();
  }, []);

  const handleUpdate = async () => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { data, error } = await supabase.auth.updateUser({
          email,
          data: { name: name }
      });

      if (error) {
          setError('Error updating profile. ' + error.message);
      } else {
          setSuccess('Profile updated successfully.');
      }
      setLoading(false);
  };

  return (
      <div className="max-w-md mx-auto width-full p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">User Account Settings</h2>
          {loading && <p className="text-center text-gray-600">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {success && <p className="text-center text-green-500">{success}</p>}
          <div className="space-y-4">
              <div>
                  <Label className="block text-gray-700 font-bold mb-2">Name:</Label>
                  <Input
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                  />
              </div>
              <div>
                  <Label className="block text-gray-700 font-bold mb-2">Email:</Label>
                  <Input
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
              </div>
              <Button
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleUpdate}
                  disabled={loading}
              >
                  {loading ? 'Updating...' : 'Update Profile'}
              </Button>
          </div>
      </div>
  );
};
function QuizesView(){
  const supabase = createClient();
  let [quizzes, setQuizzes] = useState([]);
  let quiz_server;
  useEffect(() => {
    console.log(1)
    let {data} = supabase.auth.getSession().then((e)=>{  
      supabase.from('quiz').select("*").eq("host",e.data.session.user.id).then((e)=>{
        quiz_server = e.data
        let quizzes_ = quiz_server?.map(quiz => {
          return (
            <li className="w-full" key={quiz.id}>
            <Link key={quiz.id} href={`/editquiz/${quiz.id}`} className="w-full">
            <Alert className="m-4 w-full">
              <NotepadText className="h-4 w-4" />
              <AlertTitle>{quiz.title}</AlertTitle>
              <AlertDescription>
                Created on: {new Date(quiz.created_at).toLocaleString()}
                </AlertDescription>
            </Alert>
            </Link></li>)
        })
        setQuizzes(quizzes_)
      })
    })
  },[])
  return (
    <><ul className="overflow-scroll w-5/6 h-5/6 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-track-rounded-full">{quizzes}</ul></>
  )
}
function DashboardView({ db_fn,changeDBFN }) {
  if (db_fn == "dashboard") {
    return (
      <>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-hidden">
          <div>
          <h1 className="text-lg font-semibold md:text-2xl">Quizzes</h1>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4 flex-wrap"
            x-chunk="dashboard-02-chunk-1"
          >
            <Link href = "/createquiz">
            <Card className="m-4">
              <CardContent className="flex gap-4 p-4 w-[300px] h-[200px] items-center justify-center relative rounded-xl text-center">
                <h1 className="text-3xl font-bold">Create a Quiz</h1>
                <BorderBeam/>
              </CardContent>
            </Card>
            </Link>
            <Card className="m-4 cursor-pointer" onClick={function(){changeDBFN("quiz")}}>
              <CardContent className="flex gap-4 p-4 w-[300px] h-[200px] items-center justify-center relative rounded-xl text-center">
                <h1 className="text-3xl font-bold">View Past Quizzes</h1>
                <BorderBeam/>
              </CardContent>
            </Card>
            <Link href = "/join">
            <Card className="m-4">
              <CardContent className="flex gap-4 p-4 w-[300px] h-[200px] items-center justify-center relative rounded-xl text-center">
                <h1 className="text-3xl font-bold">Join a Quiz</h1>
                <BorderBeam/>
              </CardContent>
            </Card>
            </Link>
          </div>
          </div>
          <div>
          <h1 className="text-lg font-semibold md:text-2xl">Buzz</h1>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4 flex-wrap"
            x-chunk="dashboard-02-chunk-1"
          >
            <Link href = "/buzz/host">
            <Card className="m-4">
              <CardContent className="flex gap-4 p-4 w-[300px] h-[200px] items-center justify-center relative rounded-xl text-center">
                <h1 className="text-3xl font-bold">Host a Buzz</h1>
                <BorderBeam/>
              </CardContent>
            </Card>
            </Link>
            <Link href = "/buzz/player">
            <Card className="m-4">
              <CardContent className="flex gap-4 p-4 w-[300px] h-[200px] items-center justify-center relative rounded-xl text-center">
                <h1 className="text-3xl font-bold">Join a Buzz</h1>
                <BorderBeam/>
              </CardContent>
            </Card>
            </Link>
            </div></div>
        </main>
      </>
    );
  } else if (db_fn == "quiz") {
    return <> <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-hidden">
    <div className="flex items-center">
      <h1 className="text-lg font-semibold md:text-2xl">Quizzes</h1>
    </div>
    <div
      className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4 flex-wrap"
      x-chunk="dashboard-02-chunk-1"
    ><QuizesView/></div></main></>;
  } else if (db_fn == "settings") {
    return <UserSettings/>;
  }
}
export default function Dashboard() {
  let [db_fn, changeDBFN] = useState("dashboard");
  const supabase = createClient();
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getSession().then((e)=>{
      console.log(e.data)
      if (!e.data.session) {
          router.push("/login");
      }
    })
  },[])
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Image alt = "favicon" width="32" height = "32" className="bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" src = "/favicon.png"></Image>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="">Times Up!</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <div
                onClick={function(){changeDBFN("dashboard")}}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </div>
              <div
                onClick={function(){changeDBFN("quiz")}}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer"
              >
                <NotepadText className="h-4 w-4" />
                Quizzes
              </div>
              <div
                onClick={function(){changeDBFN("settings")}}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer"
              >
                <CircleUser className="h-4 w-4" />
                Account Settings
              </div>
              <Link
                href="/auth/signout"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <NotepadText className="h-4 w-4" />
                  Quizzes
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <CircleUser className="h-4 w-4" />
                  Account Settings
                </Link>
                <Link
                  href="/auth/signout"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <DashboardView db_fn={db_fn} changeDBFN = {changeDBFN}></DashboardView>
      </div>
    </div>
  );
}
