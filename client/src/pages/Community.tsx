import { useEffect, useState }from "react";
import type { Project }from "../types"
import { Loader2Icon } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import toast from "react-hot-toast";

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
    <div className="flex items-center justify-center min-h-screen">
      <Loader2Icon className='size-7 animate-spin text-blue-300'/>
      
    </div> 
  ):(
    <div className="min-h-screen text-white p-6 md:p-12 my-28">
      <div className="max-w-6x1 mx-auto">
        <header className="mb-12">
          <h1 className="text-3x1 md:text-4x1 font-semibold mb-4">Community</h1>
          <p className="text-black-400">See what others  are creating with UGC.ai</p>
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
