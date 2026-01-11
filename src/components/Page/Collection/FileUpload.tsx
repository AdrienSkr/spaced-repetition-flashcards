import { useRef, useState } from 'preact/hooks'
import UploadIcon from '../assets/export.svg'
import FileIcon from '../assets/file.svg'

interface FileUploadProps {
  onFileContentChange?: (content: string) => void
}

const FileUpload: preact.FunctionComponent<FileUploadProps> = ({
  onFileContentChange,
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const selectedFile = target.files?.[0]
    if (selectedFile && isValidFileType(selectedFile)) {
      setFile(selectedFile)
      readFileContent(selectedFile)
    } else {
      alert('Please select a CSV, JSON or TXT file.')
    }
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer?.files[0]
    if (droppedFile && isValidFileType(droppedFile)) {
      setFile(droppedFile)
      readFileContent(droppedFile)
    } else {
      alert('Please drop a CSV, JSON or TXT file.')
    }
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
  }

  const isValidFileType = (file: File): boolean => {
    const validExtensions = ['csv', 'json', 'txt']
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
    return validExtensions.includes(fileExtension)
  }

  const readFileContent = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string
      setFileContent(content)
      if (textAreaRef.current) {
        textAreaRef.current.value = content
      }
      if (onFileContentChange) {
        onFileContentChange(content)
      }
    }
    reader.readAsText(file)
  }

  const handlePaste = (event: ClipboardEvent) => {
    const pastedText = event.clipboardData?.getData('text')
    if (pastedText) {
      setFileContent(pastedText)
      if (onFileContentChange) {
        onFileContentChange(pastedText)
      }
    }
  }

  const handleTextAreaChange = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    setFileContent(target.value)
    if (onFileContentChange) {
      onFileContentChange(target.value)
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-md">
      <div
        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-gray-400"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <img
          src={UploadIcon}
          alt="Upload Icon"
          className="mx-auto mb-4 text-4xl text-gray-400"
        />
        <p className="text-gray-600">
          Drag and drop a file here or click to select
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.json,.txt"
          className="hidden"
        />
      </div>
      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            <img src={FileIcon} alt="File Icon" className="mr-2 inline" />
            {file.name}
          </p>
        </div>
      )}
      <textarea
        ref={textAreaRef}
        className="mt-4 w-full rounded-lg border p-2"
        rows={10}
        placeholder="Paste file content here..."
        onPaste={handlePaste}
        onChange={handleTextAreaChange}
        value={fileContent}
      ></textarea>
    </div>
  )
}

export default FileUpload
