
# TimesUp
![image](https://github.com/user-attachments/assets/4b3de735-bab0-48f1-b3c8-e5e88e4d153f)
An interactive, simple to use for all your quizzing needs.   
🌐 Live at: [TimesUp!](https://timesup.mtt.one)


## Tech Stack
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NextJS](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## Problem Statement
Design a real-time quiz application that enables users to participate in live quizzes, receive instant feedback, and compete for top scores. The app should support user registration, quiz creation, scoring, and real-time synchronization.

## Features
#### Dashboard (/dashboard)
- See all previous quizzes, you created.
- See options to host, join, create a quiz.
- Change account settings. 

#### Edit Quiz (/editquiz)
- Edit quiz names, guest access, pages, teams, etc on this page.
- Create a new quiz instance from this page. 

#### Quiz Host (/quiz_host/[quiz_id])
- The host interface for conducting the quiz. Allows changing questions, seeing live leaderboards, starting timers, etc. 

#### Play (/play/[quiz_id])
- Player interface for participating in the quiz. Allow submission of responses, particpate individually or in teams. 

and many more. (Tried to be as concise as possible here)
## Installation and Deployment

1. Download this github repository as ZIP, Extract the zip file. Alternatively use `git clone`
2. Create a new database inside a new project in supabase with schema as mentioned in the `(schema.png)` image in the `supabase-functions` directory. 
3. Keep note of three things, the anon api key, the service_role api key, and the url.
4. In the frontend, use the command `npm install` to install all dependencies, then create a new `.env.local` file with the following things
```
NEXT_PUBLIC_SUPABASE_URL=url
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon api key
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=service api key
```
6. Type the command `npm run dev` .
7. The website will be live on `localhost:3000`.

## Challenges Encountered
- This was the first time, of me working with React. Also I had less than 10 days before submission deadline, hence had to learn about React as quickly as possible, the states, hooks, contexts, etc.
- Thinking and Implementing the real time nature of the app while communicating with the SQL based Supabase backend, was a tedious task.

## Applications
1. Education - Allows for quizzing in online and physical classes, helping teachers conduct lectures more interactively.
2. Games - Makes it easy for live game hosts, to conduct live games.
3. Feedback - Allows users to give feedback during a live event. 

## Further Improvements
1. Adding a buzzer, and multiple other question types such as MCQ_Multiple, etc.
2. Allow addition of images, and increasing customisability of pages.

## Contributors
With ❤️ By Mr Techtroid (mtt.ONE)
