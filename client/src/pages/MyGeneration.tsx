import { useEffect, useState } from "react"
import type { Project } from "../types"
import { Loader2Icon } from "lucide-react"
import ProjectCard from "../components/ProjectCard"
import { PrimaryButton } from "../components/Buttons"
import { useAuth, useUser } from "@clerk/react"
import { useNavigate } from "react-router-dom"
import api from "../configs/axios"
import toast from "react-hot-toast"


const MyGeneration = () => {
  const {user,isLoaded}=useUser()
  const {getToken} =useAuth()
  const navigate =useNavigate()

  const [generations, setGenerations] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)


  const fetchMyGenerations = async () => {
    try{
      const token =await getToken();
      const {data} =await api.get('/api/user/projects',{
        headers:{Authorization:`Bearer ${token}`}
      })
      setGenerations(data.projects)
      setLoading(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error:any){
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);


    }
    
    
    
  }
  useEffect(() => {
    if(user){
       // eslint-disable-next-line react-hooks/set-state-in-effect
       fetchMyGenerations();

    }else if(isLoaded && !user){
      navigate('/')
    }
   
  },[user])

  return loading ?(
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712] to-[#030712]" />
      <Loader2Icon className="size-10 animate-spin text-indigo-400 relative z-10"/>
    </div>

  ):(
    <div className="min-h-screen text-white p-6 md:p-12 mt-28 relative overflow-hidden">
     <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/10 via-transparent to-purple-900/10 pointer-events-none" />
     <div className="max-w-6xl mx-auto relative z-10">
       <header className="mb-14 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">My <span className="text-gradient">Generations</span></h1>
       <p className="text-white/60 max-w-2xl mx-auto">View and manage your AI-generated lifestyle images and videos</p>
    </header>
    {/* generations list */}
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {generations.map((gen)=>(
        <ProjectCard key={gen.id} gen={gen} setGenerations={setGenerations} />
      ))}
    </div>
    {generations.length === 0 &&(
      <div className="text-center py-24 glass-panel rounded-[2rem] border border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold tracking-tight mb-3 text-white/95">No generations yet</h3>
          <p className="text-white/50 mb-8 max-w-md mx-auto">Start creating stunning product photos and immersive lifestyle videos today with our AI.</p>
          <PrimaryButton onClick={()=>window.location.href='/generate'} className="px-8 shadow-lg">
            Create New Generation
          </PrimaryButton>
        </div>
      </div>
    )}
  </div>
</div>

  )
   
  
}

export default MyGeneration;
