import { cn } from '@/utils/utils';

interface IconProps {
  className?: string;
}

export const PlaceholderLogo = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 46 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
  >
    <g clipPath="url(#clip0_467_3784)">
      <g filter="url(#filter0_i_467_3784)">
        <path
          d="M1 9.8584C1 4.61169 5.25329 0.358398 10.5 0.358398H35.5C40.7467 0.358398 45 4.61169 45 9.8584V34.8584C45 40.1051 40.7467 44.3584 35.5 44.3584H10.5C5.25329 44.3584 1 40.1051 1 34.8584V9.8584Z"
          fill="#1F84EF"
        />
        <path
          d="M1.91667 9.8584C1.91667 5.11795 5.75956 1.27507 10.5 1.27507H35.5C40.2404 1.27507 44.0833 5.11795 44.0833 9.8584V34.8584C44.0833 39.5988 40.2404 43.4417 35.5 43.4417H10.5C5.75956 43.4417 1.91667 39.5988 1.91667 34.8584V9.8584Z"
          stroke="url(#paint0_linear_467_3784)"
          strokeWidth="1.83333"
        />
        <path
          d="M23 8.3584C30.732 8.3584 37 14.6264 37 22.3584L34.4538 22.3584L29.5116 22.3584C29.5116 18.7621 26.5963 15.8468 23 15.8468C19.4039 15.8468 16.4884 18.7621 16.4884 22.3584L11.5447 22.3584L9 22.3584C9 14.6264 15.2682 8.3584 23 8.3584Z"
          fill="white"
        />
        <path
          d="M23 36.3584C15.2682 36.3584 9 30.0904 9 22.3584L11.5447 22.3584L16.4884 22.3584L29.5116 22.3584C29.5116 25.9546 26.5963 28.87 23 28.87C19.4039 28.87 16.4884 25.9546 16.4884 22.3584L11.5447 22.3584C11.5447 28.6846 16.6733 33.813 22.9993 33.813C29.3255 33.813 34.4538 28.6846 34.4538 22.3584L37 22.3584C37 30.0904 30.732 36.3584 23 36.3584Z"
          fill="white"
        />
      </g>
    </g>
    <rect
      x="0.93125"
      y="0.289648"
      width="44.1375"
      height="44.1375"
      rx="9.56875"
      stroke="black"
      strokeOpacity="0.6"
      strokeWidth="0.1375"
    />
    <defs>
      <filter
        id="filter0_i_467_3784"
        x="1"
        y="-17.5166"
        width="44"
        height="61.875"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-17.875" />
        <feGaussianBlur stdDeviation="30" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.121569 0 0 0 0 0.517647 0 0 0 0 0.937255 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_467_3784"
        />
      </filter>
      <linearGradient
        id="paint0_linear_467_3784"
        x1="23"
        y1="0.358398"
        x2="23"
        y2="44.3584"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#298EF9" />
        <stop offset="1" stopColor="#1075E0" />
      </linearGradient>
      <clipPath id="clip0_467_3784">
        <rect x="1" y="0.358398" width="44" height="44" rx="9.5" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
