import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";

import Modal from "./Modal"
import Input from "./Input";
import Button from "./Button";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {

    const [isLoading, setIsLoading] = useState(false);
    const uploadModal = useUploadModal();
    const {user} = useUser();
    const supabaseClient = useSupabaseClient();
    const router =useRouter();

    const onChange = (open: boolean) => {
        if(!open){
          reset();
          uploadModal.onClose();
        }
    }

  const {register, handleSubmit, reset} = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try{
      setIsLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if(!imageFile || !songFile || !user){
        toast.error("MISSING FIELDSSSSSSSSSS");
        return;
      }
          
      const uniqueID = uniqid();
      const { data: songData, error: songError } = await supabaseClient.storage.from('songs').upload(`song-${values.title}-${uniqueID}`, songFile, {
        cacheControl: '3600', upsert:false
      });
              
      if(songError){
        setIsLoading(false);
        return toast.error('Failed song upload');
      }

      const { data: imageData, error: imageError } = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueID}`, imageFile, {
        cacheControl: '3600', upsert:false
      });
               
      if(imageError){
        setIsLoading(false);
        return toast.error('Failed image upload');
      }

      const {error: supabaseError} = await supabaseClient.from('songs').insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                img_path: imageData.path,
                song_path: songData.path,
      });

      if(supabaseError){
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(true);
      toast.success('Song Created Successfully');
      reset();
      uploadModal.onClose();

      } 
      catch(error){
        toast.error("Something went wrong")
      } 
      finally{
        setIsLoading(false);
      }
    }

    return (
        <Modal
          title="We got a new competitor"
          description= "Fill out the form below."
          isOpen={uploadModal.isOpen}
          onChange={onChange}>
            <form className=" flex flex-col gap-y-4"onSubmit={handleSubmit(onSubmit)}>
                <Input id="title" disabled={isLoading} placeholder="Song Titles"{...register('title', {required: true})}/>
                <Input id="author" disabled={isLoading} placeholder="Song author"{...register('author', {required: true})}/>
                <div className="pb-1"> Select the song that you are proud of!
                    <div>
                      <Input id="song" type="file" disabled={isLoading} accept=".mp3"{...register('song', {required: true})}/>
                    </div>
                </div>
                <div className="pb-1"> Select the image to show off!
                  <div>
                    <Input id="image" type="file" disabled={isLoading} accept="image/*"{...register('image', {required: true})}/>
                  </div>
                </div>
                <Button disabled={isLoading} type="submit">
                  Create
                </Button>
            </form>
        </Modal>
    );
}

export default UploadModal;