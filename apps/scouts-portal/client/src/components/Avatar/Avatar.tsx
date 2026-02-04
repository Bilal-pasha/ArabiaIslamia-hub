'use client';

import Image from 'next/image';

export const Avatar = ({
  width = 40,
  height = 40,
  fontSize = 14,
  imagePath,
  bgColor,
  textColor,
  name,
}: {
  width?: number;
  height?: number;
  fontSize?: number;
  imagePath?: string;
  bgColor?: string;
  textColor?: string;
  name?: string | null;
}) => {
  
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full dark:bg-gray-600 bg-primary-100 ${
        bgColor ? bgColor : 'bg-primary-100'
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {!!imagePath ? (
        <Image
          className={`${`h-full w-full object-cover`}`}
          width={width}
          height={height}
          src={imagePath as string}
          priority={true}
          alt="profile-picture"
        />
      ) : (
        <span
          className={`mb-px dark:text-gray-300 leading-tight font-medium ${
            textColor ? textColor : 'text-primary-500'
          }`}
          style={{
            fontSize: `${fontSize}px`,
          }}
        >
          {name && (name as unknown as string).slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
};
