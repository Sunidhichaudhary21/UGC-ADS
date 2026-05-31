import type React from "react";
import type { Project } from "../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  EllipsisIcon,
  ImageIcon,
  Loader2Icon,
  PlaySquareIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import { GhostButton, PrimaryButton } from "./Buttons";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import api from "../configs/axios";

const ProjectCard = ({
  gen,
  setGenerations,
  forCommunity = false,
}: {
  gen: Project;
  setGenerations: React.Dispatch<React.SetStateAction<Project[]>>;
  forCommunity?: boolean;
}) => {
  const {getToken} =useAuth()
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete=async(id:string)=>{
    const confirm=window.confirm('Are you sure you want to delete this project');
    if(!confirm) return;
    try{
      const token = await getToken();
      const {data}=await api.delete(`/api/project/${id}`,{
        headers:{Authorization:`Bearer ${token}`}
      })
      setGenerations((generations)=>generations.filter((gen)=>gen.id!==id));
      toast.success(data.message);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error:any){
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
   

  }

const togglePublish=async(projectId:string)=>{
  try{
  const token = await getToken();
  const {data}=await api.get(`/api/user/publish/${projectId}`,{
    headers:{Authorization:`Bearer ${token}`}
  })
  setGenerations((generations) =>
    generations.map((g) => (g.id === projectId ? { ...g, isPublished: !g.isPublished } : g))
  );
  toast.success(data.isPublished? 'project Published' :'project unpublished');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}catch(error:any){
  toast.error(error?.response?.data?.message || error.message);
  console.log(error);
}
 

 
}

  return (
    <div key={gen.id} className="mb-4 break-inside-avoid">
      <div
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden
    hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1 transition-all duration-300 group"
      >
        {/* preview */}
        <div
          className={`${
            gen?.aspectRatio === "9:16" ? "aspect-9/16" : "aspect-video"
          } relative overflow-hidden`}
        >
          {gen.generatedImage && (
            <img
              src={gen.generatedImage}
              alt={gen.productName}
              className={`absolute inset-0 w-full h-full object-cover transition duration-700
                    ${gen.generatedVideo ? "group-hover:opacity-0" : "group-hover:scale-110"}`}
            />
          )}
          {gen.generatedVideo && (
            <video
              src={gen.generatedVideo}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-0
                group-hover:opacity-100 transition duration-700"
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          )}
          {!gen?.generatedImage && !gen?.generatedVideo && (
            <div
              className="absolute inset-0 w-full h-full flex flex-col items-center
                justify-center bg-black/40 backdrop-blur-sm"
            >
              <Loader2Icon className="size-8 animate-spin text-indigo-400" />
            </div>
          )}
          {/* status badges */}
          <div className="absolute left-4 top-4 flex gap-2 items-center">
            {gen.isGenerating && (
              <span className="text-xs font-medium px-2.5 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 backdrop-blur-md rounded-full">
                Generating
              </span>
            )}
            {gen.isPublished && (
              <span className="text-xs font-medium px-2.5 py-1 bg-green-500/20 text-green-300 border border-green-500/30 backdrop-blur-md rounded-full">
                Published
              </span>
            )}
          </div>
          {/* action menu for my generations only */}
          {!forCommunity && (
            <div
              onMouseDownCapture={() => {
                setMenuOpen(true);
              }}
              onMouseLeave={() => {
                setMenuOpen(false);
              }}
              className="absolute right-4 top-4 sm:opacity-0
                group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
            >
              <div className="absolute top-0 right-0">
                <EllipsisIcon
                  className="ml-auto bg-black/40 backdrop-blur-md text-white border border-white/10 rounded-full
                        p-1.5 size-8 cursor-pointer hover:bg-black/60 transition-colors"
                />
              </div>
              <div className="flex flex-col items-end w-32 text-sm">
                <ul
                  className={`text-xs ${menuOpen ? "block" : "hidden"}
                            overflow-hidden right-0 peer-focus:block hover:block w-44
                            bg-black/60 backdrop-blur-xl text-white border border-white/10
                            rounded-xl shadow-2xl mt-10 py-1 z-10`}
                >
                  {gen.generatedImage && 
                    <a
                      href="#"
                      download
                      className="flex gap-2 items-center px-4 py-2.5
                                hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      <ImageIcon size={14} /> Download Image
                    </a>
                  }
                  {gen.generatedVideo &&
                    <a
                      href="#"
                      download
                      className="flex gap-2 items-center px-4 py-2.5
                               hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      <PlaySquareIcon size={14} /> Download Video
                    </a>}
                    {(gen.generatedVideo || gen.generatedImage) && <button
                    onClick={()=>navigator.share({url:gen.generatedVideo || gen.generatedImage,
                      title:gen.productName,text:gen.productDescription})}
                      className="w-full flex gap-2 items-center px-4 py-2.5 hover:bg-white/10 cursor-pointer transition-colors">
                      <Share2Icon size={14}/> Share
                    </button>}

                    <button onClick={()=>handleDelete(gen.id)} className="w-full flex gap-2 items-center px-4 py-2.5 hover:bg-red-500/20
                    text-red-400 transition-colors">
                      <Trash2Icon size={14}/> Delete
                    </button>
                </ul>
              </div>
            </div>
          )}

          {/* source images */}
          <div className="absolute right-4 bottom-4 flex items-center">
            <img
              src={gen.uploadedImages[0]}
              alt="product"
              className="w-12 h-12
                object-cover rounded-full border-2 border-[#0f172a] shadow-lg animate-float"
            />
            <img
              src={gen.uploadedImages[1]}
              alt="model"
              className="w-12 h-12
                object-cover rounded-full border-2 border-[#0f172a] shadow-lg animate-float -ml-4"
                style={{animationDelay:'3s'}}
            />
          </div>
        </div>

        {/* details */}
        <div className="p-5 bg-gradient-to-b from-transparent to-black/20">
          <div className="flex items-start justify-between gap-4">
            {/* product name, date,aspect ratio */}
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 tracking-wide text-white/95">{gen.productName}</h3>
              {gen.createdAt && (
                <p className="text-xs text-white/40">
                  Created {new Date(gen.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="flex flex-col items-end gap-1">
                <span
                  className="text-xs px-2.5 py-1 bg-white/5 border border-white/10
                        rounded-md text-white/70"
                >
                  {gen.aspectRatio}
                </span>
              </div>
            </div>
          </div>
          {/* product description*/}
          {gen.productDescription && (
            <div className="mt-4">
              <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Description</p>
              <div
                className="text-sm text-white/70 bg-black/20 p-3
                    rounded-lg border border-white/5 break-words leading-relaxed"
              >
                {gen.productDescription}
              </div>
            </div>
          )}

          {/* user prompt */}
          {gen.userPrompt && (
            <div className="mt-4">
              <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Prompt</p>
              <div className="text-sm text-indigo-200/80 italic bg-indigo-900/10 p-3 rounded-lg border border-indigo-500/10 leading-relaxed">{gen.userPrompt}</div>
            </div>
          )}

          {/* buttons */}
          {!forCommunity && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              <GhostButton className="text-xs justify-center w-full"
              onClick={()=>{navigate(`/result/${gen.id}`);scrollTo(0,0)}}>
                View Details
              </GhostButton>
              <PrimaryButton onClick={()=>togglePublish(gen.id)}
                className="text-xs w-full">
                {gen.isPublished ? 'Unpublish':'Publish'}
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
