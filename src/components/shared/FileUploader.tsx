import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void
  mediaUrl: string
}

const FileUploader = ({ fieldChange, mediaUrl}: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([])
  const [fileUrl, setFileUrl] = useState(mediaUrl)


  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles)
      fieldChange(acceptedFiles)
      setFileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png",".jpg",".jpeg"]
    }
  })

  return (
    <div {...getRootProps()} className='w-full flex flex-center flex-col rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer'/>
      {
        fileUrl ? (
          <>
            <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
              <img 
              src={fileUrl} 
              className='file_uploader-img'
              alt="property image" />
            </div>
            <p className='file_uploader-label'>Click or drag photo to replace</p>
          </>
        ) : (
          <div className='file_uploader-box w-full bg-gray-50 hover:bg-gray-100 rounded-xl'>
            <img 
              src="/icons/file-upload.svg" alt="file upload" 
              width={96}
              height={77}
            />
            <h3 className='base-medium text-dark-4 mb-2 mt-6'>Drag images here</h3>
            <p className='text-light-4 small-regular mb-6'>PNG, JPG, JPEG</p>
            <Button className='shad-button_dark_5'>
              Select from files
            </Button>
          </div>
        )
      }
    </div>
  )
}

export default FileUploader
