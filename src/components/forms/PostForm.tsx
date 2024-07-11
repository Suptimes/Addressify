import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import MultiFilesUploader from "../shared/MultiFilesUploader.tsx"
import { PostValidation } from "@/lib/validation/index.ts"
import { Models } from "appwrite"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations.tsx"
import { useUserContext } from "@/context/AuthContext.tsx"
import { toast } from "sonner"
import Loader from "../shared/Loader.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "../ui/separator.tsx"
import { useState } from "react"



type PostFormProps = {
  post?: Models.Document
  action: "Create" | "Update"
}



const PostForm = ({ post, action }: PostFormProps) => {
    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost()
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost()

    const [removedFileIndices, setRemovedFileIndices] = useState<number[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const { user } = useUserContext()
    const navigate = useNavigate()
    const isUpdate = action === "Update"

    // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    mode: 'onSubmit', // Only validate on submit
    defaultValues: {
      title: post?.title || "",
      files: [],
      location: post?.location || "",
      price: post?.price || "",
      description: post?.description || "",
      type: post?.type || "for-rent",
      property: post?.property || "",
      beds: post?.beds || "",
      baths: post?.baths || "",
      duration: post?.duration || "",
      cheques: post?.cheques || "",
      city: post?.city || "",
      address: post?.address || "",
      size: post?.size || "",
      category: post?.category || "residential",
      isUpdate,
    },
})

  // Handle file change
  const handleFileChange = (files: File[]) => {
    setNewFiles(files);
    form.setValue("files", files);
  }

  // Handle file removal from FileUploader
  const handleRemoveFile = (index: number) => {
    setRemovedFileIndices([...removedFileIndices, index]);
  };
    
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {

    if(post && action === "Update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageIds: post?.imageIds,
        imageUrls: post?.imageUrls,
        newFiles: newFiles, // new files to be added
        removedFileIndices: removedFileIndices, // indices of old files to be removed
      })

      if(!updatedPost) {
        toast.error("Please try again.")
        throw new Error("Post could not update.")
      }
      // return navigate(`/property/${post.$id}`)
      navigate(`/properties`)
      return toast.success("Property updated successfully.")
    }


    // Create Post
    const newPost = await createPost({
          ...values,
          userId: user.id,
          files: values.files, // Pass the files array to createPost
     })

    if(!newPost) {
      toast("Please try again.")
     }

     //  navigate(`../property/:${newPost.$id}`)
     navigate(`../properties`)
     toast.success("Property successfully added.")
     
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">


        <FormField // Title
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Textarea 
                className="shad-textarea h-[50px] w-full custom-scrollbar"
                placeholder="Write a descriptive title for your property" 
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField // Image
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <MultiFilesUploader
                  fieldChange={handleFileChange}
                  mediaUrls={post?.imageUrls || []} // Pass mediaUrls for initial preview
                  onRemoveFile={handleRemoveFile}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

            
        <div className="flex flex-between">

          {/* PRICE SECTION */}
          <div className="flex flex-col gap-6 w-full">
            <div className="space-y-2">
              <h4 className="font-medium leading-none text-primary-500">Property Price</h4>
              <p className="text-sm text-muted-foreground">
                {/* Set the payments you wish for. */}
              </p>
            </div>

            <div className="flex flex-center flex-col gap-2 w-full">
              <div className="grid grid-cols-2 items-center gap-4 w-full">
                <FormField // Price
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                          <Input
                            type="number"
                            className="shad-input w-full border-solid border-[1px]"
                            placeholder="Amount in AED"
                            {...field}
                          />
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4 w-full">
                <FormField // Duration
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount per</FormLabel>
                      <FormControl>
                      
                            <Select                      
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value}
                            >
                              <SelectTrigger className="bg-slate-50 hover:bg-slate-100 cursor-pointer w-full border-solid border-black/50 border-[1px]">
                              <SelectValue placeholder="Duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem className="cursor-pointer" value="month">Month</SelectItem>
                                <SelectItem className="cursor-pointer" value="year">Year</SelectItem>
                              </SelectContent>
                            </Select>
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              </div>

              <div className="grid grid-cols-2 items-center gap-4 w-full">
              <FormField // cheques
                control={form.control}
                name="cheques"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cheques/Frequency</FormLabel>
                    <FormControl>
                          <Input                                                       
                            className="shad-input border-solid border-[1px]"
                            placeholder="N. of cheques"
                            {...field}
                          />
                          
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              </div>
            </div>
          </div>
          
          <Separator orientation={"vertical"} className="mx-10" />

          {/* LOCATION SECTION */}
          <div className="flex flex-col gap-6 w-full">
            <div className="space-y-2">
              <h4 className="font-medium leading-none text-primary-500">Property Location</h4>
              <p className="text-sm text-muted-foreground">
                {/* Set the payments you wish for. */}
              </p>
            </div>

            <div className="flex flex-center flex-col gap-2 w-full">
              <div className="grid grid-cols-2 items-center gap-4 w-full">
                <FormField // City
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-slate-50 hover:bg-slate-100 cursor-pointer w-full ">
                            <SelectValue placeholder="City" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem className="cursor-pointer" value="dubai">Dubai</SelectItem>
                            <SelectItem className="cursor-pointer" value="abudhabi">Abu Dhabi</SelectItem>
                          </SelectContent>
                        </Select>                          
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4 w-full">
                <FormField // Region .Location
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl className="w-full">
                      
                            <Select                      
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value}
                            >
                              <SelectTrigger className="bg-slate-50 hover:bg-slate-100 cursor-pointer w-full border-solid border-black/50 border-[1px]">
                              <SelectValue placeholder="Region" />
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem className="cursor-pointer" value="albarsha">
                                Al Barsha
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="alquoz">
                                Al Quoz
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="almankhool">
                                Al Mankhool
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="almina">
                                Al Mina
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="alsatwa">
                                Al Satwa
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="alsufouh">
                                Al Sufouh
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="arabianranches">
                                Arabian Ranches
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="businessbay">
                                Business Bay
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="dubaifestivalcity">
                                Dubai Festival City
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="dubaihills">
                                Dubai Hills
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="dubaimarina">
                                Dubai Marina
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="dubaiproductioncity">
                                Dubai Production City
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="dubisportscity">
                                Dubai Sports City
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="dubaisiliconoasis">
                                Dubai Silicon Oasis
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="downtown">
                                Downtown Dubai
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="jumeirah">
                                Jumeirah
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="jumeirahbeachresidence">
                                Jumeirah Beach Residence (JBR)
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="jumeirahislands">
                                Jumeirah Islands
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="jumeirahlake">
                                Jumeirah Lake Towers (JLT)
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="jumeirahpark">
                                Jumeirah Park
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="jumeirahvillagecircle">
                                Jumeirah Village Circle (JVC)
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="jumeirahvillagetriangle">
                                Jumeirah Village Triangle (JVT)
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="meydancity">
                                Meydan City
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="mirdif">
                                Mirdif
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="motorcity">
                                Motor City
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="naddalsheba">
                                Nadd Al Sheba
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="palmjumeirah">
                                Palm Jumeirah
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="tecom">
                                Tecom (Barsha Heights)
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="thegreens">
                                The Greens
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="theviewstower">
                                The Views
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="thevilladubai">
                                The Villa, Dubai
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="ummsuqeim">
                                Umm Suqeim
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="warsan">
                                Warsan
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="wasl">
                                Wasl
                              </SelectItem>
                              <SelectItem className="cursor-pointer" value="zabeel">
                                Zabeel
                              </SelectItem>
                              </SelectContent>
                            </Select>
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              </div>

              <div className="grid grid-cols-2 items-center gap-4 w-full">
                <FormField //  Location .Address
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input 
                        className="shad-input-post"
                        placeholder="Optional" 
                        {...field} />
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

        </div>

        <Separator />

        <div className="flex flex-between">
          {/* SIZE SECTION */}
          <div className="flex flex-col gap-6 w-full">
            <div className="space-y-2 w-full">
              <h4 className="font-medium leading-none text-primary-500">Property Size</h4>
              <p className="text-sm text-muted-foreground">
                {/* Set the payments you wish for. */}
              </p>
            </div>

            <div className="flex flex-center flex-col gap-2 w-full">
              <div className="grid grid-cols-2 items-center gap-4 w-full">
                <FormField // Size
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                          <Input
                            className="shad-input w-full border-solid border-[1px]"
                            placeholder="Size in sqft"
                            {...field}
                          />
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4 w-full">
                <FormField // Bedrooms
                  control={form.control}
                  name="beds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl className="w-full">
                      <Input                                                     
                            className="shad-input border-solid border-[1px]"
                            placeholder="N. of bedrooms"
                            {...field}
                          />
                            
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              </div>

              <div className="grid grid-cols-2 items-center gap-4 w-full">
              <FormField // bathrooms
                control={form.control}
                name="baths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                          <Input                                                      
                            className="shad-input border-solid border-[1px]"
                            placeholder="N. of bathrooms"
                            {...field}
                          />
                          
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              </div>
            </div>
          </div>
        
          <Separator orientation={"vertical"} className="mx-10" />

          {/* TYPE SECTION */}
          <div className="flex flex-col gap-6 w-full">

            <div className="space-y-2">
                <h4 className="font-medium leading-none text-primary-500">Property Type</h4>
                <p className="text-sm text-muted-foreground">
                  {/* Set the payments you wish for. */}
                </p>
            </div>

            <div className="flex flex-center flex-col gap-2 w-full">
              <div className="grid grid-cols-2 items-center gap-4 w-full">
                <FormField // Category
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-slate-50 hover:bg-slate-100 cursor-pointer w-full ">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem className="cursor-pointer" value="residential">Residential</SelectItem>
                            <SelectItem className="cursor-pointer" value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4 w-full">
                <FormField // Operation Type
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                          // defaultValue="for-sale" // Set default value here
                        >
                          <SelectTrigger className="bg-slate-50 hover:bg-slate-100 cursor-pointer w-full ">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem className="cursor-pointer" value="for-sale">For Sale</SelectItem>
                            <SelectItem className="cursor-pointer" value="for-rent">For Rent</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4 w-full">
                <FormField // Property Type
                  control={form.control}
                  name="property"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-slate-50 hover:bg-slate-100 cursor-pointer w-full ">
                            <SelectValue placeholder="Property Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem className="cursor-pointer" value="apartment">Apartment</SelectItem>
                            <SelectItem className="cursor-pointer" value="villa">Villa</SelectItem>
                            <SelectItem className="cursor-pointer" value="townhouse">Townhouse</SelectItem>
                            <SelectItem className="cursor-pointer" value="penthouse">Penthouse</SelectItem>
                            <SelectItem className="cursor-pointer" value="compound">Compound</SelectItem>
                            <SelectItem className="cursor-pointer" value="duplex">Duplex</SelectItem>
                            <SelectItem className="cursor-pointer" value="coops">Co-ops</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
          
        

        <FormField // Desc
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                className="shad-textarea h-[50px] custom-scrollbar"
                placeholder="Write a detailed description of your property" 
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end max-md:gap-10">
          <Button 
            variant="none"
            type="button" 
            className="shad-button_dark_4 max-md:scale-125"
            onClick={() => navigate(-1)}
            >
              Cancel
          </Button>

          <Button 
          type="submit" 
          className="shad-button_primary whitespace-nowrap max-md:scale-125 mr-3"
          disabled={isLoadingUpdate || isLoadingCreate}
          >
            { isLoadingUpdate || isLoadingCreate 
              ? <div className="flex gap-3 p-1"><Loader />Loading...</div>
              : action
            }
          </Button>
        </div>
      </form>
    </Form>
    </>
  )
}

export default PostForm
