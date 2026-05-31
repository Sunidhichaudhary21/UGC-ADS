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
  const [generationType, setGenerationType] = useState<"photo" | "video" | "both">("photo");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "product" | "model",
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (type === "product") setProductImage(e.target.files[0]);
      else setModelImage(e.target.files[0]);
    }
  };

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!user) return toast('Please login to generate')
    if(!productImage || !modelImage || !name || !productName || !aspectRatio)
      return toast('Please fill all the required fields')

    try{
      setIsGenerating(true);
      const formData=new FormData();
      formData.append('name',name)
      formData.append('productName',productName)
      formData.append('productDescription',productDescription)
      formData.append('userPrompt',userPrompt)
      formData.append('aspectRatio',aspectRatio)
      formData.append('generationType',generationType)
      formData.append('images',productImage)
      formData.append('images',modelImage)

      const token=await getToken()
      const {data}=await api.post('/api/project/create',formData,{
        headers:{Authorization:`Bearer ${token}`}
      })
      toast.success(data.message)
      navigate('/result/'+ data.projectId)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error:any){
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

        <div
          className="flex gap-20 max-sm:flex-col items-start
            justify-between"
        >
          {/* left col */}
          <div
            className="flex flex-col w-full sm:max-w-60 gap-8 
                mt-8 mb-12"
          >
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
          {/* right col */}
          <div className="w-full">
            <div className="mb-4 text-gray-300">
              <label htmlFor="name" className="block text-sm mb-4">
                Project Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name your project"
                required
                className="w-full bg-[#030712]/50 rounded-xl border p-4 text-sm border-white/10 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="mb-4 text-gray-300">
              <label htmlFor="productName" className="block text-sm mb-4">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter the name of product"
                required
                className="w-full bg-[#030712]/50 rounded-xl border p-4 text-sm border-white/10 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="mb-4 text-gray-300">
              <label
                htmlFor="productDescription"
                className="block text-sm mb-4"
              >
                Product Description{" "}
                <span className="text-xs text-blue-300">(optional)</span>
              </label>

              <textarea
                id="productDescription"
                rows={4}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Enter the description of the product"
                className="w-full bg-[#030712]/50 rounded-xl border p-4 text-sm border-white/10 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all shadow-inner"
              />
            </div>

            <div className="mb-4 text-gray-300">
              <label className="block text-sm mb-4">Ad Format Type</label>
              <div className="flex gap-4 max-sm:flex-col sm:gap-3">
                <button
                  type="button"
                  onClick={() => setGenerationType("photo")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all border border-white/10 cursor-pointer ${
                    generationType === "photo"
                      ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <ImageIcon className="size-6" />
                  <div className="text-center">
                    <p className="font-semibold text-sm">Photo Ad</p>
                    <p className="text-xs opacity-60">5 credits</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setGenerationType("video")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all border border-white/10 cursor-pointer ${
                    generationType === "video"
                      ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <VideoIcon className="size-6" />
                  <div className="text-center">
                    <p className="font-semibold text-sm">Video Ad</p>
                    <p className="text-xs opacity-60">15 credits</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGenerationType("both")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all border border-white/10 cursor-pointer ${
                    generationType === "both"
                      ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="flex gap-1">
                    <ImageIcon className="size-5" />
                    <VideoIcon className="size-5" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">Both (Photo & Video)</p>
                    <p className="text-xs opacity-60">15 credits</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-4 text-gray-300">
              <label className="block text-sm mb-4">Aspect Ratio</label>
              <div className="flex gap-3">
                <RectangleVerticalIcon
                  onClick={() => setAspectRatio("9:16")}
                  className={`p-2.5 size-13 bg-white/5 rounded-xl transition-all border border-transparent cursor-pointer hover:bg-white/10 ${aspectRatio === "9:16" ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "text-white/60"}`}
                />
                
                <RectangleHorizontalIcon
                  onClick={() => setAspectRatio("16:9")}
                  className={`p-2.5 size-13 bg-white/5 rounded-xl transition-all border border-transparent cursor-pointer hover:bg-white/10 ${aspectRatio === "16:9" ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "text-white/60"}`}
                />
              </div>
            </div>
            
            <div className="mb-4 text-gray-300">
              <label
                htmlFor="userPrompt"
                className="block text-sm mb-4"
              >
                User Prompt
                <span className="text-xs text-blue-300">(optional)</span>
              </label>
              <textarea
                id="userPrompt"
                rows={4}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Describe how you want the naration to be."
                className="w-full bg-[#030712]/50 rounded-xl border p-4 text-sm border-white/10 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all shadow-inner"
              />
            </div>
          </div>
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
