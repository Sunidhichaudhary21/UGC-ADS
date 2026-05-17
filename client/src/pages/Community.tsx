import { useEffect, useState }from "react";
import type { Project }from "../types"
import { Loader2Icon } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import toast from "react-hot-toast";
import api from "../configs/axios";
const Community = () => {
  const [projects, setProjects]=useState<Project[]>([])
  const [loading, setLoading]=useState(true)
  
  const fetchProjects=async ()=>{
    try{
      const {data} = await api.get('/api/project/published')
      setProjects(data.projects)
      setLoading(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error:any){
      toast.error(error?.response?.data?.message || error.message)
      console.log(error);

    }
  }

  useEffect(()=>{
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects()
  },[])
  
  return loading?(
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712] to-[#030712]" />
      <Loader2Icon className='size-10 animate-spin text-indigo-400 relative z-10'/>
    </div> 
  ):(
    <div className="min-h-screen text-white p-6 md:p-12 mt-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-indigo-900/10 pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            <span className="text-gradient">Community</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">See what others are creating with UGC.ai and draw inspiration for your next project.</p>
        </header>

        {/* projects list */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {projects.map((project)=>(
            <ProjectCard key={project.id} gen={project} setGenerations={setProjects} forCommunity={true}/>
          ))}

        </div>

      </div>

    </div>
  )
}

export default Community
