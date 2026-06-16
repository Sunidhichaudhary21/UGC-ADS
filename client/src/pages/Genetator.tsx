import { useState } from "react";
import Title from "../components/Title";
import UploadZone from "../components/UploadZone";
import { ImageIcon, Loader2Icon, RectangleHorizontalIcon, RectangleVerticalIcon, VideoIcon, Wand2Icon } from "lucide-react";
import { PrimaryButton } from "../components/Buttons";
import { useAuth, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../configs/axios";
const Genetator = () => {

  const {user} =useUser()
  const {getToken} = useAuth()
  const navigate =useNavigate()


  const [name, setName] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [generationType, setGenerationType] = useState<"photo" | "video" | "both">("both");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "product" | "model",
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log(`[Upload] File selected for ${type}: name=${file.name}, size=${file.size} bytes, type=${file.type}`);
      if (type === "product") setProductImage(file);
      else setModelImage(file);
    }
  };

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("[Generate Button] Form submit event handler triggered.");
    if(!user) {
      console.warn("[Generate Button] User not logged in, aborted.");
      return toast('Please login to generate');
    }
    if(!productImage || !modelImage) {
      console.warn("[Generate Button] Missing uploaded images. Product image exists:", !!productImage, "Model image exists:", !!modelImage);
      return toast('Please upload both a Product Image and a Model Image');
    }

    try{
      setIsGenerating(true);
      console.log("[Generate Button] Preparing FormData with payload:", {
        name,
        productName,
        productDescription,
        userPrompt,
        aspectRatio,
        generationType,
        productImageName: productImage.name,
        modelImageName: modelImage.name
      });
      const formData=new FormData();
      formData.append('name',name)
      formData.append('productName',productName)
      formData.append('productDescription',productDescription)
      formData.append('userPrompt',userPrompt)
      formData.append('aspectRatio',aspectRatio)
      formData.append('generationType',generationType)
      formData.append('images',productImage)
      formData.append('images',modelImage)

      console.log("[Generate Button] Requesting authentication token from Clerk...");
      const token=await getToken()
      console.log("[Generate Button] Sending POST request to /api/project/create...");
      const {data}=await api.post('/api/project/create',formData,{
        headers:{Authorization:`Bearer ${token}`}
      })
      console.log("[Generate Button] Request succeeded. Received response payload:", data);
      toast.success(data.message)
      navigate('/result/'+ data.projectId)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error:any){
      console.error("[Generate Button] Request failed with error:", error.response?.data || error.message || error);
      setIsGenerating(false);
      toast.error(error?.response?.data?.message ||error.message)

    }
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-12 mt-29">
      <form onSubmit={handleGenerate} className="max-w-4xl mx-auto mb-40 glass-panel p-8 md:p-12 rounded-[2rem]">
        <Title
          heading="Create In-Context UGC Ad"
          description="Upload your model and product images to generate stunning photo ads, short-form video loops, or both instantly!"
        />

        {/* Upload zones in side-by-side columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-10 w-full">
          <UploadZone
            label="Product Image"
            file={productImage}
            onClear={() => setProductImage(null)}
            onChange={(e) => handleFileChange(e, "product")}
          />
          <UploadZone
            label="Model Image"
            file={modelImage}
            onClear={() => setModelImage(null)}
            onChange={(e) => handleFileChange(e, "model")}
          />
        </div>

        {/* Collapsible Advanced Settings */}
        <div className="border border-white/5 bg-white/2 rounded-2xl p-6 mb-8 transition-all duration-300">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-sm font-semibold tracking-wide text-gray-300 hover:text-white cursor-pointer transition-colors"
          >
            <span>Advanced Settings</span>
            <span className="text-xs text-indigo-400 font-medium">
              {showAdvanced ? "Hide options ▲" : "Configure details (Optional) ▼"}
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-6 space-y-6 border-t border-white/5 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-gray-300">
                  <label htmlFor="name" className="block text-sm mb-3">
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name your project"
                    className="w-full bg-[#030712]/50 rounded-xl border p-4 text-sm border-white/10 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="text-gray-300">
                  <label htmlFor="productName" className="block text-sm mb-3">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter the name of product"
                    className="w-full bg-[#030712]/50 rounded-xl border p-4 text-sm border-white/10 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="text-gray-300">
                <label
                  htmlFor="productDescription"
                  className="block text-sm mb-3"
                >
                  Product Description{" "}
                  <span className="text-xs text-blue-300">(optional)</span>
                </label>
                <textarea
                  id="productDescription"
                  rows={3}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Enter the description of the product"
                  className="w-full bg-[#030712]/50 rounded-xl border p-4 text-sm border-white/10 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-gray-300">
                  <label className="block text-sm mb-3">Ad Format Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGenerationType("photo")}
                      className={`flex-1 flex flex-col items-center gap-1.5 p-3.5 rounded-xl transition-all border border-white/10 cursor-pointer ${
                        generationType === "photo"
                          ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <ImageIcon className="size-5" />
                      <div className="text-center">
                        <p className="font-semibold text-xs">Photo Ad</p>
                        <p className="text-[10px] opacity-65">5 credits</p>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setGenerationType("video")}
                      className={`flex-1 flex flex-col items-center gap-1.5 p-3.5 rounded-xl transition-all border border-white/10 cursor-pointer ${
                        generationType === "video"
                          ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <VideoIcon className="size-5" />
                      <div className="text-center">
                        <p className="font-semibold text-xs">Video Ad</p>
                        <p className="text-[10px] opacity-65">15 credits</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGenerationType("both")}
                      className={`flex-1 flex flex-col items-center gap-1.5 p-3.5 rounded-xl transition-all border border-white/10 cursor-pointer ${
                        generationType === "both"
                          ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex gap-0.5">
                        <ImageIcon className="size-4.5" />
                        <VideoIcon className="size-4.5" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-xs">Both</p>
                        <p className="text-[10px] opacity-65">15 credits</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="text-gray-300">
                  <label className="block text-sm mb-3">Aspect Ratio</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAspectRatio("9:16")}
                      className={`flex items-center justify-center p-3 size-12 bg-white/5 rounded-xl transition-all border cursor-pointer hover:bg-white/10 ${aspectRatio === "9:16" ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "border-transparent text-white/60"}`}
                    >
                      <RectangleVerticalIcon className="size-5" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setAspectRatio("16:9")}
                      className={`flex items-center justify-center p-3 size-12 bg-white/5 rounded-xl transition-all border cursor-pointer hover:bg-white/10 ${aspectRatio === "16:9" ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "border-transparent text-white/60"}`}
                    >
                      <RectangleHorizontalIcon className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-300">
                <label
                  htmlFor="userPrompt"
                  className="block text-sm mb-3"
                >
                  User Prompt
                  <span className="text-xs text-blue-300">(optional)</span>
                </label>
                <textarea
                  id="userPrompt"
                  rows={3}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Describe how you want the narration to be or context about the model and product."
                  className="w-full bg-[#030712]/50 rounded-xl border p-4 text-sm border-white/10 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all shadow-inner"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-10">
          <PrimaryButton disabled={isGenerating} className="px-10 py-3 rounded-md
           disabled:opacity-70 disabled:cursor-not-allowed">
            {isGenerating?(<>
            <Loader2Icon className="size-5 animate-spin"/> Generating...
            </>
            ):(
            <>
            <Wand2Icon className="size-5 mr-2"/>
            {generationType === 'photo' ? 'Generate Photo Ad' : generationType === 'video' ? 'Generate Video Ad' : 'Generate Photo & Video'}
            </>)}
          </PrimaryButton>

        </div>
      </form>
    </div>
  );
};

export default Genetator;
