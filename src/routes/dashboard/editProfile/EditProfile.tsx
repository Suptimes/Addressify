import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router-dom"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { ProfileValidation } from "@/lib/validation"
import { useUserContext } from "@/context/AuthContext"
import { useGetUserById, useUpdateProfile } from "@/lib/react-query/queriesAndMutations"

import Loader from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"
import ProfileUploader from "@/components/shared/ProfileUploader"
import { useEffect } from "react"
import { IUpdateUser } from "@/types"
import { LucideEdit } from "lucide-react"




const EditProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate()
  const { user, setUser } = useUserContext()
  const { id } = useParams();
  
  const { data: currentUser, isLoading: isUserLoading } = useGetUserById(id || "")
  const { mutateAsync: updateProfile, isPending: isLoadingUpdate } = useUpdateProfile()

  const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        defaultValues: {
            name: "",
            file: [],
            email: "",
            // newPassword: "",
            // oldPassword: "",
            // bio: "",
        },
        mode: "onChange", // Ensure validation is applied as user types
  })

  // Update form when currentUser is fetched
  useEffect(() => {
    if (currentUser) {

      // Check if the current user ID matches the logged-in user's ID
      if (user?.id !== currentUser.$id) {
        navigate("/unauthorized")
        return;
      }


      form.reset({
        name: currentUser.name || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
        file: [], // Files are usually not reset directly, managed separately
        newPassword: "",
        oldPassword: "",
      });
    }
  }, [currentUser, form]);
  
  
  if (!currentUser)
      return (
        <div className="flex-center w-full h-full">
          <Loader w={40} h={40} brightness="brightness-50" />
        </div>
      );
  
 
  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
      if(currentUser) {
        try {
              // Filter out undefined properties or provide defaults

              const updateData: IUpdateUser = {
                userId: currentUser.$id,
                name: value.name || "",  // Ensure name is not undefined
                file: value.file,
                imageId: currentUser?.imageId || "",
                imageUrl: currentUser?.imageUrl || "",
                email: value.email || "",
                // bio: value.bio || "",
              }
  

          const updatedProfile = await updateProfile(updateData)

          if(!updatedProfile) {
            toast({ title: "Please try again."})
            throw new Error("Profile could not update.")
          }

          if (updatedProfile) {
            setUser({
              ...user,
              name: updatedProfile?.name,
              email: updatedProfile?.email,
              bio: updatedProfile?.bio,
              imageUrl: updatedProfile?.imageUrl,
            });
            toast({ title: "Profile updated successfully." });
            navigate(`/profile/${currentUser.$id}`);
          } else {
            toast({ title: "Please try again." });
          }

        } catch (error) {
          console.error("Profile update error:", error);
          toast({ title: "An error occurred while updating the profile." });
        }
      }
  }

  return (
    <div className="middlePage w-full">
      <div className="common-container-noscroll w-full max-w-5xl">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <LucideEdit width={36} height={36} alt="edit profile" className="brightness-0"/>
          <h2 className="h3-bold lg:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        {isUserLoading || isLoadingUpdate 
          ? (<div className="w-full h-full">
              <Loader h={40} w={40} brightness="brightness-50" /></div>) 
          : (

    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleUpdate)} 
        className="flex flex-col gap-6 w-full max-w-5xl">
       
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="flex-center">
              <FormControl>
                <ProfileUploader
                  fieldChange={field.onChange}
                  mediaUrl={currentUser.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                type="text"
                className="shad-input"
                placeholder="Enter your Name" 
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                type="email"
                className="shad-input"
                placeholder="Enter your new email"
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
{/* 
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
              <Input 
                type="password"
                className="shad-input"
                placeholder="Enter your new password"
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old password</FormLabel>
              <FormControl>
              <Input 
                type="text"
                className="shad-input"
                placeholder="Enter your old password"
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                className="shad-textarea h-[50px] w-full custom-scrollbar"
                placeholder="Write a bio about you" 
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        /> */}

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
          disabled={isLoadingUpdate}
          >
            { isLoadingUpdate 
              ? <div className="flex gap-3 p-1">
                <Loader />Loading...</div>
              : "Update"
            }
          </Button>
        </div>
      </form>
    </Form>
          )
        }
      </div>
    </div>
  )
}

export default EditProfile