import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone, FileRejection } from 'react-dropzone'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

type FileUploaderProps = {
  fieldChange: (files: File[]) => void
  mediaUrls?: string[]
  onRemoveFile: (index: number) => void
}

const MultiFilesUploader = ({ fieldChange, mediaUrls = [], onRemoveFile }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [fileUrls, setFileUrls] = useState<string[]>(mediaUrls)
  const [error, setError] = useState<string | null>(null)

  const maxFiles = 10
  const maxFileSize = 2 * 1024 * 1024 // 2MB in bytes

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: FileRejection[], event: DragEvent) => {
      // Handle file size errors
      if (fileRejections.length > 0) {
        setError(`Some files are too large. Maximum size is 2MB.`)
        return
      }

      const totalFiles = files.length + acceptedFiles.length
      if (totalFiles > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} images.`)
        return
      }

      setError(null)
      const newFiles = [...files, ...acceptedFiles]
      setFiles(newFiles)
      fieldChange(newFiles)

      const newFileUrls = acceptedFiles.map(file => URL.createObjectURL(file))
      setFileUrls([...fileUrls, ...newFileUrls])
    },
    [files, fileUrls, fieldChange]
  )

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    fieldChange(updatedFiles)
    const updatedFileUrls = fileUrls.filter((_, i) => i !== index)
    setFileUrls(updatedFileUrls)
    setError(null) // Clear error when an image is removed
    onRemoveFile(index) // Notify parent component of the removal
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"]
    },
    multiple: true,
    maxSize: maxFileSize, // 2MB file size limit
    onDropRejected: (fileRejections) => setError(`File size limit exceeded. Each file must be less than 2MB.`),
  })

  return (
    <div className='file-uploader'>
      <div {...getRootProps()} className='w-full flex flex-col rounded-xl cursor-pointer'>
        <input {...getInputProps()} className='cursor-pointer'/>
        {
          fileUrls.length > 0 ? (
            <div className='w-full flex flex-wrap'>
              {fileUrls.map((url, index) => (
                <div key={index} className='w-1/3 p-2 relative'>
                  <img src={url} className='w-full h-auto' alt={`property image ${index + 1}`} />
                  <button
                    type="button"
                    className='flex items-center justify-center absolute top-1 right-1 bg-[#e30a0a] text-white rounded-full p-1 border-none cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering onDrop
                      removeFile(index);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {fileUrls.length < maxFiles && (
                <div className='w-1/3 p-2'>
                  <div className='bg-gray-50 flex justify-center items-center h-full min-h-[80px] border-2 border-dashed p-3 w-full'>
                    <p>Click to add more images</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='file_uploader-box w-full bg-gray-50'>
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
      {error && <p className='text-[#e30a0a] mt-2'>{error}</p>}
    </div>
  )
}

export default MultiFilesUploader