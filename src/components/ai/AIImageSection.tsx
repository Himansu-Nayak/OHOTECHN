'use client';

import * as React from 'react';
import { Image as ImageIcon, RefreshCw, Sparkles } from 'lucide-react';
import { analyzeAiImage, ImageAnalysisResponse } from '@/api/ai';

export function AIImageSection() {
  const [imgFile, setImgFile] = React.useState<File | null>(null);
  const [imgPreview, setImgPreview] = React.useState<string | null>(null);
  const [imgContext, setImgContext] = React.useState('Enterprise Dashboard UI Screenshot');
  const [imgLoading, setImgLoading] = React.useState(false);
  const [imgResult, setImgResult] = React.useState<ImageAnalysisResponse | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setImgFile(f);
      setImgPreview(URL.createObjectURL(f));
    }
  };

  const handleAnalyzeImage = async () => {
    if (!imgFile || imgLoading) return;
    setImgLoading(true);
    try {
      const res = await analyzeAiImage(imgFile, imgContext || undefined);
      if (res.success && res.data) {
        setImgResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
        <ImageIcon className="w-5 h-5 text-indigo-400" />
        Computer Vision & Product Asset Inspector
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-colors">
            {imgPreview ? (
              <div className="mb-3">
                <img src={imgPreview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-contain" />
              </div>
            ) : (
              <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            )}
            <p className="text-sm font-semibold text-slate-200">
              {imgFile ? imgFile.name : 'Upload Screenshot, UI Mockup, or Asset'}
            </p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPEG, WebP (max 10MB)</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
              id="img-upload-sec"
            />
            <label
              htmlFor="img-upload-sec"
              className="inline-block mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Select Image
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Asset Context</label>
            <input
              type="text"
              value={imgContext}
              onChange={(e) => setImgContext(e.target.value)}
              placeholder="e.g. ERP Dashboard, Mobile POS Screen"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            disabled={!imgFile || imgLoading}
            onClick={handleAnalyzeImage}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {imgLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{imgLoading ? 'Analyzing Visual Metadata...' : 'Inspect Image with Gemini'}</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Vision Analysis
          </h3>

          {imgResult ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-white block mb-1">Visual Description:</span>
                <p className="text-slate-300 leading-relaxed">{imgResult.description}</p>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-slate-800">
                <span className="font-bold text-white">Detected Category:</span>
                <span className="font-semibold text-indigo-400">{imgResult.detectedCategory}</span>
              </div>

              <div>
                <span className="font-bold text-white block mb-1">Generated SEO Alt-Text:</span>
                <p className="p-2.5 rounded-xl bg-slate-900 text-slate-300 italic">{imgResult.altText}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Visual Quality Rating:</span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {imgResult.visualQualityRating}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
              Upload an image asset to view extracted visual attributes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
