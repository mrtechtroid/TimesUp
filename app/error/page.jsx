export default function Error({
    searchParams,
  }) {
    return <>
      <div className="flex flex-col items-center justify-center w-[100vw] h-[100vh] ">
        <div className="fixed top-4 center-x z-10 rounded-full text-xl">
          <h1>Error</h1>
          {searchParams.message && <div className="text-center text-xl">{searchParams.message}</div>}
        </div>
      </div>
     
   
   </>
  }