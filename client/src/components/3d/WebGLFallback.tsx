import React from 'react';

interface WebGLFallbackProps {
  className?: string;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center w-full h-full min-h-[360px] ${className}`}>
      {/* Background radial glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#8065FF]/30 to-[#32C8F5]/25 blur-3xl animate-pulse" />

      {/* Outer Orbit Ring */}
      <div className="absolute w-80 h-80 rounded-full border border-dashed border-[#8065FF]/40 animate-spin-slow" />
      
      {/* Inner Tilted Orbit Ring */}
      <div 
        className="absolute w-64 h-64 rounded-full border border-[#32C8F5]/50 animate-spin"
        style={{ animationDuration: '15s', transform: 'rotateX(60deg) rotateY(20deg)' }}
      />

      {/* Central Pulsing AI Core */}
      <div className="relative w-44 h-44 rounded-full bg-gradient-to-br from-[#8065FF] via-[#5332E0] to-[#151D35] p-1 shadow-[0_0_50px_rgba(128,101,255,0.6)] flex items-center justify-center animate-float-slow">
        <div className="w-full h-full rounded-full bg-[#080B18]/80 backdrop-blur-md flex flex-col items-center justify-center p-4 border border-[#A68BFF]/40 text-center">
          <div className="w-12 h-12 rounded-full bg-[#32C8F5]/20 flex items-center justify-center mb-2 border border-[#32C8F5]">
            <div className="w-5 h-5 rounded-full bg-[#32C8F5] animate-ping opacity-75" />
          </div>
          <span className="text-xs font-heading font-semibold text-white tracking-wider uppercase">
            AI Intelligence Core
          </span>
          <span className="text-[10px] text-[#A6B0C8]">Active & Ready</span>
        </div>
      </div>

      {/* Floating Nodes */}
      <div className="absolute top-10 left-16 w-3 h-3 rounded-full bg-[#32C8F5] shadow-[0_0_10px_#32C8F5] animate-bounce" />
      <div className="absolute bottom-12 right-20 w-3 h-3 rounded-full bg-[#8065FF] shadow-[0_0_10px_#8065FF] animate-bounce" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-8 w-2 h-2 rounded-full bg-[#30D6A0] shadow-[0_0_8px_#30D6A0]" />
    </div>
  );
};
