import React, { useState, useRef, useEffect } from 'react';
import { Upload, Archive, CheckSquare, Grid, List, Terminal, Cpu, Send, Bot } from 'lucide-react';

export default function ChatImageRepository() {
  const [images, setImages] = useState([]);
  const [referenceImages, setReferenceImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [selectedReference, setSelectedReference] = useState(null);
  const [viewMode, setViewMode] = useState('explorer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReferenceUpload = async (files) => {
    const newReferenceImages = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setReferenceImages(prev => [...prev, ...newReferenceImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    handleReferenceUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMessage = async (message) => {
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI response and image generation
    setTimeout(() => {
      const selectedRef = referenceImages.find(img => img.id === selectedReference);
      const imageData = {
        id: Math.random().toString(36).substr(2, 9),
        url: '/api/placeholder/400/400',
        name: 'Generated Image',
        size: 1024 * 1024,
        type: 'image/png',
        lastModified: Date.now(),
        referenceImage: selectedRef?.url
      };

      setImages(prev => [...prev, imageData]);
      setMessages(prev => [...prev, {
        text: "I've generated an image based on your request. Would you like to review it for Etsy upload or archive it?",
        sender: 'bot'
      }]);
      setIsProcessing(false);
    }, 2000);
  };

  const archiveSelected = () => {
    const archivedImages = images.filter(img => selectedImages.has(img.id));
    setImages(prev => prev.filter(img => !selectedImages.has(img.id)));
    setSelectedImages(new Set());
    setMessages(prev => [...prev, {
      text: `Archived ${archivedImages.length} image(s)`,
      sender: 'bot'
    }]);
  };

  const toggleImageSelection = (id) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-3">
            <Cpu className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              AI Generated Images
            </h1>
          </div>
        </div>

        <div className="flex gap-6 mb-6">
          {/* Reference Images Panel */}
          <div className="w-64 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-blue-400">Reference Images</h2>
              <label className="p-2 bg-blue-600 rounded hover:bg-blue-700 cursor-pointer">
                <Upload size={16} />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleReferenceUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="space-y-2 min-h-48 border-2 border-dashed border-gray-600 rounded-lg p-4 transition-colors hover:border-blue-500"
            >
              {referenceImages.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  Drag and drop images here
                </div>
              )}
              {referenceImages.map(img => (
                <div
                  key={img.id}
                  onClick={() => setSelectedReference(img.id)}
                  className={`relative rounded-lg overflow-hidden cursor-pointer ${
                    selectedReference === img.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-blue-400">AI Assistant</h2>
            </div>
            
            <div className="h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`mb-4 ${
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block p-3 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleMessage(input)}
                  placeholder="Describe the image you want..."
                  className="flex-1 px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleMessage(input)}
                  className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Images Section */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setSelectedImages(new Set(images.map(img => img.id)))}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Select All
            </button>

            <button
              onClick={() => setSelectedImages(new Set())}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Clear Selection
            </button>

            <button
              onClick={archiveSelected}
              disabled={selectedImages.size === 0}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:bg-gray-600 transition-colors"
            >
              <Archive size={20} />
              Archive Selected
            </button>

            <button
              onClick={() => {}} // Implement Etsy upload
              disabled={selectedImages.size === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600 transition-colors"
            >
              Upload to Etsy
            </button>

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setViewMode('explorer')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'explorer' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(img => (
              <div
                key={img.id}
                className={`relative aspect-square border border-gray-700 rounded-lg overflow-hidden cursor-pointer bg-gray-800
                  ${selectedImages.has(img.id) ? 'ring-2 ring-blue-500' : 'hover:border-gray-600'}`}
                onClick={() => toggleImageSelection(img.id)}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                {selectedImages.has(img.id) && (
                  <div className="absolute top-2 right-2">
                    <CheckSquare className="w-6 h-6 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}