import {  UploadIcon, XIcon } from "lucide-react"
import type { UploadZoneProps } from "../types"

const UploadZone = ({label,file,onClear ,onChange}:
    UploadZoneProps) => {
  return (
    <div className="relative group w-full">
        <div className={`relative h-64 rounded-3xl border-2
            border-dashed transition-all duration-300 flex flex-col
          items-center justify-center overflow-hidden bg-white/2 p-6 ${file ? 'border-indigo-500/50 bg-indigo-900/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]' : 'border-white/10 hover:border-indigo-500/40 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'}`}>
              {file ? (
                <>
                <img src={URL.createObjectURL(file)} alt="preview"
                className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-70 group-hover:opacity-50 transition-opacity duration-300"/>
                <div className="z-10">
                  <button type="button" onClick={onClear} className="p-3
                  rounded-full bg-black/40 backdrop-blur-md hover:bg-red-500/80 text-white
                  hover:scale-110 transition-all shadow-lg border border-white/10">
                    <XIcon className="w-5 h-5"/>
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/60
                backdrop-blur-lg p-3 rounded-xl border border-white/10 text-center shadow-lg">
                  <p className="text-sm font-medium truncate text-white/90">{file.name}</p>
                </div>
                </>
              ):(
                <>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center
                justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300">
                  <UploadIcon className="w-7 h-7 text-white/50
                  group-hover:text-indigo-300 transition-colors"/>
                </div>
                <h3 className="text-lg font-semibold mb-2 tracking-wide text-white/90">{label}</h3>
                <p className="text-xs text-white/50 text-center max-w-[200px]">Drag & drop or Click to upload</p>
                <input type="file" accept="image/*" onChange={onChange} aria-label={`${label} upload`}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                </>
              )}
                
        </div>
      
    </div>
  )
}

export default UploadZone
