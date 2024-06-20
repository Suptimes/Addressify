import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader.tsx"
import { PostValidation } from "@/lib/validation/index.ts"
import { Models } from "appwrite"
import { useCreatePost } from "@/lib/react-query/queriesAndMutations.tsx"
import { useUserContext } from "@/context/AuthContext.tsx"
import { useToast } from "../ui/use-toast.ts"


type PostFormProps = {
  post?: Models.Document
}



const PostForm = ({ post }: PostFormProps) => {
    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost()
    const { user } = useUserContext()
    const { toast } = useToast()
    const navigate = useNavigate()

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
    title: post ? post?.title : "",
    file: [],
    location: post ? post?.location : "",
    price: post ? post?.price : "",
    description: post ? post?.description : ""
    },
})
    
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    const newPost = await createPost({
          ...values,
          userId: user.id,
     })

    if(!newPost) {
      toast({
        title: "Please try again."
      })
     }

     toast({
      title: "Property successfully added."
    })
    //  navigate(`../property/:${newPost.$id}`)
     navigate(`../properties`)
     
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
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

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input 
                type="text"
                className="shad-input"
                placeholder="Property or neighborhood address" 
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                type="number"
                className="shad-input"
                placeholder="Annual or monthly rent price" 
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
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

        <div className="flex gap-4 items-center justify-end">
          <Button 
            type="button" 
            className="shad-button_dark_4"
            >
              Cancel
          </Button>

          <Button 
          type="submit" 
          className="shad-button_primary whitespace-nowrap"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
