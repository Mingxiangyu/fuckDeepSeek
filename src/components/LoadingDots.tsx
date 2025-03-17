"use client";

interface LoadingDotsProps {
  color?: string;
  size?: number;
}

export default function LoadingDots({ color = "bg-blue-500", size = 2 }: LoadingDotsProps) {
  return (
    <div className="flex gap-1">
      <div 
        className={`h-${size} w-${size} ${color} rounded-full animate-bounce`} 
        style={{ animationDelay: "0ms" }}
      ></div>
      <div 
        className={`h-${size} w-${size} ${color} rounded-full animate-bounce`} 
        style={{ animationDelay: "150ms" }}
      ></div>
      <div 
        className={`h-${size} w-${size} ${color} rounded-full animate-bounce`} 
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );
}