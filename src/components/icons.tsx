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

export const MetaLogo = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      viewBox="0 0 256 171"
    >
      <defs>
        <linearGradient
          id="SVGYeLhubCc"
          x1="13.878%"
          x2="89.144%"
          y1="55.934%"
          y2="58.694%"
        >
          <stop offset="0%" stopColor="#0064e1"></stop>
          <stop offset="40%" stopColor="#0064e1"></stop>
          <stop offset="83%" stopColor="#0073ee"></stop>
          <stop offset="100%" stopColor="#0082fb"></stop>
        </linearGradient>
        <linearGradient
          id="SVGll66Sdsg"
          x1="54.315%"
          x2="54.315%"
          y1="82.782%"
          y2="39.307%"
        >
          <stop offset="0%" stopColor="#0082fb"></stop>
          <stop offset="100%" stopColor="#0064e0"></stop>
        </linearGradient>
      </defs>
      <path
        fill="#0081fb"
        d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82c3.677 5.947 9.16 8.466 14.751 8.466c7.211 0 13.808-1.79 26.52-19.372c10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946c-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927c0-23.52-5.484-49.623-17.564-68.273c-8.574-13.23-19.684-21.313-31.907-21.313c-13.22 0-23.859 9.97-35.815 27.75c-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07c-14.2 18.91-26.324 26.076-42.287 26.076c-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148z"
      ></path>
      <path
        fill="url(#SVGYeLhubCc)"
        d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0C85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49c6.802 8.243 11.565 10.7 17.752 10.7c15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946c-5.591 9.686-16.488 19.363-34.818 19.363c-11.395 0-21.49-2.475-32.654-13.007c-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428c-10.923 0-20.2 7.666-27.963 19.39z"
      ></path>
      <path
        fill="url(#SVGll66Sdsg)"
        d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39c-10.976 16.568-17.698 41.245-17.698 64.944c0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148C0 83.772 7.514 55.24 21.802 33.206C34.48 13.666 52.774 0 73.757 0z"
      ></path>
    </svg>
  );
};

export const GoogleLogo = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      viewBox="0 0 16 16"
    >
      <g fill="none" fillRule="evenodd" clipRule="evenodd">
        <path
          fill="#f44336"
          d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
          opacity={0.987}
        ></path>
        <path
          fill="#ffc107"
          d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
          opacity={0.997}
        ></path>
        <path
          fill="#448aff"
          d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
          opacity={0.999}
        ></path>
        <path
          fill="#43a047"
          d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
          opacity={0.993}
        ></path>
      </g>
    </svg>
  );
};

export const GoogleAdsLogo = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      viewBox="0 0 256 230"
    >
      <path
        fill="#fbbc04"
        d="M5.888 166.405L90.88 20.9c10.796 6.356 65.236 36.484 74.028 42.214L79.916 208.627c-9.295 12.28-85.804-23.587-74.028-42.23z"
      ></path>
      <path
        fill="#4285f4"
        d="M250.084 166.402L165.092 20.906C153.21 1.132 127.62-6.054 106.601 5.625S79.182 42.462 91.064 63.119l84.992 145.514c11.882 19.765 37.473 26.95 58.492 15.272c20.1-11.68 27.418-37.73 15.536-57.486z"
      ></path>
      <ellipse
        cx={42.664}
        cy={187.924}
        fill="#34a853"
        rx={42.664}
        ry={41.604}
      ></ellipse>
    </svg>
  );
};
