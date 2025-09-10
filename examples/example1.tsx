 <div className="relative w-[200px] h-[150px] overflow-hidden rounded group">
  <img
    className="w-full h-full object-cover rounded transform-gpu transition-transform duration-300 group-hover:scale-[1.02] group-hover:brightness-102"
    style={{
      transformOrigin: 'center',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
    }}
  />
</div>




.img-zoom {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem; /* same as Tailwind's rounded */
  transform-origin: center;
  will-change: transform;
  backface-visibility: hidden;
  transition: transform 300ms, filter 300ms;
}

.group:hover .img-zoom {
  transform: scale(1.02);
  filter: brightness(1.02);
}


import { ReactComponent as CloseIcon } from "assets/xicon.svg";


  handleDownload(
              "https://picsum.photos/200/200", // random public image
              "test-image.jpg"
            )




// utils/axiosInstance.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  validateStatus: () => true, // keep all HTTP statuses in try
});

// Interceptor: catch network/CORS errors and turn them into fake response
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.message === "Network Error" && !err.response) {
      return Promise.resolve({
        status: 0,
        data: { message: "🌐 CORS/Network error" },
        headers: {},
        config: err.config,
      });
    }
    return Promise.reject(err);
  }
);

export default api;

