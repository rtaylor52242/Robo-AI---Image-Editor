
import React, { useState, useCallback } from 'react';
import { editImageWithPrompt } from './services/geminiService';

const RobotLogo: React.FC = () => (
  <svg
    className="w-16 h-16 sm:w-20 sm:h-20 text-purple-500"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 7H8C6.34315 7 5 8.34315 5 10V17C5 18.6569 6.34315 20 8 20H16C17.6569 20 19 18.6569 19 17V10C19 8.34315 17.6569 7 16 7Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M12 7V4M12 4H10M12 4H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="9.5" cy="13.5" r="1.5" fill="currentColor" />
    <circle cx="14.5" cy="13.5" r="1.5" fill="currentColor" />
    <path
      d="M9 17H15"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="stroke-gray-900"
    />
  </svg>
);

const UploadIcon: React.FC = () => (
  <svg className="w-12 h-12 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
  </svg>
);

const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const HelpIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div 
          className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-lg w-full mx-4 border border-gray-700 animate-fade-in-up" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">How to Use Robo AI</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close dialog">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="space-y-4 text-gray-300">
            <p><strong className="font-semibold text-purple-400">1. Upload an Image:</strong> Click the "Original Image" card on the left to select an image from your device. Supported formats are PNG, JPG, and WEBP.</p>
            <p><strong className="font-semibold text-purple-400">2. Write a Prompt:</strong> In the "Edit Prompt" box, describe the changes you want to make. Be as specific as you can for the best results!</p>
            <p><strong className="font-semibold text-purple-400">3. Generate:</strong> Click the "Generate Image" button. The AI will process your request, which may take a few moments.</p>
            <p><strong className="font-semibold text-purple-400">4. View Your Creation:</strong> Your new, edited image will appear in the "Edited Image" card on the right.</p>
          </div>
        </div>
      </div>
    );
};


interface ImageDisplayCardProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageDisplayCard: React.FC<ImageDisplayCardProps> = ({ title, imageUrl, isLoading = false, onFileChange }) => (
  <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 h-96">
    <h2 className="text-lg font-semibold text-gray-300 mb-4">{title}</h2>
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading ? (
        <SpinnerIcon />
      ) : imageUrl ? (
        <img src={imageUrl} alt={title} className="max-w-full max-h-full object-contain rounded-md" />
      ) : (
        onFileChange ? (
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-700 rounded-md transition-colors">
            <UploadIcon />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
            <input id="file-upload" name="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={onFileChange} />
          </label>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
             <p>Your edited image will appear here</p>
          </div>
        )
      )}
    </div>
  </div>
);


export default function App() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("Make the man look like a pirate, standing on the deck of a ship with a sunset in the background.");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalImage(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setEditedImageUrl(null);
      setError(null);
    }
  };
  
  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  }

  const handleSubmit = useCallback(async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }
    if (!prompt.trim()) {
        setError("Please enter a text prompt describing your edit.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);

    try {
      const resultUrl = await editImageWithPrompt(originalImage, prompt);
      setEditedImageUrl(resultUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);

  const isSubmitDisabled = isLoading || !originalImage || !prompt.trim();

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto relative">
          <button
              onClick={() => setIsHelpOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white bg-gray-800/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 z-10"
              aria-label="Open help dialog"
            >
              <HelpIcon />
          </button>
          <header className="text-center mb-8">
            <div className="inline-block p-2 bg-gray-800/50 rounded-full mb-4">
               <RobotLogo />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Robo AI - Image Editor
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Upload an image and describe your desired edits using the power of Robo AI.
            </p>
          </header>

          <main>
            <div className="bg-gray-800/50 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2">
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                    Edit Prompt
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={handlePromptChange}
                    placeholder="e.g., Add a retro filter, Change the background to a beach, etc."
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow resize-none"
                  />
                </div>
                <div className="w-full lg:mt-7">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                    className={`w-full h-14 px-6 text-white font-semibold rounded-md transition-all duration-300 flex items-center justify-center
                      ${isSubmitDisabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 shadow-lg hover:shadow-xl'}
                    `}
                  >
                    {isLoading ? <SpinnerIcon /> : 'Generate Image'}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ImageDisplayCard 
                title="Original Image"
                imageUrl={originalImageUrl}
                onFileChange={handleImageChange}
              />
              <ImageDisplayCard 
                title="Edited Image"
                imageUrl={editedImageUrl}
                isLoading={isLoading}
              />
            </div>
          </main>
        </div>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
